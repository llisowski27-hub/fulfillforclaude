-- ============================================================
-- THE LIQUIDATOR — Migration: Critical Fixes
-- 006_critical_fixes.sql
-- ============================================================
-- Rozwiązuje:
--   [1] Deadlock w checkout — sortowanie items po ID
--   [2] Brak atomowości checkout — pełna pg function
--   [3] Anti-sniping: usunięcie p_max_extends z parametrów,
--       odczyt z kolumny auctions.max_extends
--   [4] DB-level constraint: aukcja tylko dla listing type=auction
--   [5] Duplikat place_bid — jedna definicja
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1 + 5. POPRAWIONY place_bid
--    - max_extends czytany z tabeli, NIE z parametru
--    - p_max_extends usunięty z sygnatury
-- ────────────────────────────────────────────────────────────

DROP FUNCTION IF EXISTS place_bid(UUID, TEXT, NUMERIC, INT, INT);

CREATE OR REPLACE FUNCTION place_bid(
  p_auction_id  UUID,
  p_user_id     TEXT,
  p_amount      NUMERIC(10,2),
  p_snipe_window_ms INT DEFAULT 30000
)
RETURNS TABLE (
  bid_id         UUID,
  new_price      NUMERIC(10,2),
  new_bid_count  INT,
  new_end_time   TIMESTAMPTZ,
  was_extended   BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_auction       RECORD;
  v_min_required  NUMERIC(10,2);
  v_new_bid_id    UUID;
  v_time_left_ms  BIGINT;
  v_new_end       TIMESTAMPTZ;
  v_was_extended  BOOLEAN := false;
BEGIN
  -- Lock wiersza aukcji
  SELECT *
  INTO v_auction
  FROM auctions
  WHERE id = p_auction_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aukcja nie istnieje';
  END IF;

  IF v_auction.status != 'active' THEN
    RAISE EXCEPTION 'Aukcja nie jest aktywna';
  END IF;

  IF v_auction.end_time <= now() THEN
    RAISE EXCEPTION 'Aukcja się zakończyła';
  END IF;

  v_min_required := COALESCE(v_auction.current_price, v_auction.starting_price)
                    + v_auction.min_bid_increment;

  IF p_amount < v_min_required THEN
    RAISE EXCEPTION 'Minimalna kwota: % zł', v_min_required;
  END IF;

  -- Reset is_winning na poprzednim bidzie
  IF v_auction.winning_bid_id IS NOT NULL THEN
    UPDATE bids SET is_winning = false
    WHERE id = v_auction.winning_bid_id;
  END IF;

  -- Wstaw nowy bid
  INSERT INTO bids (auction_id, user_id, amount, is_winning)
  VALUES (p_auction_id, p_user_id, p_amount, true)
  RETURNING id INTO v_new_bid_id;

  -- Anti-sniping: max_extends z TABELI, nie z parametru
  v_time_left_ms := EXTRACT(EPOCH FROM (v_auction.end_time - now())) * 1000;
  v_new_end := v_auction.end_time;

  IF v_time_left_ms > 0
     AND v_time_left_ms <= p_snipe_window_ms
     AND v_auction.extend_count < v_auction.max_extends
  THEN
    v_new_end := now() + (p_snipe_window_ms || ' milliseconds')::interval;
    v_was_extended := true;
  END IF;

  UPDATE auctions
  SET current_price   = p_amount,
      winning_bid_id  = v_new_bid_id,
      bid_count       = v_auction.bid_count + 1,
      end_time        = v_new_end,
      extend_count    = CASE WHEN v_was_extended
                             THEN v_auction.extend_count + 1
                             ELSE v_auction.extend_count END
  WHERE id = p_auction_id;

  RETURN QUERY SELECT
    v_new_bid_id,
    p_amount,
    v_auction.bid_count + 1,
    v_new_end,
    v_was_extended;
END;
$$;


-- ────────────────────────────────────────────────────────────
-- 2. ATOMOWY CHECKOUT — pełna pg function
--    Jedna transakcja: walidacja → order → items → dekrementacja.
--    Sortowanie items po listing_id zapobiega deadlockom.
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION create_order_atomic(
  p_user_id         TEXT,
  p_shipping_name   TEXT,
  p_shipping_street TEXT,
  p_shipping_city   TEXT,
  p_shipping_postal TEXT,
  p_shipping_country TEXT DEFAULT 'PL',
  p_shipping_phone  TEXT DEFAULT NULL,
  p_notes           TEXT DEFAULT NULL,
  -- Items jako JSON array: [{"listing_id":"...","quantity":1,"unit_price":10.00,"source_type":"buy_now","bid_id":null}]
  p_items           JSONB DEFAULT '[]'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_order_id    UUID;
  v_subtotal    NUMERIC(10,2) := 0;
  v_item        JSONB;
  v_listing     RECORD;
  v_item_total  NUMERIC(10,2);
  v_new_qty     INT;
  -- Posortowane items — zapobiega deadlockom
  v_sorted_items JSONB;
BEGIN
  -- Sortuj items po listing_id — przewidywalna kolejność locków
  SELECT jsonb_agg(elem ORDER BY elem->>'listing_id')
  INTO v_sorted_items
  FROM jsonb_array_elements(p_items) AS elem;

  IF v_sorted_items IS NULL OR jsonb_array_length(v_sorted_items) = 0 THEN
    RAISE EXCEPTION 'Zamówienie musi zawierać przynajmniej jedną pozycję';
  END IF;

  -- 1. Waliduj i lockuj wszystkie listingi (posortowane!)
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_sorted_items)
  LOOP
    SELECT *
    INTO v_listing
    FROM listings
    WHERE id = (v_item->>'listing_id')::UUID
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Listing % nie istnieje', v_item->>'listing_id';
    END IF;

    IF NOT v_listing.is_active OR v_listing.status != 'active' THEN
      RAISE EXCEPTION 'Oferta "%" nie jest aktywna', v_listing.title;
    END IF;

    IF v_listing.quantity_available < (v_item->>'quantity')::INT THEN
      RAISE EXCEPTION 'Niewystarczająca ilość dla "%"  (dostępne: %)',
        v_listing.title, v_listing.quantity_available;
    END IF;
  END LOOP;

  -- 2. Oblicz subtotal
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_sorted_items)
  LOOP
    v_item_total := ROUND((v_item->>'quantity')::INT * (v_item->>'unit_price')::NUMERIC, 2);
    v_subtotal := v_subtotal + v_item_total;
  END LOOP;

  -- 3. Wstaw zamówienie
  INSERT INTO orders (
    user_id, status,
    shipping_name, shipping_street, shipping_city,
    shipping_postal, shipping_country, shipping_phone,
    subtotal, shipping_cost, total, notes
  ) VALUES (
    p_user_id::UUID, 'pending',
    p_shipping_name, p_shipping_street, p_shipping_city,
    p_shipping_postal, p_shipping_country, p_shipping_phone,
    v_subtotal, 0, v_subtotal, p_notes
  )
  RETURNING id INTO v_order_id;

  -- 4. Wstaw pozycje
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_sorted_items)
  LOOP
    v_item_total := ROUND((v_item->>'quantity')::INT * (v_item->>'unit_price')::NUMERIC, 2);

    INSERT INTO order_items (
      order_id, listing_id, quantity, unit_price, total_price,
      source_type, bid_id
    ) VALUES (
      v_order_id,
      (v_item->>'listing_id')::UUID,
      (v_item->>'quantity')::INT,
      (v_item->>'unit_price')::NUMERIC,
      v_item_total,
      (v_item->>'source_type')::listing_type_enum,
      NULLIF(v_item->>'bid_id', 'null')::UUID
    );
  END LOOP;

  -- 5. Dekrementuj stany (listingi już zlockowane w kroku 1)
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_sorted_items)
  LOOP
    v_new_qty := (
      SELECT quantity_available - (v_item->>'quantity')::INT
      FROM listings
      WHERE id = (v_item->>'listing_id')::UUID
    );

    UPDATE listings
    SET quantity_available = v_new_qty,
        status = CASE WHEN v_new_qty = 0 THEN 'sold'::listing_status_enum ELSE status END,
        is_active = CASE WHEN v_new_qty = 0 THEN false ELSE is_active END
    WHERE id = (v_item->>'listing_id')::UUID;
  END LOOP;

  RETURN v_order_id;
END;
$$;


-- ────────────────────────────────────────────────────────────
-- 4. DB-LEVEL CONSTRAINTS
--    Aukcja tylko dla listing type = 'auction'
-- ────────────────────────────────────────────────────────────

-- Trigger: blokuj INSERT aukcji dla nie-auction listingów
CREATE OR REPLACE FUNCTION check_auction_listing_type()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM listings
    WHERE id = NEW.listing_id
    AND listing_type = 'auction'
  ) THEN
    RAISE EXCEPTION 'Aukcja może być przypisana tylko do listingu typu auction';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_auction_listing_type ON auctions;

CREATE TRIGGER trg_check_auction_listing_type
  BEFORE INSERT OR UPDATE OF listing_id ON auctions
  FOR EACH ROW
  EXECUTE FUNCTION check_auction_listing_type();

-- Trigger: blokuj zmianę listing_type jeśli ma aukcję
CREATE OR REPLACE FUNCTION check_listing_type_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.listing_type = 'auction' AND NEW.listing_type != 'auction' THEN
    IF EXISTS (SELECT 1 FROM auctions WHERE listing_id = NEW.id) THEN
      RAISE EXCEPTION 'Nie można zmienić typu listingu — ma przypisaną aukcję';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_listing_type_change ON listings;

CREATE TRIGGER trg_check_listing_type_change
  BEFORE UPDATE OF listing_type ON listings
  FOR EACH ROW
  EXECUTE FUNCTION check_listing_type_change();


-- ============================================================
-- KONIEC MIGRACJI 006
-- ============================================================

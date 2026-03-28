-- ============================================================
-- THE LIQUIDATOR — Migration: Atomic Operations
-- 005_atomic_operations.sql
-- ============================================================
-- Rozwiązuje:
--   [1] Race condition w bidowaniu — pg function z row lock
--   [2] Overselling w checkout — SELECT FOR UPDATE na listings
--   [3] Anti-sniping cap — max 3 extendy per aukcję
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. ATOMOWE BIDOWANIE
--    Jedna transakcja: walidacja + insert bid + update auction.
--    Row lock na auctions — dwa bidy w tej samej ms nie przejdą.
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION place_bid(
  p_auction_id  UUID,
  p_user_id     TEXT,
  p_amount      NUMERIC(10,2),
  p_snipe_window_ms INT DEFAULT 30000,
  p_max_extends INT DEFAULT 3
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
  v_extend_count  INT;
  v_new_end       TIMESTAMPTZ;
  v_was_extended  BOOLEAN := false;
BEGIN
  -- Lock wiersza aukcji — blokuje inne bidy do końca transakcji
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

  -- Walidacja kwoty
  v_min_required := COALESCE(v_auction.current_price, v_auction.starting_price)
                    + v_auction.min_bid_increment;

  IF p_amount < v_min_required THEN
    RAISE EXCEPTION 'Minimalna kwota: % zł', v_min_required;
  END IF;

  -- Zresetuj is_winning na poprzednim bidzie
  IF v_auction.winning_bid_id IS NOT NULL THEN
    UPDATE bids SET is_winning = false
    WHERE id = v_auction.winning_bid_id;
  END IF;

  -- Wstaw nowy bid
  INSERT INTO bids (auction_id, user_id, amount, is_winning)
  VALUES (p_auction_id, p_user_id, p_amount, true)
  RETURNING id INTO v_new_bid_id;

  -- Anti-sniping z capem
  v_time_left_ms := EXTRACT(EPOCH FROM (v_auction.end_time - now())) * 1000;
  v_new_end := v_auction.end_time;

  IF v_time_left_ms > 0 AND v_time_left_ms <= p_snipe_window_ms THEN
    -- Policz ile razy już przedłużaliśmy
    SELECT COUNT(*) INTO v_extend_count
    FROM bids
    WHERE auction_id = p_auction_id
      AND created_at > (v_auction.end_time - (p_snipe_window_ms || ' milliseconds')::interval);

    IF v_extend_count <= p_max_extends THEN
      v_new_end := now() + (p_snipe_window_ms || ' milliseconds')::interval;
      v_was_extended := true;
    END IF;
  END IF;

  -- Zaktualizuj aukcję
  UPDATE auctions
  SET current_price   = p_amount,
      winning_bid_id  = v_new_bid_id,
      bid_count       = v_auction.bid_count + 1,
      end_time        = v_new_end
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
-- 2. ATOMOWY CHECKOUT — dekrementacja z lockiem
--    Zapobiega overselling: SELECT FOR UPDATE na listing.
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION decrement_quantity(
  p_listing_id UUID,
  p_amount     INT
)
RETURNS TABLE (
  new_quantity  INT,
  is_sold_out  BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_listing RECORD;
  v_new_qty INT;
BEGIN
  -- Lock wiersza listingu
  SELECT quantity_available, is_active, status
  INTO v_listing
  FROM listings
  WHERE id = p_listing_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Listing nie istnieje';
  END IF;

  IF NOT v_listing.is_active OR v_listing.status != 'active' THEN
    RAISE EXCEPTION 'Oferta nie jest aktywna';
  END IF;

  IF v_listing.quantity_available < p_amount THEN
    RAISE EXCEPTION 'Niewystarczająca ilość (dostępne: %)', v_listing.quantity_available;
  END IF;

  v_new_qty := v_listing.quantity_available - p_amount;

  UPDATE listings
  SET quantity_available = v_new_qty,
      status = CASE WHEN v_new_qty = 0 THEN 'sold'::listing_status_enum ELSE status END,
      is_active = CASE WHEN v_new_qty = 0 THEN false ELSE is_active END
  WHERE id = p_listing_id;

  RETURN QUERY SELECT v_new_qty, (v_new_qty = 0);
END;
$$;


-- ────────────────────────────────────────────────────────────
-- 3. ANTI-SNIPING: kolumna extend_count na auctions
--    Śledzenie ile razy aukcja była przedłużona.
-- ────────────────────────────────────────────────────────────

ALTER TABLE auctions
  ADD COLUMN IF NOT EXISTS extend_count INT NOT NULL DEFAULT 0;
ALTER TABLE auctions
  ADD COLUMN IF NOT EXISTS max_extends INT NOT NULL DEFAULT 3;


-- Zaktualizowana wersja place_bid z extend_count
CREATE OR REPLACE FUNCTION place_bid(
  p_auction_id  UUID,
  p_user_id     TEXT,
  p_amount      NUMERIC(10,2),
  p_snipe_window_ms INT DEFAULT 30000,
  p_max_extends INT DEFAULT 3
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

  IF v_auction.winning_bid_id IS NOT NULL THEN
    UPDATE bids SET is_winning = false
    WHERE id = v_auction.winning_bid_id;
  END IF;

  INSERT INTO bids (auction_id, user_id, amount, is_winning)
  VALUES (p_auction_id, p_user_id, p_amount, true)
  RETURNING id INTO v_new_bid_id;

  -- Anti-sniping z capem (kolumna extend_count)
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


-- ============================================================
-- KONIEC MIGRACJI 005
-- ============================================================

-- ============================================================
-- THE LIQUIDATOR — Migration: Marketplace Tables
-- 003_marketplace.sql
-- Target: Supabase (PostgreSQL 15+)
-- ============================================================
-- Nowe tabele:
--   [1] user_profiles — profil kupującego (Supabase Auth)
--   [2] user_addresses — wiele adresów na użytkownika
--   [3] listings — oferty publiczne (kup_teraz / aukcja)
--   [4] auctions — dane aukcji (czas, ceny, stan)
--   [5] bids — licytacje
--   [6] orders — zamówienia
--   [7] order_items — pozycje zamówień
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. ENUMY
-- ────────────────────────────────────────────────────────────

CREATE TYPE listing_type_enum  AS ENUM ('buy_now', 'auction');
CREATE TYPE listing_status_enum AS ENUM ('draft', 'active', 'sold', 'cancelled');
CREATE TYPE auction_status_enum AS ENUM ('scheduled', 'active', 'ended', 'cancelled');
CREATE TYPE order_status_enum   AS ENUM ('pending', 'paid', 'shipped', 'completed', 'cancelled');


-- ────────────────────────────────────────────────────────────
-- 2. TABELA: user_profiles
--    Rozszerzenie Supabase Auth (auth.users).
--    Bez duplikacji email/hasła — FK do auth.users(id).
-- ────────────────────────────────────────────────────────────

CREATE TABLE user_profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name      TEXT NOT NULL,
  phone             TEXT,
  default_address_id UUID,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);

CREATE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ────────────────────────────────────────────────────────────
-- 3. TABELA: user_addresses
--    Wiele adresów na użytkownika. Jeden domyślny
--    wskazywany przez user_profiles.default_address_id.
-- ────────────────────────────────────────────────────────────

CREATE TABLE user_addresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL
              REFERENCES user_profiles(id) ON DELETE CASCADE,
  label       TEXT        NOT NULL DEFAULT 'Domowy',
  full_name   TEXT        NOT NULL,
  street      TEXT        NOT NULL,
  city        TEXT        NOT NULL,
  postal_code TEXT        NOT NULL,
  country     TEXT        NOT NULL DEFAULT 'PL',
  phone       TEXT,

  created_at  TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);

CREATE TRIGGER trg_user_addresses_updated_at
  BEFORE UPDATE ON user_addresses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_addresses_user ON user_addresses (user_id);

-- Deferred FK — default_address_id wskazuje na user_addresses,
-- ale user_addresses.user_id wskazuje na user_profiles.
-- Dodajemy FK po obu tabelach.
ALTER TABLE user_profiles
  ADD CONSTRAINT fk_default_address
  FOREIGN KEY (default_address_id)
  REFERENCES user_addresses(id)
  ON DELETE SET NULL;


-- ────────────────────────────────────────────────────────────
-- 4. TABELA: listings
--    Oferta publiczna powiązana z inventory_item.
--    Jeden item = max jedna aktywna oferta (UNIQUE partial).
-- ────────────────────────────────────────────────────────────

CREATE TABLE listings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id   UUID               NOT NULL
                      REFERENCES inventory_items(id) ON DELETE RESTRICT,
  listing_type        listing_type_enum  NOT NULL,
  status              listing_status_enum NOT NULL DEFAULT 'draft',

  title               TEXT               NOT NULL,
  description         TEXT,
  images              TEXT[]             DEFAULT '{}',

  -- Cena "kup teraz" (wymagana dla buy_now, opcjonalna dla aukcji jako buy-it-now)
  buy_now_price       NUMERIC(10,2)      CHECK (buy_now_price >= 0),

  quantity_available  INT                NOT NULL DEFAULT 1
                      CHECK (quantity_available >= 0),
  is_active           BOOLEAN            NOT NULL DEFAULT false,
  is_featured         BOOLEAN            NOT NULL DEFAULT false,

  -- SEO / szukajka
  slug                TEXT               UNIQUE,
  category            TEXT,
  tags                TEXT[]             DEFAULT '{}',

  published_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ        NOT NULL DEFAULT current_timestamp,
  updated_at          TIMESTAMPTZ        NOT NULL DEFAULT current_timestamp,

  -- buy_now wymaga ceny
  CONSTRAINT chk_buy_now_price CHECK (
    listing_type != 'buy_now' OR buy_now_price IS NOT NULL
  )
);

CREATE TRIGGER trg_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Jeden item = max jedna aktywna oferta
CREATE UNIQUE INDEX uq_listing_active_item
  ON listings (inventory_item_id)
  WHERE status IN ('draft', 'active');

CREATE INDEX idx_listings_status     ON listings (status);
CREATE INDEX idx_listings_type       ON listings (listing_type);
CREATE INDEX idx_listings_active     ON listings (is_active, status);
CREATE INDEX idx_listings_category   ON listings (category);
CREATE INDEX idx_listings_item       ON listings (inventory_item_id);


-- ────────────────────────────────────────────────────────────
-- 5. TABELA: auctions
--    Dane aukcji. 1:1 z listing (tylko dla type = 'auction').
-- ────────────────────────────────────────────────────────────

CREATE TABLE auctions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id       UUID               NOT NULL UNIQUE
                   REFERENCES listings(id) ON DELETE RESTRICT,

  status           auction_status_enum NOT NULL DEFAULT 'scheduled',

  start_time       TIMESTAMPTZ        NOT NULL,
  end_time         TIMESTAMPTZ        NOT NULL,

  starting_price   NUMERIC(10,2)      NOT NULL CHECK (starting_price >= 0),
  reserve_price    NUMERIC(10,2)      CHECK (reserve_price >= 0),
  min_bid_increment NUMERIC(10,2)     NOT NULL DEFAULT 1.00
                   CHECK (min_bid_increment > 0),

  current_price    NUMERIC(10,2)      CHECK (current_price >= 0),
  winning_bid_id   UUID,
  bid_count        INT                NOT NULL DEFAULT 0,

  created_at       TIMESTAMPTZ        NOT NULL DEFAULT current_timestamp,
  updated_at       TIMESTAMPTZ        NOT NULL DEFAULT current_timestamp,

  -- Walidacja czasowa
  CONSTRAINT chk_auction_times CHECK (start_time < end_time),

  -- Rezerwa >= cena wywoławcza
  CONSTRAINT chk_reserve_price CHECK (
    reserve_price IS NULL OR reserve_price >= starting_price
  )
);

CREATE TRIGGER trg_auctions_updated_at
  BEFORE UPDATE ON auctions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_auctions_status   ON auctions (status);
CREATE INDEX idx_auctions_end_time ON auctions (end_time) WHERE status = 'active';
CREATE INDEX idx_auctions_listing  ON auctions (listing_id);


-- ────────────────────────────────────────────────────────────
-- 6. TABELA: bids
--    Licytacje. Immutable po utworzeniu.
-- ────────────────────────────────────────────────────────────

CREATE TABLE bids (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id  UUID          NOT NULL
              REFERENCES auctions(id) ON DELETE RESTRICT,
  user_id     UUID          NOT NULL
              REFERENCES user_profiles(id) ON DELETE RESTRICT,
  amount      NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  is_winning  BOOLEAN       NOT NULL DEFAULT false,

  created_at  TIMESTAMPTZ   NOT NULL DEFAULT current_timestamp
);

-- Szybkie wyciąganie najwyższej oferty
CREATE INDEX idx_bids_auction_time ON bids (auction_id, created_at DESC);
-- Historia licytacji użytkownika
CREATE INDEX idx_bids_user_auction ON bids (user_id, auction_id);

-- Deferred FK: auctions.winning_bid_id → bids.id
ALTER TABLE auctions
  ADD CONSTRAINT fk_winning_bid
  FOREIGN KEY (winning_bid_id)
  REFERENCES bids(id)
  ON DELETE SET NULL;


-- ────────────────────────────────────────────────────────────
-- 7. TABELA: orders
-- ────────────────────────────────────────────────────────────

CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID              NOT NULL
                   REFERENCES user_profiles(id) ON DELETE RESTRICT,
  status           order_status_enum NOT NULL DEFAULT 'pending',

  -- Snapshot adresu w momencie zamówienia (dane się nie zmienią)
  shipping_name    TEXT              NOT NULL,
  shipping_street  TEXT              NOT NULL,
  shipping_city    TEXT              NOT NULL,
  shipping_postal  TEXT              NOT NULL,
  shipping_country TEXT              NOT NULL DEFAULT 'PL',
  shipping_phone   TEXT,

  subtotal         NUMERIC(10,2)     NOT NULL CHECK (subtotal >= 0),
  shipping_cost    NUMERIC(10,2)     NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  total            NUMERIC(10,2)     NOT NULL CHECK (total >= 0),

  notes            TEXT              CHECK (length(notes) <= 500),

  -- Płatności (faza 2 — Stripe/P24)
  payment_method   TEXT,
  payment_id       TEXT,
  paid_at          TIMESTAMPTZ,

  created_at       TIMESTAMPTZ       NOT NULL DEFAULT current_timestamp,
  updated_at       TIMESTAMPTZ       NOT NULL DEFAULT current_timestamp,

  -- Total = subtotal + shipping
  CONSTRAINT chk_order_total CHECK (total = subtotal + shipping_cost)
);

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_orders_user   ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);


-- ────────────────────────────────────────────────────────────
-- 8. TABELA: order_items
-- ────────────────────────────────────────────────────────────

CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID          NOT NULL
              REFERENCES orders(id) ON DELETE CASCADE,
  listing_id  UUID          NOT NULL
              REFERENCES listings(id) ON DELETE RESTRICT,

  quantity    INT           NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price  NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),

  -- Źródło zakupu (kup_teraz vs wygrana aukcja)
  source_type listing_type_enum NOT NULL,
  bid_id      UUID          REFERENCES bids(id) ON DELETE SET NULL,

  created_at  TIMESTAMPTZ   NOT NULL DEFAULT current_timestamp,

  -- total = quantity * unit_price
  CONSTRAINT chk_item_total CHECK (total_price = quantity * unit_price)
);

CREATE INDEX idx_order_items_order   ON order_items (order_id);
CREATE INDEX idx_order_items_listing ON order_items (listing_id);


-- ────────────────────────────────────────────────────────────
-- 9. RLS (Row Level Security) — Supabase Auth
--    Kupujący widzi tylko swoje dane.
-- ────────────────────────────────────────────────────────────

ALTER TABLE user_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids           ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items    ENABLE ROW LEVEL SECURITY;

-- Listings i auctions — publiczne do odczytu
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;

-- user_profiles: własny profil
CREATE POLICY "Users read own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- user_addresses: własne adresy
CREATE POLICY "Users manage own addresses"
  ON user_addresses FOR ALL
  USING (auth.uid() = user_id);

-- listings: publiczny odczyt aktywnych, admin pisze
CREATE POLICY "Public read active listings"
  ON listings FOR SELECT
  USING (is_active = true AND status = 'active');

-- auctions: publiczny odczyt
CREATE POLICY "Public read auctions"
  ON auctions FOR SELECT
  USING (true);

-- bids: każdy widzi bidy aukcji, ale tylko swoje tworzy
CREATE POLICY "Users read all bids"
  ON bids FOR SELECT
  USING (true);

CREATE POLICY "Users create own bids"
  ON bids FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- orders: własne zamówienia
CREATE POLICY "Users manage own orders"
  ON orders FOR ALL
  USING (auth.uid() = user_id);

-- order_items: widoczne przez order policy (CASCADE)
CREATE POLICY "Users read own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );


-- ============================================================
-- KONIEC MIGRACJI 003
-- ============================================================

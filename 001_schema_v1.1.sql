-- ============================================================
-- THE LIQUIDATOR — Mikro-Fulfillment & Komis
-- Database Schema v1.1
-- Target: Supabase (PostgreSQL 15+)
-- ============================================================
-- CHANGELOG v1.1:
--   [1] payout_status_enum zamiast TEXT CHECK
--   [2] CHECK cena_docelowa >= cena_zakupu
--   [3] notes ograniczone do 500 znaków
--   [4] warehouse_logs FK → ON DELETE CASCADE (logi podążają za itemem)
--   [5] indeks kompozytowy (status, client_id)
--   [6] pola audytowe: last_audited_at, checked_by
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. ENUMY
-- ────────────────────────────────────────────────────────────

CREATE TYPE typ_modelu_enum    AS ENUM ('fulfillment', 'komis');
CREATE TYPE stan_enum          AS ENUM ('nowy', 'używany');
CREATE TYPE status_enum        AS ENUM ('w_magazynie', 'sprzedane', 'zwrocone');
CREATE TYPE typ_akcji_enum     AS ENUM ('PRZYJECIE', 'WYDANIE', 'ZWROT', 'KOREKTA');
CREATE TYPE payout_status_enum AS ENUM ('oczekujace', 'wyplacone');


-- ────────────────────────────────────────────────────────────
-- 2. HELPER: auto-update updated_at
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = current_timestamp;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ────────────────────────────────────────────────────────────
-- 3. TABELA: clients
-- ────────────────────────────────────────────────────────────

CREATE TABLE clients (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nazwa         TEXT            NOT NULL,
  email         TEXT,
  telefon       TEXT,
  typ_modelu    typ_modelu_enum NOT NULL,

  -- komis: prowizja jako ułamek (np. 0.15 = 15%)
  stawka_prowizji  NUMERIC(5,4) CHECK (stawka_prowizji >= 0 AND stawka_prowizji <= 1),

  -- fulfillment: stawka za paczkę w PLN
  stawka_za_paczke NUMERIC(10,2) CHECK (stawka_za_paczke >= 0),

  created_at    TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,

  -- Walidacja biznesowa: komis wymaga prowizji, fulfillment wymaga stawki
  CONSTRAINT chk_komis_prowizja CHECK (
    typ_modelu != 'komis' OR stawka_prowizji IS NOT NULL
  ),
  CONSTRAINT chk_fulfillment_stawka CHECK (
    typ_modelu != 'fulfillment' OR stawka_za_paczke IS NOT NULL
  )
);

CREATE TRIGGER trg_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ────────────────────────────────────────────────────────────
-- 4. TABELA: inventory_items
-- ────────────────────────────────────────────────────────────

CREATE TABLE inventory_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku             TEXT          NOT NULL UNIQUE,
  nazwa           TEXT          NOT NULL,
  opis            TEXT,
  stan            stan_enum     NOT NULL DEFAULT 'nowy',
  status          status_enum   NOT NULL DEFAULT 'w_magazynie',
  lokalizacja_kod TEXT          NOT NULL,

  cena_zakupu     NUMERIC(10,2) NOT NULL CHECK (cena_zakupu  >= 0),
  cena_docelowa   NUMERIC(10,2) NOT NULL CHECK (cena_docelowa >= 0),

  client_id       UUID          NOT NULL
                  REFERENCES clients(id) ON DELETE RESTRICT,

  -- [6] Pola audytowe — manual-first workflow
  last_audited_at TIMESTAMPTZ,
  checked_by      TEXT,

  created_at      TIMESTAMPTZ   NOT NULL DEFAULT current_timestamp,
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT current_timestamp,

  -- Jedna lokalizacja na klienta — bez konfliktów na półkach
  CONSTRAINT uq_lokalizacja_client UNIQUE (lokalizacja_kod, client_id),

  -- [2] Cena docelowa nie może być niższa niż zakup
  CONSTRAINT chk_cena_docelowa CHECK (cena_docelowa >= cena_zakupu)
);

CREATE TRIGGER trg_inventory_items_updated_at
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ────────────────────────────────────────────────────────────
-- 5. TABELA: warehouse_logs
-- ────────────────────────────────────────────────────────────

CREATE TABLE warehouse_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- [4] CASCADE — usunięcie itemu czyści powiązane logi
  item_id     UUID           NOT NULL
              REFERENCES inventory_items(id) ON DELETE CASCADE,

  typ_akcji   typ_akcji_enum NOT NULL,

  -- [3] Notes z limitem 500 znaków
  notes       TEXT           CHECK (length(notes) <= 500),

  created_at  TIMESTAMPTZ    NOT NULL DEFAULT current_timestamp,
  updated_at  TIMESTAMPTZ    NOT NULL DEFAULT current_timestamp
);

CREATE TRIGGER trg_warehouse_logs_updated_at
  BEFORE UPDATE ON warehouse_logs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ────────────────────────────────────────────────────────────
-- 6. TABELA: payouts
-- ────────────────────────────────────────────────────────────

CREATE TABLE payouts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID               NOT NULL
              REFERENCES clients(id) ON DELETE RESTRICT,
  kwota_netto NUMERIC(10,2)      NOT NULL CHECK (kwota_netto >= 0),

  -- [1] Pełny ENUM zamiast TEXT CHECK
  status      payout_status_enum NOT NULL DEFAULT 'oczekujace',

  created_at  TIMESTAMPTZ        NOT NULL DEFAULT current_timestamp,
  updated_at  TIMESTAMPTZ        NOT NULL DEFAULT current_timestamp
);

CREATE TRIGGER trg_payouts_updated_at
  BEFORE UPDATE ON payouts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ────────────────────────────────────────────────────────────
-- 7. INDEKSY
-- ────────────────────────────────────────────────────────────

-- inventory_items
CREATE INDEX idx_inventory_status        ON inventory_items (status);
CREATE INDEX idx_inventory_lokalizacja   ON inventory_items (lokalizacja_kod);
CREATE INDEX idx_inventory_client        ON inventory_items (client_id);

-- [5] Kompozytowy indeks dla filtrowania dashboardu
CREATE INDEX idx_inventory_status_client ON inventory_items (status, client_id);

-- warehouse_logs
CREATE INDEX idx_whlogs_item             ON warehouse_logs (item_id);
CREATE INDEX idx_whlogs_typ_akcji        ON warehouse_logs (typ_akcji);

-- payouts
CREATE INDEX idx_payouts_client          ON payouts (client_id);
CREATE INDEX idx_payouts_status          ON payouts (status);


-- ============================================================
-- KONIEC SCHEMATU v1.1
-- ============================================================

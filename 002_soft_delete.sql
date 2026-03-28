-- ============================================================
-- THE LIQUIDATOR — Migration: Soft Delete Support
-- 002_soft_delete.sql
-- ============================================================
-- Zmiany:
--   [1] status_enum += 'wycofane' (soft delete dla inventory)
--   [2] clients += archived_at (soft delete dla klientów)
--   [3] warehouse_logs FK → ON DELETE RESTRICT (nie CASCADE)
--       Bo teraz nie kasujemy itemów, więc CASCADE niepotrzebny,
--       a RESTRICT chroni przed przypadkowym usunięciem.
-- ============================================================


-- [1] Dodaj 'wycofane' do status_enum
ALTER TYPE status_enum ADD VALUE IF NOT EXISTS 'wycofane';


-- [2] Dodaj pole archiwizacji do clients
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ DEFAULT NULL;

-- Indeks — szybkie filtrowanie aktywnych klientów
CREATE INDEX IF NOT EXISTS idx_clients_archived
  ON clients (archived_at)
  WHERE archived_at IS NULL;


-- [3] Zmień FK w warehouse_logs z CASCADE na RESTRICT
--     (wymaga drop + recreate constraint)
ALTER TABLE warehouse_logs
  DROP CONSTRAINT IF EXISTS warehouse_logs_item_id_fkey;

ALTER TABLE warehouse_logs
  ADD CONSTRAINT warehouse_logs_item_id_fkey
  FOREIGN KEY (item_id) REFERENCES inventory_items(id)
  ON DELETE RESTRICT;


-- ============================================================
-- KONIEC MIGRACJI 002
-- ============================================================

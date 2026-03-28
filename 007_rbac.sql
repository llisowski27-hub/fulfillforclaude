-- ============================================================
-- THE LIQUIDATOR — Migration: Role-Based Access Control
-- 007_rbac.sql
-- ============================================================
-- Rozwiązuje:
--   [1] Brak kontroli ról — dodanie kolumny `role` do user_profiles
--   [2] RLS policies dla admin-only operacji
--   [3] Domyślna rola: 'user', admin nadaje się ręcznie
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. ENUM + KOLUMNA ROLI
-- ────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE user_role_enum AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS role user_role_enum NOT NULL DEFAULT 'user';

-- Index dla szybkiego filtrowania adminów
CREATE INDEX IF NOT EXISTS idx_user_profiles_role
  ON user_profiles (role);


-- ────────────────────────────────────────────────────────────
-- 2. HELPER FUNCTION — sprawdzanie roli
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = p_user_id AND role = 'admin'
  );
$$;


-- ────────────────────────────────────────────────────────────
-- 3. RLS — ochrona krytycznych tabel
--    Listings: insert/update/delete tylko admin
--    Auctions: insert/update/delete tylko admin
--    Orders: update statusu tylko admin
--    Payouts: wszystkie operacje tylko admin
--    Clients: wszystkie operacje tylko admin
--    Inventory: wszystkie operacje tylko admin
-- ────────────────────────────────────────────────────────────

-- Listings — admin-only zapisy
DROP POLICY IF EXISTS listings_admin_write ON listings;
CREATE POLICY listings_admin_write ON listings
  FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Listings — publiczny odczyt aktywnych
DROP POLICY IF EXISTS listings_public_read ON listings;
CREATE POLICY listings_public_read ON listings
  FOR SELECT
  USING (is_active = true AND status = 'active');

-- Auctions — admin zapis, publiczny odczyt
DROP POLICY IF EXISTS auctions_admin_write ON auctions;
CREATE POLICY auctions_admin_write ON auctions
  FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS auctions_public_read ON auctions;
CREATE POLICY auctions_public_read ON auctions
  FOR SELECT
  USING (true);

-- Payouts — admin only
DROP POLICY IF EXISTS payouts_admin_only ON payouts;
CREATE POLICY payouts_admin_only ON payouts
  FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Clients — admin only
DROP POLICY IF EXISTS clients_admin_only ON clients;
CREATE POLICY clients_admin_only ON clients
  FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Inventory — admin only
DROP POLICY IF EXISTS inventory_admin_only ON inventory_items;
CREATE POLICY inventory_admin_only ON inventory_items
  FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));


-- ============================================================
-- KONIEC MIGRACJI 007
-- ============================================================

-- ============================================================
-- THE LIQUIDATOR — Production Migration Runner
-- migrate.sql
-- ============================================================
-- Uruchom w Supabase SQL Editor lub przez psql:
--   psql $DATABASE_URL -f migrate.sql
--
-- Kolejność migracji:
--   001_schema_v1.1.sql  — tabele admin (clients, inventory, warehouse_logs, payouts)
--   002_soft_delete.sql  — soft delete (status wycofane, archived_at)
--   003_marketplace.sql  — marketplace (users, listings, auctions, bids, orders)
--   004_realtime.sql     — Supabase Realtime na auctions + bids
--
-- UWAGA: Uruchom każdy plik osobno w Supabase SQL Editor
-- jeśli chcesz kontrolować każdy krok.
-- ============================================================

-- Weryfikacja: sprawdź czy tabele istnieją
DO $$
BEGIN
  -- Tabele admin
  ASSERT (SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients')),
    'Tabela clients nie istnieje — uruchom 001_schema_v1.1.sql';
  ASSERT (SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inventory_items')),
    'Tabela inventory_items nie istnieje — uruchom 001_schema_v1.1.sql';

  -- Tabele marketplace
  ASSERT (SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'listings')),
    'Tabela listings nie istnieje — uruchom 003_marketplace.sql';
  ASSERT (SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'auctions')),
    'Tabela auctions nie istnieje — uruchom 003_marketplace.sql';
  ASSERT (SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bids')),
    'Tabela bids nie istnieje — uruchom 003_marketplace.sql';
  ASSERT (SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders')),
    'Tabela orders nie istnieje — uruchom 003_marketplace.sql';

  -- Realtime
  ASSERT (SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'auctions'
  )), 'Realtime nie włączony na auctions — uruchom 004_realtime.sql';

  ASSERT (SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'bids'
  )), 'Realtime nie włączony na bids — uruchom 004_realtime.sql';

  -- Indeksy kluczowe
  ASSERT (SELECT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_listings_active'
  )), 'Indeks idx_listings_active nie istnieje';

  ASSERT (SELECT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_auctions_end_time'
  )), 'Indeks idx_auctions_end_time nie istnieje';

  ASSERT (SELECT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bids_auction_time'
  )), 'Indeks idx_bids_auction_time nie istnieje';

  -- Atomic functions (005)
  ASSERT (SELECT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'place_bid'
  )), 'Funkcja place_bid nie istnieje — uruchom 005_atomic_operations.sql';

  ASSERT (SELECT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'decrement_quantity'
  )), 'Funkcja decrement_quantity nie istnieje — uruchom 005_atomic_operations.sql';

  ASSERT (SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'auctions' AND column_name = 'extend_count'
  )), 'Kolumna extend_count nie istnieje — uruchom 005_atomic_operations.sql';

  -- Critical fixes (006)
  ASSERT (SELECT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'create_order_atomic'
  )), 'Funkcja create_order_atomic nie istnieje — uruchom 006_critical_fixes.sql';

  ASSERT (SELECT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_check_auction_listing_type'
  )), 'Trigger trg_check_auction_listing_type nie istnieje — uruchom 006_critical_fixes.sql';

  ASSERT (SELECT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_check_listing_type_change'
  )), 'Trigger trg_check_listing_type_change nie istnieje — uruchom 006_critical_fixes.sql';

  RAISE NOTICE '✓ Wszystkie migracje, indeksy, funkcje i triggery poprawne';
END
$$;

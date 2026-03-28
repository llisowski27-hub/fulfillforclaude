-- ============================================================
-- THE LIQUIDATOR — Migration: Enable Realtime
-- 004_realtime.sql
-- ============================================================
-- Włącza Supabase Realtime na tabelach auctions i bids.
-- Pozwala klientom subskrybować zmiany przez WebSocket.
--
-- UWAGA: W Supabase Dashboard → Database → Replication
-- upewnij się, że tabele auctions i bids mają włączony
-- "Realtime" toggle. Ta migracja robi to programatycznie.
-- ============================================================

-- Włącz Realtime publication na auctions
ALTER PUBLICATION supabase_realtime ADD TABLE auctions;

-- Włącz Realtime publication na bids
ALTER PUBLICATION supabase_realtime ADD TABLE bids;

-- Replica identity FULL — żeby payload UPDATE zawierał
-- wszystkie kolumny, nie tylko PK i zmienione pola.
-- Bez tego useRealtimeAuction nie dostanie current_price.
ALTER TABLE auctions REPLICA IDENTITY FULL;
ALTER TABLE bids REPLICA IDENTITY FULL;

-- ============================================================
-- KONIEC MIGRACJI 004
-- ============================================================

-- ============================================================
-- THE LIQUIDATOR — Seed Data
-- seed.sql
-- ============================================================
-- Realistyczne dane testowe. Uruchom po migracji.
-- Zdjęcia z picsum.photos (placeholder).
-- ============================================================

-- ── Klienci ─────────────────────────────────────────────────

INSERT INTO clients (id, nazwa, email, telefon, typ_modelu, stawka_prowizji, stawka_za_paczke) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'SneakerVault Sp. z o.o.', 'kontakt@sneakervault.pl', '+48 600 100 001', 'komis', 0.15, NULL),
  ('c1000000-0000-0000-0000-000000000002', 'TechOutlet24', 'info@techoutlet24.pl', '+48 600 100 002', 'fulfillment', NULL, 8.50),
  ('c1000000-0000-0000-0000-000000000003', 'RetroGadget', 'adam@retrogadget.pl', '+48 600 100 003', 'komis', 0.12, NULL);

-- ── Inventory Items ─────────────────────────────────────────

INSERT INTO inventory_items (id, sku, nazwa, opis, stan, status, lokalizacja_kod, cena_zakupu, cena_docelowa, client_id) VALUES
  ('i1000000-0000-0000-0000-000000000001', 'NIKE-AF1-42-WHT', 'Nike Air Force 1 Low White EU 42', 'Nowe, oryginalne pudełko, metki.', 'nowy', 'w_magazynie', 'A-01-01', 320.00, 549.00, 'c1000000-0000-0000-0000-000000000001'),
  ('i1000000-0000-0000-0000-000000000002', 'IPHONE-15-128-BLK', 'iPhone 15 128GB Black', 'Powystawowy, ekran bez rys, bateria 98%.', 'powystawowy', 'w_magazynie', 'B-01-01', 2800.00, 3499.00, 'c1000000-0000-0000-0000-000000000002'),
  ('i1000000-0000-0000-0000-000000000003', 'DYSON-V12-SLV', 'Dyson V12 Detect Slim Silver', 'Używany 3 miesiące, komplet końcówek.', 'używany', 'w_magazynie', 'B-02-01', 1200.00, 1899.00, 'c1000000-0000-0000-0000-000000000002'),
  ('i1000000-0000-0000-0000-000000000004', 'NB-574-44-GRY', 'New Balance 574 Grey EU 44', 'Po zwrocie, noszone 2 razy, oryginalne pudełko.', 'po_zwrocie', 'w_magazynie', 'A-01-02', 180.00, 299.00, 'c1000000-0000-0000-0000-000000000001'),
  ('i1000000-0000-0000-0000-000000000005', 'SONY-WH1000-BLK', 'Sony WH-1000XM5 Black', 'Odnowiony, nowe pady, etui.', 'odnowiony', 'w_magazynie', 'C-01-01', 650.00, 999.00, 'c1000000-0000-0000-0000-000000000003'),
  ('i1000000-0000-0000-0000-000000000006', 'LEGO-42143', 'LEGO Technic Ferrari Daytona SP3 42143', 'Nowy, zapieczętowany.', 'nowy', 'w_magazynie', 'C-02-01', 1400.00, 1799.00, 'c1000000-0000-0000-0000-000000000003');

-- ── Listings ────────────────────────────────────────────────

INSERT INTO listings (id, inventory_item_id, listing_type, status, title, description, images, buy_now_price, quantity_available, is_active, is_featured, slug, category, tags, published_at) VALUES
  (
    'l1000000-0000-0000-0000-000000000001',
    'i1000000-0000-0000-0000-000000000001',
    'auction',
    'active',
    'Nike Air Force 1 Low White EU 42 — Aukcja',
    'Kultowe AF1 w białym colorwayu. Nowe, nigdy nienoszone, oryginalne pudełko z metkami. Rozmiar EU 42 / US 8.5. Idealne na co dzień lub do kolekcji.',
    ARRAY['https://picsum.photos/seed/af1-1/800/800', 'https://picsum.photos/seed/af1-2/800/800', 'https://picsum.photos/seed/af1-3/800/800'],
    499.00,
    1,
    true,
    true,
    'nike-air-force-1-42-aukcja',
    'Sneakers',
    ARRAY['nike', 'af1', 'sneakers', 'eu42'],
    now()
  ),
  (
    'l1000000-0000-0000-0000-000000000002',
    'i1000000-0000-0000-0000-000000000002',
    'buy_now',
    'active',
    'iPhone 15 128GB Black — Powystawowy',
    'iPhone 15 w stanie powystawowym. Ekran bez rys, bateria 98%. Komplet: ładowarka USB-C, pudełko. Gwarancja producenta do końca roku.',
    ARRAY['https://picsum.photos/seed/iphone15-1/800/800', 'https://picsum.photos/seed/iphone15-2/800/800'],
    3499.00,
    1,
    true,
    false,
    'iphone-15-128gb-black',
    'Elektronika',
    ARRAY['apple', 'iphone', 'telefon'],
    now()
  ),
  (
    'l1000000-0000-0000-0000-000000000003',
    'i1000000-0000-0000-0000-000000000003',
    'auction',
    'active',
    'Dyson V12 Detect Slim — Aukcja od 1 zł',
    'Odkurzacz bezprzewodowy Dyson V12 Detect Slim. Używany 3 miesiące, komplet końcówek, laser na podłodze. Stan bardzo dobry.',
    ARRAY['https://picsum.photos/seed/dyson-1/800/800', 'https://picsum.photos/seed/dyson-2/800/800'],
    1699.00,
    1,
    true,
    true,
    'dyson-v12-detect-slim-aukcja',
    'AGD',
    ARRAY['dyson', 'odkurzacz', 'agd'],
    now()
  ),
  (
    'l1000000-0000-0000-0000-000000000004',
    'i1000000-0000-0000-0000-000000000004',
    'buy_now',
    'active',
    'New Balance 574 Grey EU 44',
    'Klasyczne NB 574 w szarym kolorze. Po zwrocie — noszone dosłownie 2 razy. Oryginalne pudełko.',
    ARRAY['https://picsum.photos/seed/nb574-1/800/800'],
    299.00,
    1,
    true,
    false,
    'new-balance-574-grey-44',
    'Sneakers',
    ARRAY['new-balance', 'nb574', 'sneakers'],
    now()
  ),
  (
    'l1000000-0000-0000-0000-000000000005',
    'i1000000-0000-0000-0000-000000000005',
    'buy_now',
    'active',
    'Sony WH-1000XM5 Black — Odnowione',
    'Najlepsze słuchawki ANC na rynku. Odnowione: nowe pady, wyczyszczone, etui w zestawie.',
    ARRAY['https://picsum.photos/seed/sony-xm5-1/800/800', 'https://picsum.photos/seed/sony-xm5-2/800/800'],
    999.00,
    2,
    true,
    false,
    'sony-wh1000xm5-black',
    'Elektronika',
    ARRAY['sony', 'słuchawki', 'anc'],
    now()
  ),
  (
    'l1000000-0000-0000-0000-000000000006',
    'i1000000-0000-0000-0000-000000000006',
    'auction',
    'active',
    'LEGO Technic Ferrari Daytona SP3 — Aukcja',
    'Nowy, zapieczętowany zestaw LEGO Technic 42143. Kolekcjonerski model Ferrari Daytona SP3, 3778 elementów.',
    ARRAY['https://picsum.photos/seed/lego-ferrari-1/800/800', 'https://picsum.photos/seed/lego-ferrari-2/800/800'],
    NULL,
    1,
    true,
    false,
    'lego-technic-ferrari-daytona-aukcja',
    'Kolekcje',
    ARRAY['lego', 'technic', 'ferrari', 'kolekcja'],
    now()
  );

-- ── Aukcje (3 aktywne z różnymi czasami końca) ─────────────

INSERT INTO auctions (id, listing_id, status, start_time, end_time, starting_price, reserve_price, min_bid_increment, current_price, bid_count, extend_count, max_extends) VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'l1000000-0000-0000-0000-000000000001',
    'active',
    now() - interval '2 hours',
    now() + interval '35 minutes',
    199.00,
    350.00,
    5.00,
    320.00,
    7,
    0,
    3
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'l1000000-0000-0000-0000-000000000003',
    'active',
    now() - interval '1 hour',
    now() + interval '4 hours',
    1.00,
    800.00,
    10.00,
    450.00,
    12,
    0,
    3
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'l1000000-0000-0000-0000-000000000006',
    'active',
    now() - interval '30 minutes',
    now() + interval '23 hours',
    500.00,
    NULL,
    25.00,
    750.00,
    4,
    0,
    3
  );

-- ── Przykładowe bidy ────────────────────────────────────────

INSERT INTO bids (id, auction_id, user_id, amount, is_winning, created_at) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'anon-user-aaa', 199.00, false, now() - interval '90 minutes'),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'anon-user-bbb', 210.00, false, now() - interval '80 minutes'),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'anon-user-aaa', 250.00, false, now() - interval '60 minutes'),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'anon-user-ccc', 280.00, false, now() - interval '30 minutes'),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'anon-user-bbb', 300.00, false, now() - interval '15 minutes'),
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'anon-user-aaa', 310.00, false, now() - interval '5 minutes'),
  ('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000001', 'anon-user-ccc', 320.00, true, now() - interval '2 minutes');

-- Aktualizuj winning_bid_id
UPDATE auctions SET winning_bid_id = 'b1000000-0000-0000-0000-000000000007'
WHERE id = 'a1000000-0000-0000-0000-000000000001';

-- Bidy dla Dyson aukcji
INSERT INTO bids (auction_id, user_id, amount, is_winning, created_at) VALUES
  ('a1000000-0000-0000-0000-000000000002', 'anon-user-bbb', 1.00, false, now() - interval '55 minutes'),
  ('a1000000-0000-0000-0000-000000000002', 'anon-user-aaa', 50.00, false, now() - interval '45 minutes'),
  ('a1000000-0000-0000-0000-000000000002', 'anon-user-ccc', 100.00, false, now() - interval '30 minutes'),
  ('a1000000-0000-0000-0000-000000000002', 'anon-user-bbb', 200.00, false, now() - interval '20 minutes'),
  ('a1000000-0000-0000-0000-000000000002', 'anon-user-aaa', 350.00, false, now() - interval '10 minutes'),
  ('a1000000-0000-0000-0000-000000000002', 'anon-user-ccc', 450.00, true, now() - interval '3 minutes');

-- ── Warehouse Logs ──────────────────────────────────────────

INSERT INTO warehouse_logs (item_id, typ_akcji, notes) VALUES
  ('i1000000-0000-0000-0000-000000000001', 'PRZYJECIE', 'Paleta od SneakerVault, 12 par'),
  ('i1000000-0000-0000-0000-000000000002', 'PRZYJECIE', 'Kurier DPD, powystawowe iPhone'),
  ('i1000000-0000-0000-0000-000000000003', 'PRZYJECIE', 'Odbiór osobisty TechOutlet24'),
  ('i1000000-0000-0000-0000-000000000004', 'PRZYJECIE', 'Zwrot od klienta — NB 574'),
  ('i1000000-0000-0000-0000-000000000004', 'KOREKTA', 'Zmiana stanu: nowy → po_zwrocie'),
  ('i1000000-0000-0000-0000-000000000005', 'PRZYJECIE', 'RetroGadget — odnowione Sony'),
  ('i1000000-0000-0000-0000-000000000006', 'PRZYJECIE', 'LEGO Ferrari, zapieczętowane');

-- ── Payouts ─────────────────────────────────────────────────

INSERT INTO payouts (client_id, kwota_netto, status) VALUES
  ('c1000000-0000-0000-0000-000000000001', 1280.00, 'oczekujace'),
  ('c1000000-0000-0000-0000-000000000002', 640.50, 'oczekujace'),
  ('c1000000-0000-0000-0000-000000000003', 419.50, 'wyplacone');


-- ============================================================
-- KONIEC SEED DATA
-- ============================================================

# The Liquidator

Marketplace z aukcjami w czasie rzeczywistym i systemem "kup teraz". Zbudowany na Next.js 15 + Supabase + TypeScript.

System łączy panel admina (zarządzanie magazynem, klientami, wypłatami) z publicznym marketplace'em (katalog, aukcje live, koszyk, checkout).

## Stack techniczny

- **Framework**: Next.js 15 (App Router, Server Actions, SSR)
- **Baza danych**: Supabase (PostgreSQL 15+, Realtime, Auth, RLS)
- **Język**: TypeScript (strict mode)
- **Walidacja**: Zod (discriminated unions, cross-field validation)
- **UI**: Tailwind CSS + shadcn/ui
- **Formularze**: react-hook-form + @hookform/resolvers
- **Deploy**: standalone Node.js + PM2 + Nginx

## Funkcjonalności

### Marketplace (publiczny)
- Katalog produktów z filtrami (typ, kategoria, cena, search)
- Sekcja "Kończy się wkrótce" — aukcje sortowane po end_time
- Strona produktu z galerią zdjęć
- **Aukcje w czasie rzeczywistym** — Supabase Realtime (WebSocket)
- Live countdown z precyzją do sekundy
- Status użytkownika: "Prowadzisz" / "Ktoś Cię przebił"
- Anti-sniping: automatyczne przedłużenie o 30s (max 3 razy)
- Blokada bidowania gdy użytkownik prowadzi
- Quick-bump buttons (+1, +5, +10, +50 zł)
- Koszyk z kontrolą ilości
- Checkout z walidacją adresu i snapshotem cen
- Konto użytkownika: moje licytacje, moje zamówienia
- Rejestracja / logowanie (email + hasło)

### Panel admina
- Dashboard z agregacjami (klienci, magazyn, wartość, wypłaty)
- Klienci: CRUD, model komis/fulfillment, archiwizacja
- Magazyn: przyjęcie towaru (sticky context + smart focus), SKU search
- Warehouse logs: historia operacji (immutable)
- Wypłaty: jednokierunkowa tranzycja (oczekujące → wypłacone)
- Oferty: tworzenie listingów (kup teraz / aukcja), publikacja, anulowanie
- 8 stanów kondycji produktu (kompatybilne z Allegro/BaseLinker)

### Bezpieczeństwo
- Atomowe operacje w PostgreSQL (`FOR UPDATE`, pg functions)
- Zero race conditions w bidowaniu i checkout
- Rate limiting na bidy (1/s per user)
- Row Level Security (RLS) — użytkownik widzi tylko swoje dane
- Snapshoty cen w zamówieniach
- Soft delete (brak fizycznego usuwania danych)
- DB-level constraints i triggery

## Wymagania

- Node.js 20+
- Konto Supabase (darmowy tier wystarczy)
- npm lub yarn

## Instalacja

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/YOUR_USER/the-liquidator.git
cd the-liquidator
npm install
```

### 2. Konfiguracja Supabase

Utwórz projekt na [supabase.com](https://supabase.com), następnie:

1. Otwórz **SQL Editor** w Supabase Dashboard
2. Uruchom migracje **po kolei** (kolejność jest ważna):

```
001_schema_v1.1.sql    → tabele admin
002_soft_delete.sql    → soft delete
003_marketplace.sql    → marketplace + RLS
004_realtime.sql       → Supabase Realtime
005_atomic_operations.sql → atomowe bidy i checkout
006_critical_fixes.sql → deadlock prevention, DB constraints
```

3. (Opcjonalnie) Uruchom `seed.sql` — wstawi 6 produktów testowych z aukcjami
4. Uruchom `migrate-check.sql` — zweryfikuje poprawność migracji

### 3. Zmienne środowiskowe

```bash
cp .env.example .env.local
```

Uzupełnij `.env.local` danymi z Supabase Dashboard → Settings → API:

```env
NEXT_PUBLIC_SUPABASE_URL=https://twoj-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...twoj-anon-key
```

### 4. Uruchomienie

```bash
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000).

## Struktura projektu

```
the-liquidator/
├── src/
│   ├── app/                    # Next.js App Router (20 routes)
│   │   ├── page.tsx            # Dashboard
│   │   ├── catalog/            # Katalog produktów
│   │   ├── product/[slug]/     # Strona produktu + live aukcja
│   │   ├── cart/               # Koszyk
│   │   ├── checkout/           # Kasa
│   │   ├── order/[id]/success/ # Potwierdzenie zamówienia
│   │   ├── login/              # Logowanie
│   │   ├── register/           # Rejestracja
│   │   ├── account/            # Konto (bidy, zamówienia)
│   │   ├── clients/            # Admin: klienci
│   │   ├── inventory/          # Admin: magazyn
│   │   └── admin/listings/     # Admin: oferty
│   │
│   ├── actions/                # Server Actions (10 modułów, 43+ akcje)
│   ├── components/             # React components (21 plików)
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── catalog/            # ProductCard, Filters, EndingSoon
│   │   ├── auction/            # LivePanel, BidForm, BidList, Status
│   │   ├── cart/               # CartContext, AddToCartButton
│   │   ├── checkout/           # CheckoutForm
│   │   ├── admin/              # ListingsTable, ListingForm
│   │   ├── clients/            # ClientForm, ClientsList
│   │   ├── inventory/          # AddItemForm, InventoryList
│   │   ├── dashboard/          # Cards, Logs, Payouts
│   │   └── layout/             # Navbar
│   │
│   ├── types/                  # TypeScript + Zod (9 modułów)
│   ├── hooks/                  # useUser, useRealtimeAuction, useCountdown
│   ├── lib/                    # Supabase clients, auth, rate-limit, utils
│   └── middleware.ts           # Session refresh
│
├── 001_schema_v1.1.sql         # Migracja: admin tables
├── 002_soft_delete.sql         # Migracja: soft delete
├── 003_marketplace.sql         # Migracja: marketplace + RLS
├── 004_realtime.sql            # Migracja: Realtime
├── 005_atomic_operations.sql   # Migracja: atomic bids + checkout
├── 006_critical_fixes.sql      # Migracja: deadlock prevention
├── migrate-check.sql           # Weryfikator migracji
├── seed.sql                    # Dane testowe (6 produktów, 3 aukcje)
├── deploy.sh                   # Skrypt deploy na VPS
├── smoke-test.sh               # Test endpointów
├── ecosystem.config.cjs        # PM2 config
└── nginx/liquidator.conf       # Nginx reverse proxy + WebSocket
```

## Migracje SQL

| Plik | Opis |
|------|------|
| `001_schema_v1.1.sql` | Tabele admin: clients, inventory_items, warehouse_logs, payouts |
| `002_soft_delete.sql` | Soft delete: status `wycofane`, `archived_at`, FK zmiana |
| `003_marketplace.sql` | Marketplace: users, listings, auctions, bids, orders + RLS |
| `004_realtime.sql` | Supabase Realtime na auctions + bids |
| `005_atomic_operations.sql` | PG functions: `place_bid()`, `decrement_quantity()` |
| `006_critical_fixes.sql` | Atomowy checkout, deadlock prevention, DB constraints |

## Deploy na VPS (produkcja)

### Szybki deploy

```bash
# Na serwerze (Ubuntu 22+):
chmod +x deploy.sh
./deploy.sh
```

Skrypt automatycznie: instaluje Node.js/PM2/Nginx, buduje aplikację (`output: standalone`), konfiguruje PM2, kopiuje Nginx config.

### Ręczny deploy

```bash
npm run build
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
HOSTNAME=0.0.0.0 PORT=3000 node .next/standalone/server.js
```

### Nginx (WebSocket support)

Kluczowe dla Supabase Realtime — bez tego aukcje live nie działają:

```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

Pełna konfiguracja w `nginx/liquidator.conf`.

### HTTPS

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d twoja-domena.pl
```

### Smoke test

```bash
chmod +x smoke-test.sh
./smoke-test.sh https://twoja-domena.pl
```

## Architektura

### Warstwy

```
┌─────────────────────────────────────────┐
│  Marketplace (publiczny)                │
│  Katalog · Aukcje · Koszyk · Checkout   │
├─────────────────────────────────────────┤
│  Panel admina                           │
│  Klienci · Magazyn · Oferty · Wypłaty   │
├─────────────────────────────────────────┤
│  Server Actions (source of truth)       │
│  Zod validation · Rate limiting         │
├─────────────────────────────────────────┤
│  Supabase (PostgreSQL)                  │
│  PG functions · RLS · Realtime          │
└─────────────────────────────────────────┘
```

### Bezpieczeństwo transakcji

- **Bidy**: `place_bid()` — `SELECT ... FOR UPDATE` na wierszu aukcji. Dwa bidy w tej samej milisekundzie nie przejdą.
- **Checkout**: `create_order_atomic()` — jedna transakcja: lock listingów (posortowanych po ID) → order → items → dekrementacja. Zero deadlocków, zero overselling.
- **Anti-sniping**: max 3 przedłużenia per aukcja, limit czytany z bazy (nie z parametru klienta).

## Licencja

MIT

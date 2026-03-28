#!/bin/bash
# ============================================================
# THE LIQUIDATOR — Smoke Test
# smoke-test.sh
# ============================================================
# Uruchom po deploy: ./smoke-test.sh https://twoja-domena.pl
# ============================================================

set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:3000}"
PASS=0
FAIL=0

echo "═══════════════════════════════════════════════"
echo "  THE LIQUIDATOR — Smoke Test"
echo "  URL: $BASE_URL"
echo "═══════════════════════════════════════════════"
echo ""

check() {
  local name="$1"
  local url="$2"
  local expected="${3:-200}"

  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")

  if [ "$code" = "$expected" ] || [ "$code" = "307" ] || [ "$code" = "308" ]; then
    echo "  ✓ $name (HTTP $code)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $name (HTTP $code, expected $expected)"
    FAIL=$((FAIL + 1))
  fi
}

# ── Strony publiczne ──────────────────────────────────────
echo "▸ Strony publiczne"
check "Dashboard"           "$BASE_URL/"
check "Katalog"             "$BASE_URL/catalog"
check "Login"               "$BASE_URL/login"
check "Register"            "$BASE_URL/register"
check "Cart"                "$BASE_URL/cart"

# ── Panel admin ───────────────────────────────────────────
echo ""
echo "▸ Panel admin"
check "Klienci"             "$BASE_URL/clients"
check "Magazyn"             "$BASE_URL/inventory"
check "Nowy towar"          "$BASE_URL/inventory/new"
check "Oferty admin"        "$BASE_URL/admin/listings"
check "Nowa oferta"         "$BASE_URL/admin/listings/new"

# ── API health (Next.js) ─────────────────────────────────
echo ""
echo "▸ Infrastruktura"
check "Next.js static"      "$BASE_URL/_next/static" "200"

# ── WebSocket check (Supabase — nie nasz serwer) ─────────
echo ""
echo "▸ Supabase connectivity"
SUPA_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.production 2>/dev/null | cut -d= -f2 || echo "")
if [ -n "$SUPA_URL" ]; then
  SUPA_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SUPA_URL/rest/v1/" 2>/dev/null || echo "000")
  if [ "$SUPA_CODE" = "200" ] || [ "$SUPA_CODE" = "401" ]; then
    echo "  ✓ Supabase REST API reachable (HTTP $SUPA_CODE)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ Supabase REST API unreachable (HTTP $SUPA_CODE)"
    FAIL=$((FAIL + 1))
  fi
else
  echo "  ! Brak NEXT_PUBLIC_SUPABASE_URL w .env.production — skip"
fi

# ── Wyniki ────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════"
echo "  Wynik: $PASS passed, $FAIL failed"
echo "═══════════════════════════════════════════════"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "  Sprawdź logi: pm2 logs liquidator"
  exit 1
fi

echo ""
echo "  ✓ Wszystko działa!"

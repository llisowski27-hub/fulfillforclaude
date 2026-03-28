#!/bin/bash
# ============================================================
# THE LIQUIDATOR — Deploy Script
# deploy.sh
# ============================================================
# Pełny deploy na Ubuntu VPS.
# Uruchom: chmod +x deploy.sh && ./deploy.sh
# ============================================================

set -euo pipefail

APP_DIR="/var/www/liquidator"
LOG_DIR="/var/log/liquidator"
REPO_URL="git@github.com:YOUR_USER/liquidator.git"
BRANCH="main"

echo "═══════════════════════════════════════════════"
echo "  THE LIQUIDATOR — Deploy"
echo "═══════════════════════════════════════════════"

# ── 1. Sprawdź zależności ────────────────────────────────
echo ""
echo "▸ Sprawdzam zależności…"

command -v node >/dev/null 2>&1 || {
  echo "  ✗ Node.js nie znaleziony. Instaluję…"
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
}

command -v pm2 >/dev/null 2>&1 || {
  echo "  ✗ PM2 nie znaleziony. Instaluję…"
  sudo npm install -g pm2
}

command -v nginx >/dev/null 2>&1 || {
  echo "  ✗ Nginx nie znaleziony. Instaluję…"
  sudo apt-get update && sudo apt-get install -y nginx
}

echo "  ✓ Node $(node -v) | npm $(npm -v) | PM2 $(pm2 -v)"

# ── 2. Katalog aplikacji ────────────────────────────────
echo ""
echo "▸ Przygotowuję katalog…"
sudo mkdir -p "$APP_DIR"
sudo mkdir -p "$LOG_DIR"
sudo chown -R "$USER:$USER" "$APP_DIR" "$LOG_DIR"

# ── 3. Pobierz / zaktualizuj kod ────────────────────────
echo ""
echo "▸ Pobieram kod…"
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR"
  git fetch origin "$BRANCH"
  git reset --hard "origin/$BRANCH"
else
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

# ── 4. Sprawdź .env.production ──────────────────────────
echo ""
if [ ! -f "$APP_DIR/.env.production" ]; then
  echo "  ✗ Brak .env.production!"
  echo "  Skopiuj .env.production na serwer i uzupełnij:"
  echo "  scp .env.production user@server:$APP_DIR/.env.production"
  exit 1
fi
echo "  ✓ .env.production znaleziony"

# ── 5. Instaluj zależności ──────────────────────────────
echo ""
echo "▸ Instaluję zależności…"
npm ci --production=false

# ── 6. Build ────────────────────────────────────────────
echo ""
echo "▸ Buduję aplikację…"
npm run build

# ── 7. Kopiuj statyczne pliki do standalone ─────────────
echo ""
echo "▸ Kopiuję static assets…"
cp -r public .next/standalone/public 2>/dev/null || true
cp -r .next/static .next/standalone/.next/static

# ── 8. Start / Restart PM2 ─────────────────────────────
echo ""
echo "▸ Uruchamiam PM2…"
pm2 delete liquidator 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save

# Auto-start po reboot
pm2 startup systemd -u "$USER" --hp "/home/$USER" 2>/dev/null || true

# ── 9. Nginx ────────────────────────────────────────────
echo ""
echo "▸ Konfiguruję Nginx…"
if [ -f "$APP_DIR/nginx/liquidator.conf" ]; then
  sudo cp "$APP_DIR/nginx/liquidator.conf" /etc/nginx/sites-available/liquidator
  sudo ln -sf /etc/nginx/sites-available/liquidator /etc/nginx/sites-enabled/
  sudo nginx -t && sudo systemctl reload nginx
  echo "  ✓ Nginx przeładowany"
else
  echo "  ! Brak nginx/liquidator.conf — skonfiguruj ręcznie"
fi

# ── 10. HTTPS (Let's Encrypt) ──────────────────────────
echo ""
echo "▸ Sprawdzam HTTPS…"
if ! command -v certbot >/dev/null 2>&1; then
  echo "  Certbot nie znaleziony. Zainstaluj:"
  echo "  sudo apt install certbot python3-certbot-nginx"
  echo "  sudo certbot --nginx -d twoja-domena.pl"
else
  echo "  ✓ Certbot dostępny"
  echo "  Jeśli brak certyfikatu, uruchom:"
  echo "  sudo certbot --nginx -d twoja-domena.pl"
fi

# ── 11. Smoke test ──────────────────────────────────────
echo ""
echo "▸ Smoke test…"
sleep 3

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ || echo "000")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "307" ]; then
  echo "  ✓ App odpowiada (HTTP $HTTP_CODE)"
else
  echo "  ✗ App nie odpowiada (HTTP $HTTP_CODE)"
  echo "  Sprawdź logi: pm2 logs liquidator"
  exit 1
fi

echo ""
echo "═══════════════════════════════════════════════"
echo "  ✓ Deploy zakończony!"
echo ""
echo "  App:    http://127.0.0.1:3000"
echo "  Logi:   pm2 logs liquidator"
echo "  Status: pm2 status"
echo "  Restart: pm2 restart liquidator"
echo "═══════════════════════════════════════════════"

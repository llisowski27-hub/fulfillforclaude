"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Gavel, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import type { AuctionDetail } from "@/types/catalog";

// ─── helpers ─────────────────────────────────────────────────
function formatPLN(amount: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
  }).format(amount);
}

function useCountdown(endTime: string) {
  const calc = () => Math.max(0, new Date(endTime).getTime() - Date.now());
  const [ms, setMs] = useState(calc);

  useEffect(() => {
    if (ms === 0) return;
    const id = setInterval(() => setMs(calc), 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return {
    display:
      ms === 0
        ? "Zakończona"
        : h > 0
          ? `${h}:${pad(m)}:${pad(s)}`
          : `${pad(m)}:${pad(s)}`,
    isUrgent: ms > 0 && ms < 5 * 60 * 1000,
    isEnded: ms === 0,
  };
}

// ─── status config ────────────────────────────────────────────
type UserStatus = "leading" | "outbid" | "neutral";

const STATUS = {
  leading: {
    icon: TrendingUp,
    label: "Prowadzisz",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    border: "border-emerald-400",
    priceColor: "text-emerald-600",
  },
  outbid: {
    icon: TrendingDown,
    label: "Przebity",
    badge: "bg-red-100 text-red-700 border-red-200",
    border: "border-red-400",
    priceColor: "text-red-500",
  },
  neutral: {
    icon: Minus,
    label: null,
    badge: "",
    border: "border-border",
    priceColor: "text-foreground",
  },
} as const;

// ─── component ───────────────────────────────────────────────
export function AuctionPanel({
  auction,
  userStatus = "neutral",
  isAuthenticated = false,
  onBid,
  submitting = false,
}: {
  auction: AuctionDetail;
  userStatus?: UserStatus;
  isAuthenticated?: boolean;
  onBid?: (amount: number) => Promise<void>;
  submitting?: boolean;
}) {
  const currentPrice = auction.current_price ?? auction.starting_price;
  const minNext = currentPrice + auction.min_bid_increment;

  const [bidAmount, setBidAmount] = useState(minNext);
  const userEdited = useRef(false);
  const { display, isUrgent, isEnded } = useCountdown(auction.end_time);

  // Keep bid input at least at minNext when price updates via realtime
  useEffect(() => {
    if (!userEdited.current) {
      setBidAmount(minNext);
    } else {
      setBidAmount((prev) => Math.max(minNext, prev));
    }
  }, [minNext]);

  const hasStarted = new Date(auction.start_time) <= new Date();
  const cfg = STATUS[userStatus];

  function bump(delta: number) {
    userEdited.current = true;
    setBidAmount((prev) => Math.max(minNext, prev + delta));
  }

  async function handleBid() {
    if (!onBid) return;
    userEdited.current = false;
    await onBid(bidAmount);
  }

  return (
    <div
      className={`rounded-2xl border-2 bg-card p-5 space-y-5 transition-colors ${cfg.border}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gavel size={16} className="text-primary" />
          <span className="text-sm font-semibold text-primary uppercase tracking-wide">
            Aukcja live
          </span>
        </div>

        {cfg.label && (
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}
          >
            <cfg.icon size={11} />
            {cfg.label}
          </span>
        )}
      </div>

      {/* Price block */}
      <div>
        <p className="text-xs text-muted-foreground mb-1">
          {auction.bid_count > 0 ? "Aktualna cena" : "Cena wywoławcza"}
        </p>
        <p className={`text-4xl font-bold tracking-tight ${cfg.priceColor}`}>
          {formatPLN(currentPrice)}
        </p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
          <span>{auction.bid_count} ofert</span>
          <span>·</span>
          <span>min. podbicie {formatPLN(auction.min_bid_increment)}</span>
        </div>
      </div>

      {/* Countdown */}
      {!isEnded && hasStarted && (
        <div
          className={`flex items-center justify-between rounded-xl px-4 py-3 ${
            isUrgent
              ? "bg-red-50 border border-red-200"
              : "bg-muted border border-border"
          }`}
        >
          <span
            className={`text-xs font-medium ${isUrgent ? "text-red-600" : "text-muted-foreground"}`}
          >
            Kończy się za
          </span>
          <span
            className={`text-xl font-bold tabular-nums ${isUrgent ? "text-red-600" : "text-foreground"}`}
          >
            {display}
          </span>
        </div>
      )}

      {isEnded && (
        <div className="rounded-xl bg-muted border border-border px-4 py-3 text-center">
          <span className="text-sm font-semibold text-muted-foreground">
            Aukcja zakończona
          </span>
        </div>
      )}

      {!hasStarted && !isEnded && (
        <div className="rounded-xl bg-muted border border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">Rozpoczyna się</p>
          <p className="text-sm font-semibold text-foreground">
            {new Date(auction.start_time).toLocaleString("pl-PL")}
          </p>
        </div>
      )}

      {/* Bid input + quick bumps */}
      {!isEnded && hasStarted && (
        <div className="space-y-2.5">
          {/* Input */}
          <div className="relative">
            <input
              type="number"
              min={minNext}
              step={auction.min_bid_increment}
              value={bidAmount}
              onChange={(e) => {
                userEdited.current = true;
                setBidAmount(Math.max(minNext, Number(e.target.value)));
              }}
              disabled={submitting}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-base font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-60"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              zł
            </span>
          </div>

          {/* Quick bump buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 5, 10, 50].map((delta) => (
              <button
                key={delta}
                onClick={() => bump(delta)}
                disabled={submitting}
                className="rounded-lg border border-border bg-secondary py-2 text-sm font-medium text-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-50"
              >
                +{delta}
              </button>
            ))}
          </div>

          {/* Submit — auth-aware */}
          {!isAuthenticated ? (
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center rounded-xl border border-border bg-secondary py-3.5 text-sm font-semibold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            >
              Zaloguj się, aby licytować
            </Link>
          ) : (
            <button
              onClick={handleBid}
              disabled={submitting || bidAmount < minNext}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Składanie oferty...
                </>
              ) : (
                <>Licytuj {formatPLN(bidAmount)}</>
              )}
            </button>
          )}

          {bidAmount < minNext && (
            <p className="text-center text-xs text-destructive">
              Minimalna oferta: {formatPLN(minNext)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

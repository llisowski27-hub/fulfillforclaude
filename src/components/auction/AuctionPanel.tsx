"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Gavel, TrendingUp, TrendingDown, Minus, Loader2, Flame, Lock } from "lucide-react";
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
    isCritical: ms > 0 && ms < 60 * 1000,
    isEnded: ms === 0,
  };
}

// ─── status config ────────────────────────────────────────────
type UserStatus = "leading" | "outbid" | "neutral";

const STATUS = {
  leading: {
    icon: TrendingUp,
    label: "Prowadzisz!",
    badge: "bg-bg-blue-100 text-blue-700 border-blue-300",
    border: "border-blue-400",
    glow: "shadow-blue-500/20",
    priceColor: "from-blue-600 to-blue-400",
  },
  outbid: {
    icon: TrendingDown,
    label: "Przebity",
    badge: "bg-red-100 text-red-700 border-red-300",
    border: "border-red-400",
    glow: "shadow-red-500/20",
    priceColor: "from-red-500 to-red-400",
  },
  neutral: {
    icon: Minus,
    label: null,
    badge: "",
    border: "border-border",
    glow: "shadow-gray-200/60",
    priceColor: "from-amber-500 to-orange-400",
  },
} as const;

const BUMP_CHIPS = [
  { delta: 1,  label: "+1 zł",  style: "bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700" },
  { delta: 5,  label: "+5 zł",  style: "bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700" },
  { delta: 10, label: "+10 zł", style: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-400" },
  { delta: 50, label: "+50 zł", style: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-400 font-bold" },
];

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
  const { display, isUrgent, isCritical, isEnded } = useCountdown(auction.end_time);

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
    <div className={`rounded-2xl border-2 bg-card p-5 space-y-4 transition-all shadow-lg ${cfg.border} ${cfg.glow}`}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="badge-live">
          <Gavel size={10} className="inline mr-0.5" />
          Aukcja live
        </span>

        {cfg.label && (
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${cfg.badge}`}>
            <cfg.icon size={11} />
            {cfg.label}
          </span>
        )}
      </div>

      {/* Price block */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3.5">
        <p className="text-xs text-muted-foreground mb-1 font-medium">
          {auction.bid_count > 0 ? "Aktualna cena" : "Cena wywoławcza"}
        </p>
        <p className={`text-4xl font-black tracking-tight bg-gradient-to-r ${cfg.priceColor} bg-clip-text text-transparent`}>
          {formatPLN(currentPrice)}
        </p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
          <span className="font-semibold text-blue-600">{auction.bid_count} ofert</span>
          <span>·</span>
          <span>min. podbicie <span className="font-medium text-amber-600">{formatPLN(auction.min_bid_increment)}</span></span>
        </div>
      </div>

      {/* Countdown */}
      {!isEnded && hasStarted && (
        <div className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${
          isCritical
            ? "bg-red-50 border-2 border-red-300"
            : isUrgent
              ? "bg-red-50 border border-red-200"
              : "bg-gray-50 border border-gray-100"
        }`}>
          <span className={`text-xs font-semibold ${isCritical || isUrgent ? "text-red-600" : "text-muted-foreground"}`}>
            {isCritical ? <><Flame size={11} className="inline mr-1" />Kończy się!</> : "Kończy się za"}
          </span>
          <span className={`font-black tabular-nums ${
            isCritical
              ? "text-2xl text-red-600 animate-pulse"
              : isUrgent
                ? "text-xl text-red-500"
                : "text-xl text-foreground"
          }`}>
            {display}
          </span>
        </div>
      )}

      {isEnded && (
        <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-center">
          <span className="text-sm font-semibold text-muted-foreground">Aukcja zakończona</span>
        </div>
      )}

      {!hasStarted && !isEnded && (
        <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
          <p className="text-xs text-amber-600 font-medium">Rozpoczyna się</p>
          <p className="text-sm font-bold text-amber-800">
            {new Date(auction.start_time).toLocaleString("pl-PL")}
          </p>
        </div>
      )}

      {/* Bid input + chips */}
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
              className="w-full rounded-xl border-2 border-blue-200 bg-white px-4 py-3 pr-12 text-lg font-black text-foreground outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all disabled:opacity-60"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-600">
              zł
            </span>
          </div>

          {/* Chips */}
          <div className="grid grid-cols-4 gap-1.5">
            {BUMP_CHIPS.map(({ delta, label, style }) => (
              <button
                key={delta}
                onClick={() => bump(delta)}
                disabled={submitting}
                className={`rounded-xl border py-2 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 ${style}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Submit */}
          {!isAuthenticated ? (
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-3.5 text-sm font-semibold text-foreground hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
            >
              <Lock size={14} />
              Zaloguj się, aby licytować
            </Link>
          ) : (
            <button
              onClick={handleBid}
              disabled={submitting || bidAmount < minNext}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl btn-win py-4 text-base font-black shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all animate-glow"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Składanie oferty...
                </>
              ) : (
                <>
                  <Gavel size={16} />
                  Licytuj {formatPLN(bidAmount)}
                </>
              )}
            </button>
          )}

          {bidAmount < minNext && (
            <p className="text-center text-xs text-destructive font-medium">
              Minimalna oferta: {formatPLN(minNext)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AuctionPanel } from "./AuctionPanel";
import { useRealtimeAuction } from "@/hooks/useRealtimeAuction";
import { useUser } from "@/hooks/useUser";
import { placeBidAction } from "@/actions/auction";
import type { AuctionDetail } from "@/types/catalog";

const PLN = (n: number) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
  }).format(n);

export function LiveAuctionPanel({
  auctionId,
  initial,
}: {
  auctionId: string;
  initial: AuctionDetail;
}) {
  const { user, loading: authLoading } = useUser();
  const { auction, recentBids, isConnected, myBid, setMyBid } =
    useRealtimeAuction(auctionId, initial, user?.id);

  const [submitting, setSubmitting] = useState(false);

  // ── userStatus ────────────────────────────────────────────────
  const userStatus = useMemo<"leading" | "outbid" | "neutral">(() => {
    if (!myBid || !user) return "neutral";
    const current = auction.current_price ?? auction.starting_price;
    return myBid >= current ? "leading" : "outbid";
  }, [myBid, auction.current_price, auction.starting_price, user]);

  // ── Price flash ───────────────────────────────────────────────
  const prevPrice = useRef(auction.current_price);
  const [priceFlash, setPriceFlash] = useState<"win" | "loss" | null>(null);
  useEffect(() => {
    if (prevPrice.current !== auction.current_price) {
      prevPrice.current = auction.current_price;
      const flash = userStatus === "leading" ? "win" : "loss";
      setPriceFlash(null);
      requestAnimationFrame(() => setPriceFlash(flash));
      const t = setTimeout(() => setPriceFlash(null), 900);
      return () => clearTimeout(t);
    }
  }, [auction.current_price, userStatus]);

  // ── Anti-sniping ──────────────────────────────────────────────
  const prevEndTime = useRef(auction.end_time);
  const [showExtended, setShowExtended] = useState(false);
  useEffect(() => {
    if (prevEndTime.current !== auction.end_time) {
      prevEndTime.current = auction.end_time;
      setShowExtended(true);
      const t = setTimeout(() => setShowExtended(false), 4000);
      return () => clearTimeout(t);
    }
  }, [auction.end_time]);

  // ── Bid handler ───────────────────────────────────────────────
  async function handleBid(amount: number) {
    setSubmitting(true);
    try {
      const result = await placeBidAction(auctionId, amount);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setMyBid(result.amount);
      toast.success(`Oferta ${PLN(result.amount)} złożona!`);
    } finally {
      setSubmitting(false);
    }
  }

  const flashClass =
    priceFlash === "win"
      ? "animate-flash-win"
      : priceFlash === "loss"
        ? "animate-flash-loss"
        : "";

  return (
    <div className="space-y-3">

      {/* Connection status */}
      <div className="flex justify-end">
        {isConnected ? (
          <span className="badge-live">Live</span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />
            Łączenie...
          </span>
        )}
      </div>

      {/* Anti-sniping banner */}
      {showExtended && (
        <div className="animate-slide-down rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 flex items-center gap-2">
          <span className="text-lg">⏱</span>
          <span className="text-sm font-semibold text-amber-800">
            Aukcja przedłużona o 30 sekund — ktoś złożył ofertę w ostatniej chwili!
          </span>
        </div>
      )}

      {/* Main panel — flash wrapper */}
      <div className={flashClass}>
        <AuctionPanel
          auction={auction}
          userStatus={userStatus}
          isAuthenticated={!authLoading && !!user}
          onBid={handleBid}
          submitting={submitting}
        />
      </div>

      {/* Bid feed */}
      {recentBids.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Feed ofert
            </p>
            <span className="badge-live" style={{ fontSize: "0.6rem" }}>na żywo</span>
          </div>
          {recentBids.map((bid, i) => (
            <div
              key={bid.id}
              className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors ${
                i === 0
                  ? "animate-slide-down bg-emerald-50 border border-emerald-100"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                {i === 0 && (
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Nowa</span>
                )}
                <span className="text-xs text-muted-foreground tabular-nums">
                  {new Date(bid.created_at).toLocaleTimeString("pl-PL", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
              <span className={`text-sm font-black tabular-nums ${i === 0 ? "text-emerald-600" : "text-foreground"}`}>
                {PLN(bid.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

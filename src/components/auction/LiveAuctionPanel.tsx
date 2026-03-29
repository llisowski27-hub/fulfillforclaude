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

  // ── userStatus derived from myBid vs current price ───────────
  const userStatus = useMemo<"leading" | "outbid" | "neutral">(() => {
    if (!myBid || !user) return "neutral";
    const current = auction.current_price ?? auction.starting_price;
    return myBid >= current ? "leading" : "outbid";
  }, [myBid, auction.current_price, auction.starting_price, user]);

  // ── Price flash animation ─────────────────────────────────────
  const prevPrice = useRef(auction.current_price);
  const [priceFlash, setPriceFlash] = useState(false);
  useEffect(() => {
    if (prevPrice.current !== auction.current_price) {
      prevPrice.current = auction.current_price;
      setPriceFlash(false);
      requestAnimationFrame(() => setPriceFlash(true));
      const t = setTimeout(() => setPriceFlash(false), 800);
      return () => clearTimeout(t);
    }
  }, [auction.current_price]);

  // ── Anti-sniping notification ─────────────────────────────────
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
      // Optimistic update: user is now leading
      setMyBid(result.amount);
      toast.success(`Oferta ${PLN(result.amount)} złożona!`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Connection status */}
      <div className="flex justify-end">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
            isConnected ? "text-emerald-600" : "text-muted-foreground"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isConnected
                ? "bg-emerald-500 animate-pulse"
                : "bg-muted-foreground/50"
            }`}
          />
          {isConnected ? "Live" : "Łączenie..."}
        </span>
      </div>

      {/* Anti-sniping banner */}
      {showExtended && (
        <div className="animate-slide-down rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">
          ⏱ Aukcja przedłużona o 30 sekund — ktoś złożył ofertę w ostatniej chwili
        </div>
      )}

      {/* Main panel — flash wrapper */}
      <div className={priceFlash ? "animate-flash-price" : ""}>
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
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Ostatnie oferty
          </p>
          {recentBids.map((bid, i) => (
            <div
              key={bid.id}
              className={`flex items-center justify-between py-1 ${
                i === 0
                  ? "animate-slide-down border-b border-emerald-100"
                  : "border-b border-border last:border-0"
              }`}
            >
              <span className="text-xs text-muted-foreground tabular-nums">
                {new Date(bid.created_at).toLocaleTimeString("pl-PL", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
              <span
                className={`text-sm font-bold tabular-nums ${
                  i === 0 ? "text-emerald-600" : "text-foreground"
                }`}
              >
                {PLN(bid.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

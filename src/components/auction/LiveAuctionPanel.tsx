"use client";

import { useEffect, useRef, useState } from "react";
import { AuctionPanel } from "./AuctionPanel";
import { useRealtimeAuction } from "@/hooks/useRealtimeAuction";
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
  userStatus,
}: {
  auctionId: string;
  initial: AuctionDetail;
  userStatus?: "leading" | "outbid" | "neutral";
}) {
  const { auction, recentBids, isConnected } = useRealtimeAuction(
    auctionId,
    initial
  );

  // Price flash animation
  const prevPrice = useRef(auction.current_price);
  const [priceFlash, setPriceFlash] = useState(false);
  useEffect(() => {
    if (prevPrice.current !== auction.current_price) {
      prevPrice.current = auction.current_price;
      setPriceFlash(false);
      // Retrigger CSS animation by toggling
      requestAnimationFrame(() => setPriceFlash(true));
      const t = setTimeout(() => setPriceFlash(false), 800);
      return () => clearTimeout(t);
    }
  }, [auction.current_price]);

  // Anti-sniping notification
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
        <AuctionPanel auction={auction} userStatus={userStatus} />
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

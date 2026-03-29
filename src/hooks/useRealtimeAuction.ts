"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AuctionDetail } from "@/types/catalog";

export type RecentBid = {
  id: string;
  amount: number;
  created_at: string;
};

export function useRealtimeAuction(
  auctionId: string,
  initial: AuctionDetail,
  userId?: string | null
) {
  const [auction, setAuction] = useState<AuctionDetail>(initial);
  const [recentBids, setRecentBids] = useState<RecentBid[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [myBid, setMyBid] = useState<number | null>(null);

  const initialRef = useRef(initial);

  // Fetch user's existing highest bid on this auction
  useEffect(() => {
    if (!userId) {
      setMyBid(null);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    supabase
      .from("bids")
      .select("amount")
      .eq("auction_id", auctionId)
      .eq("bidder_id", userId)
      .order("amount", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setMyBid(data.amount);
      });
  }, [auctionId, userId]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel(`auction:${auctionId}`)
      // ── auctions UPDATE — price / bid_count / end_time change ──
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "auctions",
          filter: `id=eq.${auctionId}`,
        },
        (payload) => {
          const row = payload.new as Partial<AuctionDetail>;
          setAuction((prev) => ({
            ...prev,
            current_price:
              row.current_price !== undefined
                ? row.current_price
                : prev.current_price,
            bid_count:
              row.bid_count !== undefined ? row.bid_count : prev.bid_count,
            end_time: row.end_time ?? prev.end_time,
            status: row.status ?? prev.status,
          }));
        }
      )
      // ── bids INSERT — new bid animation ──────────────────────
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bids",
          filter: `auction_id=eq.${auctionId}`,
        },
        (payload) => {
          const bid = payload.new as {
            id: string;
            amount: number;
            created_at: string;
          };
          setRecentBids((prev) =>
            [
              { id: bid.id, amount: bid.amount, created_at: bid.created_at },
              ...prev,
            ].slice(0, 5)
          );
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auctionId]);

  return { auction, recentBids, isConnected, myBid, setMyBid };
}

"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export type BidResult =
  | { success: true; bidId: string; amount: number }
  | { success: false; error: string };

export async function placeBidAction(
  auctionId: string,
  amount: number
): Promise<BidResult> {
  const supabase = await getSupabaseServerClient();

  // ── 1. Auth ───────────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Musisz być zalogowany, aby licytować." };
  }

  // ── 2. Basic sanity ───────────────────────────────────────────
  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: "Nieprawidłowa kwota oferty." };
  }

  // ── 3. Fetch live auction state ───────────────────────────────
  const { data: auction, error: auctionError } = await supabase
    .from("auctions")
    .select("id, status, current_price, starting_price, min_bid_increment, end_time")
    .eq("id", auctionId)
    .single();

  if (auctionError || !auction) {
    return { success: false, error: "Nie znaleziono aukcji." };
  }

  if (auction.status !== "active") {
    return { success: false, error: "Aukcja nie jest aktywna." };
  }

  if (new Date(auction.end_time) <= new Date()) {
    return { success: false, error: "Aukcja już się zakończyła." };
  }

  const minBid =
    (auction.current_price ?? auction.starting_price) +
    auction.min_bid_increment;

  if (amount < minBid) {
    return {
      success: false,
      error: `Minimalna oferta: ${new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
      }).format(minBid)}`,
    };
  }

  // ── 4. Try RPC place_bid, fallback to direct insert ───────────
  const { data: rpcData, error: rpcError } = await supabase.rpc("place_bid", {
    p_auction_id: auctionId,
    p_bidder_id: user.id,
    p_amount: amount,
  });

  if (!rpcError) {
    return { success: true, bidId: rpcData as string, amount };
  }

  // Fallback: direct insert + manual auction update (if no RPC)
  const { data: bid, error: insertError } = await supabase
    .from("bids")
    .insert({
      auction_id: auctionId,
      bidder_id: user.id,
      amount,
    })
    .select("id")
    .single();

  if (insertError) {
    return {
      success: false,
      error: insertError.message ?? "Nie udało się złożyć oferty.",
    };
  }

  // Update auction current_price + bid_count
  const auctionRow = auction as unknown as { bid_count?: number };
  await supabase
    .from("auctions")
    .update({
      current_price: amount,
      bid_count: auctionRow.bid_count ? auctionRow.bid_count + 1 : 1,
    })
    .eq("id", auctionId);

  return { success: true, bidId: bid.id, amount };
}

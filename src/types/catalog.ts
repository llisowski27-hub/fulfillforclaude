export type AuctionSummary = {
  id: string;
  status: "scheduled" | "active" | "ended" | "cancelled";
  end_time: string;
  starting_price: number;
  current_price: number | null;
  bid_count: number;
};

export type ListingWithAuction = {
  id: string;
  title: string;
  images: string[];
  buy_now_price: number | null;
  listing_type: "buy_now" | "auction";
  slug: string | null;
  category: string | null;
  auctions: AuctionSummary | null;
};

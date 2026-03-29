import { getSupabaseServerClient } from "@/lib/supabase/server";

export type OrderItem = {
  listing_id: string;
  quantity: number;
  unit_price: number;
  source_type: string;
  bid_id: string | null;
  title?: string;
  images?: string[];
};

export type Order = {
  id: string;
  status: string;
  total_amount: number;
  shipping_name: string;
  shipping_street: string;
  shipping_city: string;
  shipping_postal: string;
  shipping_country: string;
  created_at: string;
  items: OrderItem[];
};

export type UserBid = {
  id: string;
  amount: number;
  created_at: string;
  auction_id: string;
  auctions: {
    id: string;
    status: string;
    end_time: string;
    current_price: number | null;
    bid_count: number;
    listings: {
      id: string;
      title: string;
      slug: string | null;
      images: string[];
    } | null;
  } | null;
};

export async function getUserOrders(): Promise<Order[]> {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      total_amount,
      shipping_name,
      shipping_street,
      shipping_city,
      shipping_postal,
      shipping_country,
      created_at,
      items
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []) as unknown as Order[];
}

export async function getUserBids(): Promise<UserBid[]> {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bids")
    .select(
      `
      id,
      amount,
      created_at,
      auction_id,
      auctions (
        id,
        status,
        end_time,
        current_price,
        bid_count,
        listings (
          id,
          title,
          slug,
          images
        )
      )
    `
    )
    .eq("bidder_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []) as unknown as UserBid[];
}

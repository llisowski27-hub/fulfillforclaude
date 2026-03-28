import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ListingWithAuction } from "@/types/catalog";

export async function getActiveListings(): Promise<ListingWithAuction[]> {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      id,
      title,
      images,
      buy_now_price,
      listing_type,
      slug,
      category,
      auctions (
        id,
        status,
        end_time,
        starting_price,
        current_price,
        bid_count
      )
    `
    )
    .eq("is_active", true)
    .eq("status", "active")
    .order("published_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []) as unknown as ListingWithAuction[];
}

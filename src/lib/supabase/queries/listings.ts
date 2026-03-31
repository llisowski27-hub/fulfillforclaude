import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ListingDetail, ListingWithAuction } from "@/types/catalog";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUUID(s: string) { return UUID_RE.test(s); }

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

export async function getListingBySlug(
  slugOrId: string
): Promise<ListingDetail | null> {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      id,
      title,
      description,
      images,
      buy_now_price,
      listing_type,
      slug,
      category,
      tags,
      quantity_available,
      auctions (
        id,
        status,
        start_time,
        end_time,
        starting_price,
        reserve_price,
        min_bid_increment,
        current_price,
        bid_count
      )
    `
    )
    .eq("is_active", true)
    .eq("status", "active")
    .or(
      isUUID(slugOrId)
        ? `slug.eq.${slugOrId},id.eq.${slugOrId}`
        : `slug.eq.${slugOrId}`
    )
    .single();

  if (error?.code === "PGRST116") return null; // no rows
  if (error) throw new Error(error.message);

  return data as unknown as ListingDetail;
}

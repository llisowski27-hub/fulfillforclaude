import { Suspense } from "react";
import { Gavel } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/catalog/ProductCard";
import type { ListingWithAuction } from "@/types/catalog";

export const metadata = { title: "Aukcje — The Liquidator" };
export const revalidate = 30;

async function AuctionsGrid() {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("listings")
    .select(
      `id, title, images, buy_now_price, listing_type, slug, category,
       auctions (id, status, end_time, starting_price, current_price, bid_count)`
    )
    .eq("is_active", true)
    .eq("status", "active")
    .eq("listing_type", "auction")
    .order("published_at", { ascending: false });

  if (error) throw new Error(error.message);
  const listings = (data ?? []) as unknown as ListingWithAuction[];

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <Gavel size={40} strokeWidth={1.5} />
        <p className="text-sm">Brak aktywnych aukcji</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ProductCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

function AuctionsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/3] bg-muted" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-3 bg-muted rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AuctionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Aukcje
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Licytuj w czasie rzeczywistym
        </p>
      </div>

      <Suspense fallback={<AuctionsSkeleton />}>
        <AuctionsGrid />
      </Suspense>
    </div>
  );
}

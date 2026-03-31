import { Suspense } from "react";
import { Package, TrendingDown } from "lucide-react";
import { getActiveListings } from "@/lib/supabase/queries/listings";
import { ProductCard } from "@/components/catalog/ProductCard";

export const metadata = {
  title: "Katalog — Liqware",
};

export const revalidate = 60;

async function ListingsGrid() {
  const listings = await getActiveListings();

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <Package size={40} strokeWidth={1.5} />
        <p className="text-sm">Brak aktywnych ofert</p>
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

export default function CatalogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
              <Package size={16} className="text-gray-600" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Katalog</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Aktywne oferty kup teraz i aukcje na żywo
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-100 px-3 py-1.5">
          <TrendingDown size={13} className="text-amber-600" />
          <span className="text-xs font-semibold text-amber-700">Ceny likwidacyjne</span>
        </div>
      </div>

      <Suspense fallback={<CatalogSkeleton />}>
        <ListingsGrid />
      </Suspense>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
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

import { notFound } from "next/navigation";
import { Tag } from "lucide-react";
import { getListingBySlug } from "@/lib/supabase/queries/listings";
import { ImageGallery } from "@/components/catalog/ImageGallery";
import { LiveAuctionPanel } from "@/components/auction/LiveAuctionPanel";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { ListingDetail } from "@/types/catalog";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Nie znaleziono — The Liquidator" };
  return { title: `${listing.title} — The Liquidator` };
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
  }).format(amount);
}

// ─── Buy-now Panel ────────────────────────────────────────────
function BuyNowPanel({
  listing,
}: {
  listing: Pick<ListingDetail, "id" | "title" | "images" | "slug" | "buy_now_price" | "quantity_available">;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Tag size={16} className="text-blue-500" />
        <span className="text-sm font-semibold text-blue-500 uppercase tracking-wide">
          Kup teraz
        </span>
      </div>

      <div>
        <p className="text-3xl font-bold text-foreground">
          {formatPrice(listing.buy_now_price ?? 0)}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Dostępnych: {listing.quantity_available} szt.
        </p>
      </div>

      <AddToCartButton
        id={listing.id}
        title={listing.title}
        image={listing.images?.[0] ?? null}
        price={listing.buy_now_price ?? 0}
        maxQuantity={listing.quantity_available}
        slug={listing.slug}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) notFound();

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <a href="/catalog" className="hover:text-foreground transition-colors">
          Katalog
        </a>
        {listing.category && (
          <>
            <span className="mx-2">/</span>
            <span>{listing.category}</span>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-foreground truncate">{listing.title}</span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Gallery */}
        <ImageGallery images={listing.images ?? []} title={listing.title} />

        {/* Right — Details */}
        <div className="flex flex-col gap-5">
          {/* Title + category */}
          <div>
            {listing.category && (
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
                {listing.category}
              </p>
            )}
            <h1 className="text-2xl font-bold leading-snug text-foreground">
              {listing.title}
            </h1>
          </div>

          {/* Auction or Buy-now panel */}
          {listing.listing_type === "auction" && listing.auctions ? (
            <LiveAuctionPanel
              auctionId={listing.auctions.id}
              initial={listing.auctions}
            />
          ) : (
            <BuyNowPanel
              listing={{
                id: listing.id,
                title: listing.title,
                images: listing.images,
                slug: listing.slug,
                buy_now_price: listing.buy_now_price,
                quantity_available: listing.quantity_available,
              }}
            />
          )}

          {/* Description */}
          {listing.description && (
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <h2 className="text-sm font-semibold text-foreground">Opis</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {listing.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {listing.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

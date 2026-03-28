import { notFound } from "next/navigation";
import { Gavel, ShoppingCart, Tag } from "lucide-react";
import { getListingBySlug } from "@/lib/supabase/queries/listings";
import { ImageGallery } from "@/components/catalog/ImageGallery";
import { CountdownBadge } from "@/components/catalog/CountdownBadge";
import type { ListingDetail, AuctionDetail } from "@/types/catalog";
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

// ─── Auction Panel ────────────────────────────────────────────
function AuctionPanel({ auction }: { auction: AuctionDetail }) {
  const displayPrice = auction.current_price ?? auction.starting_price;
  const hasStarted = new Date(auction.start_time) <= new Date();
  const hasEnded = new Date(auction.end_time) <= new Date();

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Gavel size={16} className="text-primary" />
        <span className="text-sm font-semibold text-primary uppercase tracking-wide">
          Aukcja live
        </span>
      </div>

      {/* Current price */}
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">
          {auction.bid_count > 0 ? "Aktualna cena" : "Cena wywoławcza"}
        </p>
        <p className="text-3xl font-bold text-foreground">
          {formatPrice(displayPrice)}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Minimalne podbicie: {formatPrice(auction.min_bid_increment)}
        </p>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{auction.bid_count} ofert</span>
        <span>·</span>
        {hasEnded ? (
          <span className="text-destructive font-medium">Zakończona</span>
        ) : hasStarted ? (
          <span className="inline-flex items-center gap-1.5">
            Kończy się za <CountdownBadge endTime={auction.end_time} />
          </span>
        ) : (
          <span>
            Rozpoczyna się{" "}
            {new Date(auction.start_time).toLocaleString("pl-PL")}
          </span>
        )}
      </div>

      {/* Bid button placeholder — live bidding in future milestone */}
      <button
        disabled
        className="w-full rounded-xl bg-primary/20 py-3 text-sm font-semibold text-primary/60 cursor-not-allowed"
        title="Logowanie wymagane do licytowania"
      >
        Licytuj — wkrótce dostępne
      </button>
    </div>
  );
}

// ─── Buy-now Panel ────────────────────────────────────────────
function BuyNowPanel({
  listing,
}: {
  listing: Pick<ListingDetail, "buy_now_price" | "quantity_available">;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Tag size={16} className="text-blue-500" />
        <span className="text-sm font-semibold text-blue-500 uppercase tracking-wide">
          Kup teraz
        </span>
      </div>

      {/* Price */}
      <div>
        <p className="text-3xl font-bold text-foreground">
          {formatPrice(listing.buy_now_price ?? 0)}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Dostępnych: {listing.quantity_available} szt.
        </p>
      </div>

      {/* Add to cart placeholder — cart in future milestone */}
      <button
        disabled
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary/20 py-3 text-sm font-semibold text-primary/60 cursor-not-allowed"
        title="Koszyk wkrótce dostępny"
      >
        <ShoppingCart size={16} />
        Dodaj do koszyka — wkrótce
      </button>
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
            <AuctionPanel auction={listing.auctions} />
          ) : (
            <BuyNowPanel listing={listing} />
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

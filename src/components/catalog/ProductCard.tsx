import Image from "next/image";
import Link from "next/link";
import { CountdownBadge } from "./CountdownBadge";
import type { ListingWithAuction } from "@/types/catalog";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function ProductCard({ listing }: { listing: ListingWithAuction }) {
  const { title, images, buy_now_price, listing_type, slug, auctions } =
    listing;

  const href = slug ? `/product/${slug}` : `/product/${listing.id}`;
  const isAuction = listing_type === "auction";
  const displayPrice = isAuction
    ? (auctions?.current_price ?? auctions?.starting_price ?? 0)
    : (buy_now_price ?? 0);
  const coverImage = images?.[0] ?? null;

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-border bg-card shadow-sm overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="w-12 h-12"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          {isAuction ? (
            <span className="inline-flex items-center rounded-full bg-emerald-500/90 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
              Aukcja
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-blue-500/90 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
              Kup teraz
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-3">
        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Price */}
        <p className="text-base font-bold text-foreground">
          {formatPrice(displayPrice)}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between mt-0.5">
          {isAuction && auctions?.end_time ? (
            <CountdownBadge endTime={auctions.end_time} />
          ) : (
            <span className="text-xs text-muted-foreground">
              {listing.category ?? ""}
            </span>
          )}
          {isAuction && auctions?.bid_count != null && (
            <span className="text-xs text-muted-foreground">
              {auctions.bid_count} bid{auctions.bid_count !== 1 ? "y" : ""}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

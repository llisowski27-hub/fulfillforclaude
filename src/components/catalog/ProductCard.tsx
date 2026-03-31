import Image from "next/image";
import Link from "next/link";
import { CountdownBadge } from "./CountdownBadge";
import type { ListingWithAuction } from "@/types/catalog";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductCard({ listing }: { listing: ListingWithAuction }) {
  const { title, images, buy_now_price, listing_type, slug, auctions } = listing;

  const href = slug ? `/product/${slug}` : `/product/${listing.id}`;
  const isAuction = listing_type === "auction";
  const displayPrice = isAuction
    ? (auctions?.current_price ?? auctions?.starting_price ?? 0)
    : (buy_now_price ?? 0);
  const coverImage = images?.[0] ?? null;

  const msLeft = auctions?.end_time
    ? new Date(auctions.end_time).getTime() - Date.now()
    : null;
  const isUrgent = msLeft !== null && msLeft > 0 && msLeft < 60 * 60 * 1000;

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl bg-card border border-border overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-rose-500/10 hover:border-rose-200"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1" className="w-12 h-12">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2.5 left-2.5">
          {isAuction ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-600 to-orange-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
              {isUrgent && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              )}
              Aukcja
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-white/90 border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 backdrop-blur-sm shadow-sm">
              Kup teraz
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-3.5">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Price */}
        <p className="text-xl font-black bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent tracking-tight">
          {formatPrice(displayPrice)}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between">
          {isAuction && auctions?.end_time ? (
            <CountdownBadge endTime={auctions.end_time} />
          ) : (
            <span className="text-xs text-muted-foreground">{listing.category ?? ""}</span>
          )}
          {isAuction && auctions?.bid_count != null && (
            <span className="text-xs text-muted-foreground tabular-nums">
              {auctions.bid_count} ofert
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

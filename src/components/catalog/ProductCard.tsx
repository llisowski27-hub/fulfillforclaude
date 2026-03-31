import Image from "next/image";
import Link from "next/link";
import { Flame, TrendingUp } from "lucide-react";
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

function BidPopularity({ bidCount }: { bidCount: number }) {
  const max = 20;
  const pct = Math.min((bidCount / max) * 100, 100);
  const hot = bidCount >= 5;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${hot ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-blue-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${hot ? "text-amber-600" : "text-blue-600"}`}>
        {hot && <Flame size={10} className="inline mr-0.5 mb-0.5" />}
        {bidCount} ofert
      </span>
    </div>
  );
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
  const isCritical = msLeft !== null && msLeft > 0 && msLeft < 10 * 60 * 1000;
  const bidCount = auctions?.bid_count ?? 0;
  const isHot = isAuction && bidCount >= 5;

  return (
    <Link
      href={href}
      className={`group flex flex-col rounded-2xl bg-card border overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-2 ${
        isAuction
          ? isHot
            ? "card-hot hover:shadow-amber-500/20 hover:shadow-xl"
            : "border-blue-100 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10"
          : "border-border hover:shadow-xl hover:shadow-gray-200/80 hover:border-gray-300"
      }`}
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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 px-2.5 py-1 text-xs font-bold text-white shadow-md shadow-blue-500/30">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              Aukcja
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-white/90 border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 backdrop-blur-sm shadow-sm">
              Kup teraz
            </span>
          )}
        </div>

        {/* Urgent banner */}
        {isCritical && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-500 px-3 py-1 flex items-center justify-center gap-1.5">
            <span className="animate-pulse text-white text-xs font-bold tracking-wide">⚡ KOŃCZY SIĘ!</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-3.5">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Price */}
        {isAuction ? (
          <div className="flex items-baseline gap-1.5">
            <p className="text-xl font-black bg-gradient-to-r from-amber-500 to-orange-400 bg-clip-text text-transparent tracking-tight">
              {formatPrice(displayPrice)}
            </p>
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-0.5">
              <TrendingUp size={10} className="text-blue-500" />
              akt. cena
            </span>
          </div>
        ) : (
          <p className="text-xl font-black text-foreground tracking-tight">
            {formatPrice(displayPrice)}
          </p>
        )}

        {/* Popularity bar (auctions only) */}
        {isAuction && <BidPopularity bidCount={bidCount} />}

        {/* Metadata */}
        <div className="flex items-center justify-between">
          {isAuction && auctions?.end_time ? (
            <CountdownBadge endTime={auctions.end_time} />
          ) : (
            <span className="text-xs text-muted-foreground">{listing.category ?? ""}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

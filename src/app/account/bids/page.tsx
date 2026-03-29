import { getUserBids } from "@/lib/supabase/queries/account";
import { Gavel, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Moje oferty — The Liquidator" };

function formatPrice(amount: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type BidStatus = "winning" | "outbid" | "won" | "lost" | "active";

function getBidStatus(bid: {
  amount: number;
  auctions: {
    status: string;
    current_price: number | null;
  } | null;
}): BidStatus {
  const auction = bid.auctions;
  if (!auction) return "active";

  const isHighest =
    auction.current_price !== null && bid.amount >= auction.current_price;

  if (auction.status === "ended") {
    return isHighest ? "won" : "lost";
  }
  if (auction.status === "active") {
    return isHighest ? "winning" : "outbid";
  }
  return "active";
}

const BID_STATUS_CONFIG: Record<
  BidStatus,
  { label: string; color: string; icon: typeof TrendingUp }
> = {
  winning: {
    label: "Prowadzisz",
    color: "bg-emerald-100 text-emerald-700",
    icon: TrendingUp,
  },
  outbid: {
    label: "Przebity",
    color: "bg-red-100 text-red-600",
    icon: TrendingDown,
  },
  won: {
    label: "Wygrałeś",
    color: "bg-emerald-100 text-emerald-700",
    icon: TrendingUp,
  },
  lost: {
    label: "Przegrałeś",
    color: "bg-gray-100 text-gray-500",
    icon: Minus,
  },
  active: {
    label: "Aktywna",
    color: "bg-blue-100 text-blue-700",
    icon: TrendingUp,
  },
};

export default async function AccountBidsPage() {
  const bids = await getUserBids();

  if (bids.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <Gavel size={28} className="text-gray-400" />
        </div>
        <p className="text-gray-900 font-medium">Brak ofert</p>
        <p className="mt-1 text-sm text-gray-500">
          Nie złożyłeś jeszcze żadnej oferty na aukcji.
        </p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          Przeglądaj aukcje
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bids.map((bid) => {
        const auction = bid.auctions;
        const listing = auction?.listings;
        const status = getBidStatus(bid);
        const config = BID_STATUS_CONFIG[status];
        const Icon = config.icon;
        const thumb = listing?.images?.[0];
        const href = listing?.slug
          ? `/product/${listing.slug}`
          : listing
          ? `/product/${listing.id}`
          : "#";

        return (
          <div key={bid.id} className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
            <div className="flex gap-4">
              {/* Thumbnail */}
              <Link href={href} className="shrink-0">
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-gray-100 sm:h-20 sm:w-20">
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt={listing?.title ?? ""}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Gavel size={20} className="text-gray-300" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <Link
                    href={href}
                    className="truncate text-sm font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
                  >
                    {listing?.title ?? "Aukcja"}
                  </Link>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.color}`}
                  >
                    <Icon size={12} />
                    {config.label}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>
                    Twoja oferta:{" "}
                    <span className="font-semibold text-gray-800">
                      {formatPrice(bid.amount)}
                    </span>
                  </span>
                  {auction?.current_price != null && (
                    <span>
                      Aktualna cena:{" "}
                      <span className="font-semibold text-gray-800">
                        {formatPrice(auction.current_price)}
                      </span>
                    </span>
                  )}
                  {auction?.bid_count != null && (
                    <span>{auction.bid_count} ofert łącznie</span>
                  )}
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  {formatDate(bid.created_at)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

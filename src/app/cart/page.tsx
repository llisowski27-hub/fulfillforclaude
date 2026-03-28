"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

const PLN = (n: number) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
  }).format(n);

export default function CartPage() {
  const { items, totalItems, subtotal, remove, setQty } = useCart();
  const shipping = subtotal > 0 ? 19.99 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground">
        <ShoppingBag size={48} strokeWidth={1.5} />
        <p className="text-lg font-semibold">Koszyk jest pusty</p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Przeglądaj katalog
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Koszyk{" "}
        <span className="text-muted-foreground font-normal text-lg">
          ({totalItems} {totalItems === 1 ? "produkt" : "produkty"})
        </span>
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Items list ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-border bg-card p-4"
            >
              {/* Image */}
              <Link
                href={item.slug ? `/product/${item.slug}` : `/product/${item.id}`}
                className="shrink-0"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                      <ShoppingBag size={24} strokeWidth={1} />
                    </div>
                  )}
                </div>
              </Link>

              {/* Details */}
              <div className="flex flex-1 flex-col gap-2 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={item.slug ? `/product/${item.slug}` : `/product/${item.id}`}
                    className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                  >
                    {item.title}
                  </Link>
                  <button
                    onClick={() => remove(item.id)}
                    className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label="Usuń"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  {/* Quantity control */}
                  <div className="flex items-center gap-1 rounded-xl border border-border bg-background">
                    <button
                      onClick={() => setQty(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="flex h-8 w-8 items-center justify-center rounded-l-xl text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => setQty(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxQuantity}
                      className="flex h-8 w-8 items-center justify-center rounded-r-xl text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Line total */}
                  <p className="text-base font-bold text-foreground">
                    {PLN(item.price * item.quantity)}
                  </p>
                </div>

                {item.quantity >= item.maxQuantity && (
                  <p className="text-xs text-amber-600">
                    Maksymalna dostępna ilość
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Sticky summary ─────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-base font-semibold text-foreground">
              Podsumowanie
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  Produkty ({totalItems})
                </span>
                <span>{PLN(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Wysyłka</span>
                <span>{shipping === 0 ? "—" : PLN(shipping)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground">
              <span>Razem</span>
              <span className="text-lg">{PLN(total)}</span>
            </div>

            {/* Checkout — wired in future milestone */}
            <button
              disabled
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary/20 py-3 text-sm font-semibold text-primary/60 cursor-not-allowed"
              title="Checkout wkrótce dostępny"
            >
              Przejdź do płatności
              <ArrowRight size={16} />
            </button>

            <Link
              href="/catalog"
              className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Kontynuuj zakupy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

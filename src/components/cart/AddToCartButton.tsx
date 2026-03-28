"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartContext";
import type { CartItem } from "@/types/cart";

type Props = Omit<CartItem, "quantity">;

export function AddToCartButton(props: Props) {
  const { add, items } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = items.find((i) => i.id === props.id);
  const atMax = inCart ? inCart.quantity >= props.maxQuantity : false;

  function handleClick() {
    if (atMax) return;
    add(props);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (atMax) {
    return (
      <button
        disabled
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-muted border border-border py-3 text-sm font-semibold text-muted-foreground cursor-not-allowed"
      >
        Maksymalna ilość w koszyku
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow hover:opacity-90 active:scale-[0.98] transition-all"
    >
      {added ? (
        <>
          <Check size={16} />
          Dodano!
        </>
      ) : (
        <>
          <ShoppingCart size={16} />
          {inCart ? "Dodaj jeszcze" : "Dodaj do koszyka"}
        </>
      )}
    </button>
  );
}

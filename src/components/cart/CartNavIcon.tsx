"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";

export function CartNavIcon() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className="relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
      title="Koszyk"
    >
      <ShoppingCart size={20} strokeWidth={1.8} />
      <span className="text-[10px] font-medium">Koszyk</span>
      {totalItems > 0 && (
        <span className="absolute -top-0.5 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white shadow">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}

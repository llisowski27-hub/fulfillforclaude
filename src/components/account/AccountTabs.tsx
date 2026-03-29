"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Gavel } from "lucide-react";

const TABS = [
  { href: "/account/orders", label: "Zamówienia", icon: ShoppingBag },
  { href: "/account/bids", label: "Moje oferty", icon: Gavel },
];

export default function AccountTabs() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex gap-1 rounded-xl bg-card border border-border p-1">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

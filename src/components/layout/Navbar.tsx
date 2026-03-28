import Link from "next/link";
import { ShoppingCart, Package, Gavel, Users, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-primary">
              The Liquidator
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/catalog" icon={<Package size={16} />}>
              Katalog
            </NavLink>
            <NavLink href="/auctions" icon={<Gavel size={16} />}>
              Aukcje
            </NavLink>
            <NavLink href="/cart" icon={<ShoppingCart size={16} />}>
              Koszyk
            </NavLink>
          </nav>

          <nav className="hidden md:flex items-center gap-1 border-l border-border pl-4 ml-4">
            <NavLink href="/clients" icon={<Users size={16} />}>
              Klienci
            </NavLink>
            <NavLink href="/inventory" icon={<Package size={16} />}>
              Magazyn
            </NavLink>
            <NavLink href="/admin/listings" icon={<LayoutDashboard size={16} />}>
              Oferty
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {icon}
      {children}
    </Link>
  );
}

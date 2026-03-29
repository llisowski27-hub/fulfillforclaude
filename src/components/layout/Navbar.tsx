import Link from "next/link";
import { Package, Gavel } from "lucide-react";
import { CartNavIcon } from "@/components/cart/CartNavIcon";
import { UserMenu } from "@/components/layout/UserMenu";
import { getUser } from "@/lib/auth";

export default async function Navbar() {
  const user = await getUser();

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
            <CartNavIcon />
          </nav>

          {/* Auth section */}
          <div className="hidden md:flex items-center gap-1 border-l border-border pl-4 ml-2">
            {user ? (
              <>
                <div className="ml-2 pl-2 border-l border-border">
                  <UserMenu email={user.email!} />
                </div>
              </>
            ) : (
              <>
                <NavLink href="/login" icon={null}>
                  Zaloguj
                </NavLink>
                <Link
                  href="/register"
                  className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Rejestracja
                </Link>
              </>
            )}
          </div>
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

import Link from "next/link";
import { Package, Gavel, Zap } from "lucide-react";
import { CartNavIcon } from "@/components/cart/CartNavIcon";
import { UserMenu } from "@/components/layout/UserMenu";
import { getUser } from "@/lib/auth";

export default async function Navbar() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <Zap size={16} strokeWidth={2.5} />
            </div>
            <span className="text-base font-black tracking-tight text-foreground">
              The <span className="text-primary">Liquidator</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/catalog" icon={<Package size={15} />}>Katalog</NavLink>
            <NavLink href="/auctions" icon={<Gavel size={15} />}>Aukcje</NavLink>
            <CartNavIcon />
          </nav>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2 border-l border-border pl-4 ml-2">
            {user ? (
              <UserMenu email={user.email!} />
            ) : (
              <>
                <NavLink href="/login" icon={null}>Zaloguj</NavLink>
                <Link
                  href="/register"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all"
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

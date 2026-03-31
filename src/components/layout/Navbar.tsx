import Link from "next/link";
import { Package, Gavel, Zap, TrendingUp } from "lucide-react";
import { CartNavIcon } from "@/components/cart/CartNavIcon";
import { UserMenu } from "@/components/layout/UserMenu";
import { getUser } from "@/lib/auth";

export default async function Navbar() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/95 backdrop-blur-xl shadow-sm shadow-emerald-500/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-green-400 text-white shadow-md shadow-emerald-500/30 transition-transform group-hover:scale-105">
              <Zap size={16} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-black tracking-tight text-foreground">
                The <span className="bg-gradient-to-r from-amber-500 to-orange-400 bg-clip-text text-transparent">Liquidator</span>
              </span>
              <span className="badge-live" style={{ fontSize: "0.6rem", padding: "0.05rem 0.4rem" }}>Live auctions</span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/catalog" icon={<Package size={15} />}>Katalog</NavLink>
            <NavLink href="/auctions" icon={<Gavel size={15} />} live>Aukcje</NavLink>
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
                  className="rounded-lg btn-win px-4 py-2 text-sm font-bold shadow shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all"
                >
                  Rejestracja
                </Link>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Ticker bar */}
      <div className="border-t border-emerald-50 bg-emerald-50/60 px-4 py-1 hidden md:flex items-center gap-6 overflow-hidden">
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
          <TrendingUp size={11} />
          <span>Rynek aktywny</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <TickerItem label="Aktywne aukcje" value="24" up />
          <TickerItem label="Licytujących" value="138" up />
          <TickerItem label="Ostatnia transakcja" value="2 min temu" />
        </div>
      </div>
    </header>
  );
}

function TickerItem({ label, value, up }: { label: string; value: string; up?: boolean }) {
  return (
    <span className="flex items-center gap-1">
      <span className="text-muted-foreground">{label}:</span>
      <span className={up ? "text-win font-semibold" : "text-foreground font-medium"}>{value}</span>
    </span>
  );
}

function NavLink({
  href, icon, children, live,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  live?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-emerald-50 hover:text-emerald-700"
    >
      {icon}
      {children}
      {live && (
        <span className="ml-0.5 inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      )}
    </Link>
  );
}

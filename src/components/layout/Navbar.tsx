import Link from "next/link";
import { Zap, Bell } from "lucide-react";
import { CartNavIcon } from "@/components/cart/CartNavIcon";
import { UserMenu } from "@/components/layout/UserMenu";
import { SearchBar } from "@/components/layout/SearchBar";
import { getUser } from "@/lib/auth";

export default async function Navbar() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">

      {/* ── Main bar ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/30 transition-transform group-hover:scale-105">
              <Zap size={16} strokeWidth={2.5} />
            </div>
            <span className="hidden lg:block text-base font-black tracking-tight text-foreground">
              The <span className="bg-gradient-to-r from-amber-500 to-orange-400 bg-clip-text text-transparent">Liquidator</span>
            </span>
          </Link>

          {/* Search bar — grows to fill space */}
          <div className="flex-1 hidden md:block">
            <SearchBar />
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Notifications */}
            <button
              className="relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              title="Powiadomienia"
            >
              <Bell size={20} strokeWidth={1.8} />
              <span className="text-[10px] font-medium">Alerty</span>
              <span className="absolute -top-0.5 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white shadow">
                3
              </span>
            </button>

            {/* Cart */}
            <CartNavIcon />

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200 mx-1" />

            {/* Auth */}
            {user ? (
              <UserMenu email={user.email!} />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Zaloguj
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg btn-win px-4 py-2 text-sm font-bold shadow shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] transition-all"
                >
                  Rejestracja
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>

    </header>
  );
}

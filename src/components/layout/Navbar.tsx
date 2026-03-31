import Link from "next/link";
import { Bell } from "lucide-react";
import { CartNavIcon } from "@/components/cart/CartNavIcon";
import { UserMenu } from "@/components/layout/UserMenu";
import { SearchBar } from "@/components/layout/SearchBar";
import { getUser } from "@/lib/auth";

export default async function Navbar() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">

          {/* Logo — LIQWARE wordmark */}
          <Link href="/" className="shrink-0 flex items-center group">
            <img
              src="/liqware.svg"
              alt="Liqware"
              className="h-7 w-auto transition-opacity group-hover:opacity-75"
              style={{ color: "#111" }}
            />
          </Link>

          {/* Search bar */}
          <div className="flex-1 hidden md:block">
            <SearchBar />
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 shrink-0">
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

            <CartNavIcon />

            <div className="w-px h-8 bg-gray-200 mx-1" />

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

import Link from "next/link";
import { Sparkles, BarChart2, MessageSquare, Phone } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { getUser } from "@/lib/auth";

const NAV_LINKS = [
  { label: "Jak działamy", href: "/#jak-dzialamy" },
  { label: "Usługi", href: "/#uslugi" },
  { label: "Efekty", href: "/#efekty" },
  { label: "Analizator reklam", href: "/analiza", icon: <BarChart2 size={13} /> },
];

export default async function Navbar() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow shadow-blue-500/30">
              <Sparkles size={15} strokeWidth={2.5} />
            </div>
            <span className="font-black text-gray-900 tracking-tight text-lg">
              Liqware
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              AI Ads
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <Link
                  href="/analiza"
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <BarChart2 size={14} />
                  Moje analizy
                </Link>
                <UserMenu email={user.email!} />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block text-sm font-medium text-gray-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Zaloguj
                </Link>
                <Link
                  href="/konsultacja"
                  className="flex items-center gap-1.5 rounded-xl btn-win px-4 py-2 text-sm font-bold shadow shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] transition-all"
                >
                  <Phone size={13} />
                  <span className="hidden sm:inline">Bezpłatna konsultacja</span>
                  <span className="sm:hidden">Konsultacja</span>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

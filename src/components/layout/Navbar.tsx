import Link from "next/link";
import { Sparkles, BarChart2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import { UserMenu } from "@/components/layout/UserMenu";

const NAV_LINKS = [
  { label: "Ścieżki", href: "/#program" },
  { label: "Jak pracujemy", href: "/#jak-dzialamy" },
  { label: "Dlaczego my", href: "/#efekty" },
  { label: "Analiza reklam", href: "/analiza", icon: <BarChart2 size={13} /> },
];

export default async function Navbar() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2.5 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
              <Sparkles size={14} strokeWidth={2.5} className="text-white" />
            </div>
            <span className="font-black text-white tracking-tight text-lg">
              Liqware
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold text-blue-400 border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 rounded-full tracking-wider uppercase">
              Kurs + Audyt
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <Link
                  href="/analiza"
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
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
                  className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
                >
                  Zaloguj się
                </Link>
                <Button asChild size="default" variant="primary">
                  <Link href="/#zapis">
                    <Phone size={13} />
                    <span className="hidden sm:inline">Umów rozmowę</span>
                    <span className="sm:hidden">Rozmowa</span>
                  </Link>
                </Button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import { Package, Gavel, ArrowRight, TrendingDown, Zap, Clock, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-8 py-16 md:px-16 md:py-24 shadow-2xl shadow-gray-900/30">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute top-8 right-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative max-w-2xl space-y-6">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 backdrop-blur-sm px-4 py-1.5 text-sm font-bold text-blue-300 border border-blue-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
            </span>
            Aukcje live — rynek otwarty
          </div>

          <h1 className="text-5xl font-black tracking-tight text-white leading-[1.1]">
            Likwidacja magazynów.
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Ceny nie do pobicia.
            </span>
          </h1>

          <p className="text-lg text-white/70 leading-relaxed max-w-lg">
            Marketplace z aukcjami na żywo i wyprzedażami stałocenowymi.
            Części samochodowe, elektronika, towar po leasingach.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-gray-900 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            >
              <Package size={16} />
              Przeglądaj katalog
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 rounded-xl btn-win px-6 py-3 text-sm font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Gavel size={16} />
              Aktywne aukcje
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-8">
          <StatPill label="Aktywne aukcje" value="24" accent="blue" />
          <StatPill label="Licytujących online" value="138" accent="blue" />
          <StatPill label="Sprzedanych dziś" value="57" accent="amber" />
          <StatPill label="Śr. oszczędność" value="43%" accent="amber" />
        </div>
      </section>

      {/* ── Feature cards ─────────────────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<Clock size={22} className="text-blue-600" />}
          iconBg="bg-blue-50 border border-blue-100"
          title="Aukcje live"
          description="Licytuj w czasie rzeczywistym. Anti-sniping przedłuża aukcję przy ostatnich ofertach."
          accent="blue"
        />
        <FeatureCard
          icon={<TrendingDown size={22} className="text-amber-600" />}
          iconBg="bg-amber-50 border border-amber-100"
          title="Kup teraz"
          description="Stałe ceny na towar z magazynów likwidacyjnych. Bez czekania na koniec aukcji."
          accent="amber"
        />
        <FeatureCard
          icon={<ShieldCheck size={22} className="text-gray-600" />}
          iconBg="bg-gray-50 border border-gray-200"
          title="Gwarantowana realizacja"
          description="Każda transakcja potwierdzana w sekundach. Zamówienie trafia do realizacji od razu."
          accent="gray"
        />
      </section>

      {/* ── CTA strip ─────────────────────────────────────────── */}
      <section className="rounded-2xl bg-blue-600 px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg shadow-blue-600/20">
        <div>
          <p className="text-white font-black text-xl">Gotowy na pierwszą licytację?</p>
          <p className="text-blue-100 text-sm mt-1">Zarejestruj się za darmo i licytuj od razu.</p>
        </div>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow transition-all hover:scale-[1.02] hover:shadow-md whitespace-nowrap"
        >
          <Zap size={15} />
          Załóż konto
        </Link>
      </section>

    </div>
  );
}

function StatPill({ label, value, accent }: { label: string; value: string; accent: "blue" | "amber" }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className={`text-2xl font-black ${accent === "blue" ? "text-blue-400" : "text-amber-400"}`}>
        {value}
      </span>
      <span className="text-sm text-white/50">{label}</span>
    </div>
  );
}

function FeatureCard({
  icon, iconBg, title, description, accent,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  accent: "blue" | "amber" | "gray";
}) {
  const hoverBorder = accent === "blue"
    ? "hover:border-blue-200 hover:shadow-blue-500/10"
    : accent === "amber"
      ? "hover:border-amber-200 hover:shadow-amber-500/10"
      : "hover:border-gray-300";

  return (
    <div className={`group rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${hoverBorder}`}>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <h3 className="font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

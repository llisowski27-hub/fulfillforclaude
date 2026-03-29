import Link from "next/link";
import { Package, Gavel, ArrowRight, TrendingDown, Zap, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-rose-500 to-orange-500 px-8 py-16 md:px-16 md:py-24 shadow-2xl shadow-rose-500/20">
        {/* Background texture */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="pointer-events-none absolute -bottom-8 -right-8 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="relative max-w-2xl space-y-6">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-white border border-white/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Aukcje live w czasie rzeczywistym
          </div>

          <h1 className="text-5xl font-black tracking-tight text-white leading-[1.1]">
            Likwidacja magazynów.
            <br />
            <span className="text-white/85">Ceny nie do pobicia.</span>
          </h1>

          <p className="text-lg text-white/80 leading-relaxed max-w-lg">
            Marketplace z aukcjami na żywo i wyprzedażami stałocenowymi.
            Części samochodowe, elektronika, towar po leasingach.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-rose-600 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            >
              <Package size={16} />
              Przeglądaj katalog
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/15 backdrop-blur-sm px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/25"
            >
              <Gavel size={16} />
              Aktywne aukcje
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature cards ─────────────────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<Clock size={22} className="text-rose-500" />}
          iconBg="bg-rose-50"
          title="Aukcje live"
          description="Licytuj w czasie rzeczywistym. Anti-sniping przedłuża aukcję przy ostatnich ofertach."
        />
        <FeatureCard
          icon={<TrendingDown size={22} className="text-orange-500" />}
          iconBg="bg-orange-50"
          title="Kup teraz"
          description="Stałe ceny na towar z magazynów likwidacyjnych. Bez czekania na koniec aukcji."
        />
        <FeatureCard
          icon={<Zap size={22} className="text-rose-500" />}
          iconBg="bg-rose-50"
          title="Natychmiastowe potwierdzenie"
          description="Każda transakcja potwierdzana w sekundach. Zamówienie trafia do realizacji od razu."
        />
      </section>
    </div>
  );
}

function FeatureCard({
  icon, iconBg, title, description,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-rose-200">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <h3 className="font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

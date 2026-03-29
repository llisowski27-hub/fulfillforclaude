import Link from "next/link";
import { Package, Gavel, ArrowRight, TrendingDown, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-card border border-border px-8 py-16 md:px-16 md:py-24">
        {/* Background glow */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative max-w-2xl space-y-6">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Aukcje live w czasie rzeczywistym
          </div>

          <h1 className="text-5xl font-black tracking-tight text-foreground leading-[1.1]">
            Likwidacja magazynów.
            <br />
            <span className="text-primary">Ceny nie do pobicia.</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
            Marketplace z aukcjami na żywo i wyprzedażami stałocenowymi.
            Części samochodowe, elektronika, towar po leasingach.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Package size={16} />
              Przeglądaj katalog
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-bold text-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
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
          icon={<Gavel size={22} />}
          title="Aukcje live"
          description="Licytuj w czasie rzeczywistym. Anti-sniping przedłuża aukcję przy ostatnich ofertach."
        />
        <FeatureCard
          icon={<TrendingDown size={22} />}
          title="Kup teraz"
          description="Stałe ceny na towar z magazynów likwidacyjnych. Bez czekania na koniec aukcji."
        />
        <FeatureCard
          icon={<Zap size={22} />}
          title="Natychmiastowe potwierdzenie"
          description="Każda transakcja potwierdzana w sekundach. Zamówienie trafia do realizacji od razu."
        />
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-6 space-y-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary/20">
        {icon}
      </div>
      <h3 className="font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

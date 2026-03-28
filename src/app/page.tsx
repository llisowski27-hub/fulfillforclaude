import Link from "next/link";
import { Package, Gavel, ArrowRight, TrendingDown } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="rounded-2xl bg-card border border-border p-8 md:p-12 shadow-sm">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Aukcje live w czasie rzeczywistym
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Likwidacja magazynów.
            <br />
            <span className="text-primary">Części po najniższych cenach.</span>
          </h1>

          <p className="text-lg text-muted-foreground">
            Marketplace z aukcjami na żywo i wyprzedażami stałocenowyimi.
            Części samochodowe, elektronika, towar po leasingach.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-opacity hover:opacity-90"
            >
              <Package size={16} />
              Przeglądaj katalog
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary"
            >
              <Gavel size={16} />
              Aktywne aukcje
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<Gavel size={20} className="text-primary" />}
          title="Aukcje live"
          description="Licytuj w czasie rzeczywistym. Anti-sniping przedłuża aukcję przy ostatnich bidach."
        />
        <FeatureCard
          icon={<TrendingDown size={20} className="text-primary" />}
          title="Kup teraz"
          description="Stałe ceny na towar z magazynów likwidacyjnych. Bez czekania na koniec aukcji."
        />
        <FeatureCard
          icon={<Package size={20} className="text-primary" />}
          title="Zweryfikowany towar"
          description="Każda pozycja opisana stanem technicznym. 8 kategorii kondycji zgodnych z Allegro."
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
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

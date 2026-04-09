import Link from "next/link";
import {
  ArrowRight, Sparkles, BarChart2, Target, MessageSquare,
  CheckCircle, TrendingUp, Clock, Shield, Zap, Star,
  MapPin, Search, Eye, Phone, ChevronRight
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-20">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 px-8 py-16 md:px-16 md:py-24 shadow-xl shadow-blue-950/40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_110%_50%,rgba(59,130,246,0.25),transparent)]" />
        <div className="pointer-events-none absolute -top-16 right-0 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 text-blue-300 text-sm font-semibold">
            <Sparkles size={13} />
            AI-powered marketing dla lokalnych firm
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Twoje reklamy Meta & Google,{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              które przynoszą klientów.
            </span>
          </h1>

          <p className="text-xl text-white/70 leading-relaxed max-w-xl">
            Pomagamy dentystom, klinicom estetycznym i firmom remontowym z całej Polski generować leady przez płatne reklamy — za stałą miesięczną opłatę.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/konsultacja"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-gray-900 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            >
              <Phone size={15} />
              Bezpłatna konsultacja 15 min
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/analiza"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-bold text-white/90 transition-all hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              <BarChart2 size={15} />
              Analizuj swoje reklamy AI
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative mt-12 flex flex-wrap gap-8 border-t border-white/10 pt-8">
          <StatPill value="3–5%" label="średni reply rate cold outreach" accent="blue" />
          <StatPill value="stała opłata" label="bez prowizji od budżetu" accent="amber" />
          <StatPill value="15 min" label="bezpłatna konsultacja" accent="blue" />
          <StatPill value="AI analiza" label="Twoich aktualnych reklam" accent="amber" />
        </div>
      </section>

      {/* ── Problem section ───────────────────────────────────── */}
      <section className="space-y-6" id="uslugi">
        <div className="text-center space-y-3">
          <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">Problem</p>
          <h2 className="text-3xl font-black text-foreground">
            Większość lokalnych firm traci pieniądze na reklamy — albo ich w ogóle nie ma
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Sprawdzamy dziesiątki firm tygodniowo przez Facebook Ad Library i Google Ads Transparency. Wynik jest zawsze ten sam.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <ProblemCard
            icon={<Eye size={20} className="text-red-500" />}
            iconBg="bg-red-50 border border-red-100"
            title="Brak reklam"
            description="Firma ma profil na Google Maps, jest widoczna lokalnie — ale nie wydaje ani złotówki na pozyskiwanie nowych klientów przez płatne kanały."
          />
          <ProblemCard
            icon={<Target size={20} className="text-orange-500" />}
            iconBg="bg-orange-50 border border-orange-100"
            title="Złe targetowanie"
            description="Reklamy ustawione przez właściciela lub siosrzenicę — zbyt szerokie grupy, zły format, brak konwersji. Budżet przepalony, efekt zerowy."
          />
          <ProblemCard
            icon={<BarChart2 size={20} className="text-amber-500" />}
            iconBg="bg-amber-50 border border-amber-100"
            title="Brak mierzenia efektów"
            description="Właściciel nie wie ile kosztuje pozyskanie jednego klienta. Reklamy działają na zasadzie wiary, nie danych."
          />
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="space-y-10" id="jak-dzialamy">
        <div className="text-center space-y-3">
          <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">Jak działamy</p>
          <h2 className="text-3xl font-black text-foreground">Trzy kroki do pierwszych leadów</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <StepCard
            step="01"
            icon={<Search size={22} className="text-blue-600" />}
            title="Analiza AI Twoich reklam"
            description="Wklejasz link do profilu Facebook lub opisujesz co robisz. Nasz system AI analizuje Twoją sytuację i wskazuje konkretne problemy i szanse."
            cta={{ label: "Analizuj teraz", href: "/analiza" }}
          />
          <StepCard
            step="02"
            icon={<MessageSquare size={22} className="text-blue-600" />}
            title="Bezpłatna rozmowa 15 min"
            description="Pokazuję co konkretnie bym zrobił dla Twojej firmy — jaki format reklam, jaką grupę docelową, jaki budżet startowy i kiedy możesz oczekiwać pierwszych leadów."
            cta={{ label: "Umów rozmowę", href: "/konsultacja" }}
          />
          <StepCard
            step="03"
            icon={<TrendingUp size={22} className="text-blue-600" />}
            title="Stała opłata, mierzalne wyniki"
            description="Zarządzam Twoimi kampaniami Meta i Google za stałą miesięczną opłatę. Co miesiąc raport: ile leadów, jaki koszt za lead, co optymalizujemy."
            cta={null}
          />
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">Usługi</p>
          <h2 className="text-3xl font-black text-foreground">Co konkretnie dostajesz</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            icon={<Target size={22} className="text-blue-600" />}
            iconBg="bg-blue-50 border border-blue-100"
            title="Meta Ads (Facebook + Instagram)"
            items={[
              "Kampanie lead generation",
              "Reklamy remarketingowe",
              "Lookalike audiences",
              "A/B testy kreacji",
            ]}
            accent="blue"
          />
          <ServiceCard
            icon={<Search size={22} className="text-green-600" />}
            iconBg="bg-green-50 border border-green-100"
            title="Google Ads"
            items={[
              "Kampanie lokalne (Google Maps)",
              "Reklamy w wyszukiwarce",
              "Performance Max",
              "Śledzenie konwersji",
            ]}
            accent="green"
          />
          <ServiceCard
            icon={<BarChart2 size={22} className="text-amber-600" />}
            iconBg="bg-amber-50 border border-amber-100"
            title="AI Analiza & Raportowanie"
            items={[
              "Audyt aktualnych reklam",
              "Miesięczne raporty z wynikami",
              "Optymalizacja oparta o dane",
              "Wgląd w reklamy konkurencji",
            ]}
            accent="amber"
          />
        </div>
      </section>

      {/* ── For who ───────────────────────────────────────────── */}
      <section className="rounded-2xl bg-slate-50 border border-border px-8 py-12 space-y-8" id="efekty">
        <div className="text-center space-y-3">
          <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">Dla kogo</p>
          <h2 className="text-3xl font-black text-foreground">Specjalizujemy się w lokalnych usługach</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Dentyści, kliniki estetyczne, firmy remontowe, fryzjerzy, gabinety fizjoterapii — każdy może mieć stały dopływ klientów z reklam.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { city: "Warszawa", type: "Dentysta", result: "18 leadów / miesiąc", icon: "🦷" },
            { city: "Kraków", type: "Klinika estetyczna", result: "24 zapytania / miesiąc", icon: "✨" },
            { city: "Poznań", type: "Firma remontowa", result: "11 wycen / miesiąc", icon: "🔨" },
            { city: "Wrocław", type: "Fizjoterapeuta", result: "15 rezerwacji / miesiąc", icon: "💪" },
            { city: "Gdańsk", type: "Salon fryzjerski", result: "32 nowych klientów / miesiąc", icon: "✂️" },
            { city: "Łódź", type: "Kancelaria prawna", result: "8 konsultacji / miesiąc", icon: "⚖️" },
          ].map((item) => (
            <div key={item.city + item.type} className="flex items-center gap-3 rounded-xl bg-white border border-border p-4 shadow-sm">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin size={11} />
                  {item.city} · {item.type}
                </div>
                <p className="font-bold text-sm text-foreground mt-0.5">{item.result}</p>
              </div>
              <CheckCircle size={16} className="ml-auto text-green-500 shrink-0" />
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          * Wyniki orientacyjne. Rzeczywiste efekty zależą od branży, lokalizacji i budżetu reklamowego.
        </p>
      </section>

      {/* ── Why us ────────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-foreground">Dlaczego stała opłata a nie % od budżetu</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <WhyCard
            icon={<Shield size={20} className="text-blue-600" />}
            title="Bez konfliktu interesów"
            description="Przy % od budżetu agencja zarabia więcej gdy przepalasz więcej. My zarabiamy tyle samo niezależnie od budżetu — nasz cel to najlepszy koszt za lead."
          />
          <WhyCard
            icon={<Clock size={20} className="text-blue-600" />}
            title="Przewidywalny koszt"
            description="Wiesz ile płacisz za zarządzanie reklamami każdego miesiąca. Budżet reklamowy to osobna kwota, którą kontrolujesz samodzielnie."
          />
          <WhyCard
            icon={<Zap size={20} className="text-blue-600" />}
            title="AI + ludzki nadzór"
            description="Automatyzacja AI do optymalizacji stawek i testowania kreacji, człowiek do strategii i komunikacji. Najlepsze z obu światów."
          />
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg shadow-blue-600/20">
        <div className="space-y-2 text-center md:text-left">
          <p className="text-white font-black text-2xl">Sprawdź czy możesz mieć więcej klientów</p>
          <p className="text-blue-100 leading-relaxed max-w-md">
            15-minutowa rozmowa. Pokażę co konkretnie zrobiłbym dla Twojej firmy — bez zobowiązań.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            href="/analiza"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/20 hover:scale-[1.02] whitespace-nowrap"
          >
            <BarChart2 size={15} />
            Analizuj reklamy AI
          </Link>
          <Link
            href="/konsultacja"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 shadow transition-all hover:scale-[1.02] hover:shadow-md whitespace-nowrap"
          >
            <Phone size={15} />
            Umów rozmowę
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

    </div>
  );
}

/* ── Helpers ──────────────────────────────────────────────── */

function StatPill({ value, label, accent }: { value: string; label: string; accent: "blue" | "amber" }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className={`text-xl font-black ${accent === "blue" ? "text-blue-400" : "text-amber-400"}`}>
        {value}
      </span>
      <span className="text-sm text-white/50">{label}</span>
    </div>
  );
}

function ProblemCard({ icon, iconBg, title, description }: {
  icon: React.ReactNode; iconBg: string; title: string; description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <h3 className="font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, icon, title, description, cta }: {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: { label: string; href: string } | null;
}) {
  return (
    <div className="relative rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
          {icon}
        </div>
        <span className="text-4xl font-black text-blue-100">{step}</span>
      </div>
      <h3 className="font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          {cta.label}
          <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}

function ServiceCard({ icon, iconBg, title, items, accent }: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  items: string[];
  accent: "blue" | "green" | "amber";
}) {
  const hoverBorder =
    accent === "blue" ? "hover:border-blue-200 hover:shadow-blue-500/10"
    : accent === "green" ? "hover:border-green-200 hover:shadow-green-500/10"
    : "hover:border-amber-200 hover:shadow-amber-500/10";

  return (
    <div className={`rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${hoverBorder}`}>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <h3 className="font-bold text-foreground">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function WhyCard({ icon, title, description }: {
  icon: React.ReactNode; title: string; description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
        {icon}
      </div>
      <h3 className="font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

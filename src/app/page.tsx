import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Services from "@/components/landing/Services";
import HowItWorks from "@/components/landing/HowItWorks";
import Differentiation from "@/components/landing/Differentiation";
import LeadForm from "@/components/landing/LeadForm";
import { Phone, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Stats />
      </div>

      <Services />

      <HowItWorks />

      <Differentiation />

      {/* ── Lead Form Section ──────────────────────────────────── */}
      <section
        id="zapis"
        className="relative py-24 overflow-hidden border-t border-border/50"
      >
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-64 w-[600px] bg-blue-600/8 blur-[80px] rounded-full" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-72 bg-violet-600/8 blur-[60px] rounded-full" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left: copy */}
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                  Zacznij tutaj
                </p>
                <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                  Zobaczmy czy{" "}
                  <span className="text-gradient-cyber">mogę Ci pomóc.</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  Wypełnij formularz. Zanim zadzwonię, przeanalizuję Twoją
                  sytuację — żeby 15 minut poszło na konkrety, nie na
                  przedstawianie się.
                </p>
              </div>

              {/* Reassurances */}
              <div className="space-y-3">
                {[
                  "Bez prezentacji sprzedażowych. Bez NDA. Prawdziwa rozmowa.",
                  "Wychodzisz z konkretną rekomendacją — niezależnie od decyzji.",
                  "Mówię wprost czy kurs, czy audyt ma dla Ciebie sens.",
                  "Zero presji. Zero miesięcznych zobowiązań.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>

              {/* Alt CTA */}
              <div className="rounded-2xl glass p-5 space-y-3">
                <p className="text-sm font-bold text-white">
                  Wolisz najpierw sprawdzić swoje reklamy?
                </p>
                <p className="text-xs text-muted-foreground">
                  Wklej tekst swojej reklamy i dostań darmową analizę AI
                  w 30 sekund — bez rejestracji.
                </p>
                <Link
                  href="/analiza"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Przejdź do analizy reklam
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Right: form */}
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-blue-500/5 blur-2xl" />
              <div className="relative rounded-2xl border border-border/60 bg-card/70 p-8 gradient-border">
                <div className="mb-6 space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone size={15} className="text-blue-400" />
                    <h3 className="font-black text-white">Umów bezpłatną rozmowę</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    15 minut · Bez zobowiązań
                  </p>
                </div>
                <LeadForm />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-border/50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Liqware. Kurs AI Marketing i audyt agencji.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/analiza" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Analiza reklam
            </Link>
            <Link href="#zapis" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Umów rozmowę
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Zaloguj się
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

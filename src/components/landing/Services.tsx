import Link from "next/link";
import {
  BookOpen,
  Shield,
  CheckCircle,
  ArrowRight,
  Facebook,
  Search,
  BrainCircuit,
  FileSearch,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Services() {
  return (
    <section id="program" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            Dwie ścieżki
          </p>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Wybierz jak chcesz{" "}
            <span className="text-gradient-cyber">odzyskać kontrolę.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Niezależnie od tego czy chcesz sam prowadzić reklamy, czy wolisz
            trzymać agencję na krótkiej smyczy — mamy dla Ciebie gotowy system.
          </p>
        </div>

        {/* Two paths */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ── Path 1: DIY Course ──────────────────────────── */}
          <div className="relative rounded-2xl border border-border/60 bg-card/60 p-8 space-y-6 gradient-border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/15 hover:border-blue-500/30">
            {/* Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 rounded-full glass-blue px-3 py-1 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                Ścieżka 1
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">od</p>
                <p className="text-2xl font-black text-white">
                  497 zł
                  <span className="text-xs font-normal text-muted-foreground ml-1">jednorazowo</span>
                </p>
              </div>
            </div>

            {/* Icon + title */}
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 shrink-0">
                <BookOpen size={26} />
              </div>
              <div className="space-y-1.5 pt-1">
                <h3 className="text-2xl font-black text-white leading-tight">
                  Kurs AI Marketing
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Dla firm które chcą być niezależne. Nauczysz się prowadzić
                  reklamy samodzielnie przy pomocy AI.
                </p>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2.5">
              {[
                { icon: <Facebook size={13} className="text-blue-400" />, text: "Moduł Meta Ads — Facebook + Instagram od zera" },
                { icon: <Search size={13} className="text-cyan-400" />, text: "Moduł Google Ads — Search + Maps dla lokalnych" },
                { icon: <BrainCircuit size={13} className="text-violet-400" />, text: "Moduł AI — ChatGPT, prompty, automatyzacje" },
                { icon: <CheckCircle size={13} className="text-green-400" />, text: "Szablony reklam dla dentystów, klinik, remontów" },
                { icon: <CheckCircle size={13} className="text-green-400" />, text: "Dożywotni dostęp + aktualizacje" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2.5 text-sm text-foreground/80">
                  <span className="flex h-5 w-5 items-center justify-center shrink-0">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>

            {/* Ideal for */}
            <div className="rounded-xl bg-white/3 border border-white/8 p-4">
              <p className="text-[11px] font-bold text-blue-300 uppercase tracking-wider mb-1">
                Dobry wybór jeśli
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                Masz 6–10h żeby się nauczyć. Chcesz oszczędzać długofalowo
                i mieć pełną kontrolę nad każdą złotówką.
              </p>
            </div>

            {/* CTA */}
            <Button asChild size="lg" variant="primary" className="w-full">
              <Link href="#zapis">
                Zapisz się na kurs
                <ArrowRight size={15} />
              </Link>
            </Button>
          </div>

          {/* ── Path 2: Agency Management ───────────────────── */}
          <div className="relative rounded-2xl border border-border/60 bg-card/60 p-8 space-y-6 gradient-border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/15 hover:border-violet-500/30">
            {/* Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 px-3 py-1 text-[10px] font-bold text-violet-300 uppercase tracking-wider">
                Ścieżka 2
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">od</p>
                <p className="text-2xl font-black text-white">
                  1 490 zł
                  <span className="text-xs font-normal text-muted-foreground ml-1">/ audyt</span>
                </p>
              </div>
            </div>

            {/* Icon + title */}
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/15 border border-violet-500/30 text-violet-400 shrink-0">
                <Shield size={26} />
              </div>
              <div className="space-y-1.5 pt-1">
                <h3 className="text-2xl font-black text-white leading-tight">
                  Audyt i nadzór agencji
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Dla firm które już pracują z agencją. Sprawdzamy czy dostajesz
                  to za co płacisz — i ile realnie przepalasz.
                </p>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2.5">
              {[
                { icon: <FileSearch size={13} className="text-violet-400" />, text: "Pełen audyt kampanii Meta + Google" },
                { icon: <AlertTriangle size={13} className="text-amber-400" />, text: "Wykrycie ukrytych marż i przepalania budżetu" },
                { icon: <BarChart3 size={13} className="text-cyan-400" />, text: "Dashboard z realnymi KPI — widzisz wszystko" },
                { icon: <CheckCircle size={13} className="text-green-400" />, text: "Raport + konkretne rekomendacje w 5 dni" },
                { icon: <CheckCircle size={13} className="text-green-400" />, text: "Opcjonalny miesięczny nadzór (od 790 zł)" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2.5 text-sm text-foreground/80">
                  <span className="flex h-5 w-5 items-center justify-center shrink-0">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>

            {/* Ideal for */}
            <div className="rounded-xl bg-white/3 border border-white/8 p-4">
              <p className="text-[11px] font-bold text-violet-300 uppercase tracking-wider mb-1">
                Dobry wybór jeśli
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                Płacisz agencji co miesiąc i nie wiesz dokładnie co dostajesz.
                Chcesz niezależnej weryfikacji i prawdziwej transparentności.
              </p>
            </div>

            {/* CTA */}
            <Button asChild size="lg" variant="ghost" className="w-full">
              <Link href="#zapis">
                Zamów audyt
                <ArrowRight size={15} />
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-muted-foreground">
          Nie wiesz którą ścieżkę wybrać?{" "}
          <Link href="#zapis" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Umów bezpłatną 15-min rozmowę →
          </Link>
        </p>
      </div>
    </section>
  );
}

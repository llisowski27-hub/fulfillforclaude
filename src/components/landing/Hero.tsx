"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Shield, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 grid-overlay" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-background to-violet-950/20" />

      {/* Radial glows */}
      <div className="pointer-events-none absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-0 h-80 w-80 rounded-full bg-violet-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Copy ──────────────────────────────────── */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full glass-blue px-4 py-1.5 text-xs font-semibold text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 dot-live" />
              AI Marketing · Kursy · Audyt agencji · Polska
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.05] text-white">
                Przejmij kontrolę
              </h1>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.05]">
                <span className="text-gradient-cyber">nad marketingiem</span>
              </h1>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.05] text-white">
                swojej firmy.
              </h1>
            </div>

            {/* Sub */}
            <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
              Dwie ścieżki. Jeden cel: przestać tracić pieniądze. Naucz się
              samodzielnie prowadzić reklamy AI — albo pozwól nam audytować
              i nadzorować Twoją obecną agencję.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Button asChild size="xl" variant="primary" className="glow-blue-sm">
                <Link href="#program">
                  <BookOpen size={16} />
                  Zobacz program kursu
                  <ArrowRight size={15} />
                </Link>
              </Button>
              <Button asChild size="xl" variant="ghost">
                <Link href="#program">
                  <Shield size={16} />
                  Audyt mojej agencji
                </Link>
              </Button>
            </div>

            {/* Social proof strip */}
            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/5">
              {[
                { value: "6h", label: "do pierwszej własnej kampanii" },
                { value: "1 000 zł", label: "oszczędność / mies." },
                { value: "100%", label: "kontroli i transparentności" },
              ].map((s) => (
                <div key={s.label} className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-white">{s.value}</span>
                  <span className="text-xs text-slate-400">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Two Paths Panel ──────────────────────── */}
          <div className="relative animate-float">
            <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-2xl" />

            <div className="relative glass-card rounded-2xl p-5 gradient-border space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/30">
                    <Zap size={13} className="text-blue-400" />
                  </div>
                  <span className="text-xs font-bold text-white/80 tracking-wide uppercase">
                    Wybierz swoją ścieżkę
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 dot-live" />
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Live</span>
                </div>
              </div>

              {/* Path 1: DIY Course */}
              <div className="rounded-xl bg-blue-500/8 border border-blue-500/20 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-blue-400" />
                    <p className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                      Ścieżka 1 · Zrób to sam z AI
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-blue-300">Od 497 zł</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  Kurs wideo + szablony AI. Uczysz się raz, używasz przez lata.
                  1–2h tygodniowo po kursie.
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-blue-400" />
                  <span className="text-[11px] text-white/60">Meta Ads + Google Ads + prompty AI</span>
                </div>
              </div>

              {/* Path 2: Agency Management */}
              <div className="rounded-xl bg-violet-500/8 border border-violet-500/20 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-violet-400" />
                    <p className="text-[11px] font-bold text-violet-300 uppercase tracking-wider">
                      Ścieżka 2 · Audyt Twojej agencji
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-violet-300">Od 1 490 zł</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  Sprawdzamy czy agencja nie przepala Twojego budżetu.
                  Raport + konkretne rekomendacje w 5 dni.
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-violet-400" />
                  <span className="text-[11px] text-white/60">Audyt kampanii + KPI + miesięczny nadzór</span>
                </div>
              </div>

              {/* Savings */}
              <div className="rounded-xl bg-white/3 border border-white/8 p-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Średnia oszczędność klientów</p>
                  <p className="text-xl font-black text-white">
                    12 000 zł
                    <span className="text-green-400 text-sm font-bold ml-1.5">/ rok</span>
                  </p>
                </div>
                <TrendingUp size={24} className="text-green-400" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

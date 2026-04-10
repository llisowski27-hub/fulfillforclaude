"use client";

import Link from "next/link";
import { ArrowRight, Phone, BarChart2, Zap, TrendingUp } from "lucide-react";
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
              AI-Powered · Meta Ads · Google Ads · Poland
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.05] text-white">
                Turn Ad Spend Into
              </h1>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.05]">
                <span className="text-gradient-cyber">Predictable</span>
                <br />
                <span className="text-white">Revenue.</span>
              </h1>
            </div>

            {/* Sub */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              We run AI-optimised Meta & Google Ads for local Polish businesses —
              dentists, aesthetic clinics, renovation firms. Fixed monthly fee.
              No commissions. Just leads.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Button asChild size="xl" variant="primary" className="glow-blue-sm">
                <Link href="/konsultacja">
                  <Phone size={16} />
                  Book a Free Strategy Call
                  <ArrowRight size={15} />
                </Link>
              </Button>
              <Button asChild size="xl" variant="ghost">
                <Link href="/analiza">
                  <BarChart2 size={16} />
                  Analyze My Ads
                </Link>
              </Button>
            </div>

            {/* Social proof strip */}
            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/5">
              {[
                { value: "40+", label: "active clients" },
                { value: "4.8×", label: "avg. ROAS" },
                { value: "< 48h", label: "campaign launch" },
              ].map((s) => (
                <div key={s.label} className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-white">{s.value}</span>
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: AI Dashboard Panel ──────────────────── */}
          <div className="relative animate-float">
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-2xl" />

            <div className="relative glass-card rounded-2xl p-5 gradient-border space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/30">
                    <Zap size={13} className="text-blue-400" />
                  </div>
                  <span className="text-xs font-bold text-white/80 tracking-wide uppercase">
                    AI Performance Monitor
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 dot-live" />
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">LIVE</span>
                </div>
              </div>

              {/* Main metric */}
              <div className="rounded-xl bg-white/3 border border-white/5 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Campaign ROAS</p>
                    <p className="text-4xl font-black text-white mt-0.5">4.83<span className="text-2xl text-blue-400">×</span></p>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-green-500/10 border border-green-500/20 px-2.5 py-1.5">
                    <TrendingUp size={12} className="text-green-400" />
                    <span className="text-xs font-bold text-green-400">+23%</span>
                  </div>
                </div>

                {/* SVG chart */}
                <div className="relative h-20 w-full overflow-hidden">
                  <svg viewBox="0 0 320 80" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Area */}
                    <path
                      d="M0,70 L32,62 L64,65 L96,50 L128,44 L160,36 L192,30 L224,22 L256,16 L288,10 L320,6 L320,80 L0,80 Z"
                      fill="url(#areaGrad)"
                    />
                    {/* Line */}
                    <path
                      d="M0,70 L32,62 L64,65 L96,50 L128,44 L160,36 L192,30 L224,22 L256,16 L288,10 L320,6"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-draw"
                    />
                    {/* Dot at end */}
                    <circle cx="320" cy="6" r="3" fill="#60a5fa" />
                    <circle cx="320" cy="6" r="6" fill="#3b82f6" fillOpacity="0.25" />
                  </svg>
                </div>
              </div>

              {/* Channel metrics */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    platform: "Meta Ads",
                    dot: "bg-blue-500",
                    cpl: "42 zł",
                    change: "-18%",
                    positive: true,
                  },
                  {
                    platform: "Google Ads",
                    dot: "bg-cyan-400",
                    cpl: "67 zł",
                    change: "-12%",
                    positive: true,
                  },
                ].map((ch) => (
                  <div
                    key={ch.platform}
                    className="rounded-xl bg-white/3 border border-white/5 p-3 space-y-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${ch.dot}`} />
                      <span className="text-[11px] font-semibold text-white/60">
                        {ch.platform}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-black text-white">
                        CPL: {ch.cpl}
                      </span>
                      <span className="text-[11px] font-bold text-green-400">
                        {ch.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI optimizer status */}
              <div className="rounded-xl bg-violet-500/8 border border-violet-500/20 p-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-violet-300">AI Optimizer</p>
                  <p className="text-[11px] text-muted-foreground">
                    Audience refined · 2 min ago
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-violet-500/15 border border-violet-400/25 px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400 dot-live" />
                  <span className="text-[10px] font-bold text-violet-300 uppercase">Active</span>
                </div>
              </div>

              {/* Lead progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white/60">Leads This Month</p>
                  <p className="text-xs font-black text-white">
                    127{" "}
                    <span className="text-muted-foreground font-normal">/ 150</span>
                  </p>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{ width: "84.7%" }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

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
      <section className="relative py-24 overflow-hidden border-t border-border/50">
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
                  Start here
                </p>
                <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                  Let's see if we're{" "}
                  <span className="text-gradient-cyber">a good fit.</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  Fill in the form. I'll analyse your situation before the call
                  so we spend 15 minutes on concrete recommendations — not
                  introductions.
                </p>
              </div>

              {/* Reassurances */}
              <div className="space-y-3">
                {[
                  "No pitch decks. No NDAs. Just a real conversation.",
                  "You'll leave with actionable insights regardless.",
                  "Fixed monthly fee — no % of ad spend.",
                  "Cancel anytime. No lock-in contracts.",
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
                  Prefer to analyze your ads first?
                </p>
                <p className="text-xs text-muted-foreground">
                  Paste your ad text and get an AI audit in 30 seconds — free,
                  no sign-up.
                </p>
                <Link
                  href="/analiza"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Go to Ad Analyzer
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
                    <h3 className="font-black text-white">Book a Free Strategy Call</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    15 minutes · No commitment
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
            © {new Date().getFullYear()} Liqware. AI Marketing Agency.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/analiza" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Ad Analyzer
            </Link>
            <Link href="/konsultacja" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Book a Call
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

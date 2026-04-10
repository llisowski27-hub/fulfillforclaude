import { BrainCircuit, Shield, LineChart } from "lucide-react";

const POINTS = [
  {
    icon: <BrainCircuit size={24} />,
    iconBg: "bg-blue-600/15 border-blue-500/25",
    accent: "text-blue-400",
    kicker: "AI-First",
    heading: "Your ads get smarter every day. Automatically.",
    body: "Most agencies set campaigns and forget. We run AI loops that analyse performance signals hourly — refining bids, audiences, and creatives without you lifting a finger.",
  },
  {
    icon: <LineChart size={24} />,
    iconBg: "bg-cyan-500/15 border-cyan-400/25",
    accent: "text-cyan-400",
    kicker: "Data-Driven",
    heading: "Every decision has a number behind it.",
    body: "No gut-feel targeting. No 'brand awareness' excuses. We optimise for one thing: cost per qualified lead. You always know exactly what you're paying for each new customer.",
  },
  {
    icon: <Shield size={24} />,
    iconBg: "bg-violet-600/15 border-violet-500/25",
    accent: "text-violet-400",
    kicker: "No Bullshit",
    heading: "Fixed price. No % of spend. No lock-in.",
    body: "Agencies that charge % of ad spend have an incentive to blow your budget. We don't. One flat monthly fee regardless of how much you spend. Cancel anytime — no penalty.",
  },
];

export default function Differentiation() {
  return (
    <section id="efekty" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            Why Us
          </p>
          <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
            What separates us from{" "}
            <br className="hidden sm:block" />
            <span className="text-gradient-violet">every other agency.</span>
          </h2>
        </div>

        {/* Points */}
        <div className="grid gap-6 lg:grid-cols-3">
          {POINTS.map((pt) => (
            <div
              key={pt.kicker}
              className="group rounded-2xl border border-border/60 bg-card/50 p-8 space-y-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 gradient-border"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${pt.iconBg} ${pt.accent}`}
              >
                {pt.icon}
              </div>

              <div className="space-y-3">
                <p className={`text-xs font-bold uppercase tracking-widest ${pt.accent}`}>
                  {pt.kicker}
                </p>
                <h3 className="text-xl font-black text-white leading-snug">
                  {pt.heading}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pt.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

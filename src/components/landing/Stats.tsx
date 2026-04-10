import { TrendingUp, Users, Zap, Award } from "lucide-react";

type Stat = {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub: string;
  accent: string;
  glow: string;
};

const STATS: Stat[] = [
  {
    icon: <TrendingUp size={20} />,
    value: "4.8×",
    label: "Average ROAS",
    sub: "across all active campaigns",
    accent: "text-blue-400",
    glow: "hover:border-blue-500/30 hover:shadow-blue-500/10",
  },
  {
    icon: <Users size={20} />,
    value: "2,400+",
    label: "Leads Generated",
    sub: "for local service businesses",
    accent: "text-cyan-400",
    glow: "hover:border-cyan-500/30 hover:shadow-cyan-500/10",
  },
  {
    icon: <Award size={20} />,
    value: "94%",
    label: "Client Retention",
    sub: "after the first 3 months",
    accent: "text-violet-400",
    glow: "hover:border-violet-500/30 hover:shadow-violet-500/10",
  },
  {
    icon: <Zap size={20} />,
    value: "< 48h",
    label: "Campaign Launch",
    sub: "from brief to first live ad",
    accent: "text-green-400",
    glow: "hover:border-green-500/30 hover:shadow-green-500/10",
  },
];

export default function Stats() {
  return (
    <section className="relative py-20 border-y border-border/50 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-950/20 via-transparent to-violet-950/20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest mb-12">
          Measurable Results — Not Promises
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className={`group relative rounded-2xl border border-border/60 bg-card/50 p-6 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${stat.glow} gradient-border`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/8 ${stat.accent}`}>
                {stat.icon}
              </div>

              <div className="space-y-1">
                <p className={`text-4xl font-black ${stat.accent}`}>
                  {stat.value}
                </p>
                <p className="font-bold text-white">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { PiggyBank, Clock, Users, Zap } from "lucide-react";

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
    icon: <PiggyBank size={20} />,
    value: "1 000 zł",
    label: "Zaoszczędzisz miesięcznie",
    sub: "tyle kosztuje przeciętna agencja marketingowa",
    accent: "text-green-400",
    glow: "hover:border-green-500/30 hover:shadow-green-500/10",
  },
  {
    icon: <Clock size={20} />,
    value: "6h",
    label: "Do pierwszej kampanii",
    sub: "od zera do działającej reklamy Meta lub Google",
    accent: "text-blue-400",
    glow: "hover:border-blue-500/30 hover:shadow-blue-500/10",
  },
  {
    icon: <Users size={20} />,
    value: "0",
    label: "Wymaganej wiedzy technicznej",
    sub: "kurs zaprojektowany dla właścicieli firm, nie marketerów",
    accent: "text-cyan-400",
    glow: "hover:border-cyan-500/30 hover:shadow-cyan-500/10",
  },
  {
    icon: <Zap size={20} />,
    value: "AI",
    label: "Robi 80% pracy za Ciebie",
    sub: "copy, targetowanie, optymalizacja — wszystko z pomocą AI",
    accent: "text-violet-400",
    glow: "hover:border-violet-500/30 hover:shadow-violet-500/10",
  },
];

export default function Stats() {
  return (
    <section className="relative py-20 border-y border-border/50 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-950/20 via-transparent to-violet-950/20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest mb-12">
          Co konkretnie zyskujesz
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
                <p className={`text-3xl font-black ${stat.accent}`}>{stat.value}</p>
                <p className="font-bold text-white text-sm">{stat.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

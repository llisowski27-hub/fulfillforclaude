import { Facebook, Search, BrainCircuit, CheckCircle } from "lucide-react";

type Service = {
  icon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  title: string;
  tagline: string;
  features: string[];
  glowHover: string;
  borderHover: string;
  badge?: string;
};

const SERVICES: Service[] = [
  {
    icon: <Facebook size={22} />,
    iconBg: "bg-blue-600/15",
    iconBorder: "border-blue-500/30",
    title: "Meta Ads",
    tagline: "Facebook & Instagram campaigns built for local lead gen.",
    features: [
      "Lead Generation & Instant Forms",
      "Lookalike + Retargeting audiences",
      "Creative A/B testing every 2 weeks",
      "Cost-per-lead optimisation",
      "WhatsApp & Messenger CTA flows",
    ],
    glowHover: "hover:shadow-blue-500/15",
    borderHover: "hover:border-blue-500/30",
  },
  {
    icon: <Search size={22} />,
    iconBg: "bg-cyan-500/15",
    iconBorder: "border-cyan-400/30",
    title: "Google Ads",
    tagline: "Capture high-intent buyers searching for you right now.",
    features: [
      "Search + Local Service Ads",
      "Google Maps visibility boost",
      "Performance Max campaigns",
      "Conversion tracking setup",
      "Negative keyword management",
    ],
    glowHover: "hover:shadow-cyan-500/15",
    borderHover: "hover:border-cyan-400/30",
    badge: "High Intent",
  },
  {
    icon: <BrainCircuit size={22} />,
    iconBg: "bg-violet-600/15",
    iconBorder: "border-violet-500/30",
    title: "AI Optimisation",
    tagline: "Your campaigns improve automatically. Every single day.",
    features: [
      "AI bid strategy tuning",
      "Automated audience narrowing",
      "Competitor ad intelligence",
      "Monthly performance reports",
      "CPL forecasting & alerts",
    ],
    glowHover: "hover:shadow-violet-500/15",
    borderHover: "hover:border-violet-500/30",
    badge: "Proprietary",
  },
];

export default function Services() {
  return (
    <section id="uslugi" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            Services
          </p>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Everything you need to{" "}
            <span className="text-gradient-cyber">generate leads.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            No à la carte. No hidden fees. One fixed monthly payment covers
            everything below — strategy, execution, and optimisation.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          {SERVICES.map((svc) => (
            <div
              key={svc.title}
              className={`group relative rounded-2xl border border-border/60 bg-card/60 p-7 space-y-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${svc.glowHover} ${svc.borderHover} gradient-border`}
            >
              {/* Badge */}
              {svc.badge && (
                <div className="absolute top-5 right-5 rounded-full glass-blue px-2.5 py-0.5 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                  {svc.badge}
                </div>
              )}

              {/* Icon */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl border ${svc.iconBg} ${svc.iconBorder} text-white`}
              >
                {svc.icon}
              </div>

              {/* Copy */}
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">{svc.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {svc.tagline}
                </p>
              </div>

              {/* Feature list */}
              <ul className="space-y-2.5">
                {svc.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/80">
                    <CheckCircle size={14} className="text-green-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

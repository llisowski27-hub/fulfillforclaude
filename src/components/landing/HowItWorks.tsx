import { PhoneCall, FileSearch, Rocket, TrendingUp } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: <PhoneCall size={20} />,
    title: "Rozmowa",
    description:
      "15 minut przez telefon. Pytam o Twoją firmę, aktualną sytuację i cel. Na koniec mówię Ci wprost która ścieżka ma dla Ciebie sens — kurs czy audyt.",
    accent: "text-blue-400",
    iconBg: "bg-blue-600/15 border-blue-500/25",
    line: "from-blue-500/40 to-cyan-500/40",
  },
  {
    number: "02",
    icon: <FileSearch size={20} />,
    title: "Diagnoza",
    description:
      "Jeśli masz agencję — robię pełen audyt kampanii w 5 dni. Jeśli startujesz od zera — dostajesz spersonalizowany plan nauki dopasowany do Twojej branży i budżetu.",
    accent: "text-cyan-400",
    iconBg: "bg-cyan-500/15 border-cyan-400/25",
    line: "from-cyan-500/40 to-violet-500/40",
  },
  {
    number: "03",
    icon: <Rocket size={20} />,
    title: "Wdrożenie",
    description:
      "Ścieżka kursu: uczysz się, ćwiczysz, uruchamiasz pierwszą kampanię. Ścieżka audytu: dostajesz raport z konkretnymi rekomendacjami i gotowymi poprawkami dla agencji.",
    accent: "text-violet-400",
    iconBg: "bg-violet-600/15 border-violet-500/25",
    line: "from-violet-500/40 to-green-500/40",
  },
  {
    number: "04",
    icon: <TrendingUp size={20} />,
    title: "Kontrola",
    description:
      "Po wdrożeniu masz pełną kontrolę. Opcjonalnie: miesięczny nadzór (790 zł/mies) — sprawdzam czy wszystko działa, odpowiadam na pytania, korygujemy strategię co 30 dni.",
    accent: "text-green-400",
    iconBg: "bg-green-500/15 border-green-400/25",
    line: null,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="jak-dzialamy"
      className="relative py-24 border-y border-border/50 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            Jak pracujemy
          </p>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Od rozmowy do{" "}
            <span className="text-gradient-blue">pełnej kontroli.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Cztery kroki. Zero zobowiązań długoterminowych. Dokładnie wiesz
            za co płacisz na każdym etapie.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.number} className="relative">
              {step.line && (
                <div
                  className={`hidden lg:block absolute top-8 left-[calc(100%_-_12px)] w-full h-px bg-gradient-to-r ${step.line} z-10`}
                />
              )}
              <div className="relative rounded-2xl border border-border/60 bg-card/50 p-6 space-y-5 h-full gradient-border transition-all hover:border-white/10">
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${step.iconBg} ${step.accent}`}>
                    {step.icon}
                  </div>
                  <span className={`text-5xl font-black opacity-20 ${step.accent}`}>
                    {step.number}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-lg text-white">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

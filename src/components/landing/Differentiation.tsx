import { Eye, BrainCircuit, Shield } from "lucide-react";

const POINTS = [
  {
    icon: <Eye size={24} />,
    iconBg: "bg-blue-600/15 border-blue-500/25",
    accent: "text-blue-400",
    kicker: "Transparentność",
    heading: "Widzisz każdą złotówkę. Każdą decyzję. Każdy lead.",
    body: "Bez znaczenia czy sam prowadzisz kampanie, czy nadzorujemy Twoją agencję — wiesz dokładnie co się dzieje z Twoim budżetem. Koniec z „ufamy że wiedzą co robią\".",
  },
  {
    icon: <BrainCircuit size={24} />,
    iconBg: "bg-cyan-500/15 border-cyan-400/25",
    accent: "text-cyan-400",
    kicker: "AI robi ciężką robotę",
    heading: "Nie musisz być marketerem. Wystarczy że nadzorujesz system.",
    body: "ChatGPT pisze copy. Meta AI sugeruje audiencje. Narzędzia analizują wyniki. Twoja rola to 1–2 godziny tygodniowo — reszta dzieje się automatycznie, a Ty zachowujesz pełną kontrolę.",
  },
  {
    icon: <Shield size={24} />,
    iconBg: "bg-violet-600/15 border-violet-500/25",
    accent: "text-violet-400",
    kicker: "Koniec uzależnienia",
    heading: "Nigdy więcej „miesięcznej opłaty bez końca\".",
    body: "Agencja bierze 1–3 tys. zł miesięcznie w nieskończoność. Nasz kurs kupujesz raz. Nasz audyt kupujesz gdy potrzebujesz. Płacisz za wynik, nie za subskrypcję.",
  },
];

export default function Differentiation() {
  return (
    <section id="efekty" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="space-y-4 max-w-2xl">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            Dlaczego my
          </p>
          <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
            Trzy rzeczy które{" "}
            <br className="hidden sm:block" />
            <span className="text-gradient-violet">agencje wolą ukryć.</span>
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {POINTS.map((pt) => (
            <div
              key={pt.kicker}
              className="group rounded-2xl border border-border/60 bg-card/50 p-8 space-y-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 gradient-border"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${pt.iconBg} ${pt.accent}`}>
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

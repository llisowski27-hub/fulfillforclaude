"use client";

import { useState } from "react";
import {
  Sparkles, BarChart2, AlertTriangle, CheckCircle, TrendingUp,
  Target, MessageSquare, Zap, ArrowRight, Loader2, ChevronDown, ChevronUp
} from "lucide-react";
import Link from "next/link";

type AnalysisResult = {
  score: number;
  summary: string;
  issues: { severity: "high" | "medium" | "low"; text: string }[];
  improvements: string[];
  audience: string;
  estimatedCPL: string;
};

const MOCK_ANALYSIS: AnalysisResult = {
  score: 42,
  summary:
    "Reklama ma kilka poważnych problemów, które znacząco obniżają jej skuteczność. Targetowanie jest zbyt szerokie, brak wyraźnego CTA i headline nie komunikuje konkretnej korzyści dla potencjalnego klienta.",
  issues: [
    { severity: "high", text: "Brak konkretnego CTA (np. 'Zadzwoń teraz', 'Umów wizytę')" },
    { severity: "high", text: "Targetowanie wiekowe 18–65 jest za szerokie dla usługi lokalnej" },
    { severity: "medium", text: "Headline nie zawiera nazwy miasta — brak sygnału lokalności" },
    { severity: "medium", text: "Brak social proof (liczba klientów, lata doświadczenia, opinie)" },
    { severity: "low", text: "Kreacja graficzna nie zatrzymuje uwagi — brak kontrastu i twarzy" },
  ],
  improvements: [
    "Dodaj headline: '[Miasto] — [Usługa] od X zł | Umów termin dziś'",
    "Zawęź grupę docelową do 25–54 lat w promieniu 15 km od gabinetu",
    "Dodaj numer telefonu bezpośrednio w treści reklamy (click-to-call)",
    "Użyj formatu Lead Ads zamiast ruchu na stronę — mniej kroków = więcej leadów",
    "Przetestuj kreację ze zdjęciem właściciela + opinia klienta",
  ],
  audience: "Kobiety 28–48, w promieniu 12 km, zainteresowane zdrowiem i urodą",
  estimatedCPL: "35–75 zł",
};

export default function AnalizaPage() {
  const [input, setInput] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [city, setCity] = useState("");
  const [platform, setPlatform] = useState<"meta" | "google" | "both">("meta");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showAllIssues, setShowAllIssues] = useState(false);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !businessType.trim()) return;

    setLoading(true);
    setResult(null);

    // Simulate AI analysis delay
    await new Promise((r) => setTimeout(r, 2200));

    setResult(MOCK_ANALYSIS);
    setLoading(false);
  }

  const severityConfig = {
    high: { label: "Krytyczny", bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-500" },
    medium: { label: "Ważny", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
    low: { label: "Drobny", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-400" },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-blue-600 text-sm font-semibold">
          <Sparkles size={13} />
          AI Analizator Reklam
        </div>
        <h1 className="text-3xl font-black text-foreground">
          Sprawdź co jest nie tak z Twoimi reklamami
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Opisz swoją firmę i aktualne reklamy (lub wklej tekst reklamy). Nasz system AI wskaże konkretne problemy i poda gotowe poprawki.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleAnalyze} className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-sm">

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Typ biznesu *</label>
            <input
              type="text"
              placeholder="np. dentysta, klinika estetyczna, firma remontowa"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Miasto</label>
            <input
              type="text"
              placeholder="np. Warszawa, Kraków, Poznań"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Platforma reklamowa</label>
          <div className="flex gap-2">
            {(["meta", "google", "both"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                  platform === p
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-border bg-background text-muted-foreground hover:border-gray-300"
                }`}
              >
                {p === "meta" ? "Meta (FB/IG)" : p === "google" ? "Google Ads" : "Obydwie"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">
            Opis reklamy lub sytuacji *
          </label>
          <textarea
            rows={5}
            placeholder={`Przykład: "Nie mamy żadnych reklam, mamy gabinet dentystyczny w Warszawie na Mokotowie, przyjmujemy dorosłych i dzieci. Chcemy zacząć od Meta Ads z budżetem 1000 zł / miesiąc."\n\nLub wklej tekst istniejącej reklamy.`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !input.trim() || !businessType.trim()}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl btn-win py-3.5 text-sm font-bold shadow shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Analizuję...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Analizuj reklamy AI
            </>
          )}
        </button>
      </form>

      {/* Loading state */}
      {loading && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-8 text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-blue-500 mx-auto" />
          <p className="font-semibold text-blue-700">AI analizuje Twoją sytuację...</p>
          <p className="text-sm text-blue-500">Sprawdzam targetowanie, kreacje, CTA i potencjał konwersji</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6">

          {/* Score */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Ocena skuteczności reklam</p>
                <p className="text-4xl font-black text-foreground mt-1">
                  {result.score}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </p>
              </div>
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black ${
                result.score < 50 ? "bg-red-50 text-red-600 border border-red-100"
                : result.score < 70 ? "bg-amber-50 text-amber-600 border border-amber-100"
                : "bg-green-50 text-green-600 border border-green-100"
              }`}>
                {result.score < 50 ? "⚠️" : result.score < 70 ? "📊" : "✅"}
              </div>
            </div>
            <div className="w-full rounded-full bg-gray-100 h-2.5 mb-4">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  result.score < 50 ? "bg-red-500" : result.score < 70 ? "bg-amber-500" : "bg-green-500"
                }`}
                style={{ width: `${result.score}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
          </div>

          {/* Issues */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" />
              <h3 className="font-bold text-foreground">Wykryte problemy</h3>
              <span className="ml-auto text-xs text-muted-foreground">{result.issues.length} problemów</span>
            </div>
            <div className="space-y-2.5">
              {(showAllIssues ? result.issues : result.issues.slice(0, 3)).map((issue, i) => {
                const cfg = severityConfig[issue.severity];
                return (
                  <div key={i} className={`flex items-start gap-3 rounded-xl border ${cfg.border} ${cfg.bg} p-3.5`}>
                    <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-bold ${cfg.text} mr-2`}>{cfg.label}</span>
                      <span className="text-sm text-foreground">{issue.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {result.issues.length > 3 && (
              <button
                onClick={() => setShowAllIssues(!showAllIssues)}
                className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showAllIssues ? (
                  <><ChevronUp size={14} /> Pokaż mniej</>
                ) : (
                  <><ChevronDown size={14} /> Pokaż {result.issues.length - 3} więcej</>
                )}
              </button>
            )}
          </div>

          {/* Improvements */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-green-600" />
              <h3 className="font-bold text-foreground">Gotowe poprawki</h3>
            </div>
            <ol className="space-y-2.5">
              {result.improvements.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-black mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Audience + CPL */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Target size={15} />
                Rekomendowana grupa docelowa
              </div>
              <p className="text-sm font-bold text-foreground">{result.audience}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <BarChart2 size={15} />
                Szacowany koszt za lead (CPL)
              </div>
              <p className="text-2xl font-black text-foreground">{result.estimatedCPL}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-blue-600 p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg shadow-blue-600/20">
            <div className="text-center sm:text-left">
              <p className="text-white font-black text-lg">Chcesz żebym to naprawił za Ciebie?</p>
              <p className="text-blue-100 text-sm mt-1">
                15-minutowa rozmowa, zero zobowiązań. Pokażę konkretny plan dla Twojej firmy.
              </p>
            </div>
            <Link
              href="/konsultacja"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow transition-all hover:scale-[1.02] hover:shadow-md whitespace-nowrap shrink-0"
            >
              Umów rozmowę
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}

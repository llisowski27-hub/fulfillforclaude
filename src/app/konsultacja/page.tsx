"use client";

import { useState } from "react";
import { Phone, Clock, CheckCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";

type FormState = "idle" | "loading" | "success";

const BUSINESS_TYPES = [
  "Dentysta / stomatologia",
  "Klinika estetyczna / medycyna estetyczna",
  "Firma remontowa / budowlana",
  "Salon fryzjerski / kosmetyczny",
  "Fizjoterapeuta / rehabilitacja",
  "Kancelaria prawna",
  "Gastronomia / restauracja",
  "Nieruchomości",
  "Trener personalny / siłownia",
  "Inny",
];

export default function KonsultacjaPage() {
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "",
    city: "",
    budget: "",
    message: "",
    hasAds: "",
  });

  function setField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    // Simulate form submission
    await new Promise((r) => setTimeout(r, 1500));
    setState("success");
  }

  if (state === "success") {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-16">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 border border-green-100 mx-auto">
          <CheckCircle size={36} className="text-green-500" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-black text-foreground">Gotowe! Odezwę się do Ciebie</h1>
          <p className="text-muted-foreground leading-relaxed">
            Twoje zgłoszenie dotarło. Odezwę się do <strong>{form.email || form.phone}</strong> w ciągu 24 godzin, żeby umówić 15-minutową rozmowę.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 text-left space-y-3 shadow-sm">
          <p className="text-sm font-semibold text-foreground">Co będzie na rozmowie:</p>
          <ul className="space-y-2">
            {[
              "Krótka analiza Twojej sytuacji reklamowej",
              "Konkretny plan działania dla Twojej branży i miasta",
              "Szacowany koszt za lead i możliwy budżet startowy",
              "Odpowiedzi na wszystkie Twoje pytania",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Wróć na stronę główną
          <ArrowRight size={14} />
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-blue-600 text-sm font-semibold">
          <Sparkles size={13} />
          Bezpłatna konsultacja
        </div>
        <h1 className="text-3xl font-black text-foreground">
          Umów 15-minutową rozmowę
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Powiedz mi krótko o swojej firmie. Pokażę co konkretnie zrobiłbym z Twoimi reklamami — bez zobowiązań, bez bullshitu.
        </p>

        {/* What to expect */}
        <div className="grid gap-3 sm:grid-cols-3 pt-2">
          {[
            { icon: <Clock size={15} className="text-blue-600" />, text: "15 minut rozmowy" },
            { icon: <CheckCircle size={15} className="text-green-600" />, text: "Bez zobowiązań" },
            { icon: <Phone size={15} className="text-blue-600" />, text: "Przez telefon lub Zoom" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm">
              {item.icon}
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-sm">

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Imię *</label>
            <input
              type="text"
              placeholder="Jan Kowalski"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Miasto *</label>
            <input
              type="text"
              placeholder="Warszawa"
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Email *</label>
            <input
              type="email"
              placeholder="jan@firma.pl"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Telefon</label>
            <input
              type="tel"
              placeholder="+48 500 000 000"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Typ biznesu *</label>
          <select
            value={form.businessType}
            onChange={(e) => setField("businessType", e.target.value)}
            required
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
          >
            <option value="">Wybierz branżę...</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Miesięczny budżet na reklamy (opcjonalnie)</label>
          <div className="flex gap-2 flex-wrap">
            {["Brak / nie wiem", "do 1 000 zł", "1 000–3 000 zł", "3 000–10 000 zł", "10 000+ zł"].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setField("budget", b)}
                className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                  form.budget === b
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-border bg-background text-muted-foreground hover:border-gray-300"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Czy aktualnie prowadzisz reklamy?</label>
          <div className="flex gap-2">
            {["Nie, brak reklam", "Tak, na Facebooku", "Tak, na Google", "Tak, na obu"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setField("hasAds", opt)}
                className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition-all ${
                  form.hasAds === opt
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-border bg-background text-muted-foreground hover:border-gray-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Co chcesz osiągnąć? (opcjonalnie)</label>
          <textarea
            rows={3}
            placeholder="np. Chcę zdobywać więcej pacjentów na wybielanie zębów. Mam gabinet na Mokotowie, przyjmuję od poniedziałku do piątku."
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={state === "loading"}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl btn-win py-3.5 text-sm font-bold shadow shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {state === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Wysyłanie...
            </>
          ) : (
            <>
              <Phone size={15} />
              Umów bezpłatną rozmowę
              <ArrowRight size={14} />
            </>
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          Odpowiadam w ciągu 24 godzin. Nie sprzedaję i nie udostępniam Twoich danych.
        </p>
      </form>

    </div>
  );
}

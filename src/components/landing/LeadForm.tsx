"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle, ArrowRight, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitLeadAction, leadSchema, type LeadFormValues } from "@/app/actions/lead";

const BUDGETS = [
  "Nie wiem jeszcze",
  "Chcę się uczyć sam (kurs)",
  "Mam już agencję — chcę audyt",
  "Wydaję do 1 000 zł / mies.",
  "Wydaję 1 000–3 000 zł / mies.",
  "Wydaję 3 000+ zł / mies.",
];

export default function LeadForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  async function onSubmit(data: LeadFormValues) {
    setServerError(null);
    const result = await submitLeadAction(data);

    if (result.success) {
      setSubmitted(true);
    } else {
      setServerError(result.error);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-500/20 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
            <CheckCircle size={36} className="text-green-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white">Zapisane.</h3>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            Odezwę się w ciągu 24 godzin żeby ustalić termin rozmowy.
            Dostaniesz też krótki mail z pytaniami, żeby 15 minut było
            maksymalnie konkretne.
          </p>
        </div>
        <div className="glass-blue rounded-xl px-6 py-4 text-left space-y-2.5 max-w-sm w-full">
          <p className="text-xs font-bold text-blue-300 uppercase tracking-wider">
            Co ustalimy na rozmowie
          </p>
          {[
            "Która ścieżka ma dla Ciebie sens — kurs czy audyt",
            "Konkretny plan działania dla Twojej branży",
            "Realistyczny koszt pozyskania klienta w Twoim mieście",
            "Odpowiedzi na Twoje pytania — zero sprzedaży",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <CheckCircle size={13} className="text-blue-400 mt-0.5 shrink-0" />
              <p className="text-sm text-foreground/80">{item}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Name + Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Imię *</Label>
          <Input
            id="name"
            placeholder="Jan Kowalski"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle size={11} />
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="jan@firma.pl"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle size={11} />
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Company */}
      <div className="space-y-1.5">
        <Label htmlFor="company">Nazwa firmy *</Label>
        <Input
          id="company"
          placeholder="np. Dentysta Kowalski Warszawa"
          aria-invalid={!!errors.company}
          {...register("company")}
        />
        {errors.company && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle size={11} />
            {errors.company.message}
          </p>
        )}
      </div>

      {/* Budget */}
      <div className="space-y-1.5">
        <Label>Twoja sytuacja *</Label>
        <Select
          onValueChange={(val) =>
            setValue("budget", val, { shouldValidate: true })
          }
        >
          <SelectTrigger aria-invalid={!!errors.budget}>
            <SelectValue placeholder="Wybierz..." />
          </SelectTrigger>
          <SelectContent>
            {BUDGETS.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.budget && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle size={11} />
            {errors.budget.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="message">
          Coś jeszcze?{" "}
          <span className="text-muted-foreground">(opcjonalnie)</span>
        </Label>
        <Textarea
          id="message"
          placeholder="np. Gabinet stomatologiczny w Warszawie. Mam agencję która bierze 2 500 zł/mies i nie wiem czy to opłacalne."
          rows={4}
          {...register("message")}
        />
      </div>

      {/* Server error */}
      {serverError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          <AlertCircle size={15} className="shrink-0" />
          {serverError}
        </div>
      )}

      <Button
        type="submit"
        size="xl"
        variant="primary"
        disabled={isSubmitting}
        className="w-full glow-blue-sm"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Wysyłanie...
          </>
        ) : (
          <>
            Umów bezpłatną rozmowę
            <ArrowRight size={15} />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Odpowiadam w ciągu 24 godzin. Twoich danych nigdy nie sprzedaję.
      </p>
    </form>
  );
}

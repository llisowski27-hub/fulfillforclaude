import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = { title: "Zamówienie złożone — The Liquidator" };

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 size={36} className="text-emerald-600" />
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          Zamówienie złożone!
        </h1>
        <p className="text-sm text-muted-foreground">
          Numer zamówienia:{" "}
          <span className="font-mono font-semibold text-foreground">
            {id.slice(0, 8).toUpperCase()}
          </span>
        </p>
      </div>

      <p className="text-sm text-muted-foreground max-w-sm">
        Dziękujemy za zakupy. Potwierdzenie zostanie wysłane na podany adres
        email.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Kontynuuj zakupy
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/account"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
        >
          Moje zamówienia
        </Link>
      </div>
    </div>
  );
}

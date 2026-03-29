"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowRight, Lock } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { useUser } from "@/hooks/useUser";
import { createOrderAction } from "@/actions/checkout";
import { CheckoutSchema, type CheckoutFormData } from "@/types/checkout";

const PLN = (n: number) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
  }).format(n);

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalItems, clear } = useCart();
  const { user, loading: authLoading } = useUser();
  const shipping = subtotal > 0 ? 19.99 : 0;
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutSchema),
  });

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?next=/checkout");
    }
  }, [authLoading, user, router]);

  async function onSubmit(data: CheckoutFormData) {
    const result = await createOrderAction({
      form: data,
      items: items.map((i) => ({ listing_id: i.id, quantity: i.quantity })),
    });

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    clear();
    toast.success("Zamówienie złożone!");
    router.push(`/order/${result.orderId}/success`);
  }

  if (items.length === 0 || (!authLoading && !user)) return null; // redirecting

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Finalizacja zamówienia
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── Shipping form ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h2 className="text-base font-semibold text-foreground">
                Dane dostawy
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Imię i nazwisko"
                  error={errors.name?.message}
                  required
                >
                  <input
                    {...register("name")}
                    placeholder="Jan Kowalski"
                    className={inputCls(!!errors.name)}
                  />
                </Field>

                <Field label="Email" error={errors.email?.message} required>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="jan@example.pl"
                    className={inputCls(!!errors.email)}
                  />
                </Field>
              </div>

              <Field
                label="Ulica i numer"
                error={errors.street?.message}
                required
              >
                <input
                  {...register("street")}
                  placeholder="ul. Przykładowa 1/2"
                  className={inputCls(!!errors.street)}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Miasto" error={errors.city?.message} required>
                  <input
                    {...register("city")}
                    placeholder="Warszawa"
                    className={inputCls(!!errors.city)}
                  />
                </Field>

                <Field
                  label="Kod pocztowy"
                  error={errors.postal?.message}
                  required
                >
                  <input
                    {...register("postal")}
                    placeholder="00-001"
                    maxLength={6}
                    className={inputCls(!!errors.postal)}
                  />
                </Field>
              </div>

              <Field label="Telefon" error={errors.phone?.message}>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="+48 123 456 789"
                  className={inputCls(!!errors.phone)}
                />
              </Field>

              <Field label="Uwagi do zamówienia" error={errors.notes?.message}>
                <textarea
                  {...register("notes")}
                  rows={3}
                  placeholder="Opcjonalne uwagi dla sprzedającego..."
                  className={inputCls(!!errors.notes) + " resize-none"}
                />
              </Field>
            </div>
          </div>

          {/* ── Sticky summary ─────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 space-y-4">
              <h2 className="text-base font-semibold text-foreground">
                Twoje zamówienie
              </h2>

              {/* Items */}
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="text-muted-foreground line-clamp-1 flex-1">
                      {item.title}{" "}
                      {item.quantity > 1 && (
                        <span className="text-xs">×{item.quantity}</span>
                      )}
                    </span>
                    <span className="font-medium shrink-0">
                      {PLN(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 space-y-1.5 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Produkty ({totalItems})</span>
                  <span>{PLN(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wysyłka</span>
                  <span>{PLN(shipping)}</span>
                </div>
              </div>

              <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground">
                <span>Razem</span>
                <span className="text-lg">{PLN(total)}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Przetwarzanie...
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    Złóż zamówienie
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Dane są walidowane po stronie serwera przed złożeniem zamówienia.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────
function inputCls(hasError: boolean) {
  return [
    "w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground",
    "outline-none transition-all",
    "focus:ring-2 focus:ring-primary/20",
    hasError
      ? "border-destructive focus:border-destructive"
      : "border-border focus:border-primary",
  ].join(" ");
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

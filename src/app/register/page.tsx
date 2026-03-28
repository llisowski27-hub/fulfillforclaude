"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { registerAction } from "@/actions/auth";
import { RegisterSchema, type RegisterFormData } from "@/types/auth";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(RegisterSchema) });

  async function onSubmit(data: RegisterFormData) {
    const result = await registerAction(data);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Konto utworzone! Możesz się teraz zalogować.");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Utwórz konto</h1>
          <p className="text-sm text-muted-foreground">
            Masz już konto?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Zaloguj się
            </Link>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm"
        >
          <Field label="Imię i nazwisko" error={errors.display_name?.message}>
            <input
              {...register("display_name")}
              placeholder="Jan Kowalski"
              autoComplete="name"
              className={inputCls(!!errors.display_name)}
            />
          </Field>

          <Field label="Email" error={errors.email?.message}>
            <input
              {...register("email")}
              type="email"
              placeholder="jan@example.pl"
              autoComplete="email"
              className={inputCls(!!errors.email)}
            />
          </Field>

          <Field label="Hasło" error={errors.password?.message}>
            <input
              {...register("password")}
              type="password"
              placeholder="Minimum 8 znaków"
              autoComplete="new-password"
              className={inputCls(!!errors.password)}
            />
          </Field>

          <Field label="Powtórz hasło" error={errors.confirm_password?.message}>
            <input
              {...register("confirm_password")}
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              className={inputCls(!!errors.confirm_password)}
            />
          </Field>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <UserPlus size={16} />
            )}
            {isSubmitting ? "Tworzenie konta..." : "Zarejestruj się"}
          </button>
        </form>
      </div>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground",
    "outline-none transition-all focus:ring-2 focus:ring-primary/20",
    hasError
      ? "border-destructive focus:border-destructive"
      : "border-border focus:border-primary",
  ].join(" ");
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

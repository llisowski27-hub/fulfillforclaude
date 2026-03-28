"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { LoginSchema, RegisterSchema } from "@/types/auth";
import type { AuthResult } from "@/types/auth";

export async function loginAction(payload: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const parsed = LoginSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Nieprawidłowy email lub hasło." };
  }

  return {};
}

export async function registerAction(payload: {
  display_name: string;
  email: string;
  password: string;
  confirm_password: string;
}): Promise<AuthResult> {
  const parsed = RegisterSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Ten email jest już zarejestrowany." };
    }
    return { error: error.message };
  }

  // Create user profile immediately (requires auto-confirm enabled in Supabase)
  if (data.user) {
    await supabase.from("user_profiles").insert({
      id: data.user.id,
      display_name: parsed.data.display_name,
    });
  }

  return {};
}

export async function logoutAction(): Promise<void> {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
}

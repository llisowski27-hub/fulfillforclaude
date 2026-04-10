"use server";

import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Imię musi mieć min. 2 znaki"),
  email: z.string().email("Podaj poprawny adres email"),
  company: z.string().min(1, "Podaj nazwę firmy"),
  budget: z.string().min(1, "Wybierz miesięczny budżet"),
  message: z.string().max(1000).optional(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;

export type LeadActionResult =
  | { success: true }
  | { success: false; error: string };

export async function submitLeadAction(
  data: LeadFormValues
): Promise<LeadActionResult> {
  const parsed = leadSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Nieprawidłowe dane",
    };
  }

  try {
    // TODO: persist to DB or forward to CRM / email
    // e.g. await saveLeadToSupabase(parsed.data);
    // For now we log and return success
    console.log("[Lead]", new Date().toISOString(), parsed.data);

    return { success: true };
  } catch {
    return { success: false, error: "Błąd serwera. Spróbuj ponownie." };
  }
}

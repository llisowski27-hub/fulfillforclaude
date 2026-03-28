import { z } from "zod";

export const CheckoutSchema = z.object({
  name: z
    .string()
    .min(3, "Imię i nazwisko — minimum 3 znaki")
    .max(120),
  email: z
    .string()
    .email("Nieprawidłowy adres email"),
  street: z
    .string()
    .min(5, "Podaj ulicę i numer budynku")
    .max(200),
  city: z
    .string()
    .min(2, "Podaj nazwę miasta")
    .max(100),
  postal: z
    .string()
    .regex(/^\d{2}-\d{3}$/, "Format: XX-XXX (np. 00-001)"),
  phone: z
    .string()
    .regex(/^(\+?\d[\d\s\-]{7,14})?$/, "Nieprawidłowy numer telefonu")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(500, "Notatka max 500 znaków")
    .optional()
    .or(z.literal("")),
});

export type CheckoutFormData = z.infer<typeof CheckoutSchema>;

// Payload sent from client to server action
export type CheckoutPayload = {
  form: CheckoutFormData;
  items: { listing_id: string; quantity: number }[];
};

export type CheckoutResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  password: z.string().min(6, "Minimum 6 znaków"),
});

export const RegisterSchema = z
  .object({
    display_name: z
      .string()
      .min(2, "Minimum 2 znaki")
      .max(60, "Maksimum 60 znaków"),
    email: z.string().email("Nieprawidłowy adres email"),
    password: z.string().min(8, "Minimum 8 znaków"),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Hasła nie są zgodne",
    path: ["confirm_password"],
  });

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;

export type AuthResult = { error?: string };

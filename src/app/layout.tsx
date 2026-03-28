import type { Metadata } from "next";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Liquidator — Marketplace",
  description: "Marketplace z aukcjami w czasie rzeczywistym i systemem kup teraz.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

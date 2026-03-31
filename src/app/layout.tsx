import type { Metadata } from "next";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import { CartProvider } from "@/components/cart/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liqware — Platforma aukcyjna dla firm",
  description: "Platforma aukcyjna i sprzedażowa do zarządzania nadwyżkami magazynowymi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        <CartProvider>
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Toaster richColors position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}

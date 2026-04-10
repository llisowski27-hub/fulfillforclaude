import type { Metadata } from "next";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liqware — AI Marketing Agency | Meta & Google Ads",
  description:
    "We generate predictable leads for local Polish businesses via Meta Ads and Google Ads. AI-first approach, fixed monthly fee, measurable ROI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground overflow-x-hidden">
        <Navbar />
        <main>{children}</main>
        <Toaster richColors position="top-right" theme="dark" />
      </body>
    </html>
  );
}

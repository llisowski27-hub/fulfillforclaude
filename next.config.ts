// ============================================================
// THE LIQUIDATOR — Next.js Config
// next.config.ts
// ============================================================
// Standalone output — produkcja bez Vercela.
// Build generuje self-contained folder w .next/standalone
// z własnym server.js (Node.js).
// ============================================================

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Obrazki z zewnętrznych źródeł (listings)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Wyłącz source maps w produkcji (bezpieczeństwo)
  productionBrowserSourceMaps: false,

  // Strict mode dla lepszego debugowania
  reactStrictMode: true,

  // Supabase Realtime wymaga WebSocket — nie blokuj
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;

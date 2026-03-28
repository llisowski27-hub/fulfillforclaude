import { describe, it, expect } from "vitest";
import { getSupabaseBrowserClient } from "./client";

const hasCredentials = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

describe.skipIf(!hasCredentials)("Supabase browser client", () => {
  it("returns the same instance on repeated calls (singleton)", () => {
    const a = getSupabaseBrowserClient();
    const b = getSupabaseBrowserClient();
    expect(a).toBe(b);
  });

  it("exposes a .from() query method", () => {
    const client = getSupabaseBrowserClient();
    expect(typeof client.from).toBe("function");
  });
});

describe.skipIf(!hasCredentials)("Supabase DB connectivity", () => {
  it("fetches listings count from DB", async () => {
    const client = getSupabaseBrowserClient();
    const { count, error } = await client
      .from("listings")
      .select("*", { count: "exact", head: true });

    expect(error).toBeNull();
    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

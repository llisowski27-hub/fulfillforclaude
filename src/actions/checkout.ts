"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { CheckoutSchema } from "@/types/checkout";
import type { CheckoutPayload, CheckoutResult } from "@/types/checkout";

export async function createOrderAction(
  payload: CheckoutPayload
): Promise<CheckoutResult> {
  // ── 1. Server-side form validation ───────────────────────────
  const parsed = CheckoutSchema.safeParse(payload.form);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return { success: false, error: first.message };
  }

  if (!payload.items || payload.items.length === 0) {
    return { success: false, error: "Koszyk jest pusty." };
  }

  const { name, street, city, postal, phone, notes } = parsed.data;

  const supabase = await getSupabaseServerClient();

  // ── 2. Auth check ─────────────────────────────────────────────
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      error: "Musisz być zalogowany, aby złożyć zamówienie.",
    };
  }

  // ── 3. Fetch verified prices from DB (never trust client prices) ──
  const listingIds = payload.items.map((i) => i.listing_id);
  const { data: listings, error: listingsError } = await supabase
    .from("listings")
    .select("id, buy_now_price, quantity_available, is_active, status")
    .in("id", listingIds);

  if (listingsError || !listings) {
    return { success: false, error: "Błąd odczytu ofert z bazy danych." };
  }

  // ── 4. Validate each item against live listing data ───────────
  for (const item of payload.items) {
    const listing = listings.find((l) => l.id === item.listing_id);
    if (!listing) {
      return { success: false, error: `Oferta ${item.listing_id} nie istnieje.` };
    }
    if (!listing.is_active || listing.status !== "active") {
      return { success: false, error: "Jedna z ofert nie jest już aktywna." };
    }
    if (listing.quantity_available < item.quantity) {
      return {
        success: false,
        error: `Niewystarczająca ilość dla jednej z ofert (dostępne: ${listing.quantity_available}).`,
      };
    }
    if (listing.buy_now_price === null) {
      return { success: false, error: "Jedna z ofert nie ma ceny kup teraz." };
    }
  }

  // ── 5. Build items JSONB with server-verified prices ──────────
  const itemsJson = payload.items.map((item) => {
    const listing = listings.find((l) => l.id === item.listing_id)!;
    return {
      listing_id: item.listing_id,
      quantity: item.quantity,
      unit_price: Number(listing.buy_now_price),
      source_type: "buy_now",
      bid_id: null,
    };
  });

  // ── 6. Call atomic RPC ────────────────────────────────────────
  const { data: orderId, error: rpcError } = await supabase.rpc(
    "create_order_atomic",
    {
      p_user_id: user.id,
      p_shipping_name: name,
      p_shipping_street: street,
      p_shipping_city: city,
      p_shipping_postal: postal,
      p_shipping_country: "PL",
      p_shipping_phone: phone || null,
      p_notes: notes || null,
      p_items: JSON.stringify(itemsJson),
    }
  );

  if (rpcError) {
    return {
      success: false,
      error: rpcError.message ?? "Błąd tworzenia zamówienia.",
    };
  }

  return { success: true, orderId: orderId as string };
}

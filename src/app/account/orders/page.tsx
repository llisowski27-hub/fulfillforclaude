import { getUserOrders } from "@/lib/supabase/queries/account";
import { ShoppingBag, Package } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Moje zamówienia — The Liquidator" };

const STATUS_LABEL: Record<string, string> = {
  pending: "Oczekuje",
  confirmed: "Potwierdzone",
  shipped: "Wysłane",
  delivered: "Dostarczone",
  cancelled: "Anulowane",
};

const STATUS_COLOR: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped:   "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pl-PL", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(amount);
}

export default async function AccountOrdersPage() {
  const orders = await getUserOrders();

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl bg-card border border-border p-12 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag size={28} className="text-muted-foreground" />
        </div>
        <p className="text-foreground font-medium">Brak zamówień</p>
        <p className="mt-1 text-sm text-muted-foreground">Nie złożyłeś jeszcze żadnego zamówienia.</p>
        <Link href="/catalog"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow hover:opacity-90 transition-opacity">
          Przeglądaj katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const statusLabel = STATUS_LABEL[order.status] ?? order.status;
        const statusColor = STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-700";
        const itemCount = Array.isArray(order.items) ? order.items.length : 0;

        return (
          <div key={order.id} className="rounded-2xl bg-card border border-border p-6 shadow-sm hover:shadow-md hover:border-rose-200 transition-all">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusColor}`}>
                {statusLabel}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package size={15} />
                {itemCount === 1 ? "1 produkt" : `${itemCount} produkty/ów`}
              </div>
              <div className="flex items-center gap-4">
                <p className="text-base font-black bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
                  {formatPrice(order.total_amount)}
                </p>
                <Link href={`/order/${order.id}/success`}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-rose-300 hover:text-rose-600 transition-colors">
                  Szczegóły
                </Link>
              </div>
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
              {order.shipping_name} · {order.shipping_street}, {order.shipping_city} {order.shipping_postal}
            </div>
          </div>
        );
      })}
    </div>
  );
}

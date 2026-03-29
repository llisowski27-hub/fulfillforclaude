import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import AccountTabs from "@/components/account/AccountTabs";

export const metadata = { title: "Moje konto — The Liquidator" };

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/login?next=/account/orders");

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Moje konto</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <AccountTabs />
        {children}
      </div>
    </div>
  );
}

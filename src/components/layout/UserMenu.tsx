"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { useState } from "react";

export function UserMenu({ email }: { email: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await logoutAction();
    router.push("/");
    router.refresh();
  }

  const short = email.split("@")[0].slice(0, 14);

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/account/orders"
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        title="Moje konto"
      >
        <User size={14} />
        <span className="max-w-[120px] truncate">{short}</span>
      </Link>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50"
        title="Wyloguj"
      >
        <LogOut size={14} />
        Wyloguj
      </button>
    </div>
  );
}

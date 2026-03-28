"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function formatCountdown(endTime: string): string {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return "Zakończona";

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function CountdownBadge({ endTime }: { endTime: string }) {
  const [text, setText] = useState(() => formatCountdown(endTime));

  useEffect(() => {
    const id = setInterval(() => setText(formatCountdown(endTime)), 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const isUrgent =
    new Date(endTime).getTime() - Date.now() < 10 * 60 * 1000; // < 10 min

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        isUrgent ? "text-red-500" : "text-muted-foreground"
      }`}
    >
      <Clock size={11} />
      {text}
    </span>
  );
}

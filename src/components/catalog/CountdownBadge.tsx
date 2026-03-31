"use client";

import { useEffect, useState } from "react";
import { Clock, Flame } from "lucide-react";

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

  const msLeft = new Date(endTime).getTime() - Date.now();
  const isUrgent = msLeft < 60 * 60 * 1000 && msLeft > 0;
  const isCritical = msLeft < 60 * 1000 && msLeft > 0;

  if (isCritical) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 animate-pulse">
        <Flame size={11} />
        {text}
      </span>
    );
  }

  if (isUrgent) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500">
        <Flame size={11} />
        {text}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
      <Clock size={11} />
      {text}
    </span>
  );
}

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Camera, ChevronDown } from "lucide-react";

const CATEGORIES = [
  "Wszystkie kategorie",
  "Elektronika",
  "Motoryzacja",
  "Narzędzia",
  "AGD / RTV",
  "Części zamienne",
  "Inne",
];

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Wszystkie kategorie");
  const [catOpen, setCatOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category !== "Wszystkie kategorie") params.set("category", category);
    router.push(`/catalog${params.toString() ? "?" + params.toString() : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-stretch h-10 w-full max-w-2xl">
      {/* Input */}
      <div className="relative flex flex-1 items-center border border-gray-300 rounded-l-xl bg-white overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20 transition-all">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="czego szukasz?"
          className="flex-1 h-full px-3 text-sm text-foreground bg-transparent outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center gap-1 pr-2 text-muted-foreground">
          <button type="button" className="p-1 rounded hover:text-foreground transition-colors" title="Szukaj po liście">
            <Search size={14} />
          </button>
          <button type="button" className="p-1 rounded hover:text-foreground transition-colors" title="Szukaj po zdjęciu">
            <Camera size={14} />
          </button>
        </div>
      </div>

      {/* Category picker */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setCatOpen((v) => !v)}
          className="flex items-center gap-1.5 h-full px-3 border-t border-b border-r border-gray-300 bg-gray-50 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
        >
          <span className="max-w-[120px] truncate">{category}</span>
          <ChevronDown size={12} className={`transition-transform ${catOpen ? "rotate-180" : ""}`} />
        </button>

        {catOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 rounded-xl border border-gray-200 bg-white shadow-lg z-50 py-1 animate-slide-down">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setCategory(cat); setCatOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-blue-50 hover:text-blue-700 ${
                  cat === category ? "text-blue-700 font-semibold bg-blue-50" : "text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="px-5 rounded-r-xl btn-win text-sm font-black tracking-wide hover:scale-[1.02] transition-all shadow-sm"
      >
        SZUKAJ
      </button>
    </form>
  );
}

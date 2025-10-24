import React, { useEffect, useState } from "react";

/**
 * ReactionButton (localStorage)
 * - Botón simple para añadir reacciones a un `scopeKey`.
 * - Ideal para pruebas locales: abre un "selector" simple de emojis comunes
 *   y también permite pegar cualquiera en el input.
 */

const STORAGE_KEY = "evolme_reactions_counts_v2";

function loadCounts(scopeKey) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${scopeKey}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCounts(scopeKey, counts) {
  try {
    localStorage.setItem(`${STORAGE_KEY}:${scopeKey}`, JSON.stringify(counts));
  } catch {}
}

export default function ReactionButton({ scopeKey, className = "" }) {
  const [counts, setCounts] = useState({});
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");

  useEffect(() => {
    setCounts(loadCounts(scopeKey));
  }, [scopeKey]);

  useEffect(() => {
    saveCounts(scopeKey, counts);
  }, [scopeKey, counts]);

  function increment(emoji) {
    if (!emoji) return;
    setCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] ?? 0) + 1 }));
    setCustom("");
    setOpen(false);
  }

  const suggested = ["❤️", "😊", "✅", "🔥", "💪", "👏", "✨", "🧠", "⚡️", "🌱", "🚀"];

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-xl border border-neutral-200 px-3 py-2 text-sm shadow-sm hover:bg-neutral-50 active:scale-[0.98]"
      >
        Reaccionar
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-2xl border border-neutral-200 bg-white p-3 shadow-lg">
          <div className="mb-2 text-xs text-neutral-500">
            Elige un emoji o pega el tuyo:
          </div>
          <div className="mb-2 flex flex-wrap gap-2">
            {suggested.map((e) => (
              <button
                key={e}
                onClick={() => increment(e)}
                className="rounded-2xl border border-neutral-200 px-3 py-2 text-xl shadow-sm hover:bg-neutral-50 active:scale-[0.98]"
              >
                {e}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Pega/teclea un emoji…"
              className="h-9 flex-1 rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
            />
            <button
              onClick={() => increment(custom.trim())}
              className="h-9 rounded-xl bg-black px-3 text-sm font-medium text-white shadow-sm hover:opacity-90 active:scale-[0.98]"
            >
              Añadir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

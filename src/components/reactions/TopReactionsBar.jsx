import React, { useEffect, useMemo, useState } from "react";

/**
 * TopReactionsBar (localStorage)
 * - Muestra SOLO los 3 emojis más votados.
 * - Si NO hay votos, muestra 3 🙂 por defecto.
 * - Alineado a la derecha, sin contadores.
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

export function TopReactionsBar({ scopeKey, reactions, className = "" }) {
  const [localCounts, setLocalCounts] = useState({});

  useEffect(() => {
    if (!reactions) {
      setLocalCounts(loadCounts(scopeKey));
    }
  }, [scopeKey, reactions]);

  const top3 = useMemo(() => {
    const entries = reactions
      ? reactions.map((r) => [r.emoji, r.count])
      : Object.entries(localCounts);

    const withVotes = entries.filter(([, count]) => (count ?? 0) > 0);

    // ✅ Si no hay votos → mostrar 🙂🙂🙂
    if (withVotes.length === 0) {
      return ["🙂", "🙂", "🙂"];
    }

    // Ordenar por más votados
    withVotes.sort((a, b) => {
      const diff = (b[1] ?? 0) - (a[1] ?? 0);
      if (diff !== 0) return diff;
      return a[0].localeCompare(b[0]);
    });

    return withVotes.slice(0, 3).map(([emoji]) => emoji);
  }, [reactions, localCounts]);

  return (
    <div
      className={`flex items-center justify-end gap-2 text-2xl md:text-3xl ${className}`}
      aria-label="Top 3 reactions"
    >
      {top3.map((emoji, i) => (
        <span
          key={`${emoji}-${i}`}
          className="select-none"
          role="img"
          aria-label={`Reaction ${emoji}`}
          title={emoji}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

export default TopReactionsBar;

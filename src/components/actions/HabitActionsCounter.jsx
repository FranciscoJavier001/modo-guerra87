import React, { useEffect, useState } from "react";

/**
 * HabitActionsCounter
 * - Muestra contador superior (👍 N   👎 M) para un scopeKey (habit:ID).
 * - Lee de localStorage y se actualiza cuando HabitActionsButtons emite
 *   el evento global "habit-actions-updated".
 */

const COUNTS_KEY = "evolme_habit_actions_counts_v1"; // { likes: number, dislikes: number }

function loadCounts(scopeKey) {
  try {
    const raw = localStorage.getItem(`${COUNTS_KEY}:${scopeKey}`);
    return raw ? JSON.parse(raw) : { likes: 0, dislikes: 0 };
  } catch {
    return { likes: 0, dislikes: 0 };
  }
}

export default function HabitActionsCounter({ scopeKey, className = "" }) {
  const [counts, setCounts] = useState({ likes: 0, dislikes: 0 });

  const refresh = () => setCounts(loadCounts(scopeKey));

  useEffect(() => {
    refresh();
  }, [scopeKey]);

  useEffect(() => {
    const handler = (ev) => {
      // Solo refresca si el evento corresponde a este scopeKey
      if (ev?.detail?.scopeKey === scopeKey) refresh();
    };
    window.addEventListener("habit-actions-updated", handler);
    return () => window.removeEventListener("habit-actions-updated", handler);
  }, [scopeKey]);

  return (
    <div className={`text-sm text-gray-500 select-none ${className}`}>
      👍🏻 {counts.likes} &nbsp;&nbsp; 👎🏻 {counts.dislikes} &nbsp;&nbsp; 🤙🏻 {counts.likes} &nbsp;&nbsp; 
    </div>
  );
}

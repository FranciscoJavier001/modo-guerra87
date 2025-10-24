import React, { useEffect, useState } from "react";

const COUNTS_KEY = "evolme_habit_actions_counts_v2";

function loadCounts(scopeKey) {
  try {
    const raw = localStorage.getItem(`${COUNTS_KEY}:${scopeKey}`);
    return raw ? JSON.parse(raw) : { likes: 0, dislikes: 0, shares: 0 };
  } catch { return { likes: 0, dislikes: 0, shares: 0 }; }
}

export default function HabitActionsCounter({ scopeKey, className = "" }) {
  const [c, setC] = useState({ likes: 0, dislikes: 0, shares: 0 });

  const refresh = () => setC(loadCounts(scopeKey));

  useEffect(() => { refresh(); }, [scopeKey]);
  useEffect(() => {
    const h = (ev) => { if (ev?.detail?.scopeKey === scopeKey) refresh(); };
    window.addEventListener("habit-actions-updated", h);
    return () => window.removeEventListener("habit-actions-updated", h);
  }, [scopeKey]);

  return (
    <div className={`text-sm text-gray-500 select-none ${className}`}>
      👍 {c.likes} &nbsp;&nbsp; 👎 {c.dislikes} &nbsp;&nbsp; 🔗 {c.shares}
    </div>
  );
}

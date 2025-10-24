import { useEffect, useState } from "react";

/**
 * useHabitActions
 * - Maneja estado del usuario (like/dislike) y contadores (likes/dislikes/shares) por scopeKey.
 * - Persiste en localStorage.
 * - Emite evento 'habit-actions-updated' para que otros componentes refresquen (contador superior).
 */

const STATE_KEY  = "evolme_habit_actions_state_v2";   // { like: bool, dislike: bool }
const COUNTS_KEY = "evolme_habit_actions_counts_v2";  // { likes: number, dislikes: number, shares: number }

const load = (k, scopeKey, fallback) => {
  try {
    const raw = localStorage.getItem(`${k}:${scopeKey}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};
const save = (k, scopeKey, value) => {
  try { localStorage.setItem(`${k}:${scopeKey}`, JSON.stringify(value)); } catch {}
};
const notify = (scopeKey) =>
  window.dispatchEvent(new CustomEvent("habit-actions-updated", { detail: { scopeKey } }));

export default function useHabitActions(scopeKey) {
  const [state, setState]   = useState({ like: false, dislike: false });
  const [counts, setCounts] = useState({ likes: 0, dislikes: 0, shares: 0 });

  useEffect(() => {
    setState(load(STATE_KEY, scopeKey, { like: false, dislike: false }));
    setCounts(load(COUNTS_KEY, scopeKey, { likes: 0, dislikes: 0, shares: 0 }));
  }, [scopeKey]);

  useEffect(() => { save(STATE_KEY, scopeKey, state); }, [scopeKey, state]);
  useEffect(() => { save(COUNTS_KEY, scopeKey, counts); }, [scopeKey, counts]);

  const toggleLike = () => {
    setState(prev => {
      const next = { like: !prev.like, dislike: false };
      setCounts(c => {
        let { likes, dislikes, shares } = c;
        if (next.like && !prev.like) likes += 1;
        if (!next.like && prev.like) likes = Math.max(0, likes - 1);
        if (prev.dislike) dislikes = Math.max(0, dislikes - 1);
        const updated = { likes, dislikes, shares };
        setTimeout(() => { save(COUNTS_KEY, scopeKey, updated); notify(scopeKey); }, 0);
        return updated;
      });
      setTimeout(() => notify(scopeKey), 0);
      return next;
    });
  };

  const toggleDislike = () => {
    setState(prev => {
      const next = { like: false, dislike: !prev.dislike };
      setCounts(c => {
        let { likes, dislikes, shares } = c;
        if (next.dislike && !prev.dislike) dislikes += 1;
        if (!next.dislike && prev.dislike) dislikes = Math.max(0, dislikes - 1);
        if (prev.like) likes = Math.max(0, likes - 1);
        const updated = { likes, dislikes, shares };
        setTimeout(() => { save(COUNTS_KEY, scopeKey, updated); notify(scopeKey); }, 0);
        return updated;
      });
      setTimeout(() => notify(scopeKey), 0);
      return next;
    });
  };

  const doShare = async (payload = {}) => {
    const data = {
      title: payload.title ?? "EvolMe",
      text:  payload.text  ?? "Compartiendo desde EvolMe",
      url:   payload.url   ?? (typeof window !== "undefined" ? window.location.href : ""),
    };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(`${data.title}\n${data.text}\n${data.url}`.trim());
    } catch {/* cancelado o sin permisos */}
    // siempre incrementamos share al intentar compartir
    setCounts(c => {
      const updated = { ...c, shares: c.shares + 1 };
      setTimeout(() => { save(COUNTS_KEY, scopeKey, updated); notify(scopeKey); }, 0);
      return updated;
    });
  };

  return { state, counts, toggleLike, toggleDislike, doShare };
}

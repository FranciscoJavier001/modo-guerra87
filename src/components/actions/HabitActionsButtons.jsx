import React, { useEffect, useState } from "react";

/**
 * HabitActionsButtons
 * - Botones abajo del grid: Like | Dislike | Share
 * - Maneja estado del usuario (like/dislike) + contadores locales por tarjeta.
 * - Emite evento global "habit-actions-updated" para que el contador arriba refresque.
 */

const STATE_KEY  = "evolme_habit_actions_state_v1";   // { like: bool, dislike: bool }
const COUNTS_KEY = "evolme_habit_actions_counts_v1";  // { likes: number, dislikes: number }

function loadState(scopeKey) {
  try {
    const raw = localStorage.getItem(`${STATE_KEY}:${scopeKey}`);
    return raw ? JSON.parse(raw) : { like: false, dislike: false };
  } catch {
    return { like: false, dislike: false };
  }
}
function saveState(scopeKey, state) {
  try {
    localStorage.setItem(`${STATE_KEY}:${scopeKey}`, JSON.stringify(state));
  } catch {}
}

function loadCounts(scopeKey) {
  try {
    const raw = localStorage.getItem(`${COUNTS_KEY}:${scopeKey}`);
    return raw ? JSON.parse(raw) : { likes: 0, dislikes: 0 };
  } catch {
    return { likes: 0, dislikes: 0 };
  }
}
function saveCounts(scopeKey, counts) {
  try {
    localStorage.setItem(`${COUNTS_KEY}:${scopeKey}`, JSON.stringify(counts));
  } catch {}
}

function notify(scopeKey) {
  window.dispatchEvent(new CustomEvent("habit-actions-updated", { detail: { scopeKey } }));
}

export default function HabitActionsButtons({
  scopeKey,
  shareData, // { title?: string, text?: string, url?: string }
  className = "",
}) {
  const [state, setState]   = useState({ like: false, dislike: false });
  const [counts, setCounts] = useState({ likes: 0, dislikes: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setState(loadState(scopeKey));
    setCounts(loadCounts(scopeKey));
  }, [scopeKey]);

  useEffect(() => {
    saveState(scopeKey, state);
  }, [scopeKey, state]);

  useEffect(() => {
    saveCounts(scopeKey, counts);
  }, [scopeKey, counts]);

  const toggleLike = () => {
    setState((prev) => {
      const next = { like: !prev.like, dislike: false };
      setCounts((c) => {
        let { likes, dislikes } = c;
        if (next.like && !prev.like) likes += 1;
        if (!next.like && prev.like) likes = Math.max(0, likes - 1);
        if (prev.dislike) dislikes = Math.max(0, dislikes - 1);
        const updated = { likes, dislikes };
        // Persist & notify
        setTimeout(() => { saveCounts(scopeKey, updated); notify(scopeKey); }, 0);
        return updated;
      });
      setTimeout(() => notify(scopeKey), 0);
      return next;
    });
  };

  const toggleDislike = () => {
    setState((prev) => {
      const next = { like: false, dislike: !prev.dislike };
      setCounts((c) => {
        let { likes, dislikes } = c;
        if (next.dislike && !prev.dislike) dislikes += 1;
        if (!next.dislike && prev.dislike) dislikes = Math.max(0, dislikes - 1);
        if (prev.like) likes = Math.max(0, likes - 1);
        const updated = { likes, dislikes };
        // Persist & notify
        setTimeout(() => { saveCounts(scopeKey, updated); notify(scopeKey); }, 0);
        return updated;
      });
      setTimeout(() => notify(scopeKey), 0);
      return next;
    });
  };

  const doShare = async () => {
    const payload = {
      title: shareData?.title ?? "EvolMe",
      text:  shareData?.text  ?? "Compartiendo desde EvolMe",
      url:   shareData?.url   ?? (typeof window !== "undefined" ? window.location.href : ""),
    };

    try {
      if (navigator.share) {
        await navigator.share(payload);
      } else {
        await navigator.clipboard.writeText(
          `${payload.title}\n${payload.text}\n${payload.url}`.trim()
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(
          `${payload.title}\n${payload.text}\n${payload.url}`.trim()
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {}
    }
  };

  const btn =
    "rounded-xl border border-neutral-200 px-3 py-2 text-sm shadow-sm hover:bg-neutral-50 active:scale-[0.98] transition";

  return (
  <div className={`mt-3 flex items-center gap-2 w-full ${className}`}>
    <button
      type="button"
      onClick={toggleLike}
      aria-pressed={state.like}
      className={`flex-1 px-3 py-2 rounded-xl border text-sm shadow-sm transition active:scale-[0.98]
        ${state.like
          ? "bg-blue-500 text-white border-blue-500"
          : "bg-white text-gray-700 border-neutral-200 hover:bg-neutral-50"
        }`}
    >
      Like
    </button>

    <button
      type="button"
      onClick={toggleDislike}
      aria-pressed={state.dislike}
      className={`flex-1 px-3 py-2 rounded-xl border text-sm shadow-sm transition active:scale-[0.98]
        ${state.dislike
          ? "bg-blue-500 text-white border-blue-500"
          : "bg-white text-gray-700 border-neutral-200 hover:bg-neutral-50"
        }`}
    >
      Dislike
    </button>

    <button
      type="button"
      onClick={doShare}
      className={`flex-1 px-3 py-2 rounded-xl border text-sm shadow-sm transition active:scale-[0.98]
        bg-white text-gray-700 border-neutral-200 hover:bg-neutral-50`}
    >
      Share
    </button>

    {copied && <span className="ml-1 select-none text-xs text-neutral-500">Copiado ✅</span>}
  </div>
)}
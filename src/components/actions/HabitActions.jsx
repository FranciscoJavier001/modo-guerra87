import React, { useEffect, useState } from "react";

/**
 * HabitActions (Like / Dislike / Share)
 * - Estado por tarjeta usando scopeKey (p. ej. "habit:abc123").
 * - Sin contadores visibles.
 * - Persistencia localStorage.
 * - Share: Web Share API -> fallback a portapapeles.
 */

const STORAGE_KEY = "evolme_habit_actions_v1";

function loadState(scopeKey) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${scopeKey}`);
    return raw ? JSON.parse(raw) : { like: false, dislike: false };
  } catch {
    return { like: false, dislike: false };
  }
}

function saveState(scopeKey, state) {
  try {
    localStorage.setItem(`${STORAGE_KEY}:${scopeKey}`, JSON.stringify(state));
  } catch {}
}

export default function HabitActions({
  scopeKey,
  shareData, // { title?: string, text?: string, url?: string }
  className = "",
}) {
  const [state, setState] = useState({ like: false, dislike: false });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setState(loadState(scopeKey));
  }, [scopeKey]);

  useEffect(() => {
    saveState(scopeKey, state);
  }, [scopeKey, state]);

  const toggleLike = () => {
    setState((prev) => {
      // Al activar like, desactiva dislike
      const next = { like: !prev.like, dislike: false };
      return next;
    });
  };

  const toggleDislike = () => {
    setState((prev) => {
      // Al activar dislike, desactiva like
      const next = { like: false, dislike: !prev.dislike };
      return next;
    });
  };

  const doShare = async () => {
    const payload = {
      title: shareData?.title ?? "EvolMe",
      text: shareData?.text ?? "Compartiendo desde EvolMe",
      url: shareData?.url ?? (typeof window !== "undefined" ? window.location.href : ""),
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
      // usuario canceló o no se pudo compartir: fallback a clipboard
      try {
        await navigator.clipboard.writeText(
          `${payload.title}\n${payload.text}\n${payload.url}`.trim()
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {}
    }
  };

  return ;
}

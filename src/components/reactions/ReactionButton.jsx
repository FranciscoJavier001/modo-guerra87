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





  

  return (
    <div className={``}>
      

      
    </div>
  );
}

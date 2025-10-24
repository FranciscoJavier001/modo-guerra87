import React from "react";
import useHabitActions from "../../hooks/useHabitActions"

/**
 * Botones debajo del grid
 * - Ocupan el ancho completo (3 columnas iguales).
 * - Like = VERDE cuando activo, Dislike = ROJO cuando activo.
 * - Share: texto simple, incrementa contador de shares.
 * - Deshabilitados si `disabled` (cuando estás en tu propio perfil).
 */
export default function HabitActionsButtons({
  scopeKey,
  disabled = false,
  shareData,
  className = "",
}) {
  const { state, toggleLike, toggleDislike, doShare } = useHabitActions(scopeKey);

  const base =
    "flex-1 px-3 py-2 rounded-xl border text-sm shadow-sm transition active:scale-[0.98]";

  const likeCls = state.like
    ? "bg-green-500 text-white border-green-500"
    : "bg-white text-gray-700 border-neutral-200 hover:bg-neutral-50";

  const dislikeCls = state.dislike
    ? "bg-red-500 text-white border-red-500"
    : "bg-white text-gray-700 border-neutral-200 hover:bg-neutral-50";

  const disabledCls = "opacity-50 cursor-not-allowed pointer-events-none";

  return (
    <div className={`mt-3 flex items-center gap-2 w-full ${className}`}>
      <button
        type="button"
        onClick={toggleLike}
        aria-pressed={state.like}
        className={`${base} ${likeCls} ${disabled ? disabledCls : ""}`}
        disabled={disabled}
      >
        Like
      </button>

      <button
        type="button"
        onClick={toggleDislike}
        aria-pressed={state.dislike}
        className={`${base} ${dislikeCls} ${disabled ? disabledCls : ""}`}
        disabled={disabled}
      >
        Dislike
      </button>

      <button
        type="button"
        onClick={() => doShare(shareData)}
        className={`${base} bg-white text-gray-700 border-neutral-200 hover:bg-neutral-50 ${disabled ? disabledCls : ""}`}
        disabled={disabled}
      >
        Share
      </button>
    </div>
  );
}

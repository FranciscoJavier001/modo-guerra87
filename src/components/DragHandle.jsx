
import React from 'react';

export default function DragHandle({ onMouseDown }) {
  return (
    <button
      type="button"
      className="mr-3 cursor-grab active:cursor-grabbing select-none text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300"
      title="Arrastra para reordenar"
      onMouseDown={onMouseDown}
      aria-label="Arrastrar para reordenar"
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <circle cx="5" cy="6" r="1.5" />
        <circle cx="5" cy="10" r="1.5" />
        <circle cx="5" cy="14" r="1.5" />
        <circle cx="10" cy="6" r="1.5" />
        <circle cx="10" cy="10" r="1.5" />
        <circle cx="10" cy="14" r="1.5" />
      </svg>
    </button>
  );
}

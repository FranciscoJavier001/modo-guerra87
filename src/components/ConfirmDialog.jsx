
import React, { useEffect, useRef, useState } from 'react';

export default function ConfirmDialog({
  open = false,
  title = 'Confirmar',
  message = '',
  expectedText = '',
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  onConfirm = () => {},
  onCancel = () => {},
}) {
  const [input, setInput] = useState('');
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) {
      setInput('');
      setTimeout(() => {
        dialogRef.current?.focus();
      }, 0);
    }
  }, [open]);

  if (!open) return null;

  const canConfirm = expectedText ? input.trim() === expectedText : true;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-xl transition-transform transform">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-zinc-800">
          <h2 id="confirm-title" className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{title}</h2>
        </div>
        <div className="px-5 py-4 space-y-3 text-gray-800 dark:text-zinc-200">
          <p className="text-sm text-gray-700 whitespace-pre-line">{message}</p>
          {expectedText && (
            <div>
              <label className="block text-xs text-gray-500 dark:text-zinc-400 mb-1">
                Escribe exactamente: <span className="font-semibold">{expectedText}</span>
              </label>
              <input
                ref={dialogRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-900"
                placeholder="Escribe aquí..."
              />
            </div>
          )}
        </div>
        <div className="px-5 py-4 border-t border-gray-200 dark:border-zinc-800 flex gap-2 justify-end">
          <button
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 transition"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-white transition ${canConfirm ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800' : 'bg-red-300 cursor-not-allowed'}`}
            onClick={() => canConfirm && onConfirm()}
            disabled={!canConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

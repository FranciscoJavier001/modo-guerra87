import React from 'react';
export default function ConfirmBar({ onConfirm, onCancel, disabled }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-sm disabled:opacity-60" onClick={onConfirm} disabled={disabled}>Confirmar</button>
      <button type="button" className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm" onClick={onCancel}>Cancelar</button>
    </div>
  );
}

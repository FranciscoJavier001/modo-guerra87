import React from 'react';
import ConfirmBar from '@/components/ConfirmBar';
import HabitTracker from '@/components/HabitTracker';
import { calcStreakFromRegistros, calcBestStreakFromRegistros } from '@/utils/dateUtils';

export default function HabitItem({
  habit,
  confirming,
  onAskDelete,
  onCancelDelete,
  onConfirmDelete,
  onEdit,
  onUpdateLocal,
  footer
}) {
  
  const racha = calcStreakFromRegistros(habit?.registros);
  const best = calcBestStreakFromRegistros(habit?.registros);
  
  console.log(habit.nombre, Object.keys(habit.registros || {}).length);

  return (
    <div className="bg-white shadow p-3 rounded mb-4">
      <div className="flex justify-between items-center gap-3">
        <input
          value={habit.nombre || ''}
          onChange={(e) => onEdit(habit.id, e.target.value)}
          className="border-b w-full text-lg font-medium"
        />

        {confirming ? (
          <ConfirmBar onConfirm={onConfirmDelete} onCancel={onCancelDelete} />
        ) : (
          <button
            type="button"
            className="text-red-600 hover:text-red-700 text-sm"
            onClick={() => onAskDelete(habit.id)}
          >
            🗑️
          </button>
        )}
      </div>

      <HabitTracker habit={habit} onUpdateLocal={onUpdateLocal} />

      <div className="text-sm text-gray-500 mt-2 flex justify-between items-center">
        <div className="flex gap-3">
          <span>✅ {habit.resumen?.completados || 0}</span>
          <span>❌ {habit.resumen?.fallados || 0}</span>
          <span>🚫 {habit.resumen?.saltados || 0}</span>
          <span>📅 {habit.resumen?.diasTotales || 0}</span>
        </div>

        <div className="font-semibold text-orange-600 flex gap-3">
          <span>🔥 {racha}</span>
          <span className="text-gray-600">🏆 {best}</span>
        </div>
      </div>

      {footer}
    </div>
  );
}

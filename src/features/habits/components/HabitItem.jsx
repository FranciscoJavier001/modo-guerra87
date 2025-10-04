import React from 'react';
import ConfirmBar from '@/components/ConfirmBar';
export default function HabitItem({ habit, confirming, onAskDelete, onCancelDelete, onConfirmDelete, onEdit, footer }){
  return (
    <div className="bg-white shadow p-3 rounded mb-4">
      <div className="flex justify-between items-center gap-3">
        <input value={habit.nombre||''} onChange={(e)=>onEdit(habit.id, e.target.value)} className="border-b w-full text-lg font-medium" />
        {confirming ? (
          <ConfirmBar onConfirm={()=>onConfirmDelete(habit.id)} onCancel={onCancelDelete} />
        ) : (
          <button type="button" className="text-red-600 hover:text-red-700 text-sm" onClick={()=>onAskDelete(habit.id)}>Eliminar</button>
        )}
      </div>
      {footer}
    </div>
  );
}

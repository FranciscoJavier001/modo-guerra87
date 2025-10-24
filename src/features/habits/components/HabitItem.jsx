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
// imports (agrega estas dos líneas donde correspondan)
import { TopReactionsBar } from "@/components/reactions/TopReactionsBar";
import ReactionButton from "@/components/reactions/ReactionButton";

// ...dentro de tu componente HabitItem
export default function HabitItem({ habit, onEdit, onAskDelete, onConfirmDelete, confirming, onCancelDelete, ...props }) {
  const scopeKey = `habit:${habit.id}`; // asegura un id estable por hábito

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      {/* Header: título a la izquierda, Top-3 a la derecha */}
      <div className="flex items-center justify-between gap-3">
        <input
          value={habit.nombre || ""}
          onChange={(e) => onEdit(habit.id, e.target.value)}
          className="w-full border-b text-lg font-medium outline-none"
        />

        {/* Top 3 reacciones (sin contadores) */}
        <TopReactionsBar scopeKey={scopeKey} />

        {/* Botón de reacción (opcional para pruebas locales) */}
        <ReactionButton scopeKey={scopeKey} />

        {confirming ? (
          <ConfirmBar
            onConfirm={() => onConfirmDelete(habit.id)}
            onCancel={onCancelDelete}
          />
        ) : (
          <button
            type="button"
            className="text-sm text-red-600 transition-colors duration-100 hover:text-red-700"
            onClick={() => onAskDelete(habit.id)}
          >
            Eliminar
          </button>
        )}
      </div>

      {/* Aquí sigue tu grid de días / recuadros verdes */}
      {/* <HabitGrid ... /> */}
    </div>
  );
}

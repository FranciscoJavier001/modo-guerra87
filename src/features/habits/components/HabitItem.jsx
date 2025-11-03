// src/components/HabitItem.jsx
import React from 'react';
import CalendarTrigger from './calendar/CalendarTrigger';   // <- ajusta si tu ruta difiere
import { toKey } from '../../../utils/dataKey'; // ojo: la ruta exacta
import HabitItem from './HabitItem';

/**
 * Props esperadas (ajusta a tu modelo real):
 * - habit: {
 *     id: string,
 *     nombre: string,
 *     // alguna de estas fuentes para “días en verde”:
 *     registros?: Array<{ dateKey: string, status?: 'done'|'fail'|'sobre'|'pending' }>,
 *     hechosMap?: { [dateKey: string]: boolean }, // true = done
 *     hechosArray?: string[],                     // ['yyyy-MM-dd', ...]
 *   }
 * - onJumpToDate?: (date: Date, habitId: string) => void
 * - children?: React.ReactNode  (contenido existente: inputs, cuadritos, etc.)
 */
export default function HabitItem({ habit, onJumpToDate, children }) {
  // 1) Construimos el mapa de estados para pintar el calendario:
  const statusMap = React.useMemo(() => {
    const map = {};

    // A) registros detallados con status explícito
    if (Array.isArray(habit?.registros)) {
      for (const r of habit.registros) {
        const k = r.dateKey;
        const st = r.status || 'done';
        map[k] = st;
      }
    }

    // B) objeto booleano { 'yyyy-MM-dd': true }
    if (habit?.hechosMap && typeof habit.hechosMap === 'object') {
      for (const k of Object.keys(habit.hechosMap)) {
        if (habit.hechosMap[k]) map[k] = map[k] || 'done';
      }
    }

    // C) arreglo simple de keys hechas
    if (Array.isArray(habit?.hechosArray)) {
      for (const k of habit.hechosArray) {
        map[k] = map[k] || 'done';
      }
    }

    return map;
  }, [habit?.registros, habit?.hechosMap, habit?.hechosArray]);

  // 2) Qué pasa al elegir un día en el calendario:
  const handleDayPick = (date) => {
    // Aquí puedes abrir modal de nota/sobre, o mover la grilla a esa fecha
    onJumpToDate?.(date, habit?.id);
    // console.log('Day picked ->', habit?.nombre, toKey(date));
  };

  console.log("Renderizando habit:", habit?.nombre);

  return (
    <div className="rounded-xl border p-3 bg-white shadow-sm">
      {/* Header del hábito */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="font-semibold truncate">
            {habit?.nombre || 'Hábito'}
          </div>
        </div>

        {/* Botón 📅 calendario */}
        <CalendarTrigger
          statusMap={statusMap}
          onDayPick={handleDayPick}
        />
      </div>

      {/* Contenido existente (inputs, cuadritos, botones, etc.) */}
      <div className="mt-3">
        {children}
      </div>
    </div>
  );
}

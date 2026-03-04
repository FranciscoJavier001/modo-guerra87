import React, { useRef, useEffect } from 'react';
import { actualizarHabito } from '../services/firebaseHabits';
import { getDaysFromFirstRecordToToday } from '../utils/dateUtils';

function HabitTracker({ habit, onUpdateLocal }) {
  const dias = getDaysFromFirstRecordToToday(habit?.registros);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [dias.length]);

  const toggleDia = async (fecha) => {
    const actual = habit?.registros?.[fecha];
    let siguienteEstado;

    if (!actual) siguienteEstado = 'completado';
    else if (actual === 'completado') siguienteEstado = 'autopiloto';
    else if (actual === 'autopiloto') siguienteEstado = 'fallado';
    else if (actual === 'fallado') siguienteEstado = 'pendiente';
    else if (actual === 'pendiente') siguienteEstado = 'saltado';
    else if (actual === 'saltado') siguienteEstado = undefined;

    const nuevosRegistros = { ...(habit?.registros || {}) };
    if (siguienteEstado) nuevosRegistros[fecha] = siguienteEstado;
    else delete nuevosRegistros[fecha];

    const resumen = { completados: 0, fallados: 0, saltados: 0, diasTotales: 0 };

    for (const estado of Object.values(nuevosRegistros)) {
      if (estado === 'completado' || estado === 'autopiloto') resumen.completados++;
      if (estado === 'fallado') resumen.fallados++;
      if (estado === 'saltado') resumen.saltados++;
    }

    resumen.diasTotales = Object.keys(nuevosRegistros).length;

    const actualizado = { ...habit, registros: nuevosRegistros, resumen };
    onUpdateLocal?.(actualizado);

    await actualizarHabito(habit.id, actualizado);
  };

  return (
    <div ref={scrollRef} className="flex gap-1 mt-2 flex-nowrap overflow-x-auto">
      {dias.map((fecha) => {
        const estado = habit?.registros?.[fecha];

        const color =
          estado === 'completado' ? 'bg-green-500' :
          estado === 'autopiloto' ? 'bg-yellow-400' :
          estado === 'pendiente' ? 'bg-blue-500' :
          estado === 'fallado' ? 'bg-red-500' :
          estado === 'saltado' ? 'bg-gray-300' :
          'bg-white border';

        return (
          <div
            key={fecha}
            title={fecha}
            className={`w-6 h-6 shrink-0 rounded cursor-pointer ${color}`}
            onClick={() => toggleDia(fecha)}
          />
        );
      })}
    </div>
  );
}

export default HabitTracker;
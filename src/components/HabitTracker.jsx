import React from 'react';
import { actualizarHabito } from '../services/firebaseHabits';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

+dayjs.extend(utc);
+dayjs.extend(tz);

const ZONE = 'America/Mexico_City';   // cambia si lo necesitas

const getLastNDays = (n = 15) => {
  const base = dayjs().tz(ZONE).startOf('day');     // “hoy” local
  return Array.from({ length: n }, (_, i) =>
    base.subtract(n - 1 - i, 'day').format('YYYY-MM-DD')
  );
};

const estados = ['completado', 'fallado', 'saltado'];

function HabitTracker({ habit, onUpdateLocal }) {
  const dias = getLastNDays(15);   // mismo número que antes

  // Asegúrate de tener este helper dentro del componente (o arriba del archivo)
const nextEstado = (actual) => {
  const orden = [null, 'completado', 'fallado', 'saltado', 'sobre'];
  const idx = orden.indexOf(actual ?? null);
  return orden[(idx + 1) % orden.length];
};

// Reemplaza tu toggleDia por este:
const toggleDia = (fecha) => {
  // Garantiza objeto
  const registros = { ...(habit.registros || {}) };

  const estadoActual = registros[fecha] ?? null;
  const siguiente = nextEstado(estadoActual);

  if (siguiente === null) {
    delete registros[fecha];     // vuelve a “vacío”
  } else {
    registros[fecha] = siguiente; // guarda el nuevo estado
  }

  const actualizado = { ...habit, registros };
  onUpdateLocal?.(actualizado);   // si ya tienes este callback para refrescar UI/guardar
};

return (
  <div className="flex gap-1 mt-2">
    {dias.map((fecha) => {
      const estado = habit.registros?.[fecha];
      const color =
        estado === 'completado'
          ? 'bg-green-500 text-white shadow-sm'
          : estado === 'fallado'
          ? 'bg-red-500 text-white shadow-sm'
          : estado === 'sobre'
          ? 'bg-blue-600 text-white shadow-sm'
          : estado === 'saltado'
          ? 'bg-gray-300 text-gray-700'
          : 'bg-white border border-gray-300';

      return (
        <div
          key={fecha}
          title={fecha}
          className={`w-6 h-6 rounded cursor-pointer transition-all duration-150 hover:scale-110 ${color}`}
          onClick={() => toggleDia(fecha)}
        ></div>
      );
    })}
  </div>
);
}

export default HabitTracker;
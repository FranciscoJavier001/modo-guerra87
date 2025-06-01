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

  const toggleDia = async (fecha) => {
    const actual = habit.registros?.[fecha];
    let siguienteEstado;

    if (!actual) siguienteEstado = 'completado';
    else if (actual === 'completado') siguienteEstado = 'fallado';
    else if (actual === 'fallado') siguienteEstado = 'saltado';
    else if (actual === 'saltado') siguienteEstado = undefined;

    const nuevosRegistros = { ...habit.registros };
    if (siguienteEstado) nuevosRegistros[fecha] = siguienteEstado;
    else delete nuevosRegistros[fecha];

    // Calcular resumen
    const resumen = { completados: 0, fallados: 0, saltados: 0, diasTotales: 0 };
    for (const estado of Object.values(nuevosRegistros)) {
      if (estado === 'completado') resumen.completados++;
      if (estado === 'fallado') resumen.fallados++;
      if (estado === 'saltado') resumen.saltados++;
    }
    resumen.diasTotales = Object.keys(nuevosRegistros).length;

    const actualizado = { ...habit, registros: nuevosRegistros, resumen };
    onUpdateLocal(actualizado); // actualizar en frontend
    await actualizarHabito(habit.id, actualizado); // guardar en Firestore
  };

  return (
    <div className="flex gap-1 mt-2 ">
      {dias.map(fecha => {
        const estado = habit.registros?.[fecha];
        const color =
          estado === 'completado' ? 'bg-green-500' :
          estado === 'fallado' ? 'bg-red-500' :
          estado === 'saltado' ? 'bg-gray-300' :
          'bg-white border';

        return (
          <div
            key={fecha}
            title={fecha}
            className={`w-6 h-6 rounded cursor-pointer ${color}`}
            onClick={() => toggleDia(fecha)}
          ></div>
        );
      })}
    </div>
  );
}

export default HabitTracker;
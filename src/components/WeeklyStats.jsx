
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(tz);

const ZONE = 'America/Mexico_City';

/**
 * Calcula % completado por día (últimos 7 días) considerando la forma:
 * - h.dias[YYYY-MM-DD] = true/false
 * - o h.fechas = ['YYYY-MM-DD', ...] (true implícito)
 */
function useWeeklyStats(habitos) {
  return useMemo(() => {
    const base = dayjs().tz(ZONE).startOf('day');
    const dias = Array.from({ length: 7 }, (_, i) =>
      base.subtract(6 - i, 'day').format('YYYY-MM-DD')
    );

    const perDay = dias.map(d => {
      let total = 0;
      let done = 0;
      for (const h of habitos) {
        total += 1;
        const mapa = h.dias || h.mapa || {};
        const fechasArr = Array.isArray(h.fechas) ? new Set(h.fechas) : null;
        let v = null;
        if (mapa && Object.prototype.hasOwnProperty.call(mapa, d)) {
          v = !!mapa[d];
        } else if (fechasArr && fechasArr.has(d)) {
          v = true;
        }
        if (v === true) done += 1;
      }
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      return { day: d, pct, done, total };
    });

    return perDay;
  }, [habitos]);
}

export default function WeeklyStats({ habitos = [] }) {
  const weekly = useWeeklyStats(habitos);

  return (
    <div className="w-full max-w-2xl mx-auto my-4 p-4 bg-white/70 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-3">Progreso semanal (últimos 7 días)</h2>
      <div className="space-y-2">
        {weekly.map(({ day, pct, done, total }) => (
          <div key={day} className="flex items-center gap-3">
            <div className="w-24 text-sm text-gray-600">{day}</div>
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-3 bg-blue-600"
                style={{ width: `${pct}%` }}
                aria-label={`Completado ${pct}%`}
              />
            </div>
            <div className="w-14 text-right text-sm text-gray-700">{pct}%</div>
            <div className="w-20 text-right text-xs text-gray-500">
              {done}/{total} hábitos
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

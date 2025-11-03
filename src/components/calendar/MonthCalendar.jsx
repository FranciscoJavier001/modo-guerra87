// src/components/calendar/MonthCalendar.jsx
import React from 'react';
import {
  today, toKey, addMonths, monthMatrix, sameMonth
} from '../../utils/dateKeys';

// statusMap: { 'yyyy-MM-dd': 'done' | 'fail' | 'sobre' | 'pending' }
export default function MonthCalendar({
  monthDate,
  setMonthDate,
  onSelectDay,
  statusMap = {}
}) {
  const T = today();
  const rows = monthMatrix(monthDate);

  const colorFor = (d) => {
    const k = toKey(d);
    const s = statusMap[k];
    if (s === 'done') return 'bg-green-500 text-white';
    if (s === 'sobre') return 'bg-blue-600 text-white';
    if (s === 'fail') return 'bg-red-500 text-white';
    if (s === 'pending') return 'bg-amber-400 text-white';
    return 'bg-white text-gray-900';
  };

  const isToday = (d) => toKey(d) === toKey(T);
  const isOtherMonth = (d) => !sameMonth(d, monthDate);

  return (
    <div className="w-80 border rounded-xl p-3 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setMonthDate(addMonths(monthDate, -1))}
        >◀</button>
        <div className="font-semibold">
          {monthDate.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
        </div>
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setMonthDate(addMonths(monthDate, +1))}
        >▶</button>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-2">
        <button className="px-2 py-1 border rounded w-full"
          onClick={() => setMonthDate(T)}>Hoy</button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
        {['L','M','X','J','V','S','D'].map(d => (
          <div key={d} className="text-center py-1">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {rows.flat().map((d, idx) => {
          const base = `h-9 flex items-center justify-center rounded-md border text-sm cursor-pointer`;
          const status = colorFor(d);
          const dim = isOtherMonth(d) ? 'opacity-40' : '';
          const ring = isToday(d) ? 'ring-2 ring-indigo-500 ring-offset-1' : '';
          return (
            <button
              key={idx}
              className={`${base} ${status} ${dim} ${ring}`}
              onClick={() => onSelectDay(d)}
              title={toKey(d)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-3 mt-3 text-xs text-gray-600">
        <Legend swatch="bg-green-500" label="Cumplido" />
        <Legend swatch="bg-blue-600"  label="Sobre" />
        <Legend swatch="bg-red-500"   label="Falló" />
        <Legend swatch="bg-amber-400" label="Pendiente" />
      </div>
    </div>
  );
}

function Legend({swatch, label}) {
  return (
    <div className="flex items-center gap-1">
      <span className={`inline-block w-3 h-3 rounded ${swatch}`}></span>
      <span>{label}</span>
    </div>
  );
}

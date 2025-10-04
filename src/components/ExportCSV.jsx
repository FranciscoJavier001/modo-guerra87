
import React from 'react';
import dayjs from 'dayjs';

/**
 * Exporta los hábitos a CSV.
 * Espera un array de hábitos (como en App.jsx), intenta detectar varias formas de estructura:
 *  - { id, nombre, dias: { 'YYYY-MM-DD': true/false } }
 *  - { id, nombre, fechas: ['YYYY-MM-DD', ...] }  // interpretamos como completados = true
 *  - { resumen: { completados, fallados, saltados, diasTotales } } (opcional)
 */
function toCsv(habitos = [], ultimosNDias = 15) {
  const base = dayjs().startOf('day');
  const dias = Array.from({ length: ultimosNDias }, (_, i) =>
    base.subtract(ultimosNDias - 1 - i, 'day').format('YYYY-MM-DD')
  );

  const header = ['id','nombre', ...dias, 'completados','fallados','saltados','diasTotales'];
  const lines = [header];

  for (const h of habitos) {
    const nombre = h.nombre || h.titulo || h.name || '';
    const mapa = h.dias || h.mapa || {};
    const fechasArr = Array.isArray(h.fechas) ? new Set(h.fechas) : null;

    const row = [h.id || '', nombre];

    for (const d of dias) {
      let v = null;
      if (mapa && Object.prototype.hasOwnProperty.call(mapa, d)) {
        v = mapa[d] ? 1 : 0;
      } else if (fechasArr && fechasArr.has(d)) {
        v = 1;
      }
      row.push(v === null ? '' : v);
    }

    const res = h.resumen || {};
    row.push(
      res.completados ?? '',
      res.fallados ?? '',
      res.saltados ?? '',
      res.diasTotales ?? ''
    );

    lines.push(row);
  }

  return lines.map(r =>
    r.map(x => (x === null || x === undefined ? '' : String(x).replace(/"/g,'""')))
     .map(x => /[",\n]/.test(x) ? `"${x}"` : x)
     .join(',')
  ).join('\n');
}

export default function ExportCSV({ habitos = [], nDias = 15, filename = 'habitos.csv' }) {
  const handleClick = () => {
    try {
      const csv = toCsv(habitos, nDias);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('No se pudo exportar: ' + (e?.message || String(e)));
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition"
      title="Exportar hábitos a CSV (últimos días)"
    >
      Exportar CSV
    </button>
  );
}

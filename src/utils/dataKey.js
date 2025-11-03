// src/utils/dateKeys.js
export function toKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
export function fromKey(k) { return new Date(`${k}T00:00:00`); }
export function today() { const d = new Date(); d.setHours(0,0,0,0); return d; }

export function addMonths(d, n) {
  const x = new Date(d); x.setMonth(x.getMonth() + n); x.setHours(0,0,0,0); return x;
}
export function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
export function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }

// Semana Lunes-Domingo
export function startOfWeek(d) {
  const x = new Date(d); const day = (x.getDay() + 6) % 7; // 0 = lun
  x.setDate(x.getDate() - day); x.setHours(0,0,0,0); return x;
}
export function addDays(d, n){ const x = new Date(d); x.setDate(x.getDate()+n); x.setHours(0,0,0,0); return x; }
export function sameDay(a,b){ return a.getTime() === b.getTime(); }
export function sameMonth(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth(); }

// Devuelve una matriz 6x7 de fechas para pintar el calendario mensual
export function monthMatrix(monthDate) {
  const start = startOfWeek(startOfMonth(monthDate));
  let cur = start;
  const rows = [];
  for (let r=0; r<6; r++){
    const row = [];
    for (let c=0; c<7; c++){
      row.push(cur);
      cur = addDays(cur, 1);
    }
    rows.push(row);
  }
  return rows;
}

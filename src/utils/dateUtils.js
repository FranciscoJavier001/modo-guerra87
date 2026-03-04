import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(tz);

const ZONE = 'America/Mexico_City';

// --- Ya lo tenías ---
export const todayKey = () => dayjs().tz(ZONE).format('YYYY-MM-DD');
export const midnightUTC = () => dayjs().tz(ZONE).startOf('day').utc().toDate();
export const fmt = (ts) => dayjs(ts).tz(ZONE).format('DD MMM YY HH:mm');

// --- NUEVO: últimos N días (asc: viejo -> hoy) ---
export const getLastNDays = (n = 15) => {
  const base = dayjs().tz(ZONE).startOf('day');
  return Array.from({ length: n }, (_, i) =>
    base.subtract(n - 1 - i, 'day').format('YYYY-MM-DD')
  );
};

// --- NUEVO: racha (hoy -> atrás), suma verde+amarillo, rojo rompe ---
export const calcStreak = (registros, dias) => {
  const arr = Array.isArray(dias) ? dias : [];
  let streak = 0;

  for (let i = arr.length - 1; i >= 0; i--) {
    const fecha = arr[i];
    const estado = registros?.[fecha];

    if (estado === 'fallado') break;
    if (estado === 'completado' || estado === 'autopiloto') streak++;
    // pendiente/saltado/undefined: no suma, no rompe
  }

  return streak;
};

export const calcBestStreak = (registros, dias) => {
  const arr = Array.isArray(dias) ? dias : [];
  let best = 0;
  let current = 0;

  // recorremos de viejo -> hoy para encontrar la mejor racha en la ventana
  for (let i = 0; i < arr.length; i++) {
    const fecha = arr[i];
    const estado = registros?.[fecha];

    if (estado === 'fallado') {
      current = 0; // rojo rompe
      continue;
    }

    if (estado === 'completado' || estado === 'autopiloto') {
      current += 1; // verde/amarillo suman
      if (current > best) best = current;
      continue;
    }

    // pendiente/saltado/undefined: no suma, no rompe (se “pausa”)
    // para tu regla: no rompe y no suma -> simplemente seguimos sin cambiar current
  }

  return best;
}

export const getDaysFromFirstRecordToToday = (registros) => {
  const keys = Object.keys(registros || {});
  const today = dayjs().tz(ZONE).startOf('day');

  if (keys.length === 0) {
    // si no hay registros, al menos muestra hoy
    return [today.format('YYYY-MM-DD')];
  }

  keys.sort(); // YYYY-MM-DD ordena bien en string

  const start = dayjs(keys[0]).tz(ZONE).startOf('day');

  const diff = today.diff(start, 'day');
  const length = diff + 1;

  return Array.from({ length }, (_, i) =>
    start.add(i, 'day').format('YYYY-MM-DD')
  );
};

export const calcStreakFromRegistros = (registros) => {
  const entries = Object.entries(registros || {})
    .sort(([a], [b]) => a.localeCompare(b)); // asc por fecha

  let streak = 0;

  // recorremos de hoy hacia atrás
  for (let i = entries.length - 1; i >= 0; i--) {
    const estado = entries[i][1];

    if (estado === 'fallado') break;
    if (estado === 'completado' || estado === 'autopiloto') streak++;
    // pendiente/saltado/undefined: no suma, no rompe
  }

  return streak;
};

export const calcBestStreakFromRegistros = (registros) => {
  const entries = Object.entries(registros || {})
    .sort(([a], [b]) => a.localeCompare(b)); // asc por fecha

  let best = 0;
  let current = 0;

  for (const [, estado] of entries) {
    if (estado === 'fallado') {
      current = 0;
      continue;
    }
    if (estado === 'completado' || estado === 'autopiloto') {
      current++;
      if (current > best) best = current;
    }
    // pendiente/saltado/undefined: no suma, no rompe
  }

  return best;
};
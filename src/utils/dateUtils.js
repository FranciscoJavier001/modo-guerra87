import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(tz);

const ZONE = 'America/Mexico_City';   // cámbialo si un día hay más zonas

export const todayKey = () =>
  dayjs().tz(ZONE).format('YYYY-MM-DD');           // "2025-05-31"

export const midnightUTC = () =>
  dayjs().tz(ZONE).startOf('day').utc().toDate();  // Date 06:00:00Z

export const fmt = ts =>
  dayjs(ts).tz(ZONE).format('DD MMM YY HH:mm');    // Para mostrar bonito

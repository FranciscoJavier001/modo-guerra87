export const emptySummary = { completados: 0, fallados: 0, saltados: 0, diasTotales: 0 };
export function normalizeHabit(h){ if(!h) return {id:'', nombre:'', registros:{}, resumen:{...emptySummary}}; return { id:h.id, nombre:h.nombre||'', registros:h.registros||{}, resumen:{...emptySummary, ...(h.resumen||{})}, orden: typeof h.orden==='number'?h.orden:null }; }
export function sortHabits(a,b){ const ao=a.orden??Number.MAX_SAFE_INTEGER; const bo=b.orden??Number.MAX_SAFE_INTEGER; if(ao!==bo) return ao-bo; return (a.nombre||'').localeCompare(b.nombre||''); }

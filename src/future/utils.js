// Simple date helpers (no external deps)
export function toKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth()+1).padStart(2,'0')
  const day = String(d.getDate()).padStart(2,'0')
  return `${y}-${m}-${day}`
}
export function fromKey(k) {
  return new Date(`${k}T00:00:00`)
}
export function today() {
  const d = new Date()
  d.setHours(0,0,0,0)
  return d
}
export function addDays(d, n) {
  const x = new Date(d); x.setDate(d.getDate()+n); return x
}
export function clampTo30(base, target) {
  const min = +base
  const max = +addDays(base, 30)
  const t = +target
  if (t < min) return new Date(min)
  if (t > max) return new Date(max)
  return target
}
export function nice(d) {
  return d.toLocaleDateString('es-MX', { weekday:'short', day:'numeric', month:'short', year:'numeric' })
}

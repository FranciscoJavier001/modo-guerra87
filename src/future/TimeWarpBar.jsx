import React from 'react'
import { addDays, clampTo30, nice } from './utils'

export default function TimeWarpBar({ baseDate, date, setDate }) {
  const go = (n) => () => setDate(clampTo30(baseDate, addDays(date, n)))
  const reset = () => setDate(baseDate)

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <button className="px-2 py-1 border rounded" onClick={go(-7)}>&laquo; -7</button>
      <button className="px-2 py-1 border rounded" onClick={go(-1)}>-1</button>
      <div className="px-2 py-1"><strong>{nice(date)}</strong> <span className="opacity-60">(ventana 30d)</span></div>
      <button className="px-2 py-1 border rounded" onClick={go(+1)}>+1</button>
      <button className="px-2 py-1 border rounded" onClick={go(+7)}>+7 &raquo;</button>
      <button className="px-2 py-1 border rounded" onClick={reset}>Hoy</button>
    </div>
  )
}

import React, { useEffect, useMemo, useState } from 'react'
import { FutureLocal, FUTURE_TYPES, newFuture } from '../services/future.local'
import { today, toKey } from './utils'
import TimeWarpBar from './TimeWarpBar'

export default function FuturePlanner() {
  const [baseDate] = useState(today())
  const [date, setDate] = useState(baseDate)
  const [items, setItems] = useState([])

  const dateKey = useMemo(()=> toKey(date), [date])

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [type, setType] = useState(FUTURE_TYPES.SOBRE) // por default: sobre azul

  useEffect(()=>{
    setItems(FutureLocal.forDate(dateKey))
  }, [dateKey])

  const create = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    const payload = newFuture({
      dateKey,
      title: title.trim(),
      type,
      amount: type === FUTURE_TYPES.SOBRE ? Number(amount || 0) : 0,
      note
    })
    FutureLocal.create(payload)
    setItems(FutureLocal.forDate(dateKey))
    setTitle('')
    setAmount('')
    setNote('')
  }

  const toggle = (id, done) => {
    FutureLocal.toggleDone(id, done)
    setItems(FutureLocal.forDate(dateKey))
  }
  const remove = (id) => {
    FutureLocal.remove(id)
    setItems(FutureLocal.forDate(dateKey))
  }
  const updateNote = (id, nv) => {
    FutureLocal.updateNote(id, nv)
    setItems(FutureLocal.forDate(dateKey))
  }

  return (
    <div className="rounded-xl border p-4 mt-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">EvolMe · Future Planner (local)</h2>
      </div>

      <TimeWarpBar baseDate={baseDate} date={date} setDate={setDate} />

      <form onSubmit={create} className="grid gap-2 mt-3 md:grid-cols-4">
        <select className="border rounded px-2 py-1" value={type} onChange={e=>setType(e.target.value)}>
          <option value={FUTURE_TYPES.SOBRE}>Sobre (azul)</option>
          <option value={FUTURE_TYPES.ACTION}>Acción</option>
        </select>
        <input className="border rounded px-2 py-1 md:col-span-2" placeholder="Título (p.ej. Ahorro $5,000 para EAP653)" value={title} onChange={e=>setTitle(e.target.value)} />
        {type === FUTURE_TYPES.SOBRE && (
          <input className="border rounded px-2 py-1" placeholder="Monto" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} />
        )}
        <textarea className="border rounded px-2 py-1 md:col-span-4" placeholder="Nota (opcional)" value={note} onChange={e=>setNote(e.target.value)} />
        <div className="md:col-span-4">
          <button className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white">Sembrar en {dateKey}</button>
        </div>
      </form>

      <div className="mt-4">
        {items.length === 0 ? (
          <div className="opacity-60">No hay profecías para este día.</div>
        ) : (
          <ul className="divide-y">
            {items.map(it => (
              <li key={it.id} className="py-2 flex items-start gap-2">
                <input type="checkbox" checked={!!it.done} onChange={e=>toggle(it.id, e.target.checked)} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={it.type === 'SOBRE' ? 'inline-block w-2 h-2 rounded-full bg-blue-600' : 'inline-block w-2 h-2 rounded-full bg-gray-500'}></span>
                    <div className="font-medium">{it.title}</div>
                    {it.type === 'SOBRE' && <div className="text-sm opacity-70">(${it.amount.toLocaleString()})</div>}
                  </div>
                  {it.note && <div className="text-sm opacity-80 mt-1 whitespace-pre-wrap">{it.note}</div>}
                  <div className="mt-1 flex gap-2">
                    <button className="text-xs underline opacity-80" onClick={()=>{
                      const nv = prompt('Editar nota', it.note || '')
                      if (nv !== null) updateNote(it.id, nv)
                    }}>Nota</button>
                    <button className="text-xs underline text-red-600" onClick={()=>remove(it.id)}>Eliminar</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

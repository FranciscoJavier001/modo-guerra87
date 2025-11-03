// Local-first storage for Future items (actions & 'sobres')
// Uses LocalStorage so you can test without touching Firestore.

const KEY = 'evolme.future.v1'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}
function save(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export const FUTURE_TYPES = {
  ACTION: 'ACTION',  // acción normal
  SOBRE: 'SOBRE',    // sobre azul (finanzas)
}

export function newFuture({ dateKey, title, type = FUTURE_TYPES.ACTION, amount = 0, note = '' }) {
  return {
    id: crypto.randomUUID(),
    dateKey,          // 'yyyy-MM-dd'
    title,
    type,
    amount,           // solo relevante para SOBRES
    note,             // nota visible/oculta
    done: false,
    createdAt: Date.now(),
    doneAt: null,
  }
}

export const FutureLocal = {
  all() { return load() },
  forDate(dateKey) { return load().filter(x => x.dateKey === dateKey) },
  create(item) {
    const data = load()
    data.push(item)
    save(data)
    return item
  },
  toggleDone(id, done = true) {
    const data = load().map(x => x.id === id ? { ...x, done, doneAt: done ? Date.now() : null } : x)
    save(data)
    return data.find(x => x.id === id)
  },
  updateNote(id, note) {
    const data = load().map(x => x.id === id ? { ...x, note } : x)
    save(data)
    return data.find(x => x.id === id)
  },
  remove(id) {
    const data = load().filter(x => x.id !== id)
    save(data)
  }
}

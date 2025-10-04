import React,{useState} from 'react';
import useHabits from '@/features/habits/hooks/useHabits';
import HabitList from '@/features/habits/components/HabitList';
import OfflineBanner from '@/components/OfflineBanner';
import Logout from '@/components/Logout';
export default function AppExample(){
  const { items, loading, saving, add, edit, confirmingId, askDelete, cancelDelete, confirmDelete } = useHabits();
  const [nuevo,setNuevo]=useState('');
  const agregar=async()=>{ if(!nuevo.trim()) return; await add(nuevo); setNuevo(''); };
  return (<div className="p-4 max-w-xl mx-auto">
    <h1 className="text-2xl font-bold mb-4 text-center">Modo Guerra</h1>
    <div className="mb-4">
      <input value={nuevo} onChange={(e)=>setNuevo(e.target.value)} placeholder="Nuevo hábito" className="border px-2 py-1 mr-2 rounded w-full mb-2" />
      <button onClick={agregar} className="bg-blue-500 text-white px-4 py-1 rounded w-full disabled:opacity-60" disabled={!nuevo.trim()||saving}>Agregar</button>
    </div>
    {loading ? (<p className="text-center text-gray-500">Cargando…</p>) : (
      <HabitList items={items} confirmingId={confirmingId} onAskDelete={askDelete} onCancelDelete={cancelDelete} onConfirmDelete={confirmDelete} onEdit={edit} renderFooter={(h)=>(
        <div className="text-sm text-gray-500 mt-2">
          ✅ {h.resumen?.completados||0} &nbsp; ❌ {h.resumen?.fallados||0} &nbsp; 🚫 {h.resumen?.saltados||0} &nbsp; 📅 {h.resumen?.diasTotales||0}
        </div>
      )} />
    )}
    <Logout /><OfflineBanner />
  </div>);
}

import { useCallback, useEffect, useState } from 'react';
import { obtenerHabitos, crearHabito, actualizarHabito, eliminarHabito, actualizarOrdenHabitos } from '@/services/firebaseHabits';
import { sortHabits } from '../model/habit';
export default function useHabits(){
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [confirmingId,setConfirmingId]=useState(null);
  useEffect(()=>{(async()=>{setLoading(true);try{const data=await obtenerHabitos();setItems(Array.isArray(data)?data.sort(sortHabits):[]);}finally{setLoading(false);}})();},[]);
  const add=useCallback(async(nombre)=>{const clean=(nombre||'').trim(); if(!clean) return; const nuevo={nombre:clean,registros:{},resumen:{completados:0,fallados:0,saltados:0,diasTotales:0}}; const creado=await crearHabito(nuevo); setItems(prev=>[...prev,creado].sort(sortHabits));},[]);
  const edit=useCallback(async(id,nombre)=>{setItems(prev=>prev.map(h=>h.id===id?{...h,nombre}:h)); await actualizarHabito(id,{nombre});},[]);
  const commitOrder=useCallback(async(ordered)=>{setItems(ordered); const pairs=ordered.map((h,i)=>({id:h.id,orden:i})); try{await actualizarOrdenHabitos(pairs);}catch{}},[]);
  const askDelete=useCallback((id)=>setConfirmingId(id),[]);
  const cancelDelete=useCallback(()=>setConfirmingId(null),[]);
  const confirmDelete=useCallback(async()=>{ if(!confirmingId) return; setSaving(true); try{ await eliminarHabito(confirmingId); setItems(prev=>prev.filter(h=>h.id!==confirmingId)); } finally { setSaving(false); setConfirmingId(null); } },[confirmingId]);
  return { items, loading, saving, add, edit, commitOrder, confirmingId, askDelete, cancelDelete, confirmDelete };
}

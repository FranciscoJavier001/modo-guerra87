import React, { useEffect, useState } from 'react';
import {
  crearHabito,
  obtenerHabitos,
  actualizarHabito,
  eliminarHabito,
  actualizarOrdenHabitos
} from './services/firebaseHabits';
import HabitTracker from './components/HabitTracker';
import ConfirmDialog from './components/ConfirmDialog';
import DragHandle from './components/DragHandle';
import Logout from './components/Logout';
import OfflineBanner from './components/OfflineBanner';


function App() {
  const [habitos, setHabitos] = useState([]);
  const [nuevoHabito, setNuevoHabito] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [allowDrag, setAllowDrag] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const ordenarLocal = (arr) => {
    return [...arr].sort((a,b) => {
      const ao = (a.orden ?? 999999);
      const bo = (b.orden ?? 999999);
      if (ao !== bo) return ao - bo;
    
  const handleDelete = (habito) => {
    setHabitToDelete(habito);
    setConfirmOpen(true);
  };

  const doDelete = async () => {
    if (!habitToDelete) return;
    try {
      await eliminarHabito(habitToDelete.id);
      setHabitos(prev => prev.filter(h => h.id !== habitToDelete.id));
    } catch (e) {
      alert('No se pudo eliminar: ' + (e?.message || String(e)));
    } finally {
      setConfirmOpen(false);
      setHabitToDelete(null);
    }
  };

  const onDragStart = (index) => setDraggingIndex(index);
  const onDragOver = (e) => e.preventDefault();
  const onDragEnter = (index) => setHoverIndex(index);
  const onDragLeave = () => setHoverIndex(null);

  const onDrop = async (toIndex) => {
    if (draggingIndex === null || draggingIndex === toIndex) return;
    setHabitos(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(draggingIndex, 1);
      arr.splice(toIndex, 0, moved);
      // recalcular orden localmente (0..n-1)
      const withOrder = arr.map((h, i) => ({ ...h, orden: i }));
      // persistir en firestore (no esperamos aquí)
      actualizarOrdenHabitos(withOrder.map(h => ({ id: h.id, orden: h.orden }))).catch(() => {});
      return withOrder;
    });
    setDraggingIndex(null);
    setHoverIndex(null);
  };

  return (a.nombre||'').localeCompare(b.nombre||'');
    });
  };

  useEffect(() => {
    const cargar = async () => {
      const datos = await obtenerHabitos();
      setHabitos(datos);
    };
    cargar();
  }, []);

  const agregarHabito = async () => {
    if (!nuevoHabito.trim()) return;
    const habitoObj = {
      nombre: nuevoHabito.trim(),
      registros: {},
      resumen: { completados: 0, fallados: 0, saltados: 0, diasTotales: 0 }
    };
    const creado = await crearHabito(habitoObj);
    setHabitos([...habitos, creado]);
    setNuevoHabito('');
  };

  const editarHabito = async (id, nuevoNombre) => {
    const actualizados = habitos.map(h =>
      h.id === id ? { ...h, nombre: nuevoNombre } : h
    );
    setHabitos(actualizados);
    await actualizarHabito(id, { nombre: nuevoNombre });
  };
  // (deshabilitado) borrarHabito ya no se usa; usamos handleDelete + ConfirmDialog
  const actualizarLocalmente = (actualizado) => {
    setHabitos(habitos.map(h => h.id === actualizado.id ? actualizado : h));
  };


  const handleDelete = (habito) => {
    setHabitToDelete(habito);
    setConfirmOpen(true);
  };

  const doDelete = async () => {
    if (!habitToDelete) return;
    try {
      await eliminarHabito(habitToDelete.id);
      setHabitos(prev => prev.filter(h => h.id !== habitToDelete.id));
    } catch (e) {
      alert('No se pudo eliminar: ' + (e?.message || String(e)));
    } finally {
      setConfirmOpen(false);
      setHabitToDelete(null);
    }
  };

  const onDragStart = (index) => setDraggingIndex(index);
  const onDragOver = (e) => e.preventDefault();
  const onDragEnter = (index) => setHoverIndex(index);
  const onDragLeave = () => setHoverIndex(null);

  const onDrop = async (toIndex) => {
    if (draggingIndex === null || draggingIndex === toIndex) return;
    setHabitos(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(draggingIndex, 1);
      arr.splice(toIndex, 0, moved);
      // recalcular orden localmente (0..n-1)
      const withOrder = arr.map((h, i) => ({ ...h, orden: i }));
      // persistir en firestore (no esperamos aquí)
      actualizarOrdenHabitos(withOrder.map(h => ({ id: h.id, orden: h.orden }))).catch(() => {});
      return withOrder;
    });
    setDraggingIndex(null);
    setHoverIndex(null);
  };

  return (
  <div className="p-4 max-w-xl mx-auto">

    <h1 className="text-2xl font-bold mb-4 text-center">Modo Guerra</h1>

    <div className="mb-4">
      <input
        value={nuevoHabito}
        onChange={(e) => setNuevoHabito(e.target.value)}
        placeholder="Nuevo hábito"
        className="border px-2 py-1 mr-2 rounded w-full mb-2"
      />
      <button
        onClick={agregarHabito}
        className="bg-blue-500 text-white px-4 py-1 rounded w-full"
      >
        Agregar
      </button>
    </div>

    {habitos.map(h => (
      <div key={h.id} className="bg-white shadow p-3 rounded mb-4">
        <div className="flex justify-between items-center">
          <input
            value={h.nombre}
            onChange={(e) => editarHabito(h.id, e.target.value)}
            className="border-b w-full text-lg font-medium"
          />
          <button
            onClick={() => handleDelete(h)}
            className="text-red-500 text-sm ml-2"
          >
            Eliminar
          </button>
        </div>
        <HabitTracker habit={h} onUpdateLocal={actualizarLocalmente} />
        <div className="text-sm text-gray-500 mt-2">
          ✅ {h.resumen?.completados || 0} ❌ {h.resumen?.fallados || 0} 🚫 {h.resumen?.saltados || 0} 📅 {h.resumen?.diasTotales || 0}
        </div>
      </div>
    ))}
    <Logout /> {/* Aquí va el botón de cerrar sesión */}
    <OfflineBanner />
    <ConfirmDialog
      open={confirmOpen}
      title="Eliminar hábito"
      message={habitToDelete ? `Esta acción no se puede deshacer. Para confirmar, escribe el nombre del hábito exactamente como aparece:

${habitToDelete.nombre || ''}` : ''}
      expectedText={habitToDelete?.nombre || ''}
      confirmLabel="Eliminar"
      cancelLabel="Cancelar"
      onConfirm={doDelete}
      onCancel={() => { setConfirmOpen(false); setHabitToDelete(null); }}
    />
  </div>
);
}

export default App;
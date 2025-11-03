// src/App.jsx
import React, { useEffect, useState } from 'react';
import {
  crearHabito,
  obtenerHabitos,
  actualizarHabito,
  eliminarHabito
} from './services/firebaseHabits';
import HabitTracker from './components/HabitTracker';
import Logout from './components/Logout';
import OfflineBanner from './components/OfflineBanner';

// Acciones nuevas
import HabitActionsCounter from "./components/actions/HabitActionsCounter";
import HabitActionsButtons from "./components/actions/HabitActionsButtons";

// Pantalla Social (lupa)
import Social from "./screens/Social";

import FuturePlanner from './future/FuturePlanner'; // ajusta la ruta según tu estructura

function App() {
  const [habitos, setHabitos] = useState([]);
  const [nuevoHabito, setNuevoHabito] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);
  const [view, setView] = useState("home"); // 'home' | 'social'
  const [plannerFor, setPlannerFor] = useState(null); // habitId | null

  // true = estás viendo TU perfil (botones deshabilitados)
  // false = estás viendo el perfil de un amigo (botones habilitados)
  const isMyProfile = true;

  // Cargar hábitos
  useEffect(() => {
    const cargar = async () => {
      const datos = await obtenerHabitos();
      setHabitos(datos || []);
    };
    cargar();
  }, []);

  // Crear hábito
  const agregarHabito = async () => {
    const nombre = (nuevoHabito || '').trim();
    if (!nombre) return;

    const habitoObj = {
      nombre,
      registros: {},
      resumen: { completados: 0, fallados: 0, saltados: 0, diasTotales: 0 }
    };
    const creado = await crearHabito(habitoObj);

    setHabitos(prev => [...prev, creado]);
    setNuevoHabito('');
  };

  // Editar nombre
  const editarHabito = async (id, nuevoNombre) => {
    const nombre = (nuevoNombre || '').trimStart();
    setHabitos(prev => prev.map(h => (h.id === id ? { ...h, nombre } : h)));
    await actualizarHabito(id, { nombre });
  };

  // Actualización local de un hábito (desde HabitTracker)
  const actualizarLocalmente = (actualizado) => {
    setHabitos(prev => prev.map(h => (h.id === actualizado.id ? actualizado : h)));
  };

  // Confirmación en dos pasos para eliminar
  const askDelete = (id) => setConfirmingId(id);
  const cancelDelete = () => setConfirmingId(null);
  const confirmDelete = async (id) => {
    try {
      await eliminarHabito(id);
      setHabitos(prev => prev.filter(h => h.id !== id));
    } catch (e) {
      alert('No se pudo eliminar: ' + (e?.message || String(e)));
    } finally {
      setConfirmingId(null);
    }
  };

  // -------- Vista Social (lupa) --------
  if (view === "social") {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Social</h1>
          <button
            className="rounded-xl border border-neutral-200 px-3 py-2 text-sm shadow-sm hover:bg-neutral-50"
            onClick={() => setView("home")}
          >
            ← Volver
          </button>
        </div>
        <Social />
      </div>
    );
  }

  // -------- Vista Home --------
  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">EvolMe</h1>

        {/* Lupa: abre la pantalla Social (A1) */}
        <button
          aria-label="Buscar amigos"
          title="Buscar amigos"
          onClick={() => setView("social")}
          className="rounded-xl border border-neutral-200 px-3 py-2 text-sm shadow-sm hover:bg-neutral-50"
        >
          🔎
        </button>
      </div>

      <div className="mb-4">
        <input
          value={nuevoHabito}
          onChange={(e) => setNuevoHabito(e.target.value)}
          placeholder="Nuevo hábito"
          className="border px-2 py-1 mr-2 rounded w-full mb-2 mt-2"
        />
        <button
          onClick={agregarHabito}
          className="bg-blue-500 text-white px-4 py-1 rounded w-full"
        >
          Agregar
        </button>
      </div>

      {habitos.map((h) => (
  <div key={h.id} className="bg-white shadow p-3 rounded mb-4">
    {/* Header: 📅 + input (izq)  |  🗑️ (der) */}
    <div className="flex justify-between items-center gap-3 mt-2">
      <div className="flex items-center gap-2 flex-1">
        {/* 📅 Calendario (placeholder; luego lo conectamos al MonthCalendar) */}
        <button
          type="button"
          title="Calendario"
          aria-label="Abrir calendario"
          className="shrink-0 text-xl leading-none hover:scale-110 transition"
          onClick={() => setPlannerFor(h.id)}
        >
          📅
        </button>

        <input
          value={h.nombre || ''}
          onChange={(e) => editarHabito(h.id, e.target.value)}
          className="border-b w-full text-lg font-medium mb-1"
        />
      </div>

      {confirmingId === h.id ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
            onClick={() => confirmDelete(h.id)}
          >
            Confirmar
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm"
            onClick={cancelDelete}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="text-red-600 hover:text-red-700 text-sm"
          onClick={() => askDelete(h.id)}
        >
          🗑️
        </button>
      )}
    </div>

    {/* Grid de días */}
    <HabitTracker habit={h} onUpdateLocal={actualizarLocalmente} />

    {/* Fila inferior: resumen + contador de acciones */}
    <div className="mt-2 flex items-center justify-between">
      <div className="text-sm text-gray-500">
        ✅ {h.resumen?.completados || 0} &nbsp;
        ❌ {h.resumen?.fallados || 0} &nbsp;
        🚫 {h.resumen?.saltados || 0} &nbsp;
        📅 {h.resumen?.diasTotales || 0}
      </div>
      <HabitActionsCounter scopeKey={`habit:${h.id}`} />
    </div>

    {/* Botones debajo del grid */}
    <HabitActionsButtons
      scopeKey={`habit:${h.id}`}
      disabled={isMyProfile}
      shareData={{
        title: "Mi hábito en EvolMe",
        text: `Estoy construyendo el hábito: "${h.nombre || "Hábito"}"`,
      }}
    />
  </div>
))}
      
{plannerFor && (
  <div
    className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4"
    onClick={() => setPlannerFor(null)} // cerrar al click en backdrop
  >
    <div
      className="bg-white rounded-2xl w-full max-w-lg shadow-xl border"
      onClick={(e) => e.stopPropagation()} // evita cerrar al click interno
    >
      <div className="flex items-center justify-between p-3 border-b">
        <div className="font-semibold">EvolMe · Future Planner (local)</div>
        <button
          className="px-2 py-1 rounded hover:bg-gray-100"
          onClick={() => setPlannerFor(null)}
        >
          ✖
        </button>
      </div>

      <div className="p-3">
        <FuturePlanner />
      </div>
    </div>
  </div>
)}

      <Logout />
      <OfflineBanner />
    </div>
  );
}

export default App;

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

function App() {
  const [habitos, setHabitos] = useState([]);
  const [nuevoHabito, setNuevoHabito] = useState('');
  const [confirmingId, setConfirmingId] = useState(null); // ← confirmación en 2 pasos

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

    // Si tu crearHabito espera SOLO el nombre:
    // const creado = await crearHabito(nombre);

    // Si tu crearHabito espera el objeto completo (como lo tienes):
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
    const nombre = (nuevoNombre || '').trimStart(); // deja escribir, pero sin espacios iniciales
    setHabitos(prev => prev.map(h => (h.id === id ? { ...h, nombre } : h)));
    await actualizarHabito(id, { nombre });
  };

  // Para que HabitTracker actualice localmente campos internos del hábito
  const actualizarLocalmente = (actualizado) => {
    setHabitos(prev => prev.map(h => (h.id === actualizado.id ? actualizado : h)));
  };

  // --- Confirmación en dos pasos ---
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

      {habitos.map((h) => (
        <div key={h.id} className="bg-white shadow p-3 rounded mb-4">
          <div className="flex justify-between items-center gap-3">
            <input
              value={h.nombre || ''}
              onChange={(e) => editarHabito(h.id, e.target.value)}
              className="border-b w-full text-lg font-medium"
            />

            {confirmingId === h.id ? (
              <div className="flex items-center gap-2">
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
                Eliminar
              </button>
            )}
          </div>

          <HabitTracker habit={h} onUpdateLocal={actualizarLocalmente} />

          <div className="text-sm text-gray-500 mt-2">
            ✅ {h.resumen?.completados || 0} &nbsp;
            ❌ {h.resumen?.fallados || 0} &nbsp;
            🚫 {h.resumen?.saltados || 0} &nbsp;
            📅 {h.resumen?.diasTotales || 0}
          </div>
        </div>
      ))}

      <Logout />
      <OfflineBanner />
    </div>
  );
}

export default App;

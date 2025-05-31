import React, { useEffect, useState } from 'react';
import {
  crearHabito,
  obtenerHabitos,
  actualizarHabito,
  eliminarHabito
} from './services/firebaseHabits';
import HabitTracker from './components/HabitTracker';

function App() {
  const [habitos, setHabitos] = useState([]);
  const [nuevoHabito, setNuevoHabito] = useState('');

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

  const borrarHabito = async (id) => {
    await eliminarHabito(id);
    setHabitos(habitos.filter(h => h.id !== id));
  };

  const actualizarLocalmente = (actualizado) => {
    setHabitos(habitos.map(h => h.id === actualizado.id ? actualizado : h));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mis Hábitos (sincronizados)</h1>
      <div className="mb-4">
        <input
          value={nuevoHabito}
          onChange={(e) => setNuevoHabito(e.target.value)}
          placeholder="Nuevo hábito"
          className="border px-2 py-1 mr-2 rounded"
        />
        <button
          onClick={agregarHabito}
          className="bg-blue-500 text-white px-4 py-1 rounded"
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
              onClick={() => borrarHabito(h.id)}
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
    </div>
  );
}

export default App;
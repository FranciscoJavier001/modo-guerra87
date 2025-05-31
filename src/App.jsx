import React, { useEffect, useState } from 'react';
import {
  crearHabito,
  obtenerHabitos,
  actualizarHabito,
  eliminarHabito
} from './services/firebaseHabits';

function App() {
  const [habitos, setHabitos] = useState([]);
  const [nuevoHabito, setNuevoHabito] = useState('');

  // Cargar hábitos desde Firestore al iniciar
  useEffect(() => {
    const cargar = async () => {
      const datos = await obtenerHabitos();
      setHabitos(datos);
    };
    cargar();
  }, []);

  // Crear hábito nuevo
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

  // Actualizar nombre del hábito
  const editarHabito = async (id, nuevoNombre) => {
    const actualizados = habitos.map(h =>
      h.id === id ? { ...h, nombre: nuevoNombre } : h
    );
    setHabitos(actualizados);
    await actualizarHabito(id, { nombre: nuevoNombre });
  };

  // Eliminar hábito
  const borrarHabito = async (id) => {
    await eliminarHabito(id);
    setHabitos(habitos.filter(h => h.id !== id));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mis Hábitos (en la nube)</h1>
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
        <div key={h.id} className="bg-white shadow p-3 rounded mb-2">
          <input
            value={h.nombre}
            onChange={(e) => editarHabito(h.id, e.target.value)}
            className="border-b w-full text-lg font-medium"
          />
          <button
            onClick={() => borrarHabito(h.id)}
            className="text-red-500 text-sm mt-1"
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
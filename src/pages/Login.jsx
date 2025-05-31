// src/pages/Login.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login, registro } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [esNuevo, setEsNuevo] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (esNuevo) {
        await registro(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError('Error en la autenticación');
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto mt-20 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">
        {esNuevo ? 'Crear cuenta' : 'Iniciar sesión'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {esNuevo ? 'Registrarse' : 'Entrar'}
        </button>
        <p
          onClick={() => setEsNuevo(!esNuevo)}
          className="text-sm text-center text-blue-500 cursor-pointer"
        >
          {esNuevo
            ? '¿Ya tienes cuenta? Inicia sesión'
            : '¿No tienes cuenta? Regístrate'}
        </p>
      </form>
    </div>
  );
}

export default Login;
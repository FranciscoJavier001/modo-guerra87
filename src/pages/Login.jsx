import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useOnline from '../hooks/useOnline';
import OnlineGuard from '../components/OnlineGuard';

export default function Login() {
  const { login, registro } = useAuth();
  const [email, setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [esNuevo, setEsNuevo] = useState(false);
  const [error, setError]   = useState('');
  const online = useOnline();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!online) { setError('Sin conexión'); return; }
    try {
      setError('');
      if (esNuevo) await registro(email, password);
      else         await login(email, password);
    } catch (err) {
      if (err?.code === 'auth/network-request-failed') {
        setError('Sin conexión a Internet. Intenta más tarde.');
      } else {
        setError(err?.message || 'Error en la autenticación');
      }
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto bg-white dark:bg-zinc-900 shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-zinc-100">
        {esNuevo ? 'Crear cuenta' : 'Iniciar sesión'}
      </h2>
      <OnlineGuard onOffline={() => setError('Sin conexión')}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" placeholder="Correo electrónico"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded" required />
          <input type="password" placeholder="Contraseña"
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
            disabled={!online}
          >
            {online ? (esNuevo ? 'Registrarse' : 'Entrar') : 'Sin conexión'}
          </button>
          <p onClick={() => setEsNuevo(!esNuevo)}
             className="text-sm text-center text-blue-500 cursor-pointer">
            {esNuevo ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </p>
        </form>
      </OnlineGuard>
    </div>
  );
}

// src/components/Logout.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';

function Logout() {
  const { logout, usuario } = useAuth();

  return (
    <div className="text-right mb-4">
      <button
        onClick={logout}
        className="text-sm px-3 py-1 bg-red-500 text-white rounded w-full"
      >
        Cerrar sesión
      </button>
      <p className="text-sm text-gray-500 mb-1">Sesión: {usuario?.email}</p>
    </div>
  );
}

export default Logout;
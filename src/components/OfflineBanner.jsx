
import React from 'react';
import useOnline from '../hooks/useOnline';

export default function OfflineBanner() {
  const online = useOnline();
  if (online) return null;

  return (
    <div className="fixed bottom-3 inset-x-0 z-[12000] px-3">
      <div className="mx-auto max-w-md rounded-2xl shadow-lg bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 p-3 text-amber-900 dark:text-amber-100 text-sm text-center">
        Sin conexión. Algunas acciones (registrarse, iniciar sesión, escribir en la nube) no están disponibles.
      </div>
    </div>
  );
}

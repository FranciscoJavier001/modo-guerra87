
import React, { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export default function UpdateToast() {
  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSW, setUpdateSW] = useState(() => () => {});

  useEffect(() => {
    // registra el SW y recibe callbacks de estado
    const update = registerSW({
      immediate: true,
      onRegisteredSW(swUrl, reg) {
        // opcional: console.log('SW registrado:', swUrl, reg);
      },
      onOfflineReady() {
        setOfflineReady(true);
        setTimeout(() => setOfflineReady(false), 4000);
      },
      onNeedRefresh() {
        setNeedRefresh(true);
      }
    });
    setUpdateSW(() => update);
  }, []);

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-3 inset-x-0 z-[11000] px-3">
      <div className="mx-auto max-w-md rounded-2xl shadow-lg bg-white/95 dark:bg-zinc-900/95 backdrop-blur border border-gray-200 dark:border-zinc-800 p-3 flex items-center justify-between gap-3">
        <div className="text-sm text-gray-800 dark:text-zinc-200">
          {needRefresh ? 'Hay una nueva versión disponible.' : 'Lista para usarse sin conexión.'}
        </div>
        <div className="flex items-center gap-2">
          {needRefresh && (
            <button
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
              onClick={() => updateSW(true)}
            >
              Actualizar
            </button>
          )}
          <button
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-sm text-gray-800 dark:text-zinc-100"
            onClick={() => { setNeedRefresh(false); setOfflineReady(false); }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import useOnline from '../hooks/useOnline';

/**
 * Intercepta onSubmit cuando está offline y muestra alert.
 * Uso:
 *  <OnlineGuard onOffline={() => setError('Sin conexión')}>
 *    <form onSubmit={handleSubmit}>...</form>
 *  </OnlineGuard>
 */
export default function OnlineGuard({ children, onOffline }) {
  const online = useOnline();

  const handle = (e) => {
    if (!online) {
      e.preventDefault();
      e.stopPropagation();
      onOffline?.();
      if (!onOffline) alert('Sin conexión a Internet');
    }
  };

  return (
    <div onSubmit={handle}>
      {children}
    </div>
  );
}

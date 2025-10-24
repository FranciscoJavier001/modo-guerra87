import React, { useState } from "react";

export default function Social() {
  const [q, setQ] = useState("");

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-3">Buscar amigos</h2>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Busca por nombre o usuario…"
        className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-300"
      />
      {/* Aquí irían resultados */}
      <div className="mt-4 text-sm text-neutral-500">
        (Próximamente: resultados y perfiles)
      </div>
    </div>
  );
}

// src/components/calendar/CalendarTrigger.jsx
import React, { useRef, useState } from 'react';
import MonthCalendar from './MonthCalendar';

export default function CalendarTrigger({
  statusMap,         // {dateKey: status}
  onDayPick          // (Date) => void
}) {
  const [open, setOpen] = useState(false);
  const [monthDate, setMonthDate] = useState(new Date());
  const ref = useRef(null);

  // Cerrar si clic fuera
  React.useEffect(() => {
    const handler = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="px-2 py-1 rounded border bg-white hover:bg-gray-50"
        onClick={() => setOpen(v => !v)}
        title="Calendario"
      >📅</button>

      {open && (
        <div className="absolute z-50 mt-2">
          <MonthCalendar
            monthDate={monthDate}
            setMonthDate={setMonthDate}
            statusMap={statusMap}
            onSelectDay={(d) => { onDayPick(d); setOpen(false); }}
          />
        </div>
      )}
    </div>
  );
}

import React from 'react';
import HabitItem from './HabitItem';
export default function HabitList({ items, confirmingId, onAskDelete, onCancelDelete, onConfirmDelete, onEdit, renderFooter }){
  return (<>
    {items.map(h => (
      <HabitItem key={h.id} habit={h} confirming={confirmingId===h.id} onAskDelete={onAskDelete} onCancelDelete={onCancelDelete} onConfirmDelete={onConfirmDelete} onEdit={onEdit} footer={renderFooter?renderFooter(h):null} />
    ))}
  </>);
}

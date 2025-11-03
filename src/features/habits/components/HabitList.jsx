import HabitItem from './HabitItem';

export default function HabitList({ habits = [] }) {
  return (
    <div className="space-y-3">
      {habits.map(h => (
        <HabitItem key={h.id} habit={h} />
      ))}
    </div>
  );
}
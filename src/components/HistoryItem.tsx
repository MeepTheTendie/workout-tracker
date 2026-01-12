import type { Entry, Exercise } from '../lib/types';

interface HistoryItemProps {
  entry: Entry;
  onDelete?: () => void; // <--- Added this prop
}

export function HistoryItem({ entry, onDelete }: HistoryItemProps) {
  const containerClass = "relative p-4 mb-2 bg-gray-900 border border-gray-800 rounded-lg group";
  
  // Delete Button (Only shows if onDelete is passed)
  const DeleteBtn = () => onDelete ? (
    <button 
      onClick={(e) => { e.stopPropagation(); onDelete(); }}
      className="absolute top-2 right-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      title="Delete Entry"
    >
      🗑️
    </button>
  ) : null;

  // 1. WORKOUTS
  if (entry.type === 'workout') {
    return (
      <div className={containerClass}>
        <DeleteBtn />
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-purple-400">{entry.workoutType}</span>
          <span className="text-xs text-gray-500 pr-6">{entry.date}</span>
        </div>
        
        <div className="space-y-1">
          {entry.exercises.map((ex: Exercise, i: number) => (
            <div key={i} className="flex justify-between text-sm text-gray-300">
              <span>{ex.name}</span>
              <span className="text-gray-500">
                {ex.sets} x {ex.reps}
              </span>
            </div>
          ))}
        </div>
        {entry.notes && <div className="mt-2 text-xs text-gray-600">{entry.notes}</div>}
      </div>
    );
  }

  // 2. ACTIVITIES
  if (entry.type === 'activity') {
    return (
      <div className={containerClass}>
        <DeleteBtn />
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold text-blue-400 block">{entry.activityType}</span>
            <span className="text-xs text-gray-500">{entry.date}</span>
          </div>
          <div className="text-xl font-bold text-white pr-6">
            {entry.duration} <span className="text-sm font-normal text-gray-500">min</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. CHECKINS
  if (entry.type === 'checkin') {
    return (
      <div className="relative p-3 mb-2 bg-black border border-gray-800 rounded-lg flex justify-between items-center group">
        <DeleteBtn />
        <div>
          <span className="font-semibold text-green-500">{entry.checkinType}</span>
          <span className="text-xs text-gray-600 ml-2">{entry.date}</span>
        </div>
        <span className="text-green-500 pr-6">✔</span>
      </div>
    );
  }

  // 4. QUICK LOGS
  if (entry.type === 'quick_log') {
    return (
      <div className={containerClass}>
        <DeleteBtn />
        <div className="flex justify-between mb-1">
          <span className="font-bold text-yellow-500">Quick Log</span>
          <span className="text-xs text-gray-500 pr-6">{entry.date}</span>
        </div>
        <div className="text-sm text-gray-300">{entry.description}</div>
      </div>
    );
  }

  return null;
}
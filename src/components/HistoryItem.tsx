import type { Entry, Exercise } from '../lib/types';

interface HistoryItemProps {
  entry: Entry;
  onDelete?: () => void;
}

export function HistoryItem({ entry, onDelete }: HistoryItemProps) {
  // Base glass style + hover effect
  const baseClass = "relative p-4 mb-3 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/60 rounded-xl group transition-all duration-200 hover:bg-zinc-800/60 hover:shadow-lg hover:border-zinc-700";

  // Delete Button Component
  const DeleteBtn = () => onDelete ? (
    <button 
      onClick={(e) => { e.stopPropagation(); onDelete(); }}
      className="absolute top-3 right-3 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
      title="Delete Entry"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
    </button>
  ) : null;

  // 1. WORKOUTS (Dumbbells / Gym)
  if (entry.type === 'workout') {
    return (
      <div className={`${baseClass} border-l-4 border-l-purple-500/50`}>
        <DeleteBtn />
        <div className="flex justify-between items-start mb-3 pr-8">
          <div>
            <span className="block text-sm font-bold text-white tracking-wide">{entry.workoutType}</span>
            <span className="text-xs text-zinc-500 font-mono">{entry.date}</span>
          </div>
        </div>
        
        <div className="space-y-1.5">
          {entry.exercises.map((ex: Exercise, i: number) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-zinc-300 font-medium">{ex.name}</span>
              <span className="text-zinc-500 font-mono text-xs bg-zinc-800/50 px-2 py-0.5 rounded">
                {ex.sets} × {ex.reps}
              </span>
            </div>
          ))}
        </div>
        {entry.notes && (
          <div className="mt-3 pt-2 border-t border-zinc-800/50 text-xs text-zinc-500 italic">
            "{entry.notes}"
          </div>
        )}
      </div>
    );
  }

  // 2. ACTIVITIES (Bike / Cardio)
  if (entry.type === 'activity') {
    return (
      <div className={`${baseClass} border-l-4 border-l-blue-500/50`}>
        <DeleteBtn />
        <div className="flex justify-between items-center">
          <div>
            <span className="block text-sm font-bold text-white tracking-wide">{entry.activityType}</span>
            <span className="text-xs text-zinc-500 font-mono">{entry.date}</span>
          </div>
          <div className="text-right pr-6">
            <div className="text-xl font-black text-white leading-none">
              {entry.duration} <span className="text-sm font-medium text-zinc-500">min</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. CHECKINS (Squats)
  if (entry.type === 'checkin') {
    return (
      <div className={`${baseClass} border-l-4 border-l-emerald-500/50 flex justify-between items-center py-3`}>
        <DeleteBtn />
        <div>
          <span className="block text-sm font-semibold text-emerald-100">{entry.checkinType}</span>
          <span className="text-xs text-zinc-600 font-mono">{entry.date}</span>
        </div>
        <div className="pr-8 text-emerald-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
      </div>
    );
  }

  // 4. QUICK LOGS
  if (entry.type === 'quick_log') {
    return (
      <div className={`${baseClass} border-l-4 border-l-amber-500/50`}>
        <DeleteBtn />
        <div className="flex justify-between mb-2">
          <span className="text-sm font-bold text-amber-500">Quick Log</span>
          <span className="text-xs text-zinc-500 font-mono pr-8">{entry.date}</span>
        </div>
        <div className="text-sm text-zinc-300 leading-relaxed">{entry.description}</div>
      </div>
    );
  }

  return null;
}
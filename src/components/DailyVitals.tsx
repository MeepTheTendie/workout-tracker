import { useMemo } from 'react';
import type { Entry } from '../lib/types';

interface DailyVitalsProps {
  entries: Entry[];
}

export function DailyVitals({ entries }: DailyVitalsProps) {
  const todayStr = useMemo(() => {
    const d = new Date();
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
  }, []);

  const status = useMemo(() => {
    const todayEntries = entries.filter((e) => e.date === todayStr);
    const mSquats = todayEntries.some(e => e.type === 'checkin' && e.checkinType === 'Morning Squats' && e.value);
    const nSquats = todayEntries.some(e => e.type === 'checkin' && e.checkinType === 'Night Squats' && e.value);
    const bikeMins = todayEntries
      .filter(e => e.type === 'activity' && e.activityType === 'Cycling')
      .reduce((sum, e) => sum + (e.type === 'activity' && e.duration ? e.duration : 0), 0);

    return { mSquats, nSquats, bikeMins };
  }, [entries, todayStr]);

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      
      {/* 1. Bike Card (Span 2 columns) */}
      <div className="col-span-2 glass-panel p-4 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className="w-16 h-16 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/></svg>
        </div>
        
        <div className="relative z-10">
          <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Cardio Protocol</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-white">{status.bikeMins}</span>
            <span className="text-sm font-medium text-zinc-500 mb-1.5">/ 60 min</span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min((status.bikeMins / 60) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Morning Squats */}
      <div className={`glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all ${status.mSquats ? 'border-emerald-500/30 bg-emerald-900/10' : 'border-zinc-800'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${status.mSquats ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
          {status.mSquats ? '✓' : 'AM'}
        </div>
        <span className={`text-xs font-bold uppercase tracking-wider ${status.mSquats ? 'text-emerald-400' : 'text-zinc-600'}`}>
          Morning
        </span>
      </div>

      {/* 3. Night Squats */}
      <div className={`glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all ${status.nSquats ? 'border-indigo-500/30 bg-indigo-900/10' : 'border-zinc-800'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${status.nSquats ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
          {status.nSquats ? '✓' : 'PM'}
        </div>
        <span className={`text-xs font-bold uppercase tracking-wider ${status.nSquats ? 'text-indigo-400' : 'text-zinc-600'}`}>
          Night
        </span>
      </div>

    </div>
  );
}
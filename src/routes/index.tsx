import { createFileRoute } from '@tanstack/react-router';
import { useEntries } from '../lib/queries';
import { DailyVitals } from '../components/DailyVitals';
import { HistoryItem } from '../components/HistoryItem'; // Use the component we made!
import type { Entry } from '../lib/types';

export const Route: any = createFileRoute('/' as any)({
  component: Index,
});

function Index() {
  const { entries, isLoading } = useEntries();

  // Sort: Newest first
  const sortedEntries = entries?.sort((a: Entry, b: Entry) => {
    const timeA = new Date(a.createdAt || a.date).getTime();
    const timeB = new Date(b.createdAt || b.date).getTime();
    return timeB - timeA;
  }) || [];

  if (isLoading) return <div className="p-8 text-center text-zinc-500 animate-pulse">Syncing Database...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Vitals HUD */}
      <DailyVitals entries={sortedEntries} />

      {/* Feed Header */}
      <div className="flex items-center gap-3 mb-4 mt-8 px-1">
        <h2 className="text-lg font-bold text-white tracking-tight">Recent Activity</h2>
        <div className="h-px bg-zinc-800 flex-1"></div>
      </div>

      {/* List */}
      <div className="space-y-3 pb-8">
        {sortedEntries.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center border-dashed border-zinc-700">
            <p className="text-zinc-500">No logs found.</p>
            <p className="text-zinc-600 text-sm mt-1">Start the protocol to see data.</p>
          </div>
        ) : (
          sortedEntries.map((entry: Entry) => (
             // Pass a dummy function or the real mutation if you want delete
            <HistoryItem key={entry.id || Math.random()} entry={entry} onDelete={() => console.log('Implement delete')} />
          ))
        )}
      </div>
    </div>
  );
}
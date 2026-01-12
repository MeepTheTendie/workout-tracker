import { createFileRoute } from '@tanstack/react-router';
import { useEntries } from '../lib/queries';
import { DailyVitals } from '../components/DailyVitals';
import type { Entry } from '../lib/types'; // <--- Added "type"

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  // FIXED: Destructure correctly based on your existing hook
  const { entries, isLoading } = useEntries();

  const sortedEntries =
    entries?.sort((a: Entry, b: Entry) => {
      // Prefer createdAt if available, fallback to date
      const timeA = new Date(a.createdAt || a.date).getTime();
      const timeB = new Date(b.createdAt || b.date).getTime();
      return timeB - timeA;
    }) || [];

  if (isLoading) {
    return <div style={{ padding: '20px', color: '#888' }}>Loading your protocol...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      
      {/* HEADER */}
      <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Gatekeeper</h1>
        <span style={{ fontSize: '0.9rem', color: '#666' }}>{new Date().toLocaleDateString()}</span>
      </header>

      {/* VITALS STRIP */}
      <DailyVitals entries={sortedEntries} />

      {/* ACTIVITY FEED */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px', marginTop: '32px', color: '#ddd' }}>
        Recent Logs
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sortedEntries.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666', border: '1px dashed #333', borderRadius: '8px' }}>
            No activity logged yet.
          </div>
        ) : (
          sortedEntries.map((entry: Entry) => <FeedCard key={entry.id || Math.random()} entry={entry} />)
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: FEED CARD ---
function FeedCard({ entry }: { entry: Entry }) {
  const cardStyle = {
    padding: '16px',
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: '4px',
  };

  // 1. WORKOUTS (Dumbbells / Gym)
  if (entry.type === 'workout') {
    return (
      <div style={cardStyle}>
        <div style={headerStyle}>
          <span style={{ color: '#a855f7', fontWeight: 'bold' }}>WORKOUT</span>
          <span>{entry.date}</span>
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{entry.workoutType}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
          {entry.exercises.map((ex, i) => (
            <div key={i} style={{ fontSize: '0.9rem', color: '#ccc', display: 'flex', justifyContent: 'space-between' }}>
              <span>{ex.name}</span>
              <span style={{ color: '#666' }}>
                {ex.sets} x {ex.reps}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. ACTIVITIES (Bike / Cardio)
  if (entry.type === 'activity') {
    return (
      <div style={cardStyle}>
        <div style={headerStyle}>
          <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>ACTIVITY</span>
          <span>{entry.date}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{entry.activityType}</span>
          <span style={{ fontSize: '1.2rem' }}>{entry.duration}m</span>
        </div>
      </div>
    );
  }

  // 3. CHECK-INS (Squats)
  if (entry.type === 'checkin') {
    return (
      <div style={{ ...cardStyle, borderColor: '#222', backgroundColor: '#0a0a0a' }}>
        <div style={headerStyle}>
          <span style={{ color: '#22c55e', fontWeight: 'bold' }}>CHECK-IN</span>
          <span>{entry.date}</span>
        </div>
        <div>
          {entry.checkinType} <span style={{ color: '#666' }}>— Completed</span>
        </div>
      </div>
    );
  }

  return null;
}
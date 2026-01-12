import { useMemo } from 'react';
import type { Entry } from '../lib/types'; // <--- Added "type" here

interface DailyVitalsProps {
  entries: Entry[];
}

export function DailyVitals({ entries }: DailyVitalsProps) {
  // 1. Get Today's Date in YYYY-MM-DD format (local time)
  const todayStr = useMemo(() => {
    const d = new Date();
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
  }, []);

  // 2. Compute Status
  const status = useMemo(() => {
    const todayEntries = entries.filter((e) => e.date === todayStr);

    const mSquats = todayEntries.some(
      (e) => e.type === 'checkin' && e.checkinType === 'Morning Squats' && e.value
    );

    const nSquats = todayEntries.some(
      (e) => e.type === 'checkin' && e.checkinType === 'Night Squats' && e.value
    );

    // Sum up bike minutes
    const bikeMins = todayEntries
      .filter((e) => e.type === 'activity' && e.activityType === 'Cycling')
      .reduce((sum, e) => {
         // Safe access with type guard
         if (e.type === 'activity' && e.duration) {
             return sum + e.duration;
         }
         return sum;
      }, 0);

    return { mSquats, nSquats, bikeMins };
  }, [entries, todayStr]);

  // 3. Simple Styles
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '12px',
    marginBottom: '24px',
    padding: '16px',
    background: '#1a1a1a', 
    borderRadius: '12px',
    color: '#fff',
    border: '1px solid #333',
  };

  const itemStyle = (done: boolean) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    borderRadius: '8px',
    background: done ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
    border: done ? '1px solid #22c55e' : '1px solid transparent',
    color: done ? '#22c55e' : '#888',
    transition: 'all 0.2s',
  });

  return (
    <div style={containerStyle}>
      {/* Morning Squats */}
      <div style={itemStyle(status.mSquats)}>
        <span style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
          {status.mSquats ? '✅' : '⏳'}
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>AM Squats</span>
      </div>

      {/* The Bike */}
      <div style={itemStyle(status.bikeMins >= 60)}>
        <span style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🚴</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
          {status.bikeMins} / 60 min
        </span>
        {/* Simple Progress Bar */}
        <div style={{ width: '100%', height: '4px', background: '#333', marginTop: '8px', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${Math.min((status.bikeMins / 60) * 100, 100)}%`, 
            height: '100%', 
            background: status.bikeMins >= 60 ? '#22c55e' : '#3b82f6' 
          }} />
        </div>
      </div>

      {/* Night Squats */}
      <div style={itemStyle(status.nSquats)}>
        <span style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
          {status.nSquats ? '✅' : '🌙'}
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>PM Squats</span>
      </div>
    </div>
  );
}
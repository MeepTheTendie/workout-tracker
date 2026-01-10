import { format } from 'date-fns'
import type { Entry } from '../lib/types'

export function HistoryItem({ entry, onDelete }: { entry: Entry; onDelete: () => void }) {
  const pills = []
  
  if (entry.type === 'workout') pills.push(<span key="t" className="badge">Workout</span>)
  if (entry.type === 'quick_log') pills.push(<span key="t" className="badge">Quick Log</span>)
  if (entry.type === 'checkin') pills.push(<span key="t" className="badge gray">Check-in</span>)
  if (entry.type === 'activity') pills.push(<span key="t" className="badge good">Activity</span>)

  if ('loggedBy' in entry) pills.push(<span key="lb" className="badge gray">{entry.loggedBy}</span>)
  if ('workoutType' in entry) pills.push(<span key="wt" className="badge gray">{entry.workoutType}</span>)
  if ('location' in entry) pills.push(<span key="loc" className="badge gray">{entry.location}</span>)
  if ('activityType' in entry) pills.push(<span key="at" className="badge gray">{entry.activityType}</span>)

  const renderBody = () => {
    switch (entry.type) {
      case 'workout':
        return (
          <>
            {entry.duration && <div><strong>Duration:</strong> {entry.duration} min</div>}
            <div style={{ marginTop: 8 }}>
              {entry.exercises.map((ex, i) => (
                <div key={i} style={{ margin: '6px 0' }}>
                  <strong>{ex.name}</strong>
                  {ex.equipment && <span className="muted"> ({ex.equipment})</span>}
                  {ex.load && <div className="muted">Load: {ex.load}</div>}
                  {(ex.sets || ex.reps) && <div className="muted">{ex.sets || '?'}×{ex.reps || '?'}</div>}
                  {ex.notes && <div className="muted">{ex.notes}</div>}
                </div>
              ))}
            </div>
            {entry.notes && <div className="muted" style={{ marginTop: 8 }}><strong>Notes:</strong> {entry.notes}</div>}
          </>
        )
      case 'quick_log':
        return (
          <>
            {entry.duration && <div><strong>Duration:</strong> {entry.duration} min</div>}
            <div style={{ marginTop: 8 }}>
              {entry.exercises.map((ex, i) => (
                <div key={i} style={{ margin: '4px 0' }}>
                  • <strong>{ex.name}</strong>{ex.details ? ` - ${ex.details}` : ''}
                </div>
              ))}
            </div>
            {entry.notes && <div className="muted" style={{ marginTop: 8 }}>{entry.notes}</div>}
          </>
        )
      case 'checkin':
        return (
          <>
            {entry.bodyweight && <div><strong>Weight:</strong> {entry.bodyweight} lb</div>}
            {entry.sleep && <div><strong>Sleep:</strong> {entry.sleep} hrs</div>}
            <div><strong>Soreness:</strong> {entry.soreness}/10 {entry.sorenessAreas?.length > 0 && `(${entry.sorenessAreas.join(', ')})`}</div>
            <div><strong>Energy:</strong> {entry.energy}/10</div>
            <div><strong>Motivation:</strong> {entry.motivation}/10</div>
            {entry.notes && <div className="muted" style={{ marginTop: 6 }}>{entry.notes}</div>}
          </>
        )
      case 'activity':
        return (
          <>
            {entry.duration && <div><strong>Duration:</strong> {entry.duration} min</div>}
            <div><strong>Intensity:</strong> {entry.intensity}/10</div>
            {entry.bike && (
              <>
                <div><strong>Resistance:</strong> {entry.bike.resistance}</div>
                {entry.bike.avgSpeed && <div><strong>Avg Speed:</strong> {entry.bike.avgSpeed} mph</div>}
                {entry.bike.calories && <div><strong>Calories:</strong> {entry.bike.calories}</div>}
              </>
            )}
            {entry.notes && <div className="muted" style={{ marginTop: 6 }}>{entry.notes}</div>}
          </>
        )
    }
  }

  return (
    <div className="history-item">
      <div className="history-head">
        <div className="history-date">
            {format(new Date(entry.date + 'T00:00:00'), 'EEE, MMM d, yyyy')}
        </div>
        <div className="pillrow">{pills}</div>
      </div>
      <div>{renderBody()}</div>
      <button className="del" onClick={onDelete}>Delete</button>
    </div>
  )
}

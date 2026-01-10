import { useState } from 'react'
import type { Exercise, Entry } from '../lib/types'
import { format } from 'date-fns'

interface ExerciseCardProps {
  index: number
  exercise: Exercise
  onChange: (exercise: Exercise) => void
  onRemove: () => void
  exerciseLibrary: string[]
  entries: Entry[]
}

export function ExerciseCard({
  index,
  exercise,
  onChange,
  onRemove,
  exerciseLibrary,
  entries,
}: ExerciseCardProps) {
  const [showProgress, setShowProgress] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lastUsedData, setLastUsedData] = useState<any>(null)

  const handleBlur = () => {
    if (!exercise.name) return

    const exName = exercise.name.toLowerCase().trim()
    let lastEx: any = null

    for (const entry of entries) {
      if (entry.type === 'workout' && entry.exercises) {
        for (const ex of entry.exercises) {
          if (ex.name?.toLowerCase() === exName) {
            lastEx = { ...ex, date: entry.date }
            break
          }
        }
      }
      if (lastEx) break
    }

    if (lastEx) {
      setLastUsedData(lastEx)
      setShowProgress(true)
    } else {
      setShowProgress(false)
    }
  }

  return (
    <div className="exercise">
      <div className="exercise-head">
        <strong>Exercise {index + 1}</strong>
        <button type="button" className="btn small secondary" onClick={onRemove}>
          Remove
        </button>
      </div>

      <div className="form-group">
        <label>Exercise Name</label>
        <input
          type="text"
          value={exercise.name}
          onChange={(e) => onChange({ ...exercise, name: e.target.value })}
          onBlur={handleBlur}
          placeholder="Bench Press, Squat, etc."
          list={`exercise-list-${index}`}
        />
        <datalist id={`exercise-list-${index}`}>
          {exerciseLibrary.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>

      <div className="row2">
        <div className="form-group">
          <label>Equipment (optional)</label>
          <select
            value={exercise.equipment || ''}
            onChange={(e) =>
              onChange({ ...exercise, equipment: e.target.value || null })
            }
          >
            <option value="">Any</option>
            <option value="barbell">Barbell</option>
            <option value="dumbbell">Dumbbell</option>
            <option value="machine">Machine</option>
            <option value="cable">Cable</option>
            <option value="bodyweight">Bodyweight</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Weight/Load (optional)</label>
          <input
            type="text"
            value={exercise.load || ''}
            onChange={(e) => onChange({ ...exercise, load: e.target.value })}
            placeholder="185 lbs, 60kg, BW+25, etc"
          />
        </div>
      </div>

      <div className="row2">
        <div className="form-group">
          <label>Sets (optional)</label>
          <input
            type="number"
            value={exercise.sets || ''}
            onChange={(e) =>
              onChange({ ...exercise, sets: e.target.value ? Number(e.target.value) : null })
            }
            placeholder="3"
            min="0"
            max="50"
          />
        </div>
        <div className="form-group">
          <label>Reps (optional)</label>
          <input
            type="text"
            value={exercise.reps || ''}
            onChange={(e) => onChange({ ...exercise, reps: e.target.value })}
            placeholder="8-12 or 10"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Notes (optional)</label>
        <textarea
          value={exercise.notes || ''}
          onChange={(e) => onChange({ ...exercise, notes: e.target.value })}
          placeholder="Tempo, rest, RPE, form cues, how it felt..."
        />
      </div>

      {showProgress && lastUsedData && (
        <div className="progress-note">
          <strong>Last time ({format(new Date(lastUsedData.date + 'T00:00:00'), 'MMM d, yyyy')}):</strong>{' '}
          {lastUsedData.load || 'no weight'} • {lastUsedData.sets || '?'}×{lastUsedData.reps || '?'}
        </div>
      )}
    </div>
  )
}
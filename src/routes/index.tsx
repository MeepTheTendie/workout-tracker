import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useAddEntry } from '../lib/queries'
import { useWorkoutTypes } from '../lib/queries'
import { useEntries } from '../lib/queries'

export const Route = createFileRoute('/')({
  component: QuickLogPage,
})

function QuickLogPage() {
  const { entries } = useEntries()
  const workoutTypes = useWorkoutTypes(entries)
  const addEntry = useAddEntry()

  const form = useForm({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      loggedBy: 'Me',
      workoutType: '',
      exercises: '',
      duration: '',
      notes: '',
    },
    onSubmit: async ({ value }) => {
      const rawLines = value.exercises.split('\n').filter((l) => l.trim())
      const exercises = rawLines.map((line) => {
        const trimmed = line.trim()
        const match = trimmed.match(/^(.+?)\s*-\s*(.+)$/)
        if (match) {
          return { name: match[1].trim(), details: match[2].trim() }
        }
        return { name: trimmed, details: null }
      })

      await addEntry.mutateAsync({
        type: 'quick_log',
        date: value.date,
        loggedBy: value.loggedBy,
        workoutType: value.workoutType.trim(),
        exercises,
        duration: value.duration ? Number(value.duration) : null,
        notes: value.notes.trim() || null,
        createdAt: new Date().toISOString(),
      })

      form.reset()
      alert('✅ Quick log saved!')
    },
  })

  return (
    <section className="card section active">
      <h2>⚡ Quick Log</h2>
      <div className="info-box">
        <strong>Fast entry for workouts on the fly.</strong> Just describe what you did in plain text.
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="row2">
          <form.Field name="date">
            {(field) => (
              <div className="form-group">
                <label htmlFor="quickDate">Date</label>
                <input
                  id="quickDate"
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              </div>
            )}
          </form.Field>
          <form.Field name="loggedBy">
            {(field) => (
              <div className="form-group">
                <label htmlFor="quickLoggedBy">Logged by</label>
                <select
                  id="quickLoggedBy"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="Me">Me</option>
                  <option value="Bruce">Bruce</option>
                  <option value="Natasha">Natasha</option>
                </select>
              </div>
            )}
          </form.Field>
        </div>
        <form.Field name="workoutType">
          {(field) => (
            <div className="form-group">
              <label htmlFor="quickWorkoutType">What did you train?</label>
              <input
                id="quickWorkoutType"
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g., Upper Push, Legs, Full Body"
                list="workout-type-suggestions"
                required
              />
              <datalist id="workout-type-suggestions">
                {workoutTypes.map((type) => (
                  <option key={type} value={type} />
                ))}
              </datalist>
            </div>
          )}
        </form.Field>
        <form.Field name="exercises">
          {(field) => (
            <div className="form-group">
              <label htmlFor="quickExercises">Exercises (one per line)</label>
              <textarea
                id="quickExercises"
                rows={10}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Squats - 3x5..."
              />
              <div className="hint">
                Format: Exercise Name - Sets×Reps @ Weight
              </div>
            </div>
          )}
        </form.Field>
        <form.Field name="duration">
          {(field) => (
            <div className="form-group">
              <label htmlFor="quickDuration">Duration (minutes, optional)</label>
              <input
                id="quickDuration"
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="60"
                min="0"
                max="300"
              />
            </div>
          )}
        </form.Field>
        <form.Field name="notes">
          {(field) => (
            <div className="form-group">
              <label htmlFor="quickNotes">Notes</label>
              <textarea
                id="quickNotes"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>
        <button className="btn" type="submit" disabled={addEntry.isPending}>
          {addEntry.isPending ? 'Saving...' : 'Save Quick Log'}
        </button>
      </form>
    </section>
  )
}
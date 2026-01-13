import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useAddEntry } from '../lib/queries'

export const Route = createFileRoute('/checkin')({
  component: CheckinPage,
})

function CheckinPage() {
  const addEntry = useAddEntry()

  const form = useForm({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      bodyweight: '',
      sleep: '',
      soreness: '0',
      energy: '5',
      motivation: '5',
      sorenessAreas: '',
      notes: '',
    },
    onSubmit: async ({ value }) => {
      const sorenessAreas = value.sorenessAreas
        ? value.sorenessAreas.split(',').map((s) => s.trim())
        : []

      await addEntry.mutateAsync({
        type: 'checkin',
        date: value.date,
        bodyweight: value.bodyweight ? Number(value.bodyweight) : null,
        sleep: value.sleep ? Number(value.sleep) : null,
        soreness: Number(value.soreness),
        energy: Number(value.energy),
        motivation: Number(value.motivation),
        sorenessAreas,
        notes: value.notes.trim() || null,
        createdAt: new Date().toISOString(),
      })

      form.reset()
      alert('✅ Check-in saved!')
    },
  })

  return (
    <section className="card section active">
      <h2>📊 Daily Check-In</h2>
      <div className="info-box">
        Track how you're feeling, recovery status, and general wellness metrics.
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field name="date">
          {(field) => (
            <div className="form-group">
              <label htmlFor="checkinDate">Date</label>
              <input
                id="checkinDate"
                type="date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
              />
            </div>
          )}
        </form.Field>

        <div className="row2">
          <form.Field name="bodyweight">
            {(field) => (
              <div className="form-group">
                <label htmlFor="bodyweight">Bodyweight (lb, optional)</label>
                <input
                  id="bodyweight"
                  type="number"
                  step="0.1"
                  placeholder="275"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="sleep">
            {(field) => (
              <div className="form-group">
                <label htmlFor="sleep">Sleep (hours, optional)</label>
                <input
                  id="sleep"
                  type="number"
                  step="0.25"
                  max="24"
                  placeholder="7.5"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="soreness">
          {(field) => (
            <div className="form-group">
              <label>Overall Soreness (0–10)</label>
              <div className="range-row">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <div className="range-value">{field.state.value}</div>
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="energy">
          {(field) => (
            <div className="form-group">
              <label>Energy Level (0–10)</label>
              <div className="range-row">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <div className="range-value">{field.state.value}</div>
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="motivation">
          {(field) => (
            <div className="form-group">
              <label>Motivation (0–10, optional)</label>
              <div className="range-row">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <div className="range-value">{field.state.value}</div>
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="sorenessAreas">
          {(field) => (
            <div className="form-group">
              <label htmlFor="sorenessAreas">Specific Sore Areas (optional)</label>
              <input
                id="sorenessAreas"
                type="text"
                placeholder="e.g., quads, shoulders, lower back"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <div className="hint">Comma-separated list</div>
            </div>
          )}
        </form.Field>

        <form.Field name="notes">
          {(field) => (
            <div className="form-group">
              <label htmlFor="checkinNotes">Notes</label>
              <textarea
                id="checkinNotes"
                placeholder="How you're feeling, stress level, injuries, etc."
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        <button className="btn" type="submit" disabled={addEntry.isPending}>
          {addEntry.isPending ? 'Saving...' : 'Save Check-In'}
        </button>
      </form>
    </section>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useAddEntry } from '../lib/queries'

export const Route: any = createFileRoute('/activity' as any)({
  component: ActivityPage,
})

function ActivityPage() {
  const addEntry = useAddEntry()

  const form = useForm({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      loggedBy: 'Me',
      activityType: '',
      duration: '',
      intensity: '5',
      bikeResistance: '1',
      bikeAvgSpeed: '',
      bikeCalories: '',
      notes: '',
    },
    onSubmit: async ({ value }) => {
      const payload: any = {
        type: 'activity',
        date: value.date,
        loggedBy: value.loggedBy,
        activityType: value.activityType,
        duration: value.duration ? Number(value.duration) : null,
        intensity: Number(value.intensity),
        notes: value.notes.trim() || null,
        createdAt: new Date().toISOString(),
      }

      if (value.activityType === 'bike') {
        payload.bike = {
          resistance: value.bikeResistance ? Number(value.bikeResistance) : null,
          avgSpeed: value.bikeAvgSpeed ? Number(value.bikeAvgSpeed) : null,
          calories: value.bikeCalories ? Number(value.bikeCalories) : null,
        }
      }

      await addEntry.mutateAsync(payload)
      form.reset()
      alert('✅ Activity saved!')
    },
  })

  return (
    <section className="card section active">
      <h2>🚴 Activity & Cardio</h2>
      <div className="info-box">
        Log non-lifting activities: biking, running, swimming, recovery work, etc.
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
                <label htmlFor="activityDate">Date</label>
                <input
                  id="activityDate"
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
                <label htmlFor="activityLoggedBy">Logged by</label>
                <select
                  id="activityLoggedBy"
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

        <form.Field name="activityType">
          {(field) => (
            <div className="form-group">
              <label htmlFor="activityType">Activity Type</label>
              <select
                id="activityType"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
              >
                <option value="">Select...</option>
                <option value="bike">Stationary Bike</option>
                <option value="run">Running</option>
                <option value="walk">Walking</option>
                <option value="swim">Swimming</option>
                <option value="stretch">Stretching</option>
                <option value="massage_gun">Massage Gun</option>
                <option value="foam_roller">Foam Roller</option>
                <option value="yoga">Yoga</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}
        </form.Field>

        <div className="row2">
          <form.Field name="duration">
            {(field) => (
              <div className="form-group">
                <label htmlFor="activityDuration">Duration (minutes)</label>
                <input
                  id="activityDuration"
                  type="number"
                  placeholder="30"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="intensity">
            {(field) => (
              <div className="form-group">
                <label>Intensity (0-10)</label>
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
        </div>

        <form.Subscribe
          selector={(state) => state.values.activityType}
          children={(activityType) => {
            if (activityType !== 'bike') return null
            return (
              <div className="row3">
                <form.Field name="bikeResistance">
                  {(field) => (
                    <div className="form-group">
                      <label>Resistance</label>
                      <input
                        type="number"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="bikeAvgSpeed">
                  {(field) => (
                    <div className="form-group">
                      <label>Avg Speed</label>
                      <input
                        type="number"
                        step="0.1"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="bikeCalories">
                  {(field) => (
                    <div className="form-group">
                      <label>Calories</label>
                      <input
                        type="number"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            )
          }}
        />

        <form.Field name="notes">
          {(field) => (
            <div className="form-group">
              <label htmlFor="activityNotes">Notes</label>
              <textarea
                id="activityNotes"
                placeholder="How it felt, what you focused on, etc."
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        <button className="btn" type="submit" disabled={addEntry.isPending}>
          {addEntry.isPending ? 'Saving...' : 'Save Activity'}
        </button>
      </form>
    </section>
  )
}


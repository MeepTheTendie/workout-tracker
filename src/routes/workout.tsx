import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useAddEntry, useAddTemplate } from '../lib/queries'
import { useExerciseLibrary, useWorkoutTypes, useEntries } from '../lib/queries'
import { ExerciseCard } from '../components/ExerciseCard'
import type { Exercise } from '../lib/types'

export const Route: any = createFileRoute('/workout' as any)({
  component: WorkoutPage,
})

function WorkoutPage() {
  const { entries } = useEntries()
  const exerciseLibrary = useExerciseLibrary(entries)
  const workoutTypes = useWorkoutTypes(entries)
  const addEntry = useAddEntry()
  const addTemplate = useAddTemplate()

  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', equipment: null, load: null, sets: null, reps: null, notes: null },
  ])

  const form = useForm({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      loggedBy: 'Me',
      workoutType: '',
      location: 'Gym',
      duration: '',
      notes: '',
    },
    onSubmit: async ({ value }) => {
      const validExercises = exercises.filter((ex) => ex.name.trim())
      await addEntry.mutateAsync({
        type: 'workout',
        date: value.date,
        loggedBy: value.loggedBy,
        workoutType: value.workoutType.trim(),
        location: value.location,
        duration: value.duration ? Number(value.duration) : null,
        exercises: validExercises,
        notes: value.notes.trim() || null,
        createdAt: new Date().toISOString(),
      })
      form.reset()
      setExercises([{ name: '', equipment: null, load: null, sets: null, reps: null, notes: null }])
      alert('✅ Workout saved!')
    },
  })

  const addExercise = () => {
    setExercises([...exercises, { name: '', equipment: null, load: null, sets: null, reps: null, notes: null }])
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const updateExercise = (index: number, exercise: Exercise) => {
    const newExercises = [...exercises]
    newExercises[index] = exercise
    setExercises(newExercises)
  }

  const saveAsTemplate = async () => {
    const validExercises = exercises.filter((ex) => ex.name.trim())
    if (validExercises.length === 0) {
      alert('Add some exercises first!')
      return
    }
    const name = prompt('Template name:', form.getFieldValue('workoutType') || 'My Workout')
    if (!name) return
    await addTemplate.mutateAsync({
      name: name.trim(),
      exercises: validExercises,
      createdAt: new Date().toISOString(),
    })
    alert('✅ Template saved!')
  }

  const loadLastWorkout = () => {
    const currentType = form.getFieldValue('workoutType').trim().toLowerCase()
    if (!currentType) {
      alert('Enter a workout type first')
      return
    }
    const lastWorkout = entries.find(
      (e) => e.type === 'workout' && e.workoutType && e.workoutType.toLowerCase().includes(currentType)
    )
    if (!lastWorkout || lastWorkout.type !== 'workout' || !lastWorkout.exercises) {
      alert('No similar workout found!')
      return
    }
    setExercises(lastWorkout.exercises)
    alert(`✅ Loaded workout from ${lastWorkout.date}`)
  }

  return (
    <section className="card section active">
      <h2>🏋️ Full Workout Log</h2>
      <div className="info-box">
        Detailed exercise tracking with sets, reps, and loads. Use templates or build from scratch.
      </div>
      <div className="quick-actions">
        <button className="btn secondary small" onClick={loadLastWorkout}>📋 Load Last Similar Workout</button>
        <button className="btn secondary small" onClick={saveAsTemplate}>💾 Save Current as Template</button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}>
        <div className="row2">
          <form.Field name="date">
            {(field) => (
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} required />
              </div>
            )}
          </form.Field>
          <form.Field name="loggedBy">
            {(field) => (
              <div className="form-group">
                <label>Logged by</label>
                <select value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}>
                  <option value="Me">Me</option>
                  <option value="Bruce">Bruce</option>
                  <option value="Natasha">Natasha</option>
                </select>
              </div>
            )}
          </form.Field>
        </div>
        <div className="row2">
          <form.Field name="workoutType">
            {(field) => (
              <div className="form-group">
                <label>Workout Type/Focus</label>
                <input type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="Upper Push, Legs, etc." list="workout-types" required />
                <datalist id="workout-types">{workoutTypes.map((type) => (<option key={type} value={type} />))}</datalist>
              </div>
            )}
          </form.Field>
          <form.Field name="location">
            {(field) => (
              <div className="form-group">
                <label>Location</label>
                <select value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}>
                  <option value="Gym">Gym</option>
                  <option value="Home">Home</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}
          </form.Field>
        </div>
        <form.Field name="duration">
          {(field) => (
            <div className="form-group">
              <label>Duration (minutes, optional)</label>
              <input type="number" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="60" min="0" max="300" />
            </div>
          )}
        </form.Field>
        <div id="workoutExercises">
          {exercises.map((exercise, index) => (
            <ExerciseCard
              key={index}
              index={index}
              exercise={exercise}
              onChange={(ex) => updateExercise(index, ex)}
              onRemove={() => removeExercise(index)}
              exerciseLibrary={exerciseLibrary}
              entries={entries}
            />
          ))}
        </div>
        <div className="row2">
          <button className="btn secondary" type="button" onClick={addExercise}>+ Add Exercise</button>
          <button className="btn" type="submit" disabled={addEntry.isPending}>💪 {addEntry.isPending ? 'Saving...' : 'Save Workout'}</button>
        </div>
        <form.Field name="notes">
          {(field) => (
            <div className="form-group" style={{ marginTop: '15px' }}>
              <label>Workout Notes</label>
              <textarea value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="Overall feeling, etc." />
            </div>
          )}
        </form.Field>
      </form>
    </section>
  )
}
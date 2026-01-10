export interface Exercise {
  name: string
  equipment?: string | null
  load?: string | null
  sets?: number | null
  reps?: string | null
  notes?: string | null
}

export interface QuickExercise {
  name: string
  details?: string | null
}

export interface WorkoutEntry {
  id?: string
  type: 'workout'
  date: string
  loggedBy: string
  workoutType: string
  location: string
  duration?: number | null
  exercises: Exercise[]
  notes?: string | null
  createdAt: string
}

export interface QuickLogEntry {
  id?: string
  type: 'quick_log'
  date: string
  loggedBy: string
  workoutType: string
  exercises: QuickExercise[]
  duration?: number | null
  notes?: string | null
  createdAt: string
}

export interface CheckinEntry {
  id?: string
  type: 'checkin'
  date: string
  bodyweight?: number | null
  sleep?: number | null
  soreness: number
  sorenessAreas: string[]
  energy: number
  motivation: number
  notes?: string | null
  createdAt: string
}

export interface ActivityEntry {
  id?: string
  type: 'activity'
  date: string
  loggedBy: string
  activityType: string
  duration?: number | null
  intensity: number
  bike?: {
    resistance?: number | null
    avgSpeed?: number | null
    calories?: number | null
  }
  notes?: string | null
  createdAt: string
}

// THIS IS THE LINE THAT WAS LIKELY MISSING
export type Entry = WorkoutEntry | QuickLogEntry | CheckinEntry | ActivityEntry

export interface WorkoutTemplate {
  id?: string
  name: string
  exercises: Exercise[]
  createdAt: string
}
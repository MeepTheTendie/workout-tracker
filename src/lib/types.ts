export interface Exercise {
  name: string;
  equipment?: string | null;
  load?: string | null;
  sets?: number | null;
  reps?: string | null;
  notes?: string | null;
}

export interface WorkoutEntry {
  id?: string;
  type: 'workout';
  date: string;
  loggedBy: string;
  workoutType: string;
  location: string;
  duration?: number | null;
  exercises: Exercise[];
  notes?: string | null;
  createdAt: string;
}

export interface ActivityEntry {
  id?: string;
  type: 'activity';
  date: string;
  loggedBy: string;
  activityType: string;
  duration?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface CheckinEntry {
  id?: string;
  type: 'checkin';
  date: string;
  loggedBy: string;
  checkinType: string; // <--- This was missing!
  value: boolean;
  notes?: string | null;
  createdAt: string;
}

export interface QuickLogEntry {
  id?: string;
  type: 'quick_log';
  date: string;
  loggedBy: string;
  description: string;
  createdAt: string;
}

export type Entry = WorkoutEntry | ActivityEntry | CheckinEntry | QuickLogEntry;
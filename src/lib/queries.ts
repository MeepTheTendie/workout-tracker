import { useMutation, useQueryClient } from '@tanstack/react-query'
import { query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import {
  entriesCollection,
  templatesCollection,
  addEntry,
  addTemplate,
  deleteEntry,
  deleteTemplate,
} from './firebase'
import type { Entry, WorkoutTemplate } from './types'
import { useEffect, useState } from 'react'

export function useEntries(limitCount = 50) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const q = query(
      entriesCollection(),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Entry[] = []
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Entry)
        })
        setEntries(data)
        setIsLoading(false)
      },
      (error) => {
        console.error('Firestore error:', error)
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [limitCount])

  return { entries, isLoading }
}

export function useTemplates() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const q = query(templatesCollection(), orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: WorkoutTemplate[] = []
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as WorkoutTemplate)
        })
        setTemplates(data)
        setIsLoading(false)
      },
      (error) => {
        console.error('Firestore error:', error)
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { templates, isLoading }
}

export function useAddEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entries'] }),
  })
}

export function useDeleteEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entries'] }),
  })
}

export function useAddTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addTemplate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['templates'] }),
  })
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['templates'] }),
  })
}

export function useExerciseLibrary(entries: Entry[]) {
  const library = new Set<string>()
  entries.forEach((entry) => {
    if (entry.type === 'workout' && entry.exercises) {
      entry.exercises.forEach((ex) => {
        if (ex.name) library.add(ex.name.trim())
      })
    }
    if (entry.type === 'workout') {
  entry.exercises.forEach(ex => {
    // ... your logic here
  });
}
  })
  return Array.from(library)
}

export function useWorkoutTypes(entries: Entry[]) {
  const types = new Set<string>()
  entries.forEach((entry) => {
    if ('workoutType' in entry && entry.workoutType) {
      types.add(entry.workoutType.trim())
    }
  })
  return Array.from(types)
}
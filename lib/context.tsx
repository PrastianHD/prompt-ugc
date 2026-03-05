'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Task, TaskStatus } from '@/types'

interface AppSettings {
  openaiApiKey: string
  leonardoApiKey: string
}

interface AppContextValue {
  tasks: Task[]
  settings: AppSettings
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
  setSettings: (s: AppSettings) => void
}

const AppContext = createContext<AppContextValue | null>(null)

const TASKS_KEY = 'ugc_tasks_v2'
const SETTINGS_KEY = 'ugc_settings_v2'

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [settings, setSettingsState] = useState<AppSettings>({
    openaiApiKey: '',
    leonardoApiKey: '',
  })
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TASKS_KEY)
      if (raw) setTasks(JSON.parse(raw))
    } catch {}
    try {
      const raw = localStorage.getItem(SETTINGS_KEY)
      if (raw) setSettingsState(JSON.parse(raw))
    } catch {}
    setHydrated(true)
  }, [])

  // Persist tasks
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  }, [tasks, hydrated])

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [task, ...prev])
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t))
    )
  }, [])

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const setSettings = useCallback((s: AppSettings) => {
    setSettingsState(s)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
  }, [])

  if (!hydrated) return null

  return (
    <AppContext.Provider value={{ tasks, settings, addTask, updateTask, removeTask, setSettings }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
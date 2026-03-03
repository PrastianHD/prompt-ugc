'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { AppContextType, WebhookConfig, AIConfig, Task } from './types'
import { storage } from './storage'

type Action =
  | { type: 'SET_WEBHOOKS'; payload: WebhookConfig }
  | { type: 'SET_AI_CONFIG'; payload: AIConfig }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_CURRENT_TASK'; payload: Task | null }

interface State {
  webhooks: WebhookConfig | null
  aiConfig: AIConfig | null
  tasks: Task[]
  currentTask: Task | null
}

const initialState: State = {
  webhooks: null,
  aiConfig: null,
  tasks: [],
  currentTask: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_WEBHOOKS':
      storage.saveWebhooks(action.payload)
      return { ...state, webhooks: action.payload }
    case 'SET_AI_CONFIG':
      storage.saveAIConfig(action.payload)
      return { ...state, aiConfig: action.payload }
    case 'SET_TASKS':
      return { ...state, tasks: action.payload }
    case 'ADD_TASK': {
      const newTasks = [...state.tasks, action.payload]
      storage.saveTasks(newTasks)
      return { ...state, tasks: newTasks }
    }
    case 'UPDATE_TASK': {
      const updated = state.tasks.map(t =>
        t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
      )
      storage.saveTasks(updated)
      return { ...state, tasks: updated }
    }
    case 'DELETE_TASK': {
      const filtered = state.tasks.filter(t => t.id !== action.payload)
      storage.saveTasks(filtered)
      return { ...state, tasks: filtered }
    }
    case 'SET_CURRENT_TASK':
      return { ...state, currentTask: action.payload }
    default:
      return state
  }
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const webhooks = storage.getWebhooks()
    const aiConfig = storage.getAIConfig()
    const tasks = storage.getTasks()

    if (webhooks) dispatch({ type: 'SET_WEBHOOKS', payload: webhooks })
    if (aiConfig) dispatch({ type: 'SET_AI_CONFIG', payload: aiConfig })
    if (tasks.length > 0) dispatch({ type: 'SET_TASKS', payload: tasks })
  }, [])

  const value: AppContextType = {
    webhooks: state.webhooks,
    aiConfig: state.aiConfig,
    tasks: state.tasks,
    currentTask: state.currentTask,
    setWebhooks: (webhooks: WebhookConfig) =>
      dispatch({ type: 'SET_WEBHOOKS', payload: webhooks }),
    setAIConfig: (config: AIConfig) =>
      dispatch({ type: 'SET_AI_CONFIG', payload: config }),
    addTask: (task: Task) => dispatch({ type: 'ADD_TASK', payload: task }),
    updateTask: (id: string, updates: Partial<Task>) =>
      dispatch({ type: 'UPDATE_TASK', payload: { id, updates } }),
    deleteTask: (id: string) => dispatch({ type: 'DELETE_TASK', payload: id }),
    setCurrentTask: (task: Task | null) =>
      dispatch({ type: 'SET_CURRENT_TASK', payload: task }),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
import { WebhookConfig, AIConfig, Task } from './types'

const WEBHOOKS_KEY = 'promptcraft_webhooks'
const AI_CONFIG_KEY = 'promptcraft_ai_config'
const TASKS_KEY = 'promptcraft_tasks'

export const storage = {
  // Webhooks
  getWebhooks: (): WebhookConfig | null => {
    if (typeof window === 'undefined') return null
    try {
      const data = localStorage.getItem(WEBHOOKS_KEY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  saveWebhooks: (webhooks: WebhookConfig) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(WEBHOOKS_KEY, JSON.stringify(webhooks))
  },

  // AI Config
  getAIConfig: (): AIConfig | null => {
    if (typeof window === 'undefined') return null
    try {
      const data = localStorage.getItem(AI_CONFIG_KEY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  saveAIConfig: (config: AIConfig) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config))
  },

  // Tasks
  getTasks: (): Task[] => {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(TASKS_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  saveTasks: (tasks: Task[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  },

  addTask: (task: Task) => {
    const tasks = storage.getTasks()
    tasks.push(task)
    storage.saveTasks(tasks)
  },

  updateTask: (id: string, updates: Partial<Task>) => {
    const tasks = storage.getTasks()
    const index = tasks.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates }
      storage.saveTasks(tasks)
    }
  },

  deleteTask: (id: string) => {
    const tasks = storage.getTasks()
    storage.saveTasks(tasks.filter(t => t.id !== id))
  },

  getTaskById: (id: string): Task | undefined => {
    const tasks = storage.getTasks()
    return tasks.find(t => t.id === id)
  },
}

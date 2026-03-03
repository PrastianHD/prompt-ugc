export interface WebhookConfig {
  step1: string
  step2: string
  step3: string
}

export interface AIConfig {
  provider: 'openai' | 'gemini'
  apiKey: string
}

export type TaskStatus = 'ready' | 'edited' | 'finished' | 'error'

export interface TaskInput {
  productName?: string
  productImage?: string
  productLink?: string
  targetMarket: string
  needsCharacter: boolean
  characterImage?: string
  characterDescription?: string
  backgroundColor?: string
  videoReference?: string
}

export interface TaskOutput {
  sceneIdeas?: string
  frameImage?: string
  imageAnalysis?: string
  videoPrompt?: string
}

export interface Task {
  id: string
  input: TaskInput
  output: TaskOutput
  status: TaskStatus
  createdAt: number
  updatedAt: number
}

export interface AppContextType {
  webhooks: WebhookConfig | null
  aiConfig: AIConfig | null
  tasks: Task[]
  currentTask: Task | null
  setWebhooks: (webhooks: WebhookConfig) => void
  setAIConfig: (config: AIConfig) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  setCurrentTask: (task: Task | null) => void
}

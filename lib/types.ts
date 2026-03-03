export interface WebhookConfig {
  step1: string
  // Step 2 & 3 are cron-based, tidak bisa di-trigger manual
  // Tapi kita simpan status polling URL kalau ada
  statusCheck?: string
}

export interface AIConfig {
  provider: 'openai' | 'gemini'
  apiKey: string
}

// Status sesuai Google Sheets workflow
export type TaskStatus = 'Ready' | 'Edited' | 'Finished' | 'error'

export interface TaskInput {
  productName?: string
  productPhoto?: string    // was: productImage → sesuai workflow field "Product Photo"
  productLink?: string
  targetMarket: string
  needCharacter: boolean   // was: needsCharacter → sesuai workflow field "needCharacter"
  character?: string       // was: characterImage → sesuai workflow field "character" (URL)
  characterDescription?: string
  background?: string      // was: backgroundColor → sesuai workflow field "background"
  videoReferenceLink?: string // was: videoReference → sesuai workflow field "videoReferenceLink"
}

// Response dari Step 1 webhook
export interface ProductAnalysis {
  category: string
  keySellingPoints: string[]
  recommendedTone: string
}

export interface VideoScene {
  sceneNumber: number
  title: string
  setting: string
  action: string
  hook: string
  duration: string
}

export interface TaskOutput {
  // Step 1 response fields
  productAnalysis?: ProductAnalysis
  videoScenes?: VideoScene[]
  needCharacter?: boolean
  scrapedData?: Record<string, unknown>

  // Step 2 output (frame generation dari Leonardo AI)
  frameImage?: string

  // Step 3 output (video prompt generation)
  videoPrompt?: string
  imageAnalysis?: string
}

export interface Task {
  id: string           // taskId dari workflow (format: TASK-...)
  productId?: string   // productId dari workflow (format: PROD-...)
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
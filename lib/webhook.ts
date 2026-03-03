/**
 * Webhook Integration Module
 * Handles communication with n8n UGC Pipeline webhooks
 */

import { TaskInput, TaskOutput, Task, TaskStatus } from './types'

// ─── Step 1: Submit task ke webhook ────────────────────────────────────────

interface Step1RequestBody {
  productName?: string
  productPhoto?: string      // URL gambar produk
  productLink?: string       // alternatif jika tidak ada gambar
  targetMarket: string       // REQUIRED
  needCharacter: boolean     // sesuai workflow field
  character?: string         // URL gambar karakter
  characterDescription?: string
  background?: string        // deskripsi background
  videoReferenceLink?: string
}

interface Step1Response {
  success: boolean
  taskId: string             // format: TASK-...
  productId: string          // format: PROD-...
  status: TaskStatus
  needCharacter: boolean
  productAnalysis: {
    category: string
    keySellingPoints: string[]
    recommendedTone: string
  }
  videoScenes: Array<{
    sceneNumber: number
    title: string
    setting: string
    action: string
    hook: string
    duration: string
  }>
  scrapedData?: Record<string, unknown>
  error?: string
}

/**
 * Kirim task baru ke n8n Step 1 webhook
 */
export async function submitToStep1(
  webhookUrl: string,
  input: TaskInput
): Promise<{ task: Task; raw: Step1Response }> {
  // Map dari TaskInput ke format yang diharapkan workflow
  const body: Step1RequestBody = {
    productName: input.productName,
    productPhoto: input.productPhoto,
    productLink: input.productLink,
    targetMarket: input.targetMarket,          // REQUIRED
    needCharacter: input.needCharacter,
    character: input.character,
    characterDescription: input.characterDescription,
    background: input.background,
    videoReferenceLink: input.videoReferenceLink,
  }

  // Hapus field undefined supaya tidak dikirim
  Object.keys(body).forEach(key => {
    if (body[key as keyof Step1RequestBody] === undefined) {
      delete body[key as keyof Step1RequestBody]
    }
  })

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Webhook error ${response.status}: ${text}`)
  }

  const raw: Step1Response = await response.json()

  if (!raw.success) {
    throw new Error(raw.error || 'Webhook returned success: false')
  }

  // Susun Task object dari response
  const output: TaskOutput = {
    productAnalysis: raw.productAnalysis,
    videoScenes: raw.videoScenes,
    needCharacter: raw.needCharacter,
    scrapedData: raw.scrapedData,
  }

  const task: Task = {
    id: raw.taskId,
    productId: raw.productId,
    input,
    output,
    status: raw.status,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  return { task, raw }
}

// ─── Status Polling ─────────────────────────────────────────────────────────

interface StatusResponse {
  taskId: string
  status: TaskStatus
  frameImage?: string
  videoPrompt?: string
  imageAnalysis?: string
}

/**
 * Poll status task dari Google Sheets via n8n status endpoint
 * Panggil ini setiap 30 detik di task detail page
 *
 * @param statusUrl  - URL endpoint status (opsional, jika ada)
 * @param taskId     - ID task (format: TASK-...)
 */
export async function pollTaskStatus(
  statusUrl: string,
  taskId: string
): Promise<StatusResponse | null> {
  try {
    const response = await fetch(`${statusUrl}?taskId=${encodeURIComponent(taskId)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) return null

    const data: StatusResponse = await response.json()
    return data
  } catch {
    return null
  }
}

// ─── Status helpers ──────────────────────────────────────────────────────────

export function getStatusLabel(status: TaskStatus): string {
  const labels: Record<TaskStatus, string> = {
    Ready: 'Menunggu Proses',
    Edited: 'Frame Dibuat',
    Finished: 'Selesai',
    error: 'Error',
  }
  return labels[status] ?? status
}

export function getStatusColor(status: TaskStatus): string {
  const colors: Record<TaskStatus, string> = {
    Ready: 'text-yellow-500',
    Edited: 'text-blue-500',
    Finished: 'text-green-500',
    error: 'text-red-500',
  }
  return colors[status] ?? 'text-gray-500'
}

export function isTaskComplete(status: TaskStatus): boolean {
  return status === 'Finished'
}

export function isTaskProcessing(status: TaskStatus): boolean {
  return status === 'Ready' || status === 'Edited'
}
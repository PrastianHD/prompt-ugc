// lib/types.ts

export type TaskStatus = 'pending' | 'analyzing' | 'ready' | 'generating' | 'edited' | 'finished' | 'error'

export interface ScrapedProduct {
  name: string
  description: string
  category: string
  imageUrls: string[]
  price?: string
  rating?: string
  shopName?: string
  productLink: string
}

export interface VideoScene {
  title: string
  setting: string
  action: string
  hook: string
  duration: string
}

export interface ProductAnalysis {
  category: string
  keySellingPoints: string[]
  targetMarket: string
  recommendedTone: string
  needCharacter: boolean
  videoScene: VideoScene
}

// 🔴 KEMBALIKAN FORMAT VIDEOCLIP
export interface VideoClip {
  prompt: string
  endFrame?: string
  notes?: string
}

export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  clip1?: VideoClip
  clip2?: VideoClip
  fullScene?: string
  createdAt: number
}

export interface Task {
  id: string
  status: TaskStatus
  createdAt: number
  updatedAt: number
  input: {
    productLink?: string
    productPhoto?: string
    productName?: string
    targetMarket?: string
    needCharacter?: boolean | null
    character?: string
    background?: string
  }
  scraped?: ScrapedProduct
  analysis?: ProductAnalysis
  generatedImages?: GeneratedImage[]
  error?: string
}

export interface ScrapeResponse { success: boolean; data?: ScrapedProduct; error?: string }
export interface AnalyzeResponse { success: boolean; data?: ProductAnalysis; error?: string }
export interface GenerateImageResponse { success: boolean; data?: GeneratedImage; error?: string }
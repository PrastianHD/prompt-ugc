import { NextRequest, NextResponse } from 'next/server'
import type { ProductAnalysis, ScrapedProduct } from '@/lib/types'
// 🔴 IMPORT DUA JALUR PROMPT BARU KITA
import { getPromptWithModel, getPromptProductOnly } from '@/lib/prompts'

export const maxDuration = 60; // Timeout maksimal Vercel
export const dynamic = 'force-dynamic';

const LEO_V1 = 'https://cloud.leonardo.ai/api/rest/v1' // Untuk Upload
const LEO_V2 = 'https://cloud.leonardo.ai/api/rest/v2' // Untuk Generate

const LEONARDO_MODEL = 'nano-banana-2' 
const IMG_WIDTH  = 768
const IMG_HEIGHT = 1376

type ImageSlot = {
  url: string | null   
  strength: 'HIGH' | 'MID' | 'LOW'
  label: string        
}

function leoHeaders(apiKey: string) {
  return {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: `Bearer ${apiKey}`,
  }
}

// ─── Upload Process (LEO V1) ───────────────────────────────────────────────────
async function uploadOneImage(sourceUrl: string, apiKey: string, label: string): Promise<string | null> {
  try {
    const initRes = await fetch(`${LEO_V1}/init-image`, {
      method: 'POST',
      headers: leoHeaders(apiKey),
      body: JSON.stringify({ extension: 'jpg' }),
    })
    if (!initRes.ok) return null

    const initData = await initRes.json()
    const uploadInfo = initData?.uploadInitImage
    if (!uploadInfo?.id || !uploadInfo?.url) return null

    const imageId = uploadInfo.id as string
    const uploadUrl = uploadInfo.url as string
    const fields: Record<string, string> = JSON.parse(uploadInfo.fields)

    const imgRes = await fetch(sourceUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!imgRes.ok) return null
    const imgBuffer = await imgRes.arrayBuffer()

    const formData = new FormData()
    Object.entries(fields).forEach(([k, v]) => formData.append(k, v))
    formData.append('file', new Blob([imgBuffer], { type: 'image/jpeg' }))

    const s3Res = await fetch(uploadUrl, { method: 'POST', body: formData })
    if (!s3Res.ok && s3Res.status !== 204) return null
    return imageId
  } catch (e) {
    return null
  }
}

async function uploadAllImages(slots: ImageSlot[], apiKey: string): Promise<(string | null)[]> {
  const uploads = slots.map((slot) => {
    if (!slot.url) return Promise.resolve(null)
    return uploadOneImage(slot.url, apiKey, slot.label)
  })
  return Promise.all(uploads)
}

// ─── Generate Image (LEO V2) ──────────────────────────────
async function generateImageLeonardoV2(
  prompt: string,
  apiKey: string,
  imageIds: (string | null)[], 
  strengths: ('HIGH' | 'MID' | 'LOW')[]
): Promise<string> {

  const validImageReferences = imageIds
    .map((id, i) => id ? { image: { id: id, type: 'UPLOADED' }, strength: strengths[i] } : null)
    .filter(Boolean)

  const parameters: any = {
    width: IMG_WIDTH,
    height: IMG_HEIGHT,
    prompt: prompt,
    quantity: 2,
    style_ids: ["111dc692-d470-4eec-b791-3475abac4c46"],
    prompt_enhance: "OFF"
  }

  if (validImageReferences.length > 0) {
    parameters.guidances = { image_reference: validImageReferences }
  }

  const payload = {
    model: LEONARDO_MODEL,
    parameters: parameters,
    public: false
  }

  const res = await fetch(`${LEO_V2}/generations`, {
    method: 'POST',
    headers: leoHeaders(apiKey),
    body: JSON.stringify(payload),
  })

  const rawText = await res.text()
  if (!res.ok) {
    let errMsg = `Leonardo v2 error ${res.status}`
    try { const err = JSON.parse(rawText); errMsg = err?.error || err?.message || err?.details?.message || errMsg } catch {}
    throw new Error(errMsg)
  }

  const data = JSON.parse(rawText)
  const generationId = data?.generate?.generationId

  if (!generationId) throw new Error('generationId tidak ditemukan di response Leonardo v2.')

  return String(generationId)
}

// ─── Polling Status (LEO V1) ───────────────────────────────────────────────────
async function pollUntilComplete(generationId: string, apiKey: string, maxAttempts = 20, intervalMs = 4000): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, intervalMs))
    const res = await fetch(`${LEO_V1}/generations/${generationId}`, { headers: leoHeaders(apiKey) })
    if (!res.ok) continue

    const data = await res.json()
    const gen  = data?.generations_by_pk
    if (!gen) continue
    if (gen.status === 'COMPLETE') {
      const url = gen.generated_images?.[0]?.url
      if (!url) throw new Error('Generation COMPLETE tapi URL gambar kosong')
      return url
    }
    if (gen.status === 'FAILED') throw new Error('Leonardo generation FAILED')
  }
  throw new Error('Polling timeout')
}

// ─── POST Handler Utama ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { product, analysis, leonardoApiKey, characterUrl, backgroundUrl, customPrompt } = body

    if (!leonardoApiKey) {
      return NextResponse.json({ success: false, error: 'Leonardo API key diperlukan' }, { status: 400 })
    }

    // 🔴 KITA SPLIT JALUR DI SINI (TOTAL OVERHAUL)
    let slots: ImageSlot[] = [];
    let prompt = customPrompt;

    if (analysis.needCharacter) {
      // ── JALUR 1: PRODUK + MODEL + BACKGROUND ──
      slots = [
        { url: product.imageUrls?.[0] ?? null, strength: 'HIGH', label: 'product' },
        { url: characterUrl ?? null, strength: 'MID', label: 'character' },
        { url: backgroundUrl ?? null, strength: 'MID', label: 'background' },
      ];
      
      if (!prompt) {
        prompt = getPromptWithModel(
          product.name, 
          analysis.videoScene.setting, 
          analysis.videoScene.action, 
          analysis.videoScene.hook
        );
      }
    } else {
      // ── JALUR 2: PRODUK ONLY + BACKGROUND ──
      slots = [
        { url: product.imageUrls?.[0] ?? null, strength: 'HIGH', label: 'product' },
        // Slot karakter dilewati (skip) sepenuhnya
        { url: backgroundUrl ?? null, strength: 'MID', label: 'background' },
      ];
      
      if (!prompt) {
        prompt = getPromptProductOnly(
          product.name, 
          analysis.videoScene.setting, 
          analysis.videoScene.action, 
          analysis.videoScene.hook
        );
      }
    }

    const imageIds = await uploadAllImages(slots, leonardoApiKey)
    const strengths = slots.map(s => s.strength)
    
    const generationId = await generateImageLeonardoV2(prompt, leonardoApiKey, imageIds, strengths)
    const imageUrl = await pollUntilComplete(generationId, leonardoApiKey)

    return NextResponse.json({
      success: true,
      data: {
        generationId,
        imageUrl,
        prompt,
        // Mapping index untuk history disimpan sesuai dengan slot yang dipakai
        uploadedIds: { 
          product: imageIds[0], 
          character: analysis.needCharacter ? imageIds[1] : null, 
          background: analysis.needCharacter ? imageIds[2] : imageIds[1] 
        },
      },
    })
  } catch (err: any) {
    console.error('[generate-image] error:', err)
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 })
  }
}
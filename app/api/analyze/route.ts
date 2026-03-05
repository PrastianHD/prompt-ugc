import { NextRequest, NextResponse } from 'next/server'
import { getAnalyzePrompt } from '@/lib/prompts'

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // 🔴 Terima array 'referenceFrames' (kumpulan base64 gambar dari video)
    const { product, userInput, referenceFrames, openaiApiKey } = body

    if (!product || !openaiApiKey) {
      return NextResponse.json({ success: false, error: 'Data tidak lengkap' }, { status: 400 })
    }

    const hasRefVideo = Array.isArray(referenceFrames) && referenceFrames.length > 0

    const userPrompt = getAnalyzePrompt(
      product.name,
      product.category,
      product.description,
      userInput?.targetMarket || '',
      userInput?.needCharacter !== undefined ? userInput.needCharacter : null,
      hasRefVideo
    )

    const userContent: any[] = [{ type: 'text', text: userPrompt }]

    // 1. Masukkan foto produk Shopee
    if (product.imageUrls && product.imageUrls.length > 0) {
      const maxImages = Math.min(product.imageUrls.length, 3)
      for (let i = 0; i < maxImages; i++) {
        userContent.push({
          type: 'image_url',
          image_url: { url: product.imageUrls[i], detail: 'low' },
        })
      }
    }

    // 2. 🔴 Masukkan jepretan frame video referensi ke GPT-4o
    if (hasRefVideo) {
      userContent.push({ type: 'text', text: 'BERIKUT ADALAH FRAME DARI VIDEO REFERENSI (Tolong tiru gaya, hook, dan pacing-nya):' })
      referenceFrames.forEach((frameB64: string) => {
        userContent.push({
          type: 'image_url',
          image_url: { url: frameB64, detail: 'low' },
        })
      })
    }

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Sebaiknya pakai gpt-4o agar sangat cerdas membaca urutan gambar
        max_tokens: 2000,
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'Kamu adalah creative director dan copywriter ahli untuk video UGC sosial media (TikTok, Reels, dll).',
          },
          { role: 'user', content: userContent },
        ],
      }),
    })

    if (!openaiRes.ok) throw new Error('Gagal menghubungi OpenAI')

    const openaiData = await openaiRes.json()
    const resultJson = JSON.parse(openaiData.choices[0].message.content)

    return NextResponse.json({ success: true, data: resultJson })
  } catch (err: any) {
    console.error('[analyze] error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
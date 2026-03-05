import { NextRequest, NextResponse } from 'next/server'
import { getVideoSystemPrompt, getVideoUserPrompt } from '@/lib/prompts'

export const maxDuration = 60; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { imageUrl, product, analysis, openaiApiKey } = body

    if (!imageUrl || !openaiApiKey) {
      return NextResponse.json({ success: false, error: 'Data tidak lengkap' }, { status: 400 })
    }

    const scene = analysis.videoScene
    const hasCharacter = analysis.needCharacter

    const systemPrompt = getVideoSystemPrompt(hasCharacter)
    const userPrompt = getVideoUserPrompt(
      product.name,
      scene.title,
      scene.setting,
      scene.action,
      scene.hook,
      analysis.recommendedTone
    )

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 1000,
        temperature: 0.7,
        response_format: { type: 'json_object' }, 
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: [
              { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
              { type: 'text', text: userPrompt },
            ],
          },
        ],
      }),
    })

    if (!openaiRes.ok) {
      const errData = await openaiRes.json()
      throw new Error(errData.error?.message || 'Gagal menghubungi OpenAI')
    }

    const openaiData = await openaiRes.json()
    const resultJson = JSON.parse(openaiData.choices[0].message.content)

    return NextResponse.json({
      success: true,
      data: { 
        clip1: resultJson.clip1,
        clip2: resultJson.clip2,
        fullScene: resultJson.fullScene
      },
    })
  } catch (err: any) {
    console.error('[video-prompt] error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
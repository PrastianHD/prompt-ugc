/**
 * AI Integration Module
 * Handles API calls to OpenAI and Google Gemini for UGC script generation
 */

type AIProvider = 'openai' | 'gemini'

interface GenerateScriptParams {
  productDescription: string
  backgroundStyle: string
  modelPreference: string
  videoPlatform: string
  targetMarket: string
}

interface GenerateScriptResponse {
  script: string
  frames: Array<{
    time: string
    description: string
  }>
}

/**
 * Convert image URL to base64
 */
export async function imageToBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        resolve(base64.split(',')[1])
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error converting image to base64:', error)
    throw error
  }
}

/**
 * Get API credentials from localStorage
 */
function getApiCredentials(): { provider: AIProvider; apiKey: string } {
  if (typeof window === 'undefined') {
    throw new Error('This function must be called in the browser')
  }

  const provider = (localStorage.getItem('apiProvider') as AIProvider) || 'openai'
  const apiKey = localStorage.getItem('apiKey') || ''

  if (!apiKey) {
    throw new Error('API key not configured. Please set it in settings.')
  }

  return { provider, apiKey }
}

/**
 * Generate prompt template for UGC script
 */
function generateSystemPrompt(params: GenerateScriptParams): string {
  return `You are an expert UGC (User Generated Content) script writer for social media. 
Create engaging, authentic scripts for the following product and parameters.

Product: ${params.productDescription}
Background Style: ${params.backgroundStyle}
Model Preference: ${params.modelPreference}
Video Platform: ${params.videoPlatform}
Target Market: ${params.targetMarket}

Generate a script that:
1. Starts with a hook to grab attention in the first 3 seconds
2. Demonstrates the product benefits naturally
3. Uses language appropriate for the target market (${params.targetMarket})
4. Ends with a clear call-to-action
5. Is optimized for ${params.videoPlatform} format and length

Format the response as JSON with:
{
  "script": "Full script with scene descriptions in [BRACKETS]",
  "frames": [
    { "time": "0:00", "description": "Scene description" },
    { "time": "0:05", "description": "Next scene description" }
  ]
}`
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  apiKey: string,
  params: GenerateScriptParams
): Promise<GenerateScriptResponse> {
  const systemPrompt = generateSystemPrompt(params)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Generate a UGC script for a ${params.productDescription} product targeting ${params.targetMarket} on ${params.videoPlatform}.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content

  try {
    return JSON.parse(content)
  } catch {
    // Fallback if JSON parsing fails
    return {
      script: content,
      frames: [
        { time: '0:00', description: 'Product introduction' },
        { time: '0:05', description: 'Product demonstration' },
        { time: '0:10', description: 'Benefits highlight' },
        { time: '0:15', description: 'Call to action' },
      ],
    }
  }
}

/**
 * Call Google Gemini API
 */
async function callGemini(
  apiKey: string,
  params: GenerateScriptParams
): Promise<GenerateScriptResponse> {
  const systemPrompt = generateSystemPrompt(params)
  const userPrompt = `Generate a UGC script for a ${params.productDescription} product targeting ${params.targetMarket} on ${params.videoPlatform}.`

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: {
          text: systemPrompt,
        },
      },
      contents: {
        parts: {
          text: userPrompt,
        },
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Gemini API error: ${error.error?.message || 'Unknown error'}`)
  }

  const data = await response.json()
  const content = data.candidates[0].content.parts[0].text

  try {
    return JSON.parse(content)
  } catch {
    // Fallback if JSON parsing fails
    return {
      script: content,
      frames: [
        { time: '0:00', description: 'Product introduction' },
        { time: '0:05', description: 'Product demonstration' },
        { time: '0:10', description: 'Benefits highlight' },
        { time: '0:15', description: 'Call to action' },
      ],
    }
  }
}

/**
 * Generate UGC script using configured AI provider
 */
export async function generateUGCScript(params: GenerateScriptParams): Promise<GenerateScriptResponse> {
  try {
    const { provider, apiKey } = getApiCredentials()

    if (provider === 'openai') {
      return await callOpenAI(apiKey, params)
    } else if (provider === 'gemini') {
      return await callGemini(apiKey, params)
    } else {
      throw new Error(`Unknown provider: ${provider}`)
    }
  } catch (error) {
    console.error('Error generating UGC script:', error)
    throw error
  }
}

/**
 * Format script for different platforms
 */
export function formatScriptForPlatform(
  script: string,
  platform: 'tiktok' | 'instagram' | 'youtube' | 'generic'
): string {
  let formatted = script

  switch (platform) {
    case 'tiktok':
      // TikTok scripts should be shorter and more energetic
      formatted = formatted.replace(/\[/g, '\n[').replace(/\]/g, ']\n')
      break
    case 'instagram':
      // Instagram Reels benefit from more visual descriptions
      formatted = formatted.replace(/\[SCENE/g, '\n📸 [SCENE')
      break
    case 'youtube':
      // YouTube Shorts can be slightly longer
      formatted = formatted.replace(/\[/g, '\n━━━━━━━━━━━━\n[')
      break
    default:
      break
  }

  return formatted.trim()
}

// lib/prompts.ts

// ─── 1. PROMPT UNTUK ANALISIS PRODUK (GPT-4o Vision) ────────────────────────
export function getAnalyzePrompt(
  productName: string,
  productCategory: string,
  productDescription: string,
  targetMarketInput: string,
  userNeedCharacter: boolean | null,
  hasReferenceVideo: boolean = false
): string {
  let characterInstruction = "Untuk 'needCharacter': set true jika produk lebih menarik didemonstrasikan orang, set false jika visual produk saja sudah cukup. Sesuaikan 'videoScene' dengan pilihanmu."
  let userPref = "Bebas pilih yang terbaik (AI Auto)"

  if (userNeedCharacter === true) {
    userPref = "Wajib ada orang/model"
    characterInstruction = "USER MEMINTA: WAJIB MENGGUNAKAN MODEL/ORANG. Atur 'needCharacter' menjadi true, dan pastikan 'videoScene' melibatkan manusia/orang."
  } else if (userNeedCharacter === false) {
    userPref = "Tanpa orang (Fokus Produk Only)"
    characterInstruction = "USER MEMINTA: FOKUS PRODUK SAJA. Atur 'needCharacter' menjadi false, dan 'videoScene' HANYA fokus menyorot fisik produk. DILARANG KERAS melibatkan manusia."
  }

  let referenceInstruction = ""
  if (hasReferenceVideo) {
    referenceInstruction = `PENTING - REFERENSI VIDEO: User telah melampirkan beberapa urutan gambar (frame) dari sebuah video referensi UGC. TUGASMU: Analisis pola video tersebut. WAJIB: Tiru persis gaya, mood, dan struktur copywriting dari video referensi tersebut!`
  }

  return `Analisis produk ini dan buat konsep video UGC:
PRODUK:
- Nama: ${productName}
- Kategori: ${productCategory}
- Deskripsi: ${productDescription || 'Tidak tersedia'}

USER INPUT:
- Target Pasar: ${targetMarketInput || 'auto-detect'}
- Preferensi Visual: ${userPref}

Output JSON schema (PERSIS seperti ini):
{
  "category": "string (kategori spesifik)",
  "keySellingPoints": ["string", "string", "string"],
  "targetMarket": "string",
  "recommendedTone": "string",
  "needCharacter": boolean,
  "videoScene": {
    "title": "string",
    "setting": "string",
    "action": "string",
    "hook": "string",
    "duration": "20 detik" 
  }
}
${characterInstruction}
${referenceInstruction}`
}

// ─── 2A. JALUR: PRODUK + MODEL + BACKGROUND ──────────────────────────────────
export function getPromptWithModel(
  productName: string,
  sceneSetting: string,
  sceneAction: string,
  sceneHook: string
): string {
  const hook = (sceneHook || `Solusi ampuh ${productName}`).slice(0, 45)
  const safeSetting = sceneSetting.slice(0, 150)
  const safeProduct = productName.slice(0, 80)
  const exactProductInstruction = "CRITICAL: The product MUST look EXACTLY 100% identical to the reference image. Preserve exact packaging and label text."

  const basePrompt = [
    'Selfie-style photo of naturally beautiful young Indonesian woman.',
    `Holding ${safeProduct} in one hand naturally.`,
    `In ${safeSetting}.`,
    'Natural smile, eye contact with camera.',
    'Soft natural lighting, shallow depth of field.',
    'Authentic UGC feel, not studio photo.',
    exactProductInstruction
  ].join(' ')

  const overlay = [
    'TikTok text overlay style:',
    `Top question text: "${hook}" in white sans-serif, soft shadow.`,
    'Position upper-left. Zero text bottom 30%.'
  ].join(' ')

  const negativeRestraints = [
    'NO distorted hands, NO extra fingers, NO multiple limbs, NO complex hand gestures,',
    'NO Shopee banners, NO Shopee/Tokopedia logos, NO e-commerce UI, NO discount text,',
    'NO horizontal banners bottom, NO star ratings, NO price tags, NO app icons, NO watermarks.',
    'NO altered product labels, NO fake text on product design, NO distorted packaging.',
    'Bottom 30% MUST be 100% clean.'
  ].join(' ')

  const finalPrompt = `${basePrompt} ${overlay} ${negativeRestraints}`
  return finalPrompt.length > 1450 ? finalPrompt.slice(0, 1450) : finalPrompt
}

// ─── 2B. JALUR: PRODUK ONLY + BACKGROUND ──────────────────────────────────────
export function getPromptProductOnly(
  productName: string,
  sceneSetting: string,
  sceneAction: string,
  sceneHook: string
): string {
  const hook = (sceneHook || `Solusi ampuh ${productName}`).slice(0, 45)
  const safeSetting = sceneSetting.slice(0, 150)
  const safeAction = sceneAction.slice(0, 150)
  const safeProduct = productName.slice(0, 80)
  const exactProductInstruction = "CRITICAL: The product MUST look EXACTLY 100% identical to the reference image. Preserve exact packaging and label text."

  const basePrompt = [
    'UGC-style commercial hero shot, ultra-sharp detail.',
    `${safeProduct} focal point arranged elegantly on surface.`,
    safeSetting + '.',
    exactProductInstruction,
    safeAction + '.',
    'Soft natural lighting from upper-left, gentle shadows. Clean background.',
    'Premium approached, sharp details. Whole scene uncluttered.'
  ].join(' ')

  const overlay = [
    'TikTok text overlay style:',
    `Top question text: "${hook}" in white sans-serif, soft shadow.`,
    'Position upper-left. Zero text bottom 30%.'
  ].join(' ')

  // 🔴 PENTING: Dilarang keras ada manusia atau tangan di sini
  const negativeRestraints = [
    'NO humans, NO people, NO faces, NO hands, NO body parts,',
    'NO Shopee banners, NO Shopee/Tokopedia logos, NO e-commerce UI, NO discount text,',
    'NO horizontal banners bottom, NO star ratings, NO price tags, NO app icons, NO watermarks.',
    'NO altered product labels, NO fake text on product design, NO distorted packaging.',
    'Bottom 30% MUST be 100% clean.'
  ].join(' ')

  const finalPrompt = `${basePrompt} ${overlay} ${negativeRestraints}`
  return finalPrompt.length > 1450 ? finalPrompt.slice(0, 1450) : finalPrompt
}

// ─── 3. PROMPT UNTUK IMAGE-TO-VIDEO (Sesuai SOP Grok/Veo User) ────────────────
export function getVideoSystemPrompt(hasCharacter: boolean): string {
  const characterRules = hasCharacter ? `
### Subject & Framing
- Subject is an adult creator aligned with the Target Market (20+ years old)
- Video is recorded selfie-style at arm's length
- Subject looks directly into the lens while speaking
- Vertical 9:16 format (TikTok / Instagram Reels style)
- One hand interacts with the product; the recording device is never visible

### Google AI Safety & Compliance
- Use neutral descriptors such as "adult creator" or "everyday content creator"
- Avoid age ranges that include minors
- Avoid unnecessary physical or personal detail` 
  : `
### Subject & Framing
- Product-only showcase. NO humans, NO hands, NO subjects.
- Vertical 9:16 format (TikTok / Instagram Reels style)
- Dynamic camera movement (pan, tilt, or zoom) focusing on product details.`;

  const dialogueRules = hasCharacter ? `
## Dialog Language Rule
- Default: Spoken dialogue must be in Indonesian (Bahasa Indonesia)
- Always write the exact spoken dialogue in quotation marks inside the English prompt to force lip movement!
- 1-2 short, casual spoken sentences per clip.
- Conversational, personal, and experience-based.` 
  : `
### Tone & Vibe
- Fast-paced, commercial yet aesthetic UGC product b-roll vibe. Focus on texture, lighting, and premium feel.`;

  return `You are an expert UGC (User-Generated Content) video prompt creator for Grok AI Video.

## TECHNICAL CONSTRAINTS (CRITICAL)
- Grok image-to-video generates MAXIMUM 10 seconds per run.
- You must generate TWO consecutive prompts to create a 20-second video.
- Clip 1: Seconds 0-10, starting from the provided start frame.
- Clip 2: Seconds 10-20, continuing seamlessly from the exact end position of Clip 1.

## CRITICAL RULES
- Output must be in ENGLISH ONLY (except the spoken dialog in quotes).
- Keep descriptions professional, neutral, and product-focused.

${dialogueRules}

## Core Video Requirements
${characterRules}

### Visual Style
- Natural lighting and a realistic everyday setting
- Slight camera shake, subtle grain, and minor imperfections for authenticity
- Product must be clearly visible and used naturally
- Do NOT show the phone, camera, reflections, mirrors, or filming equipment
- No on-screen text, subtitles, watermarks, logos, or graphic overlays

## Output Format
Output MUST be valid JSON exact schema:
{
  "clip1": {
    "prompt": "string — full prompt for Clip 1 (0-10s)",
    "endFrame": "string — brief description of visual state at the end of Clip 1 for continuity",
    "notes": "string — optional technical notes"
  },
  "clip2": {
    "prompt": "string — full prompt for Clip 2 (10-20s), seamlessly continuing from clip1 endFrame",
    "notes": "string — optional technical notes"
  },
  "fullScene": "string — one sentence summary of the entire 20s flow"
}`;
}

export function getVideoUserPrompt(
  productName: string,
  sceneTitle: string,
  sceneSetting: string,
  sceneAction: string,
  sceneHook: string,
  recommendedTone: string
): string {
  return `PRODUCT INFO:
- Name: ${productName}
- Scene Title: ${sceneTitle}
- Setting: ${sceneSetting}
- Action: ${sceneAction}
- Target Hook: "${sceneHook}"
- Tone: ${recommendedTone}

Generate the JSON output fulfilling Clip 1 (0-10s) and Clip 2 (10-20s) based on the image provided and technical rules.`;
}
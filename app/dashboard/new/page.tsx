'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/lib/context'
import type { Task, ScrapedProduct, ProductAnalysis, GeneratedImage } from '@/lib/types'
import { toast } from 'sonner'
import {
  ArrowLeft, ArrowRight, Link2, Upload, Loader2,
  Sparkles, RefreshCw, CheckCircle2, AlertCircle,
  ShoppingBag, User, ImageIcon, Video, ChevronDown, Film, UserCircle
} from 'lucide-react'

const STEPS = [
  { n: 1, label: 'Link Produk' },
  { n: 2, label: 'Analisis AI' },
  { n: 3, label: 'Generate Gambar' },
]

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center flex-1 last:flex-none">
          <div className={`flex items-center gap-2.5 ${current >= s.n ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm
              ${current > s.n ? 'bg-emerald-500 text-white' : current === s.n ? 'bg-violet-600 text-white ring-4 ring-violet-500/20' : 'bg-muted border border-border text-muted-foreground'}`}>
              {current > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
            </div>
            <span className={`text-sm font-bold hidden sm:block ${current === s.n ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-3 transition-all ${current > s.n ? 'bg-emerald-500/50' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function NewTaskPage() {
  const router = useRouter()
  const { addTask, updateTask, settings } = useAppContext()

  const [step, setStep] = useState(1)
  const [taskId] = useState(() => 'TASK-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase())

  // Step 1 state
  const [productUrl, setProductUrl] = useState('')
  const [targetMarket, setTargetMarket] = useState('')
  const [needCharacter, setNeedCharacter] = useState<boolean | null>(null)
  const [character, setCharacter] = useState('')
  const [background, setBackground] = useState('')
  const [scrapeLoading, setScrapeLoading] = useState(false)
  const [scraped, setScraped] = useState<ScrapedProduct | null>(null)
  
  const [referenceVideoFile, setReferenceVideoFile] = useState<File | null>(null)
  const [isExtractingFrames, setIsExtractingFrames] = useState(false)

  // Step 2 state
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null)
  const [analyzeLoading, setAnalyzeLoading] = useState(false)

  // Step 3 state
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [genLoading, setGenLoading] = useState(false)
  const [vpLoading, setVpLoading] = useState(false) // 🔴 State khusus loading Video Prompt
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const [customPrompt, setCustomPrompt] = useState('')
  const [showPromptEditor, setShowPromptEditor] = useState(false)
  
  const [characterUrl, setCharacterUrl] = useState('') 
  const [backgroundUrl, setBackgroundUrl] = useState('')

  // ─── Scrape Product ──────────────────────────────────────────────────────────
  const handleScrape = async () => {
    if (!productUrl.trim()) { toast.error('Masukkan link Shopee terlebih dahulu'); return }
    setScrapeLoading(true)
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: productUrl }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setScraped(data.data)
      toast.success('Produk berhasil ditemukan!')
    } catch (e: any) {
      toast.error(e.message || 'Gagal scrape produk')
    } finally {
      setScrapeLoading(false)
    }
  }

  const extractFramesFromVideo = (file: File, numFrames = 4): Promise<string[]> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.src = URL.createObjectURL(file)
      video.crossOrigin = 'anonymous'
      video.muted = true
      
      video.onloadedmetadata = async () => {
        const duration = video.duration
        const interval = duration / (numFrames + 1)
        const frames: string[] = []
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        for (let i = 1; i <= numFrames; i++) {
          video.currentTime = interval * i
          await new Promise(r => { video.onseeked = r })
          
          const targetHeight = 480
          const scale = targetHeight / video.videoHeight
          canvas.width = video.videoWidth * scale
          canvas.height = targetHeight
          
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
          frames.push(canvas.toDataURL('image/jpeg', 0.6))
        }
        URL.revokeObjectURL(video.src)
        resolve(frames)
      }
    })
  }

  const handleCharacterPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setCharacterUrl(ev.target?.result as string)
      toast.success('Foto model berhasil dimuat!')
    }
    reader.readAsDataURL(file)
  }

  const handleGoToAnalyze = async () => {
    if (!scraped) { toast.error('Scrape produk dulu'); return }
    if (!settings.openaiApiKey) { toast.error('API Key OpenAI belum diisi di Settings'); return }

    let referenceFrames: string[] = []
    if (referenceVideoFile) {
      setIsExtractingFrames(true)
      toast('Membaca video referensi...', { icon: '⏳' })
      try {
        referenceFrames = await extractFramesFromVideo(referenceVideoFile)
        toast.success('Video berhasil diproses!')
      } catch (e) {
        toast.error('Gagal membaca video referensi')
      }
      setIsExtractingFrames(false)
    }

    const task: Task = {
      id: taskId,
      status: 'analyzing',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      input: { productLink: productUrl, targetMarket, needCharacter, character, background },
      scraped,
    }
    addTask(task)
    setStep(2)
    runAnalysis(scraped, referenceFrames)
  }

  const runAnalysis = async (product: ScrapedProduct, referenceFrames: string[] = []) => {
    setAnalyzeLoading(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          userInput: { targetMarket, needCharacter, character, background },
          referenceFrames,
          openaiApiKey: settings.openaiApiKey,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      if (needCharacter !== null) {
        data.data.needCharacter = needCharacter
      }

      setAnalysis(data.data)
      updateTask(taskId, { status: 'ready', analysis: data.data })
      toast.success('Analisis selesai!')
    } catch (e: any) {
      toast.error(e.message || 'Gagal analisis produk')
      updateTask(taskId, { status: 'error', error: e.message })
    } finally {
      setAnalyzeLoading(false)
    }
  }

  // ─── 🔴 Step 3: Generate Image (DIPISAH DARI VIDEO PROMPT) ───────────────────
  const handleGenerateImage = async () => {
    if (!analysis || !scraped) return
    if (!settings.leonardoApiKey) { toast.error('Leonardo API key belum diisi di Settings'); return }

    setGenLoading(true)
    try {
      const genRes = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: scraped,
          analysis,
          leonardoApiKey: settings.leonardoApiKey,
          characterUrl: characterUrl || undefined,
          backgroundUrl: backgroundUrl || undefined,
          customPrompt: customPrompt || undefined,
        }),
      })
      const genData = await genRes.json()
      if (!genData.success) throw new Error(genData.error)

      const { generationId, imageUrl, prompt } = genData.data

      const newImg: GeneratedImage = { id: generationId, url: imageUrl, prompt, createdAt: Date.now() }

      setGeneratedImages((prev) => {
        const updated = [...prev, newImg]
        // Otomatis pindah ke gambar terbaru
        setSelectedImageIdx(updated.length - 1)
        updateTask(taskId, { status: 'edited', generatedImages: updated })
        return updated
      })
      toast.success('Gambar berhasil digenerate! Silakan periksa hasilnya.')
      
      // LOGIKA OTOMATIS VIDEO PROMPT DIHAPUS DARI SINI
      
    } catch (e: any) {
      toast.error(e.message || 'Gagal generate gambar')
    } finally {
      setGenLoading(false)
    }
  }

  // ─── 🔴 Step 3.5: Generate Video Prompt secara Manual ────────────────────────
  const handleGenerateVideoPrompt = async () => {
    if (!settings.openaiApiKey) { toast.error('API Key OpenAI belum diisi'); return }
    const currentImg = generatedImages[selectedImageIdx];
    if (!currentImg) return;

    setVpLoading(true)
    try {
      const vpRes = await fetch('/api/video-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: currentImg.url, 
          product: scraped, 
          analysis, 
          openaiApiKey: settings.openaiApiKey,
        }),
      })
      const vpData = await vpRes.json()

      if (vpData.success && vpData.data) {
        setGeneratedImages((prev) => {
          const updated = prev.map((img, idx) =>
            idx === selectedImageIdx 
              ? { ...img, clip1: vpData.data.clip1, clip2: vpData.data.clip2, fullScene: vpData.data.fullScene } 
              : img
          )
          updateTask(taskId, { generatedImages: updated })
          return updated
        })
        toast.success('Video prompt siap!')
      } else {
         throw new Error(vpData.error || 'Gagal membuat video prompt')
      }
    } catch (e: any) {
      toast.error(e.message || 'Gagal membuat video prompt')
    } finally {
      setVpLoading(false)
    }
  }

  const handleFinish = () => {
    updateTask(taskId, { status: 'finished' })
    toast.success('Tugas disimpan!')
    router.push(`/dashboard/tasks/${taskId}`)
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[85vh] bg-background text-foreground relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none opacity-40 dark:opacity-20" />

      <div className="relative max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => step > 1 ? setStep(step - 1) : router.push('/dashboard')} className="w-9 h-9 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors text-foreground">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tugas Baru</h1>
            <p className="text-sm text-muted-foreground mt-0.5 font-medium">Pipeline UGC otomatis</p>
          </div>
        </div>

        <StepBar current={step} />

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Scrape URL */}
            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <h2 className="font-bold text-foreground">Link Shopee</h2>
              </div>
              <div className="flex gap-2">
                <input
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="https://shopee.co.id/..."
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-foreground"
                />
                <button onClick={handleScrape} disabled={scrapeLoading} className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
                  {scrapeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />} {scrapeLoading ? 'Scraping...' : 'Ambil'}
                </button>
              </div>

              {scraped && (
                <div className="mt-5 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl shadow-inner">
                  <div className="flex gap-4">
                    {scraped.imageUrls[0] && <img src={scraped.imageUrls[0]} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0 border border-border/50 shadow-sm" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Produk ditemukan</span></div>
                      <p className="font-bold text-sm text-foreground line-clamp-2">{scraped.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reference Video AI UGC */}
            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Film className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <h2 className="font-bold text-foreground">Reference Video <span className="text-violet-500">(AI UGC Clone)</span></h2>
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-4">Upload video TikTok/Reels viral. AI akan meniru hook, gaya editing, dan angle kameranya.</p>
              
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="video/mp4,video/quicktime"
                  onChange={(e) => setReferenceVideoFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-xl file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-500/10 file:text-violet-700 dark:file:text-violet-300
                    hover:file:bg-violet-500/20 cursor-pointer border border-border rounded-xl px-3 py-2 bg-background"
                />
              </div>
              {referenceVideoFile && <p className="text-xs text-emerald-600 font-semibold mt-3 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Video siap dianalisis</p>}
            </div>

            {/* Pengaturan Model dll */}
            <div className="glass-card rounded-2xl p-6 space-y-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2"><User className="w-5 h-5 text-violet-600 dark:text-violet-400" /><h2 className="font-bold text-foreground">Preferensi (Opsional)</h2></div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wide">Target Pasar</label>
                <textarea value={targetMarket} onChange={(e) => setTargetMarket(e.target.value)} placeholder="Wanita 18-35 tahun, interested in skincare..." rows={2} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-violet-500 resize-none transition-all shadow-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wide">Model/Karakter dalam Video</label>
                <div className="flex gap-2">
                  {[{ val: null, label: 'Auto AI' }, { val: true, label: 'Ada Model' }, { val: false, label: 'Tanpa Model' }].map(({ val, label }) => (
                    <button key={String(val)} onClick={() => setNeedCharacter(val)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all shadow-sm ${needCharacter === val ? 'bg-violet-600 border-violet-500 text-white' : 'bg-background border-border text-muted-foreground hover:bg-muted'}`}>{label}</button>
                  ))}
                </div>
              </div>

              {needCharacter === true && (
                <div className="p-5 bg-violet-500/5 border border-violet-500/20 rounded-xl space-y-5 shadow-inner mt-4 animate-in fade-in zoom-in-95 duration-200">
                  <div>
                    <label className="text-xs font-bold text-violet-700 dark:text-violet-300 mb-2 block uppercase tracking-wide flex items-center gap-1.5"><UserCircle className="w-4 h-4"/> Foto Referensi Model (Opsional)</label>
                    <div className="flex items-center gap-3">
                      {characterUrl && (
                        <img src={characterUrl} alt="Model Preview" className="w-12 h-12 rounded-lg object-cover border border-violet-500/30 shadow-sm" />
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleCharacterPhotoUpload}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-violet-500/10 file:text-violet-700 dark:file:text-violet-300 hover:file:bg-violet-500/20 cursor-pointer border border-border rounded-xl px-3 py-1.5 bg-background shadow-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-violet-700 dark:text-violet-300 mb-2 block uppercase tracking-wide">Deskripsi Karakter (Prompt)</label>
                    <input
                      value={character}
                      onChange={(e) => setCharacter(e.target.value)}
                      placeholder="Contoh: Wanita 20an, wajah oriental, casual, senyum ceria..."
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-foreground shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleGoToAnalyze} disabled={!scraped || isExtractingFrames} className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md">
              {isExtractingFrames ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isExtractingFrames ? 'Mengekstrak Video...' : 'Analisis dengan AI'} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="space-y-5">
            {analyzeLoading ? (
              <div className="glass-card rounded-2xl p-12 flex flex-col items-center gap-5 shadow-sm">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                    <Sparkles className="w-10 h-10 text-violet-500 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-foreground">AI sedang menganalisis</p>
                  <p className="text-sm font-medium text-muted-foreground mt-1">GPT-4o Vision memproses data produk & video referensi...</p>
                </div>
              </div>
            ) : analysis ? (
              <>
                <div className="glass-card rounded-2xl p-6 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <h2 className="font-bold text-foreground">Hasil Analisis AI</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <InfoCard label="Kategori" value={analysis.category} />
                    <InfoCard label="Tone" value={analysis.recommendedTone} />
                    <InfoCard label="Model" value={analysis.needCharacter ? 'Ada karakter' : 'Produk only'} accent={analysis.needCharacter ? 'violet' : 'blue'} />
                    <InfoCard label="Target" value={analysis.targetMarket} className="col-span-2" />
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 space-y-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    <h2 className="font-bold text-foreground">Scene Video (Ala Video Referensi)</h2>
                  </div>

                  <SceneField label="Judul Scene" value={analysis.videoScene.title} onChange={(v) => setAnalysis({ ...analysis, videoScene: { ...analysis.videoScene, title: v } })} />
                  <SceneField label="Setting / Latar" value={analysis.videoScene.setting} onChange={(v) => setAnalysis({ ...analysis, videoScene: { ...analysis.videoScene, setting: v } })} />
                  <SceneField label="Action" value={analysis.videoScene.action} onChange={(v) => setAnalysis({ ...analysis, videoScene: { ...analysis.videoScene, action: v } })} multiline />
                  <SceneField label="Hook" value={analysis.videoScene.hook} onChange={(v) => setAnalysis({ ...analysis, videoScene: { ...analysis.videoScene, hook: v } })} accent />
                  <SceneField label="Durasi" value={analysis.videoScene.duration} onChange={(v) => setAnalysis({ ...analysis, videoScene: { ...analysis.videoScene, duration: v } })} />
                </div>

                <button onClick={() => setStep(3)} className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md">
                  <ImageIcon className="w-5 h-5" /> Generate Start Frame <ArrowRight className="w-5 h-5" />
                </button>
              </>
            ) : null}
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && analysis && scraped && (
          <div className="space-y-5">
            
            {/* 🔴 Bagian Render Gambar yang Dihasilkan */}
            {generatedImages.length > 0 && (
              <div className="glass-card rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-foreground flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    Start Frame ({generatedImages.length}x generate)
                  </h2>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-muted border border-border mb-4 shadow-inner">
                  <img src={generatedImages[selectedImageIdx]?.url} alt="Generated" className="w-full object-contain max-h-120" />
                </div>

                {generatedImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                    {generatedImages.map((img, i) => (
                      <button key={img.id} onClick={() => setSelectedImageIdx(i)} className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all shadow-sm ${i === selectedImageIdx ? 'border-violet-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                        <img src={img.url} alt="" className="w-16 h-16 object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* 🔴 TOMBOL MANUAL VIDEO PROMPT & RENDER HASILNYA */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-violet-700 dark:text-violet-300 flex items-center gap-2 uppercase tracking-wide">
                      <Video className="w-4 h-4" /> Grok Master Prompt (20s)
                    </h4>
                    {generatedImages[selectedImageIdx]?.clip1 && (
                      <button onClick={handleGenerateVideoPrompt} disabled={vpLoading} className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
                        <RefreshCw className={`w-3.5 h-3.5 ${vpLoading ? 'animate-spin' : ''}`} /> Generate Ulang
                      </button>
                    )}
                  </div>

                  {/* Jika prompt belum digenerate untuk gambar ini, tampilkan tombol pembuat */}
                  {!(generatedImages[selectedImageIdx]?.clip1 || generatedImages[selectedImageIdx]?.clip2) ? (
                    <button 
                      onClick={handleGenerateVideoPrompt} 
                      disabled={vpLoading}
                      className="w-full py-4 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-700 dark:text-violet-300 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      {vpLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                      {vpLoading ? 'Meracik Video Prompt...' : 'Buat Video Prompt dari Gambar Ini'}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {generatedImages[selectedImageIdx]?.fullScene && (
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-800 dark:text-blue-200">
                          <span className="font-bold">Summary:</span> {generatedImages[selectedImageIdx].fullScene}
                        </div>
                      )}
                      {generatedImages[selectedImageIdx]?.clip1 && (
                        <div className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl shadow-sm space-y-2 relative group">
                          <p className="text-xs font-bold text-violet-700 dark:text-violet-300 mb-2">🎬 Clip 1 (Detik 0 - 10)</p>
                          <p className="text-sm text-foreground leading-relaxed font-mono whitespace-pre-wrap">{generatedImages[selectedImageIdx].clip1!.prompt}</p>
                        </div>
                      )}
                      {generatedImages[selectedImageIdx]?.clip2 && (
                        <div className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl shadow-sm space-y-2 relative group">
                          <p className="text-xs font-bold text-violet-700 dark:text-violet-300 mb-2">🎬 Clip 2 (Detik 10 - 20)</p>
                          <p className="text-sm text-foreground leading-relaxed font-mono whitespace-pre-wrap">{generatedImages[selectedImageIdx].clip2!.prompt}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Panel Generate Gambar */}
            <div className="glass-card rounded-2xl p-6 space-y-5 shadow-sm">
              <h2 className="font-bold text-foreground">{generatedImages.length === 0 ? 'Generate Start Frame' : 'Generate Ulang Gambar'}</h2>
              
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wide">
                  URL Foto Background <span className="text-muted-foreground/50">(opsional)</span>
                </label>
                <input
                  value={backgroundUrl}
                  onChange={(e) => setBackgroundUrl(e.target.value)}
                  placeholder="https://... (foto referensi suasana/latar)"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-foreground shadow-sm"
                />
              </div>

              <div className="h-px bg-border" />

              <button
                onClick={() => setShowPromptEditor(!showPromptEditor)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors uppercase tracking-wide"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPromptEditor ? 'rotate-180' : ''}`} />
                {showPromptEditor ? 'Sembunyikan' : 'Edit prompt manual'}
              </button>

              {showPromptEditor && (
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wide">Custom Prompt (Opsional)</label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Kosongkan untuk auto-generate prompt. Atau tulis prompt custom..."
                    rows={3}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none transition-all text-foreground shadow-sm"
                  />
                </div>
              )}

              <button onClick={handleGenerateImage} disabled={genLoading} className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md">
                {genLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating gambar...</> : <><Sparkles className="w-5 h-5" /> {generatedImages.length === 0 ? 'Generate Gambar' : 'Coba Generate Gambar Lain'}</>}
              </button>
            </div>

            {generatedImages.length > 0 && (
              <button onClick={handleFinish} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md">
                <CheckCircle2 className="w-5 h-5" /> Selesai & Simpan Tugas
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function InfoCard({ label, value, accent, className = '' }: { label: string; value: string; accent?: string; className?: string }) {
  return (
    <div className={`bg-background border border-border rounded-xl p-3 shadow-sm ${className}`}>
      <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-bold ${accent === 'violet' ? 'text-violet-600 dark:text-violet-400' : accent === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-foreground'}`}>{value}</p>
    </div>
  )
}

function SceneField({ label, value, onChange, multiline, accent }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; accent?: boolean }) {
  return (
    <div>
      <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wide">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none transition-all shadow-sm ${accent ? 'border-violet-500/30 bg-violet-500/5 text-violet-800 dark:text-violet-200' : 'bg-background border-border text-foreground'}`} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all shadow-sm ${accent ? 'border-violet-500/30 bg-violet-500/5 text-violet-800 dark:text-violet-200' : 'bg-background border-border text-foreground'}`} />
      )}
    </div>
  )
}
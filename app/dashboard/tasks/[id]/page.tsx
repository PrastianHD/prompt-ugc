'use client'

import Link from 'next/link'
import { useAppContext } from '@/lib/context'
import { ArrowLeft, Copy, ExternalLink, RefreshCw, ImageIcon, Video, Sparkles, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import type { GeneratedImage } from '@/lib/types'
import { useState } from 'react'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:    { label: 'Pending',   color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  analyzing:  { label: 'Analyzing', color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20' },
  ready:      { label: 'Siap',      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  generating: { label: 'Generating',color: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20' },
  edited:     { label: 'Ada Gambar',color: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20' },
  finished:   { label: 'Selesai',   color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  error:      { label: 'Error',     color: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20' },
}

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const { tasks } = useAppContext()
  const task = tasks.find((t) => t.id === params.id)
  const [selectedImg, setSelectedImg] = useState(0)

  if (!task) {
    return (
      <div className="min-h-[85vh] bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Tugas tidak ditemukan</p>
          <Link href="/dashboard/tasks" className="text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 text-sm transition-colors">
            ← Kembali ke daftar
          </Link>
        </div>
      </div>
    )
  }

  const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.ready
  const imgs = task.generatedImages || []
  const currentImg = imgs[selectedImg]

  const copy = (text: string, label = 'Disalin!') => {
    navigator.clipboard.writeText(text)
    toast.success(label)
  }

  return (
    <div className="min-h-[85vh] bg-background text-foreground relative">
      {/* PERBAIKAN TAILWIND: bg-size-[60px_60px] */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none opacity-40 dark:opacity-20" />

      <div className="relative max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-start gap-4 mb-8">
          <Link
            href="/dashboard/tasks"
            className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors shrink-0 mt-0.5 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold truncate text-foreground">{task.scraped?.name || task.input.productName || 'Tugas'}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusCfg.color}`}>
                {statusCfg.label}
              </span>
              <span className="text-xs text-muted-foreground">{new Date(task.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Kiri: Product + Analysis */}
          <div className="lg:col-span-2 space-y-5">
            {task.scraped && (
              <Section title="Produk">
                {task.scraped.imageUrls[0] && (
                  <img src={task.scraped.imageUrls[0]} alt="" className="w-full rounded-xl object-cover max-h-48 mb-3 border border-border/50 shadow-sm" />
                )}
                <p className="font-semibold text-sm text-foreground">{task.scraped.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{task.scraped.category}</p>
                {task.scraped.price && <p className="text-xs text-violet-600 dark:text-violet-300 mt-1">{task.scraped.price}</p>}
                {task.scraped.description && (
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-4">{task.scraped.description}</p>
                )}
                {task.input.productLink && (
                  <a href={task.input.productLink} target="_blank" rel="noopener noreferrer"
                    className="mt-2 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-500 flex items-center gap-1 transition-colors font-medium">
                    Lihat di Shopee <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </Section>
            )}

            {task.analysis && (
              <Section title="Analisis AI">
                <div className="space-y-3">
                  <MiniRow label="Target Pasar" value={task.analysis.targetMarket} />
                  <MiniRow label="Tone" value={task.analysis.recommendedTone} />
                  <MiniRow label="Model" value={task.analysis.needCharacter ? 'Ada Karakter' : 'Produk Only'} />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Selling Points</p>
                    <div className="flex flex-wrap gap-1.5">
                      {/* PERBAIKAN TYPESCRIPT: Menambahkan (p: string, i: number) */}
                      {task.analysis.keySellingPoints.map((p: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs font-medium text-violet-700 dark:text-violet-300">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {task.analysis?.videoScene && (
              <Section title="Scene Video">
                <div className="space-y-3">
                  <SceneRow label="Judul" value={task.analysis.videoScene.title} />
                  <SceneRow label="Setting" value={task.analysis.videoScene.setting} />
                  <SceneRow label="Action" value={task.analysis.videoScene.action} />
                  <div className="p-3 bg-violet-500/5 border border-violet-500/15 rounded-lg shadow-inner">
                    <p className="text-xs font-semibold text-violet-700 dark:text-violet-300 mb-1">Hook</p>
                    <p className="text-xs text-foreground italic">"{task.analysis.videoScene.hook}"</p>
                  </div>
                  <SceneRow label="Durasi" value={task.analysis.videoScene.duration} />
                </div>
              </Section>
            )}
          </div>

          {/* Kanan: Generated Images */}
          <div className="lg:col-span-3 space-y-5">
            {imgs.length > 0 ? (
              <Section title={`Start Frame (${imgs.length} gambar)`}>
                <div className="relative rounded-xl overflow-hidden bg-muted/30 mb-4 border border-border shadow-sm">
                  {/* PERBAIKAN TAILWIND: max-h-125 */}
                  <img src={currentImg.url} alt="Generated" className="w-full object-contain max-h-125" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 bg-background/80 backdrop-blur-md rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm border border-border/50 text-foreground">
                      <ImageIcon className="w-3.5 h-3.5 text-violet-500" />
                      {selectedImg + 1} / {imgs.length}
                    </span>
                  </div>
                  <a
                    href={currentImg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-background transition-colors shadow-sm border border-border/50 text-foreground"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {imgs.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {/* PERBAIKAN TYPESCRIPT: Menambahkan (img: GeneratedImage, i: number) */}
                    {imgs.map((img: GeneratedImage, i: number) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImageIdx(i)}
                        className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all shadow-sm ${i === selectedImg ? 'border-violet-500 opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img src={img.url} alt="" className="w-16 h-16 object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-5">
                  <button
                    onClick={() => copy(currentImg.prompt, 'Image prompt disalin!')}
                    className="w-full text-left p-4 bg-muted/30 border border-border rounded-xl hover:bg-muted/50 transition-colors group shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prompt Gambar</p>
                      <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <p className="text-sm text-foreground leading-relaxed line-clamp-3 font-mono">{currentImg.prompt}</p>
                  </button>
                </div>

                {/* 🔴 HASIL GROK AI MASTER PROMPT */}
                {(currentImg.clip1 || currentImg.clip2) && (
                  <div className="mt-6 space-y-4">
                    <h4 className="text-sm font-bold text-violet-600 dark:text-violet-400 flex items-center gap-2 uppercase tracking-wide">
                      <Video className="w-4 h-4" /> Grok AI Video Prompts (20s)
                    </h4>

                    {currentImg.fullScene && (
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-800 dark:text-blue-200">
                        <span className="font-bold">Summary:</span> {currentImg.fullScene}
                      </div>
                    )}
                    
                    {/* CLIP 1 */}
                    {currentImg.clip1 && (
                      <div className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-violet-700 dark:text-violet-300">🎬 CLIP 1 (0s - 10s)</p>
                          <button onClick={() => copy(currentImg.clip1!.prompt, 'Clip 1 disalin!')} className="hover:text-violet-500 transition-colors p-1">
                            <Copy className="w-4 h-4 text-violet-500/50 hover:text-violet-500" />
                          </button>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed font-mono whitespace-pre-wrap">{currentImg.clip1.prompt}</p>
                        {(currentImg.clip1.endFrame || currentImg.clip1.notes) && (
                          <div className="pt-3 mt-3 border-t border-violet-500/10 text-xs text-muted-foreground space-y-1.5">
                            {currentImg.clip1.endFrame && <p><strong className="text-foreground/70">End Frame:</strong> {currentImg.clip1.endFrame}</p>}
                            {currentImg.clip1.notes && <p><strong className="text-foreground/70">Catatan:</strong> {currentImg.clip1.notes}</p>}
                          </div>
                        )}
                      </div>
                    )}

                    {/* CLIP 2 */}
                    {currentImg.clip2 && (
                      <div className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-violet-700 dark:text-violet-300">🎬 CLIP 2 (10s - 20s)</p>
                          <button onClick={() => copy(currentImg.clip2!.prompt, 'Clip 2 disalin!')} className="hover:text-violet-500 transition-colors p-1">
                            <Copy className="w-4 h-4 text-violet-500/50 hover:text-violet-500" />
                          </button>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed font-mono whitespace-pre-wrap">{currentImg.clip2.prompt}</p>
                        {currentImg.clip2.notes && (
                          <div className="pt-3 mt-3 border-t border-violet-500/10 text-xs text-muted-foreground">
                            <p><strong className="text-foreground/70">Catatan:</strong> {currentImg.clip2.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xs text-muted-foreground text-right mt-5 font-medium">
                  Generate: {new Date(currentImg.createdAt).toLocaleTimeString('id-ID')}
                </p>
              </Section>
            ) : (
              <Section title="Start Frame">
                <div className="py-12 text-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground font-medium">Belum ada gambar digenerate</p>
                  {(task.status === 'ready' || task.status === 'analyzing') && (
                    <Link
                      href="/dashboard/new"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                    >
                      <Sparkles className="w-4 h-4" /> Lanjutkan Pipeline
                    </Link>
                  )}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-sm font-bold text-foreground mb-5 tracking-wide uppercase">{title}</h3>
      {children}
    </div>
  )
}

function MiniRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground mt-1">{value}</p>
    </div>
  )
}

function SceneRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <p className="text-xs font-medium text-muted-foreground w-14 shrink-0 mt-0.5">{label}</p>
      <p className="text-sm text-foreground leading-relaxed">{value}</p>
    </div>
  )
}
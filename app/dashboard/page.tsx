'use client'

import { useAppContext } from '@/lib/context'
import Link from 'next/link'
import { Plus, Sparkles, CheckCircle2, Clock, AlertCircle, ImageIcon, ArrowRight, Zap } from 'lucide-react'

const STATUS_CONFIG: Record<string, { label: string; dot: string }> = {
  pending:    { label: 'Pending',    dot: 'bg-yellow-400' },
  analyzing:  { label: 'Analyzing', dot: 'bg-blue-400 animate-pulse' },
  ready:      { label: 'Siap',      dot: 'bg-emerald-400' },
  generating: { label: 'Generating',dot: 'bg-violet-400 animate-pulse' },
  edited:     { label: 'Ada Gambar',dot: 'bg-violet-400' },
  finished:   { label: 'Selesai',   dot: 'bg-emerald-400' },
  error:      { label: 'Error',     dot: 'bg-red-400' },
}

export default function DashboardPage() {
  const { tasks, settings } = useAppContext()

  const finished = tasks.filter(t => t.status === 'finished').length
  const withImages = tasks.filter(t => (t.generatedImages?.length || 0) > 0).length
  const hasApiKeys = settings.openaiApiKey && settings.leonardoApiKey

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-white/40 text-sm mt-1">Pipeline UGC otomatis dari Shopee → Start Frame</p>
          </div>
          <Link
            href="/dashboard/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-semibold transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Tugas Baru
          </Link>
        </div>

        {/* API Key warning */}
        {!hasApiKeys && (
          <Link href="/dashboard/settings"
            className="flex items-center gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl hover:border-yellow-500/40 transition-colors group">
            <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-300">API Key belum dikonfigurasi</p>
              <p className="text-xs text-yellow-400/60 mt-0.5">Isi OpenAI & Leonardo API key di Settings untuk mulai menggunakan pipeline</p>
            </div>
            <ArrowRight className="w-4 h-4 text-yellow-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value={tasks.length} label="Total Tugas" icon={<Clock className="w-4 h-4" />} />
          <StatCard value={withImages} label="Ada Gambar" icon={<ImageIcon className="w-4 h-4" />} accent="violet" />
          <StatCard value={finished} label="Selesai" icon={<CheckCircle2 className="w-4 h-4" />} accent="emerald" />
          <StatCard value={tasks.filter(t => t.analysis).length} label="Teranalisis" icon={<Sparkles className="w-4 h-4" />} accent="blue" />
        </div>

        {/* Pipeline steps reminder */}
        {tasks.length === 0 && (
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-8">
            <h2 className="font-semibold mb-6 text-center text-white/60 text-sm uppercase tracking-wider">Cara Kerja Pipeline</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { n: '1', title: 'Paste Link Shopee', desc: 'Scrape otomatis nama, foto, kategori, deskripsi produk', icon: '🔗' },
                { n: '2', title: 'Analisis AI', desc: 'GPT-4o Vision analisis produk → target market + video scene', icon: '🤖' },
                { n: '3', title: 'Generate Gambar', desc: 'Leonardo Phoenix buat start frame berdasarkan scene', icon: '🎨' },
                { n: '4', title: 'Video Prompt', desc: 'GPT-4o analisis gambar → master prompt image-to-video', icon: '🎬' },
              ].map(step => (
                <div key={step.n} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/8">
                  <div className="text-2xl mb-2">{step.icon}</div>
                  <p className="text-xs text-violet-400 font-bold mb-1">Step {step.n}</p>
                  <p className="text-sm font-semibold mb-2">{step.title}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/dashboard/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition-all"
              >
                <Zap className="w-4 h-4" />
                Mulai Sekarang
              </Link>
            </div>
          </div>
        )}

        {/* Task list */}
        {tasks.length > 0 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <h2 className="font-semibold">Tugas Terbaru</h2>
              <Link href="/dashboard/tasks" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Lihat semua →
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {tasks.slice(0, 8).map((task) => {
                const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.ready
                const imgCount = task.generatedImages?.length || 0
                const thumb = task.generatedImages?.[0]?.url || task.scraped?.imageUrls?.[0]

                return (
                  <Link
                    key={task.id}
                    href={`/dashboard/tasks/${task.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden shrink-0">
                      {thumb ? (
                        <img src={thumb} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate group-hover:text-violet-300 transition-colors">
                        {task.scraped?.name || task.input.productName || 'Tugas'}
                      </p>
                      <p className="text-xs text-white/30 mt-0.5">
                        {new Date(task.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        {imgCount > 0 && ` · ${imgCount} gambar`}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      <span className="text-xs text-white/40">{cfg.label}</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ value, label, icon, accent }: { value: number; label: string; icon: React.ReactNode; accent?: string }) {
  const colors: Record<string, string> = {
    violet: 'text-violet-400',
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
  }
  const color = accent ? colors[accent] : 'text-white/60'
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
      <div className={`mb-2 ${color}`}>{icon}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <p className="text-xs text-white/30 mt-0.5">{label}</p>
    </div>
  )
}

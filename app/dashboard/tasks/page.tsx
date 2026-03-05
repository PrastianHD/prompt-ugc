'use client'

import Link from 'next/link'
import { useAppContext } from '@/lib/context'
import { Plus, Trash2, ImageIcon, ArrowRight, Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:    { label: 'Pending',    color: 'text-yellow-700 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  analyzing:  { label: 'Analyzing', color: 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20' },
  ready:      { label: 'Siap',      color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  generating: { label: 'Generating',color: 'text-violet-700 dark:text-violet-400 bg-violet-500/10 border-violet-500/20' },
  edited:     { label: 'Ada Gambar',color: 'text-violet-700 dark:text-violet-400 bg-violet-500/10 border-violet-500/20' },
  finished:   { label: 'Selesai',   color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  error:      { label: 'Error',     color: 'text-red-700 dark:text-red-400 bg-red-500/10 border-red-500/20' },
}

export default function TasksListPage() {
  const { tasks, removeTask } = useAppContext()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = tasks.filter(t => {
    const name = (t.scraped?.name || t.input.productName || '').toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase())
    const matchFilter = filter === 'all' || t.status === filter
    return matchSearch && matchFilter
  })

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    removeTask(id)
    toast.success('Tugas dihapus')
  }

  return (
    <div className="min-h-[85vh] bg-background text-foreground relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-40 dark:opacity-20" />

      <div className="relative max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Semua Tugas</h1>
            <p className="text-sm font-medium text-muted-foreground mt-1.5">{tasks.length} tugas total</p>
          </div>
          <Link
            href="/dashboard/new"
            className="flex items-center justify-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-all shrink-0 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Tugas Baru
          </Link>
        </div>

        {/* Filters */}
        {tasks.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk..."
                className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-foreground shadow-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['all', 'ready', 'edited', 'finished', 'error'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-3 rounded-xl text-xs font-bold whitespace-nowrap border transition-all shadow-sm ${
                    filter === f ? 'bg-violet-600 border-violet-500 text-white' : 'bg-background border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {f === 'all' ? 'SEMUA' : STATUS_CONFIG[f]?.label.toUpperCase() || f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {tasks.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5 border border-border">
              <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Belum ada tugas</h2>
            <p className="text-sm font-medium text-muted-foreground mb-8 max-w-sm mx-auto">Mulai pipeline UGC pertama Anda dengan melakukan scraping link Shopee.</p>
            <Link href="/dashboard/new" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-all shadow-md">
              <Plus className="w-5 h-5" /> Buat Tugas Pertama
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm font-bold uppercase tracking-widest">Tidak ada tugas yang cocok dengan filter</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(task => {
              const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.ready
              const imgs = task.generatedImages || []
              const thumb = imgs[0]?.url || task.scraped?.imageUrls?.[0]

              return (
                <Link
                  key={task.id}
                  href={`/dashboard/tasks/${task.id}`}
                  className="group glass-card rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md hover:border-violet-500/40 block"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-muted overflow-hidden relative border-b border-border">
                    {thumb ? (
                      <img src={thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    {imgs.length > 0 && (
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-background/80 backdrop-blur-md border border-border/50 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm text-foreground">
                        <ImageIcon className="w-3.5 h-3.5 text-violet-500" />
                        {imgs.length} gambar
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <p className="font-bold text-sm text-foreground line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-3">
                      {task.scraped?.name || task.input.productName || 'Tugas'}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-muted-foreground">
                        {new Date(task.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleDelete(task.id, e)}
                          className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center group-hover:bg-violet-600 group-hover:border-violet-500 transition-colors">
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
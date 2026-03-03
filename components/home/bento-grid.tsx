'use client'

import { Brain, Video, ImagePlay, Sparkles, Clock, Zap, ArrowUpRight } from 'lucide-react'

const cards = [
  {
    id: 'analyze',
    icon: Brain,
    badge: 'badge-violet',
    badgeText: 'Step 1',
    title: 'Analisis Produk',
    description: 'AI menganalisis foto/link produk, mengidentifikasi poin jual, target pasar, dan nada komunikasi paling efektif secara otomatis.',
    accent: 'violet',
    size: 'wide',  // col-span 2
    highlight: true,
  },
  {
    id: 'script',
    icon: Video,
    badge: 'badge-violet',
    badgeText: 'Output',
    title: 'Script Per Adegan',
    description: 'Hook, aksi, setting, dan durasi — siap diberikan ke talent.',
    accent: 'violet',
    size: 'normal',
  },
  {
    id: 'frame',
    icon: ImagePlay,
    badge: 'badge-cyan',
    badgeText: 'Step 2',
    title: 'Frame Visual AI',
    description: 'Leonardo AI buat gambar referensi tiap adegan. Brief visual yang jelas untuk tim produksi.',
    accent: 'cyan',
    size: 'normal',
  },
  {
    id: 'prompt',
    icon: Sparkles,
    badge: 'badge-rose',
    badgeText: 'Step 3',
    title: 'Prompt Video Siap',
    description: 'Prompt siap pakai untuk Kling, Runway, atau Pika. Langsung generate.',
    accent: 'rose',
    size: 'normal',
  },
  {
    id: 'auto',
    icon: Clock,
    badge: 'badge-cyan',
    badgeText: 'n8n Pipeline',
    title: 'Otomatis 24/7',
    description: 'Pipeline n8n berjalan otomatis di background — submit produk, tunggu hasilnya. Tidak perlu intervensi manual.',
    accent: 'cyan',
    size: 'wide',
  },
  {
    id: 'fast',
    icon: Zap,
    badge: 'badge-violet',
    badgeText: 'Quick',
    title: 'Mulai dalam 60 Detik',
    description: 'Isi form, submit, selesai.',
    accent: 'violet',
    size: 'normal',
  },
]

const accentMap = {
  violet: {
    icon: 'bg-[rgba(139,92,246,0.1)] text-[var(--accent-bright)]',
    glow: 'hover:shadow-[0_0_0_1px_rgba(139,92,246,0.4),0_12px_40px_rgba(139,92,246,0.15)]',
    dot: 'bg-[var(--accent-bright)]',
    bar: 'from-[var(--accent)] to-transparent',
  },
  cyan: {
    icon: 'bg-[rgba(6,182,212,0.1)] text-[var(--accent2-bright)]',
    glow: 'hover:shadow-[0_0_0_1px_rgba(6,182,212,0.4),0_12px_40px_rgba(6,182,212,0.12)]',
    dot: 'bg-[var(--accent2-bright)]',
    bar: 'from-[var(--accent2)] to-transparent',
  },
  rose: {
    icon: 'bg-[rgba(244,63,94,0.1)] text-[var(--accent3)]',
    glow: 'hover:shadow-[0_0_0_1px_rgba(244,63,94,0.4),0_12px_40px_rgba(244,63,94,0.12)]',
    dot: 'bg-[var(--accent3)]',
    bar: 'from-[var(--accent3)] to-transparent',
  },
}

export default function BentoGrid() {
  return (
    <section id="features" className="py-28 w-full">
      <div className="max-w-6xl mx-auto px-6">
      {/* Header */}
      <div className="mb-16">
        <span className="badge badge-violet mb-5 block w-fit">Fitur Unggulan</span>
        <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-tight text-[var(--text-primary)]">
          Dari produk ke konten,<br />
          <span className="gradient-text italic">semua otomatis.</span>
        </h2>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {cards.map((card) => {
          const Icon = card.icon
          const a = accentMap[card.accent as keyof typeof accentMap]
          const isWide = card.size === 'wide'

          return (
            <div
              key={card.id}
              className={`group relative glass-card rounded-3xl p-7 overflow-hidden noise-overlay shimmer transition-all duration-300 cursor-default ${
                isWide ? 'md:col-span-2' : ''
              } ${a.glow} hover:border-[var(--border-hover)] hover:-translate-y-1`}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${a.bar} opacity-50`} />

              {/* Badge */}
              <span className={`badge ${card.badge} mb-5 inline-flex`}>{card.badgeText}</span>

              {/* Icon */}
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 ${a.icon}`}>
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 leading-snug">{card.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{card.description}</p>

              {/* Hover arrow */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-40 transition-opacity">
                <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)]" />
              </div>

              {/* Corner dot */}
              <div className={`absolute bottom-5 right-5 w-1.5 h-1.5 rounded-full ${a.dot} opacity-30 group-hover:opacity-70 transition-opacity`} />
            </div>
          )
        })}
      </div>
      </div>
    </section>
  )
}

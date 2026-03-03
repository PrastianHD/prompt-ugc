'use client'

import Link from 'next/link'
import { ArrowRight, Play, Sparkles } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full animate-mesh"
          style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full animate-mesh"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.10) 0%, transparent 70%)', animationDelay: '8s' }} />
        <div className="absolute top-[40%] right-[25%] w-[300px] h-[300px] rounded-full animate-float2"
          style={{ background: 'radial-gradient(ellipse, rgba(244,63,94,0.07) 0%, transparent 70%)' }} />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-24 text-center">

        {/* Badge */}
        <div className="inline-flex mb-10 animate-fade-up">
          <span className="badge badge-violet">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-bright)] animate-pulse-glow" />
            Pipeline n8n · Otomatis dari Awal ke Akhir
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-[clamp(3rem,8vw,6.5rem)] leading-[1.05] tracking-tight mb-8 animate-fade-up delay-100">
          <span className="block text-[var(--text-primary)]">Konten UGC</span>
          <span className="block gradient-text italic">Profesional</span>
          <span className="block text-[var(--text-muted)] text-[0.65em] font-display not-italic mt-2">
            dalam hitungan menit — bukan hari.
          </span>
        </h1>

        {/* Sub */}
        <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up delay-200">
          Unggah foto produk, isi detail singkat. AI kami hasilkan script adegan, frame visual Leonardo AI,
          hingga prompt video siap pakai — semua berjalan otomatis di background.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-up delay-300">
          <Link href="/dashboard/new" className="btn-primary text-base">
            Mulai Gratis Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="btn-ghost text-base">
            <div className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'var(--accent-subtle)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <Play className="w-3 h-3 text-[var(--accent-bright)] ml-0.5" />
            </div>
            Lihat Demo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px animate-fade-up delay-400"
          style={{ background: 'var(--border)' }}>
          {[
            { value: '5.000+', label: 'Konten Dibuat' },
            { value: '200+',   label: 'Brand Percaya' },
            { value: '10×',    label: 'Lebih Cepat' },
          ].map((s) => (
            <div key={s.label} className="py-8 px-4" style={{ background: 'var(--bg-base)' }}>
              <div className="text-3xl font-bold gradient-text font-display">{s.value}</div>
              <div className="text-sm text-[var(--text-muted)] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Floating glass cards decorative */}
        <div className="hidden lg:block">
          <div className="absolute top-32 -left-8 glass-card rounded-2xl p-4 w-52 text-left animate-float" style={{ animationDelay: '1s' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-bright)]" />
              <span className="text-xs text-[var(--text-muted)] font-medium">Script Ready</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              "Hook: Pernah ngerasa produk skincare nggak kerja? Ini yang akhirnya berhasil..."
            </p>
          </div>
          <div className="absolute top-48 -right-4 glass-card rounded-2xl p-4 w-48 text-left animate-float2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent2-bright)]" />
              <span className="text-xs text-[var(--text-muted)] font-medium">Frame Generated</span>
            </div>
            <div className="w-full h-16 rounded-lg" style={{ background: 'var(--accent2-subtle)' }} />
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { BrainCircuit, Wand2, Palette, Zap, Puzzle } from 'lucide-react'

// Helper component for Step Boxes
const StepBoxHorizontal = ({ badge, title, children, icon: Icon, accent }: any) => {
  const accentGlowClass = {
    violet: 'hover:glow-violet',
    cyan: 'hover:glow-cyan',
    rose: 'hover:glow-rose',
  }

  return (
    // FIX MOBILE: p-6 di HP, p-8 di Desktop. flex-col-reverse di HP (icon di atas), flex-row di Desktop.
    <div className={`p-6 md:p-8 glass-card rounded-3xl flex flex-col-reverse sm:flex-row items-center sm:justify-between gap-5 sm:gap-6 hover:border-[var(--border-hover)] transition-all duration-300 ${accentGlowClass[accent as keyof typeof accentGlowClass]}`}>
      
      {/* Teks: Di HP rata tengah, di Desktop rata kiri */}
      <div className="flex-1 text-center sm:text-left">
        <span className={`badge ${accent === 'violet' ? 'badge-violet' : 'badge-cyan'} mb-3 mx-auto sm:mx-0`}>{badge}</span>
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {children}
        </p>
      </div>
      
      {/* Icon: Di HP ukurannya lebih kecil (w-16), di Desktop (w-20) */}
      <div className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border transition-all duration-300
        ${accent === 'violet' 
          ? 'bg-[var(--accent-subtle)] border-[var(--border-glow)] text-[var(--accent-bright)]' 
          : 'bg-[var(--accent2-subtle)] border-[var(--accent2-glow)] text-[var(--accent2-bright)]'}`}>
        <Icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
      </div>
    </div>
  )
}

export default function BentoGrid() {
  return (
    // FIX MOBILE: Padding atas-bawah dikurangin di HP (py-16), di Desktop (py-24)
    <section id="features" className="py-16 md:py-24 px-5 md:px-6 max-w-7xl mx-auto noise-overlay dot-grid">
      <div className="mb-12 md:mb-16 text-center">
        <span className="badge badge-violet mb-4 block w-fit mx-auto">Fitur Unggulan</span>
        
        {/* FIX MOBILE: Font judul dikecilin di HP (text-4xl), di Desktop raksasa (md:text-6xl) */}
        <h2 className="font-display text-4xl md:text-5xl lg:text-[4.5rem] leading-tight text-foreground">
          Satu Dashboard,<br />
          <span className="text-muted-foreground italic">Pipeline UGC Lengkap.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
        
        {/* --- ROW 1 --- */}
        <div className="md:col-span-1">
          <StepBoxHorizontal 
            badge="Input" 
            title="Analisis Data Produk" 
            icon={BrainCircuit} 
            accent="violet"
          >
            Tulis link, nama, atau deskripsi produk. AI langsung menganalisis nilai jual unik produk Anda dalam hitungan detik.
          </StepBoxHorizontal>
        </div>

        {/* Brand Identity Feature */}
        <div className="md:col-span-2 p-6 md:p-10 glass-card rounded-3xl noise-overlay flex flex-col justify-between gap-8 md:gap-12 border-gradient hover:glow-violet">
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6 text-center sm:text-left">
            <div className="max-w-md mx-auto sm:mx-0">
              <span className="badge badge-violet mb-4 mx-auto sm:mx-0">Output</span>
              <h3 className="font-display text-2xl md:text-3xl text-foreground mb-3">Sesuaikan dengan Brand Anda</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Tentukan target audiens, *vibe* konten (casual, professional), dan bahasa produk agar output AI selalu sinkron dengan identitas brand Anda.
              </p>
            </div>
            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto sm:mx-0 rounded-2xl flex items-center justify-center bg-[var(--bg-glass)] border border-[var(--border-hover)] text-[var(--accent-bright)]">
              <Palette className="w-7 h-7 md:w-8 md:h-8" />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {['#8b5cf6', '#a78bfa', '#c4c4d0', '#f0f0f5', '#22d3ee', '#f43f5e'].map(color => (
              <div key={color} className="flex-1 min-w-[40px] md:min-w-[50px] h-10 md:h-14 rounded-xl border border-[var(--border)] group cursor-pointer" style={{ backgroundColor: color }}>
              </div>
            ))}
          </div>
        </div>

        {/* --- ROW 2 --- */}
        <div className="md:col-span-1">
          <StepBoxHorizontal 
            badge="AI Magic" 
            title="Generasi Script & Visual" 
            icon={Wand2} 
            accent="violet"
          >
            AI membuat script UGC terstruktur (Hook, Body, CTA) dan visual frame-by-frame secara otomatis.
          </StepBoxHorizontal>
        </div>

        <div className="md:col-span-1">
          <StepBoxHorizontal 
            badge="Output Quick" 
            title="Prompt Video Siap Pakai" 
            icon={Zap} 
            accent="cyan"
          >
            Dapatkan prompt visual siap paste ke Luma, Runway, atau Kling AI untuk membuat video UGC profesional.
          </StepBoxHorizontal>
        </div>

        {/* n8n Integration */}
        <div className="md:col-span-1 p-6 md:p-8 glass-card rounded-3xl flex flex-col gap-5 hover:border-[var(--border-hover)] transition-all duration-300 hover:glow-cyan text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--accent2-subtle)] border border-[var(--accent2-glow)] text-[var(--accent2-bright)]">
              <Puzzle className="w-7 h-7" />
            </div>
            <div>
              <span className="badge badge-cyan mb-1.5 mx-auto sm:mx-0 block w-fit">Automasi</span>
              <h3 className="text-xl font-bold text-foreground">Integrasi n8n</h3>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            Gunakan webhook untuk menghubungkan PromptCraft dengan *automation pipeline* n8n Anda. Jalankan pembuatan konten secara massal dan otomatis.
          </p>
        </div>

      </div>
    </section>
  )
}
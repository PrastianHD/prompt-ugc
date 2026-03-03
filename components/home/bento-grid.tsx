'use client'

import { Zap, Palette, Brain, Video, Sparkles, Share2 } from 'lucide-react'

interface BentoCardProps {
  title: string
  description: string
  icon: React.ReactNode
  className?: string
  gradient?: string
}

function BentoCard({ title, description, icon, className = '', gradient }: BentoCardProps) {
  return (
    <div className={`glass-card p-6 md:p-8 ${className}`}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${gradient || 'bg-indigo-500/20'}`}>
        <span className="text-cyan-400">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}

export default function BentoGrid() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-bold">Fitur Unggulan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Semua yang Anda butuhkan untuk membuat konten UGC berkualitas profesional</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
        {/* Featured card (larger) */}
        <BentoCard
          title="Generasi Script AI"
          description="Hasilkan script UGC yang menarik dalam hitungan detik. AI kami menganalisis produk Anda dan membuat script yang disesuaikan dengan target pasar Anda."
          icon={<Brain className="w-6 h-6" />}
          className="md:col-span-2 lg:col-span-2 md:row-span-2"
          gradient="bg-indigo-500/20"
        />

        <BentoCard
          title="Pembingkaian Adegan"
          description="Buat deskripsi adegan dan saran pembingkaian untuk video Anda secara otomatis."
          icon={<Palette className="w-6 h-6" />}
          gradient="bg-cyan-500/20"
        />

        <BentoCard
          title="Setup Sekali Klik"
          description="Unggah foto produk Anda dan biarkan AI melakukan sisanya. Sederhana, cepat, dan intuitif."
          icon={<Zap className="w-6 h-6" />}
          gradient="bg-yellow-500/20"
        />

        <BentoCard
          title="Format Beragam"
          description="Ekspor script dalam berbagai format yang dioptimalkan untuk TikTok, Instagram, YouTube, dan lebih banyak lagi."
          icon={<Video className="w-6 h-6" />}
          gradient="bg-pink-500/20"
        />

        <BentoCard
          title="Prompt Dapat Disesuaikan"
          description="Sesuaikan setiap aspek script Anda dengan opsi kustomisasi lanjutan."
          icon={<Sparkles className="w-6 h-6" />}
          className="md:col-span-2 lg:col-span-2"
          gradient="bg-purple-500/20"
        />

        <BentoCard
          title="Bagikan & Kolaborasi"
          description="Bagikan script Anda dengan anggota tim dan dapatkan umpan balik secara real-time."
          icon={<Share2 className="w-6 h-6" />}
          gradient="bg-green-500/20"
        />
      </div>
    </section>
  )
}

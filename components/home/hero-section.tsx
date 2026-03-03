'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Generasi UGC dengan AI</span>
        </div>

        {/* Main heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight text-pretty">
            <span className="text-primary">Buat Video UGC</span>
            <br />
            <span className="text-foreground">dalam Hitungan Detik</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Ubah produk Anda menjadi konten buatan pengguna yang menarik dengan generasi script berbasis AI dan pembingkaian adegan. Sempurna untuk TikTok, Instagram, dan YouTube.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 h-12 px-8 text-base">
              Mulai Gratis
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base">
            Lihat Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 pt-12 border-t border-border">
          <div className="space-y-2">
            <div className="text-2xl md:text-3xl font-bold text-primary">5K+</div>
            <p className="text-sm text-muted-foreground">Script Terbuat</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl md:text-3xl font-bold text-secondary">200+</div>
            <p className="text-sm text-muted-foreground">Kreator Senang</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl md:text-3xl font-bold text-primary">98%</div>
            <p className="text-sm text-muted-foreground">Tingkat Puas</p>
          </div>
        </div>
      </div>
    </section>
  )
}

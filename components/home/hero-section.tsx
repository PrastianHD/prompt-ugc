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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/30">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-400 font-medium">AI-Powered UGC Generation</span>
        </div>

        {/* Main heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-pretty">
            <span className="gradient-text">Create Professional UGC</span>
            <br />
            <span className="text-foreground">in Seconds</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Transform your product into compelling user-generated content with AI-powered script generation and scene framing. Perfect for TikTok, Instagram, and YouTube.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8 text-base">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/10 hover:bg-white/5">
            View Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5">
          <div className="space-y-2">
            <div className="text-2xl md:text-3xl font-bold text-cyan-400">10K+</div>
            <p className="text-sm text-muted-foreground">Scripts Generated</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl md:text-3xl font-bold text-indigo-400">500+</div>
            <p className="text-sm text-muted-foreground">Happy Creators</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl md:text-3xl font-bold text-purple-400">99%</div>
            <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  )
}

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
        <h2 className="text-4xl md:text-5xl font-bold">Powerful Features</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to create professional UGC content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
        {/* Featured card (larger) */}
        <BentoCard
          title="AI Script Generation"
          description="Generate engaging UGC scripts in seconds. Our AI analyzes your product and creates scripts tailored to your target market."
          icon={<Brain className="w-6 h-6" />}
          className="md:col-span-2 lg:col-span-2 md:row-span-2"
          gradient="bg-indigo-500/20"
        />

        <BentoCard
          title="Scene Framing"
          description="Automatically create scene descriptions and frame suggestions for your videos."
          icon={<Palette className="w-6 h-6" />}
          gradient="bg-cyan-500/20"
        />

        <BentoCard
          title="One-Click Setup"
          description="Upload your product photo and let AI do the rest. Simple, fast, and intuitive."
          icon={<Zap className="w-6 h-6" />}
          gradient="bg-yellow-500/20"
        />

        <BentoCard
          title="Multiple Formats"
          description="Export scripts in various formats optimized for TikTok, Instagram, YouTube, and more."
          icon={<Video className="w-6 h-6" />}
          gradient="bg-pink-500/20"
        />

        <BentoCard
          title="Customizable Prompts"
          description="Fine-tune every aspect of your scripts with advanced customization options."
          icon={<Sparkles className="w-6 h-6" />}
          className="md:col-span-2 lg:col-span-2"
          gradient="bg-purple-500/20"
        />

        <BentoCard
          title="Share & Collaborate"
          description="Share your scripts with team members and get feedback in real-time."
          icon={<Share2 className="w-6 h-6" />}
          gradient="bg-green-500/20"
        />
      </div>
    </section>
  )
}

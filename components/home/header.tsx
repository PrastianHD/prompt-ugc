'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 glass-card border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <Sparkles className="w-6 h-6 text-primary" />
          <span>PromptCraft</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm hover:text-primary transition-colors">
            Fitur
          </a>
          <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">
            Cara Kerja
          </a>
          <a href="#pricing" className="text-sm hover:text-primary transition-colors">
            Harga
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button asChild className="hidden sm:flex bg-primary hover:bg-primary/90">
            <Link href="/dashboard">
              Mulai Gratis
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

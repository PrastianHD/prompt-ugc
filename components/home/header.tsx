'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-all">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-black text-xl text-foreground">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[var(--accent)] shadow-[0_0_20px_var(--accent-glow)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display">PromptCraft</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: '#features', label: 'Fitur' },
            { href: '#how-it-works', label: 'Cara Kerja' },
            { href: '#pricing', label: 'Harga' },
          ].map((item) => (
            <a key={item.href} href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/dashboard/new" className="hidden sm:inline-flex btn-primary py-2 px-5 text-sm rounded-xl">
            Mulai Gratis
          </Link>
        </div>
      </div>
    </header>
  )
}
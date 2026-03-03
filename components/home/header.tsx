'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 border-b"
      style={{
        background: 'rgba(8, 9, 16, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'var(--border)',
      }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-black text-xl text-[var(--text-primary)]">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent)', boxShadow: '0 0 20px var(--accent-glow)' }}>
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
              className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/dashboard/new"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-200"
            style={{ background: 'var(--accent)', boxShadow: '0 0 20px var(--accent-glow)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}>
            Mulai Gratis
          </Link>
        </div>
      </div>
    </header>
  )
}

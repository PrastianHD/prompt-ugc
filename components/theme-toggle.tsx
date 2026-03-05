'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Saat belum mount (mencegah kedip / hydration mismatch)
  if (!mounted) return (
    <div className="w-9 h-9 rounded-xl bg-card border border-border" />
  )

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Mode terang' : 'Mode gelap'}
      // Memanfaatkan class bawaan Tailwind untuk hover agar lebih ringan & smooth
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 bg-card border border-border text-muted-foreground hover:border-[var(--border-glow)] hover:text-[var(--accent-bright)]"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, PlusCircle, ListTodo, Settings, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { label: 'Tugas Baru', href: '/dashboard/new', icon: PlusCircle },
  { label: 'Daftar Tugas', href: '/dashboard/tasks', icon: ListTodo },
  { label: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 font-display font-bold text-lg">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>PromptCraft</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right mr-2">
            <p className="text-xs font-semibold">Paket: Gratis</p>
            <p className="text-[10px] text-muted-foreground">5 script / bulan</p>
          </div>
          <Button size="sm" className="shadow-lg shadow-primary/25">Upgrade</Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-4 shadow-xl absolute w-full">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="pt-4 border-t border-border space-y-3">
            <div className="px-2 text-sm">
              <p className="font-semibold">Paket: Gratis</p>
              <p className="text-muted-foreground">5 script per bulan</p>
            </div>
            <Button className="w-full">Upgrade Sekarang</Button>
          </div>
        </div>
      )}
    </header>
  )
}
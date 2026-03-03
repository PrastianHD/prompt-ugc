'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, PlusCircle, ListTodo, Settings, X } from 'lucide-react'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  {
    label: 'Tugas Baru',
    href: '/dashboard/new',
    icon: PlusCircle,
  },
  {
    label: 'Daftar Tugas',
    href: '/dashboard/tasks',
    icon: ListTodo,
  },
  {
    label: 'Pengaturan',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-60 bg-background border-r border-border z-40 transition-transform duration-300 flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-16 border-b border-border flex items-center px-6 gap-2">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg flex-1">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>PromptCraft</span>
          </Link>
          <button
            className="md:hidden p-1 hover:bg-muted rounded"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
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

        {/* Footer */}
        <div className="p-6 border-t border-border space-y-4">
          <div className="text-xs space-y-1">
            <p className="font-semibold">Paket: Gratis</p>
            <p className="text-muted-foreground">5 script per bulan</p>
          </div>
          <button className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-sm">
            Upgrade
          </button>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden md:block w-60" />
    </>
  )
}

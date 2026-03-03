'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="flex-1">
      <div className="p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Create and manage your UGC scripts</p>
          </div>
          <Link href="/dashboard/generate">
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-4 h-4" />
              New Script
            </Button>
          </Link>
        </div>

        {/* Empty State */}
        <div className="glass rounded-xl p-12 text-center space-y-4 min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto">
            <Plus className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-semibold">No scripts yet</h2>
          <p className="text-muted-foreground max-w-sm">
            Create your first UGC script by clicking the "New Script" button above.
          </p>
          <Link href="/dashboard/generate">
            <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-lg">
            <div className="text-3xl font-bold text-cyan-400">0</div>
            <p className="text-muted-foreground mt-2">Scripts Generated</p>
          </div>
          <div className="glass p-6 rounded-lg">
            <div className="text-3xl font-bold text-indigo-400">0</div>
            <p className="text-muted-foreground mt-2">API Calls Used</p>
          </div>
          <div className="glass p-6 rounded-lg">
            <div className="text-3xl font-bold text-purple-400">Starter</div>
            <p className="text-muted-foreground mt-2">Current Plan</p>
          </div>
        </div>
      </div>
    </div>
  )
}

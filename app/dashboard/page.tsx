'use client'

import { useAppContext } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { tasks } = useAppContext()

  return (
    <div className="flex-1">
      <div className="p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Buat dan kelola script UGC Anda</p>
          </div>
          <Button asChild className="gap-2 bg-primary hover:bg-primary/90 w-fit">
            <Link href="/dashboard/new">
              <Plus className="w-4 h-4" />
              Tugas Baru
            </Link>
          </Button>
        </div>

        {/* Empty State */}
        {tasks.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center space-y-4 min-h-[400px] flex flex-col items-center justify-center border border-border">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Belum ada tugas</h2>
            <p className="text-muted-foreground max-w-sm">
              Buat tugas pertama Anda dengan mengklik tombol "Tugas Baru" di atas.
            </p>
            <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
              <Link href="/dashboard/new">Mulai Sekarang</Link>
            </Button>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 border border-border">
            <h2 className="text-lg font-semibold mb-4">Tugas Terbaru</h2>
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <Link
                  key={task.id}
                  href={`/dashboard/tasks/${task.id}`}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{task.input.productName || 'Tugas Tanpa Nama'}</p>
                    <p className="text-sm text-muted-foreground">{new Date(task.createdAt).toLocaleDateString('id-ID')}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium status-${task.status}`}>
                    {task.status === 'ready' ? 'Siap' : task.status === 'edited' ? 'Diedit' : task.status === 'finished' ? 'Selesai' : 'Error'}
                  </span>
                </Link>
              ))}
            </div>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/dashboard/tasks">Lihat Semua</Link>
            </Button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-xl border border-border">
            <div className="text-3xl font-bold text-primary">{tasks.length}</div>
            <p className="text-muted-foreground mt-2">Total Tugas</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-border">
            <div className="text-3xl font-bold text-secondary">{tasks.filter(t => t.status === 'finished').length}</div>
            <p className="text-muted-foreground mt-2">Selesai</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-border">
            <div className="text-3xl font-bold text-status-ready">Gratis</div>
            <p className="text-muted-foreground mt-2">Paket Aktif</p>
          </div>
        </div>
      </div>
    </div>
  )
}

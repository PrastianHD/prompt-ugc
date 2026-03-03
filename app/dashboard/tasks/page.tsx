'use client'

import Link from 'next/link'
import { useAppContext } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function TasksListPage() {
  const { tasks, removeTask } = useAppContext()

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'Ready': 'status-ready',
      'Edited': 'status-edited',
      'Finished': 'status-finished',
      'Error': 'status-error',
    }
    return statusMap[status] || 'status-ready'
  }

  const getStatusText = (status: string) => {
    const textMap: { [key: string]: string } = {
      'Ready': 'Siap',
      'Edited': 'Diedit',
      'Finished': 'Selesai',
      'Error': 'Error',
    }
    return textMap[status] || status
  }

  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold">Semua Tugas</h1>
            <p className="text-muted-foreground mt-1">Kelola dan pantau semua tugas UGC Anda</p>
          </div>
          <Button asChild className="gap-2 bg-primary hover:bg-primary/90 w-fit">
            <Link href="/dashboard/new">
              <Plus className="w-4 h-4" />
              Tugas Baru
            </Link>
          </Button>
        </div>

        {/* Tasks Table */}
        {tasks.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center space-y-4 border border-border">
            <h2 className="text-2xl font-semibold">Belum ada tugas</h2>
            <p className="text-muted-foreground">Mulai dengan membuat tugas baru untuk menghasilkan script UGC.</p>
            <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
              <Link href="/dashboard/new">Buat Tugas Pertama</Link>
            </Button>
          </div>
        ) : (
          <div className="glass-card rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-sm">Produk</th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">Status</th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">Target Pasar</th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">Dibuat</th>
                    <th className="text-right px-6 py-4 font-semibold text-sm">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/tasks/${task.id}`} className="font-medium hover:text-primary transition-colors">
                          {task.input.productName || 'Tugas Tanpa Nama'}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(task.status)}`}>
                          {getStatusText(task.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {task.input.targetMarket ? task.input.targetMarket.substring(0, 30) + '...' : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(task.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="hover:bg-muted"
                        >
                          <Link href={`/dashboard/tasks/${task.id}`}>Lihat</Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeTask(task.id)}
                          className="hover:bg-red-500/10 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

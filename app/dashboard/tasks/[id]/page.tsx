'use client'

import Link from 'next/link'
import { useAppContext } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Copy, Download } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const { tasks } = useAppContext()
  const task = tasks.find((t) => t.id === params.id)

  if (!task) {
    return (
      <div className="flex-1 p-6 md:p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">Tugas Tidak Ditemukan</h1>
          <p className="text-muted-foreground">Tugas yang Anda cari tidak ada.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/tasks">Kembali ke Daftar</Link>
          </Button>
        </div>
      </div>
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Disalin ke clipboard')
  }

  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="gap-2 mb-4">
            <Link href="/dashboard/tasks">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
          </Button>
          <h1 className="text-4xl font-display font-bold">{task.input.productName}</h1>
          <p className="text-muted-foreground mt-2">{formatDate(task.createdAt)}</p>
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-2">Status</p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border status-${task.status.toLowerCase()}`}>
              {task.status === 'Ready' ? 'Siap' : task.status === 'Edited' ? 'Diedit' : task.status === 'Finished' ? 'Selesai' : 'Error'}
            </span>
          </div>
          <div className="glass-card p-6 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-2">Sumber Produk</p>
            <p className="font-semibold text-sm">{task.input.productPhoto ? 'Foto Unggahan' : 'Link Produk'}</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-2">Butuh Model</p>
            <p className="font-semibold text-sm">{task.input.needCharacter ? 'Ya' : 'Tidak'}</p>
          </div>
        </div>

        {/* Input Info */}
        <div className="glass-card p-8 rounded-2xl border border-border space-y-6 mb-8">
          <h2 className="text-2xl font-semibold">Informasi Input</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Target Pasar</p>
              <p className="text-sm">{task.input.targetMarket}</p>
            </div>
            {task.input.background && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Latar Belakang</p>
                <p className="text-sm">{task.input.background}</p>
              </div>
            )}
            {task.input.character && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Deskripsi Karakter</p>
                <p className="text-sm">{task.input.character}</p>
              </div>
            )}
            {task.input.productLink && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Link Produk</p>
                <a href={task.input.productLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
                  {task.input.productLink}
                </a>
              </div>
            )}
          </div>

          {task.input.productPhoto && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Foto Produk</p>
              <img src={`data:image/jpeg;base64,${task.input.productPhoto}`} alt={task.input.productName} className="max-h-48 rounded-lg" />
            </div>
          )}
        </div>

        {/* Step Results */}
        {task.stepResults.step1 && (
          <div className="glass-card p-8 rounded-2xl border border-border space-y-6 mb-8">
            <h2 className="text-2xl font-semibold">Hasil Step 1 - Discovery</h2>

            {task.stepResults.step1.videoScenes && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Scene Ideas</p>
                {task.stepResults.step1.videoScenes.map((scene: any, idx: number) => (
                  <div key={idx} className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Scene {idx + 1}: {scene.title}</h3>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(JSON.stringify(scene))}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm"><strong>Setting:</strong> {scene.setting}</p>
                    <p className="text-sm"><strong>Action:</strong> {scene.action}</p>
                    <p className="text-sm"><strong>Hook:</strong> {scene.hook}</p>
                    <p className="text-sm"><strong>Duration:</strong> {scene.duration}</p>
                  </div>
                ))}
              </div>
            )}

            {task.stepResults.step1.productAnalysis && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h3 className="font-semibold">Product Analysis</h3>
                <p className="text-sm"><strong>Category:</strong> {task.stepResults.step1.productAnalysis.category}</p>
                <p className="text-sm"><strong>Tone:</strong> {task.stepResults.step1.productAnalysis.recommendedTone}</p>
                <p className="text-sm"><strong>Key Points:</strong> {task.stepResults.step1.productAnalysis.keySellingPoints.join(', ')}</p>
              </div>
            )}
          </div>
        )}

        {/* Export Options */}
        <div className="glass-card p-8 rounded-2xl border border-border space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Export</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export JSON
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

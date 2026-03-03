'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowRight, ArrowLeft, Upload, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { generateUUID, fileToBase64 } from '@/lib/utils'

export default function NewTaskPage() {
  const router = useRouter()
  const { addTask, webhooks } = useAppContext()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Form state
  const [productName, setProductName] = useState('')
  const [productPhoto, setProductPhoto] = useState<string>('')
  const [productLink, setProductLink] = useState('')
  const [background, setBackground] = useState('')
  const [needCharacter, setNeedCharacter] = useState('true')
  const [character, setCharacter] = useState('')
  const [targetMarket, setTargetMarket] = useState('')

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const base64 = await fileToBase64(file)
      setProductPhoto(base64)
      toast.success('Foto berhasil diunggah')
    } catch (error) {
      toast.error('Gagal mengunggah foto')
    }
  }

  const handleSubmit = async () => {
    // Validate
    if (!productName.trim()) {
      toast.error('Nama produk harus diisi')
      return
    }

    if (!productPhoto && !productLink) {
      toast.error('Upload foto atau masukkan link produk')
      return
    }

    if (!targetMarket.trim()) {
      toast.error('Target pasar harus diisi')
      return
    }

    if (!webhooks.step1) {
      toast.error('Webhook belum dikonfigurasi di pengaturan')
      return
    }

    setLoading(true)

    try {
      const taskData = {
        productName,
        productPhoto: productPhoto || '',
        productLink: productLink || '',
        background: background || '',
        needCharacter: needCharacter === 'true',
        character: character || '',
        targetMarket,
        timestamp: new Date().toISOString(),
      }

      // Send to n8n Step 1 webhook
      const response = await fetch(webhooks.step1, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.statusText}`)
      }

      const result = await response.json()

      // Add task to local state
      const newTask = {
        id: generateUUID(),
        input: taskData,
        status: 'Ready' as const,
        createdAt: Date.now(),
        stepResults: {
          step1: result || null,
          step2: null,
          step3: null,
        },
      }

      addTask(newTask)
      toast.success('Tugas berhasil dibuat!')
      router.push('/dashboard')
    } catch (error) {
      console.error('[v0] Error:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal membuat tugas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">Tugas Baru</h1>
          <p className="text-muted-foreground">
            Langkah {step} dari 3: {step === 1 ? 'Informasi Produk' : step === 2 ? 'Preferensi' : 'Review'}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        {/* Forms */}
        <div className="glass-card p-8 rounded-2xl border border-border space-y-6">
          {/* Step 1: Product Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="productName">Nama Produk *</Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Contoh: Smartphone XYZ Pro"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Foto Produk *</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer block">
                    {productPhoto ? (
                      <div className="text-green-500">✓ Foto sudah diunggah</div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Klik untuk unggah atau drag drop</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="productLink">Atau Paste Link Produk (Shopee/Tokopedia)</Label>
                <Input
                  id="productLink"
                  value={productLink}
                  onChange={(e) => setProductLink(e.target.value)}
                  placeholder="https://shopee.co.id/..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="targetMarket">Target Pasar *</Label>
                <Textarea
                  id="targetMarket"
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  placeholder="Contoh: Wanita berusia 18-35 tahun, interested in skincare, middle-upper class"
                  className="mt-2"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 2: Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label>Butuh Model/Karakter? *</Label>
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="true"
                      checked={needCharacter === 'true'}
                      onChange={(e) => setNeedCharacter(e.target.value)}
                    />
                    <span>Ya, gunakan model</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="false"
                      checked={needCharacter === 'false'}
                      onChange={(e) => setNeedCharacter(e.target.value)}
                    />
                    <span>Tidak, tanpa model</span>
                  </label>
                </div>
              </div>

              {needCharacter === 'true' && (
                <div>
                  <Label htmlFor="character">Deskripsi Karakter</Label>
                  <Textarea
                    id="character"
                    value={character}
                    onChange={(e) => setCharacter(e.target.value)}
                    placeholder="Contoh: Female, 25 years old, casual style, energetic personality"
                    className="mt-2"
                    rows={3}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="background">Latar Belakang</Label>
                <Select value={background} onValueChange={setBackground}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Pilih gaya latar belakang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal & Bersih</SelectItem>
                    <SelectItem value="modern">Modern Studio</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle & Casual</SelectItem>
                    <SelectItem value="office">Office Setting</SelectItem>
                    <SelectItem value="outdoor">Outdoor & Natural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Nama Produk</p>
                  <p className="font-semibold">{productName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sumber</p>
                  <p className="font-semibold">{productPhoto ? 'Foto yang diunggah' : productLink || 'Tidak ada'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Target Pasar</p>
                  <p className="font-semibold">{targetMarket}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Butuh Model</p>
                  <p className="font-semibold">{needCharacter === 'true' ? 'Ya' : 'Tidak'}</p>
                </div>
                {background && (
                  <div>
                    <p className="text-muted-foreground">Latar Belakang</p>
                    <p className="font-semibold">{background}</p>
                  </div>
                )}
              </div>
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400">Tugas akan dikirim ke n8n untuk diproses. Anda akan melihat hasilnya di dashboard.</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-4 justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              Selanjutnya
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Buat Tugas
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

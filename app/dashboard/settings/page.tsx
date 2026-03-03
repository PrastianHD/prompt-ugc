'use client'

import { useState, useEffect } from 'react'
import { useAppContext } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Eye, EyeOff, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { aiConfig, webhooks, setAIConfig, setWebhooks } = useAppContext()
  const [provider, setProvider] = useState<'openai' | 'gemini'>('openai')
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [webhook1, setWebhook1] = useState('')
  const [webhook2, setWebhook2] = useState('')
  const [webhook3, setWebhook3] = useState('')
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null)

  useEffect(() => {
    if (aiConfig) {
      setProvider(aiConfig.provider)
      setApiKey(aiConfig.apiKey)
    }
    if (webhooks) {
      setWebhook1(webhooks.step1)
      setWebhook2(webhooks.step2)
      setWebhook3(webhooks.step3)
    }
  }, [aiConfig, webhooks])

  const handleSaveAI = () => {
    if (!apiKey.trim()) {
      toast.error('Masukkan API Key terlebih dahulu')
      return
    }
    setAIConfig({ provider, apiKey })
    toast.success('Konfigurasi AI berhasil disimpan')
  }

  const handleSaveWebhooks = () => {
    if (!webhook1.trim() || !webhook2.trim() || !webhook3.trim()) {
      toast.error('Semua webhook URL harus diisi')
      return
    }
    setWebhooks({ step1: webhook1, step2: webhook2, step3: webhook3 })
    toast.success('Webhook berhasil disimpan')
  }

  const handleTestWebhook = async (webhookUrl: string, step: string) => {
    setTestingWebhook(step)
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true }),
      })
      if (response.ok) {
        toast.success(`Webhook ${step} berhasil diuji`)
      } else {
        toast.error(`Webhook ${step} gagal: ${response.statusText}`)
      }
    } catch (error) {
      toast.error(`Webhook ${step} error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setTestingWebhook(null)
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-3xl">
      <div className="space-y-2">
        <h1 className="text-4xl font-display font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">Konfigurasi integrasi n8n dan provider AI Anda</p>
      </div>

      {/* n8n Webhooks */}
      <div className="glass-card p-6 rounded-2xl border border-border space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Webhook n8n</h2>
          <p className="text-muted-foreground text-sm mt-1">Masukkan URL webhook dari alur n8n Anda</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="webhook1">Webhook Step 1 (Process Produk)</Label>
            <Input
              id="webhook1"
              type="text"
              value={webhook1}
              onChange={(e) => setWebhook1(e.target.value)}
              placeholder="https://..."
              className="mt-2"
            />
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => handleTestWebhook(webhook1, 'Step 1')}
              disabled={testingWebhook === 'Step 1'}
            >
              {testingWebhook === 'Step 1' ? 'Menguji...' : 'Uji'}
            </Button>
          </div>

          <div>
            <Label htmlFor="webhook2">Webhook Step 2 (Generate Frame)</Label>
            <Input
              id="webhook2"
              type="text"
              value={webhook2}
              onChange={(e) => setWebhook2(e.target.value)}
              placeholder="https://..."
              className="mt-2"
            />
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => handleTestWebhook(webhook2, 'Step 2')}
              disabled={testingWebhook === 'Step 2'}
            >
              {testingWebhook === 'Step 2' ? 'Menguji...' : 'Uji'}
            </Button>
          </div>

          <div>
            <Label htmlFor="webhook3">Webhook Step 3 (Generate Script)</Label>
            <Input
              id="webhook3"
              type="text"
              value={webhook3}
              onChange={(e) => setWebhook3(e.target.value)}
              placeholder="https://..."
              className="mt-2"
            />
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => handleTestWebhook(webhook3, 'Step 3')}
              disabled={testingWebhook === 'Step 3'}
            >
              {testingWebhook === 'Step 3' ? 'Menguji...' : 'Uji'}
            </Button>
          </div>
        </div>

        <Button onClick={handleSaveWebhooks} className="w-full bg-primary hover:bg-primary/90">
          Simpan Webhook
        </Button>
      </div>

      {/* AI Provider */}
      <div className="glass-card p-6 rounded-2xl border border-border space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Provider AI</h2>
          <p className="text-muted-foreground text-sm mt-1">Pilih provider AI untuk generasi script</p>
        </div>

        <RadioGroup value={provider} onValueChange={(v) => setProvider(v as 'openai' | 'gemini')}>
          <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted transition-colors cursor-pointer">
            <RadioGroupItem value="openai" id="openai" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="openai" className="font-semibold cursor-pointer">
                OpenAI (GPT-4)
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Model paling canggih. Sempurna untuk script berkualitas tinggi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted transition-colors cursor-pointer">
            <RadioGroupItem value="gemini" id="gemini" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="gemini" className="font-semibold cursor-pointer">
                Google Gemini
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Opsi hemat dengan performa kuat.
              </p>
            </div>
          </div>
        </RadioGroup>

        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={provider === 'openai' ? 'sk-...' : 'AI-...'}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            API Key disimpan lokal di browser Anda dan tidak pernah dikirim ke server kami.
          </p>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-sm">
          <p className="font-semibold text-yellow-400 mb-1">Catatan Keamanan</p>
          <p className="text-muted-foreground">
            Jangan bagikan API Key Anda. Ini memberikan akses penuh ke akun dan penagihan Anda.
          </p>
        </div>

        <Button onClick={handleSaveAI} className="w-full bg-primary hover:bg-primary/90">
          Simpan Konfigurasi AI
        </Button>
      </div>

      {/* Help Section */}
      <div className="glass-card p-6 rounded-2xl border border-border space-y-4">
        <h2 className="text-2xl font-semibold">Butuh Bantuan?</h2>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-1">Dapatkan OpenAI API Key</h4>
            <p>
              Kunjungi{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                platform.openai.com/api-keys
              </a>
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Dapatkan Google Gemini API Key</h4>
            <p>
              Kunjungi{' '}
              <a
                href="https://ai.google.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                ai.google.dev
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

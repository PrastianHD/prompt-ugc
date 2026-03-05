'use client'

import { useState, useEffect } from 'react'
import { useAppContext } from '@/lib/context'
import { Eye, EyeOff, CheckCircle2, AlertCircle, Key, Zap } from 'lucide-react'
import { toast } from 'sonner'

function ApiKeyInput({
  label, description, value, onChange, placeholder, docsUrl, testUrl
}: {
  label: string; description: string; value: string; onChange: (v: string) => void
  placeholder: string; docsUrl?: string; testUrl?: string
}) {
  const [show, setShow] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'ok' | 'fail' | null>(null)

  const handleTest = async () => {
    if (!value) { toast.error('Masukkan API key dulu'); return }
    setTesting(true)
    setTestResult(null)
    try {
      if (testUrl) {
        const res = await fetch(testUrl, {
          method: 'GET',
          headers: { Authorization: `Bearer ${value}` },
        })
        setTestResult(res.ok || res.status === 401 ? 'ok' : 'fail')
        if (res.ok) toast.success(`${label} API berfungsi!`)
        else toast.error(`${label}: ${res.status} - ${res.statusText}`)
      }
    } catch {
      setTestResult('fail')
      toast.error('Koneksi gagal')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-bold text-foreground">{label}</label>
          {testResult && (
            <span className={`text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide ${testResult === 'ok' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {testResult === 'ok' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              {testResult === 'ok' ? 'Valid' : 'Error'}
            </span>
          )}
        </div>
        <p className="text-xs font-medium text-muted-foreground">{description}</p>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 pr-10 transition-all font-mono text-foreground shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {testUrl && (
          <button
            onClick={handleTest}
            disabled={testing || !value}
            className="px-4 py-3 bg-background border border-border rounded-xl text-xs font-bold hover:bg-muted disabled:opacity-40 transition-all whitespace-nowrap text-foreground shadow-sm uppercase tracking-wide"
          >
            {testing ? 'Testing...' : 'Test'}
          </button>
        )}
      </div>
      {docsUrl && (
        <a href={docsUrl} target="_blank" rel="noopener noreferrer"
          className="inline-block mt-2 text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
          Cara mendapatkan API key →
        </a>
      )}
    </div>
  )
}

export default function SettingsPage() {
  const { settings, setSettings } = useAppContext()
  const [openaiKey, setOpenaiKey] = useState(settings.openaiApiKey)
  const [leonardoKey, setLeonardoKey] = useState(settings.leonardoApiKey)

  useEffect(() => {
    setOpenaiKey(settings.openaiApiKey)
    setLeonardoKey(settings.leonardoApiKey)
  }, [settings])

  const handleSave = () => {
    setSettings({ openaiApiKey: openaiKey, leonardoApiKey: leonardoKey })
    toast.success('Pengaturan disimpan!')
  }

  const bothFilled = openaiKey && leonardoKey

  return (
    <div className="min-h-[85vh] bg-background text-foreground relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-40 dark:opacity-20" />

      <div className="relative max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Pengaturan</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1.5">Konfigurasi API key untuk pipeline UGC</p>
        </div>

        {/* Status bar */}
        <div className={`mb-8 p-4 rounded-xl border text-sm font-bold flex items-center gap-3 shadow-sm ${
          bothFilled
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300'
        }`}>
          {bothFilled
            ? <><CheckCircle2 className="w-5 h-5 shrink-0" /> Semua API key terkonfigurasi. Pipeline siap digunakan!</>
            : <><AlertCircle className="w-5 h-5 shrink-0" /> Lengkapi semua API key untuk menggunakan pipeline UGC.</>
          }
        </div>

        {/* Pipeline flow visual */}
        <div className="glass-card rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-5">Alur Pipeline</h3>
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
            {[
              { label: '1. Scrape Shopee', sub: 'Built-in', ok: true },
              { label: '2. Analisis AI', sub: 'GPT-4o Vision', ok: !!openaiKey },
              { label: '3. Generate Gambar', sub: 'Leonardo Nano', ok: !!leonardoKey },
              { label: '4. Video Prompt', sub: 'GPT-4o Vision', ok: !!openaiKey },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                <div className={`flex-1 rounded-xl p-3 border text-center shadow-sm w-full ${item.ok ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border bg-background'}`}>
                  <p className={`font-bold ${item.ok ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'}`}>{item.label}</p>
                  <p className={`text-[10px] font-medium mt-1 uppercase tracking-wide ${item.ok ? 'text-emerald-600/80 dark:text-emerald-400/80' : 'text-muted-foreground/60'}`}>{item.sub}</p>
                </div>
                {i < 3 && <div className={`hidden sm:block text-lg font-bold ${item.ok ? 'text-emerald-500/40' : 'text-muted-foreground/20'}`}>→</div>}
              </div>
            ))}
          </div>
        </div>

        {/* API Keys */}
        <div className="glass-card rounded-2xl p-6 space-y-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <h2 className="font-bold text-foreground">API Keys</h2>
          </div>

          <div className="h-px bg-border" />

          <ApiKeyInput
            label="OpenAI API Key"
            description="Digunakan untuk analisis produk (GPT-4o Vision) dan generate video prompt."
            value={openaiKey}
            onChange={setOpenaiKey}
            placeholder="sk-proj-..."
            docsUrl="https://platform.openai.com/api-keys"
            testUrl="https://api.openai.com/v1/models"
          />

          <div className="h-px bg-border" />

          <ApiKeyInput
            label="Leonardo.ai API Key"
            description="Digunakan untuk generate start frame gambar UGC menggunakan Leonardo Phoenix model."
            value={leonardoKey}
            onChange={setLeonardoKey}
            placeholder="..."
            docsUrl="https://docs.leonardo.ai/docs/create-your-api-key"
          />

          <button
            onClick={handleSave}
            className="w-full py-4 mt-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Zap className="w-5 h-5" />
            Simpan Pengaturan
          </button>
        </div>

        {/* Security note */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5 text-xs text-yellow-800 dark:text-yellow-200/80 space-y-2 shadow-sm">
          <p className="font-bold text-yellow-900 dark:text-yellow-300 uppercase tracking-wide flex items-center gap-1.5"><AlertCircle className="w-4 h-4"/> Keamanan Lokal</p>
          <p className="font-medium leading-relaxed">API key disimpan hanya di browser lokal Anda (localStorage) dan tidak disalin ke server database kami. Key hanya digunakan saat pipeline di browser sedang berjalan.</p>
        </div>
      </div>
    </div>
  )
}
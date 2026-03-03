'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Eye, EyeOff, Check } from 'lucide-react'

export default function SettingsPage() {
  const [apiProvider, setApiProvider] = useState('openai')
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedProvider = localStorage.getItem('apiProvider') || 'openai'
    const savedKey = localStorage.getItem('apiKey') || ''
    setApiProvider(savedProvider)
    setApiKey(savedKey)
  }, [])

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('apiProvider', apiProvider)
    localStorage.setItem('apiKey', apiKey)
    
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-2xl">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your API provider and keys</p>
      </div>

      {/* Save notification */}
      {saved && (
        <div className="glass border-cyan-500/50 p-4 flex items-center gap-3 rounded-lg">
          <Check className="w-5 h-5 text-cyan-400" />
          <span className="text-sm">Settings saved successfully!</span>
        </div>
      )}

      {/* API Provider Selection */}
      <Card className="bg-card/50 border-white/10">
        <CardHeader>
          <CardTitle>AI Model Provider</CardTitle>
          <CardDescription>Choose which AI provider to use for script generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={apiProvider} onValueChange={setApiProvider}>
            {/* OpenAI */}
            <div className="flex items-start gap-4 p-4 glass rounded-lg border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
              <RadioGroupItem value="openai" id="openai" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="openai" className="font-semibold cursor-pointer">
                  OpenAI (GPT-4)
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Most advanced model. Perfect for high-quality scripts.
                </p>
              </div>
            </div>

            {/* Google Gemini */}
            <div className="flex items-start gap-4 p-4 glass rounded-lg border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
              <RadioGroupItem value="gemini" id="gemini" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="gemini" className="font-semibold cursor-pointer">
                  Google Gemini
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Cost-effective option with strong performance.
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* API Key Configuration */}
      <Card className="bg-card/50 border-white/10">
        <CardHeader>
          <CardTitle>API Key</CardTitle>
          <CardDescription>
            {apiProvider === 'openai'
              ? 'Enter your OpenAI API key. Get one from platform.openai.com'
              : 'Enter your Google Gemini API key. Get one from ai.google.dev'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={apiProvider === 'openai' ? 'sk-...' : 'AI-...'}
                className="bg-input border-white/10 pr-10"
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
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-sm">
            <p className="font-semibold text-yellow-400 mb-1">Security Note</p>
            <p className="text-muted-foreground">
              Never share your API key with anyone. It grants access to your account and billing.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Save Settings
        </Button>
        <Button variant="outline" className="border-white/10">
          Reset to Default
        </Button>
      </div>

      {/* Usage Info */}
      <Card className="bg-card/50 border-white/10">
        <CardHeader>
          <CardTitle>About API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-2">OpenAI</h4>
            <p>
              Visit{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                platform.openai.com/api-keys
              </a>{' '}
              to create and manage your API keys.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Google Gemini</h4>
            <p>
              Visit{' '}
              <a
                href="https://ai.google.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                ai.google.dev
              </a>{' '}
              to create and manage your API keys.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

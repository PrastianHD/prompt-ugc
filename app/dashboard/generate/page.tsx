'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function GeneratePage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    productPhoto: '',
    backgroundStyle: 'minimal',
    modelPreference: 'female',
    videoPlatform: 'tiktok',
    targetMarket: 'gen-z',
  })
  const [generatedContent, setGeneratedContent] = useState(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGenerate = async () => {
    if (!formData.productPhoto) {
      alert('Please describe your product')
      return
    }

    setLoading(true)
    // Simulated AI generation - will be connected to actual API
    setTimeout(() => {
      setGeneratedContent({
        script: `[SCENE 1: Product Introduction]\n"Hey everyone! I just got my hands on this incredible product and I'm absolutely obsessed!"\n\n[SCENE 2: Close-up Demo]\n"Look at the quality - it's just amazing. The design is so sleek and modern."\n\n[SCENE 3: Benefits]\n"What I love most is how it makes my life easier. It's perfect for busy people like me."\n\n[SCENE 4: Call to Action]\n"If you want to level up your routine, definitely check this out!"`,
        frames: [
          { time: '0:00', description: 'Product reveal with trendy background' },
          { time: '0:05', description: 'Close-up of product details' },
          { time: '0:10', description: 'Product in action demo' },
          { time: '0:15', description: 'Satisfied user reaction shot' },
        ],
      })
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
        {/* Input Panel */}
        <div className="lg:col-span-1 overflow-y-auto">
          <Card className="bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Create UGC Script</CardTitle>
              <CardDescription>Fill in the details to generate your script</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Product Photo */}
              <div className="space-y-2">
                <Label htmlFor="product">Product Description</Label>
                <Textarea
                  id="product"
                  placeholder="Describe your product... (e.g., wireless headphones, skincare serum, fitness tracker)"
                  value={formData.productPhoto}
                  onChange={(e) => handleInputChange('productPhoto', e.target.value)}
                  className="bg-input border-white/10 min-h-24"
                />
              </div>

              {/* Step 2: Background Style */}
              <div className="space-y-2">
                <Label htmlFor="background">Background Style</Label>
                <Select value={formData.backgroundStyle} onValueChange={(value) => handleInputChange('backgroundStyle', value)}>
                  <SelectTrigger id="background" className="bg-input border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="urban">Urban</SelectItem>
                    <SelectItem value="natural">Natural</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Step 3: Model Preference */}
              <div className="space-y-2">
                <Label htmlFor="model">Model Preference</Label>
                <Select value={formData.modelPreference} onValueChange={(value) => handleInputChange('modelPreference', value)}>
                  <SelectTrigger id="model" className="bg-input border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="diverse">Diverse</SelectItem>
                    <SelectItem value="none">No Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Step 4: Video Platform */}
              <div className="space-y-2">
                <Label htmlFor="platform">Video Platform</Label>
                <Select value={formData.videoPlatform} onValueChange={(value) => handleInputChange('videoPlatform', value)}>
                  <SelectTrigger id="platform" className="bg-input border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="instagram">Instagram Reel</SelectItem>
                    <SelectItem value="youtube">YouTube Short</SelectItem>
                    <SelectItem value="generic">Generic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Step 5: Target Market */}
              <div className="space-y-2">
                <Label htmlFor="target">Target Market</Label>
                <Select value={formData.targetMarket} onValueChange={(value) => handleInputChange('targetMarket', value)}>
                  <SelectTrigger id="target" className="bg-input border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="gen-z">Gen Z</SelectItem>
                    <SelectItem value="millennials">Millennials</SelectItem>
                    <SelectItem value="professionals">Professionals</SelectItem>
                    <SelectItem value="parents">Parents</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Script'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 overflow-y-auto">
          {generatedContent ? (
            <div className="space-y-6">
              {/* Script Card */}
              <Card className="bg-card/50 border-white/10">
                <CardHeader>
                  <CardTitle>Generated Script</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-input/50 p-6 rounded-lg whitespace-pre-wrap text-sm leading-relaxed font-mono text-muted-foreground">
                    {generatedContent.script}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="flex-1 border-white/10">
                      Copy
                    </Button>
                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Frame Scenes */}
              <Card className="bg-card/50 border-white/10">
                <CardHeader>
                  <CardTitle>Scene Frames</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {generatedContent.frames.map((frame, idx) => (
                    <div key={idx} className="glass p-4 border-white/10">
                      <div className="font-semibold text-indigo-400 mb-1">{frame.time}</div>
                      <div className="text-sm text-muted-foreground">{frame.description}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="glass rounded-xl p-12 h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-semibold">Fill in the form and generate</h3>
              <p className="text-muted-foreground max-w-sm">
                Configure your product details on the left and click "Generate Script" to create your UGC content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

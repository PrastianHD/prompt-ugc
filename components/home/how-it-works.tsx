'use client'

import { Upload, Settings, Brain, Sparkles, Download } from 'lucide-react'

const steps = [
  {
    number: 1,
    title: 'Upload Product Photo',
    description: 'Share a clear photo of your product. Our AI analyzes it to understand key features.',
    icon: <Upload className="w-8 h-8" />,
  },
  {
    number: 2,
    title: 'Set Parameters',
    description: 'Choose background style, model preference, video platform, and target audience.',
    icon: <Settings className="w-8 h-8" />,
  },
  {
    number: 3,
    title: 'AI Generation',
    description: 'Our advanced AI generates personalized UGC scripts and scene frames in seconds.',
    icon: <Brain className="w-8 h-8" />,
  },
  {
    number: 4,
    title: 'Customize & Refine',
    description: 'Edit the scripts, regenerate sections, or adjust the tone and style to match your vision.',
    icon: <Sparkles className="w-8 h-8" />,
  },
  {
    number: 5,
    title: 'Download & Share',
    description: 'Export your scripts in multiple formats and start creating amazing content.',
    icon: <Download className="w-8 h-8" />,
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl md:text-5xl font-bold">How It Works</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Five simple steps to create professional UGC content</p>
      </div>

      <div className="space-y-12">
        {steps.map((step, index) => (
          <div key={step.number} className="flex gap-8 items-start">
            {/* Step number and connector */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full glass flex items-center justify-center mb-4 flex-shrink-0">
                <div className="text-2xl font-bold gradient-text">{step.number}</div>
              </div>
              {index < steps.length - 1 && (
                <div className="w-1 h-20 bg-gradient-to-b from-indigo-500/50 to-cyan-500/50"></div>
              )}
            </div>

            {/* Content */}
            <div className="pt-2 flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-indigo-400">{step.icon}</div>
                <h3 className="text-2xl font-semibold">{step.title}</h3>
              </div>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 p-8 glass rounded-2xl text-center space-y-4">
        <h3 className="text-2xl font-semibold">Ready to get started?</h3>
        <p className="text-muted-foreground">Start generating professional UGC scripts in minutes</p>
        <a
          href="/dashboard"
          className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
        >
          Launch Dashboard
        </a>
      </div>
    </section>
  )
}

'use client'

import { Upload, Settings, Brain, Sparkles, Download } from 'lucide-react'

const steps = [
  {
    number: 1,
    title: 'Unggah Foto Produk',
    description: 'Bagikan foto produk yang jelas. AI kami menganalisisnya untuk memahami fitur kunci.',
    icon: <Upload className="w-8 h-8" />,
  },
  {
    number: 2,
    title: 'Atur Parameter',
    description: 'Pilih gaya latar belakang, preferensi model, platform video, dan target audiens.',
    icon: <Settings className="w-8 h-8" />,
  },
  {
    number: 3,
    title: 'Generasi AI',
    description: 'AI canggih kami menghasilkan script UGC dan pembingkaian adegan yang dipersonalisasi dalam hitungan detik.',
    icon: <Brain className="w-8 h-8" />,
  },
  {
    number: 4,
    title: 'Sesuaikan & Perbaiki',
    description: 'Edit script, regenerasi bagian, atau sesuaikan nada dan gaya agar sesuai dengan visi Anda.',
    icon: <Sparkles className="w-8 h-8" />,
  },
  {
    number: 5,
    title: 'Unduh & Bagikan',
    description: 'Ekspor script Anda dalam berbagai format dan mulai membuat konten yang menakjubkan.',
    icon: <Download className="w-8 h-8" />,
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl md:text-5xl font-display font-bold">Cara Kerjanya</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Lima langkah sederhana untuk membuat konten UGC profesional</p>
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
                <div className="text-primary">{step.icon}</div>
                <h3 className="text-2xl font-semibold">{step.title}</h3>
              </div>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 p-8 glass-card rounded-2xl text-center space-y-4">
        <h3 className="text-2xl font-semibold">Siap untuk memulai?</h3>
        <p className="text-muted-foreground">Mulai hasilkan script UGC profesional dalam hitungan menit</p>
        <a
          href="/dashboard"
          className="inline-block px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors"
        >
          Buka Dashboard
        </a>
      </div>
    </section>
  )
}

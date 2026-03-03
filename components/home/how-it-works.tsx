'use client'

const steps = [
  {
    num: '01',
    title: 'Isi Data Produk',
    tag: '~60 detik',
    accent: 'violet',
  },
  {
    num: '02',
    title: 'AI Analisis & Script',
    tag: '~30 detik',
    accent: 'violet',
  },
  {
    num: '03',
    title: 'Frame Visual Dibuat',
    tag: 'Otomatis',
    accent: 'cyan',
  },
  {
    num: '04',
    title: 'Prompt Video Siap',
    tag: 'Output final',
    accent: 'rose',
  },
]

const tagClass = {
  violet: 'badge-violet',
  cyan: 'badge-cyan',
  rose: 'badge-rose',
}

const numClass = {
  violet: 'text-[var(--accent-bright)]',
  cyan: 'text-[var(--accent2-bright)]',
  rose: 'text-[var(--accent3)]',
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <span className="badge badge-cyan mb-5 block w-fit mx-auto md:mx-0">Cara Kerja</span>
        <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-tight text-foreground">
          Empat langkah,<br />
          <span className="text-muted-foreground italic">semuanya otomatis.</span>
        </h2>
      </div>

      {/* Steps - Versi Simple & Clean */}
      <div className="flex flex-col gap-4">
        {steps.map((step) => (
          <div key={step.num}
            className="group glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[var(--border-hover)] transition-all duration-300">
            
            {/* Nomor digeser ke kanan (sejajar) dan ukurannya disamakan dengan text judul (text-xl) */}
            <div className="flex items-center gap-5">
              <span className={`text-xl font-black font-display ${numClass[step.accent as keyof typeof numClass]}`}>
                {step.num}
              </span>
              <h3 className="text-xl font-bold text-foreground">
                {step.title}
              </h3>
            </div>

            {/* Tag / Badge */}
            <span className={`badge ${tagClass[step.accent as keyof typeof tagClass]} w-fit`}>
              {step.tag}
            </span>
          </div>
        ))}
      </div>

      {/* CTA block */}
      <div className="mt-16 relative overflow-hidden glass-card border-gradient rounded-3xl p-12 text-center">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 70%)' }} />
        <h3 className="font-display text-3xl md:text-4xl text-foreground mb-3">
          Siap coba sekarang?
        </h3>
        <p className="text-muted-foreground mb-8 text-lg">Gratis, tanpa kartu kredit.</p>
        <a href="/dashboard/new" className="btn-primary text-base mx-auto inline-flex">
          Buat Konten Pertama Saya
        </a>
      </div>
    </section>
  )
}
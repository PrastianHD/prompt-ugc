'use client'

const steps = [
  {
    num: '01',
    title: 'Isi Data Produk',
    desc: 'Nama produk, foto atau link, target pasar, dan detail karakter jika diperlukan. Form simpel, langsung submit.',
    tag: '~60 detik',
    accent: 'violet',
  },
  {
    num: '02',
    title: 'AI Analisis & Script',
    desc: 'AI menganalisis produk dan hasilkan beberapa skenario video lengkap dengan hook, aksi, setting, dan durasi per adegan.',
    tag: '~30 detik',
    accent: 'violet',
  },
  {
    num: '03',
    title: 'Frame Visual Dibuat',
    desc: 'Leonardo AI hasilkan gambar referensi setiap adegan. Brief visual yang jelas untuk tim produksi Anda.',
    tag: 'Otomatis (cron)',
    accent: 'cyan',
  },
  {
    num: '04',
    title: 'Prompt Video Siap',
    desc: 'Pipeline akhir hasilkan prompt video siap pakai. Tinggal paste ke Kling, Runway, atau tools AI video favorit Anda.',
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
    <section id="how-it-works" className="py-28 w-full">
      <div className="max-w-6xl mx-auto px-6">
      {/* Header */}
      <div className="mb-16">
        <span className="badge badge-cyan mb-5 block w-fit">Cara Kerja</span>
        <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-tight text-[var(--text-primary)]">
          Empat langkah,<br />
          <span className="text-[var(--text-muted)] italic">semuanya otomatis.</span>
        </h2>
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Vertical glow line */}
        <div className="absolute left-6 top-0 bottom-0 w-px hidden md:block"
          style={{ background: 'linear-gradient(to bottom, var(--accent), var(--accent2), transparent)' }} />

        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={step.num}
              className="group relative glass-card rounded-3xl p-7 md:pl-20 overflow-hidden hover:border-[var(--border-hover)] hover:-translate-y-0.5 transition-all duration-300">

              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'var(--grad-primary)' }} />

              {/* Number - desktop timeline dot */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-12 h-12 -translate-x-[calc(50%-0.5px)]">
                <div className="glass w-10 h-10 rounded-2xl flex items-center justify-center group-hover:border-[var(--border-glow)] transition-colors">
                  <span className={`text-xs font-black font-display ${numClass[step.accent as keyof typeof numClass]}`}>{step.num}</span>
                </div>
              </div>

              {/* Mobile number */}
              <span className={`md:hidden text-xs font-black font-display mb-3 block ${numClass[step.accent as keyof typeof numClass]}`}>
                {step.num}
              </span>

              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{step.title}</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed text-sm">{step.desc}</p>
                </div>
                <span className={`badge ${tagClass[step.accent as keyof typeof tagClass]} flex-shrink-0 hidden sm:inline-flex`}>
                  {step.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA block */}
      <div className="mt-16 relative overflow-hidden glass-card border-gradient rounded-3xl p-12 text-center">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 70%)' }} />
        <h3 className="font-display text-3xl md:text-4xl text-[var(--text-primary)] mb-3">
          Siap coba sekarang?
        </h3>
        <p className="text-[var(--text-muted)] mb-8 text-lg">Gratis, tanpa kartu kredit.</p>
        <a href="/dashboard/new" className="btn-primary text-base mx-auto inline-flex">
          Buat Konten Pertama Saya
        </a>
      </div>
      </div>
    </section>
  )
}

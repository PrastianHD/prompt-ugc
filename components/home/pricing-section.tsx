'use client'

import { Check, Zap } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Pemula',
    price: 'Gratis',
    period: null,
    desc: 'Cocok untuk mulai mencoba.',
    features: ['5 konten per bulan', 'Analisis produk dasar', 'Script per adegan', 'Frame visual standar', 'Dukungan komunitas'],
    cta: 'Mulai Gratis',
    href: '/dashboard/new',
    popular: false,
  },
  {
    name: 'Kreator',
    price: 'Rp 299.000',
    period: '/bulan',
    desc: 'Untuk kreator & brand yang serius scaling.',
    features: ['Konten tak terbatas', 'Analisis produk mendalam', 'Multi-scene script lanjutan', 'Frame visual HD', 'Prompt video siap pakai', 'Prioritas antrian proses', 'Email support prioritas'],
    cta: 'Coba 7 Hari Gratis',
    href: '/dashboard/new',
    popular: true,
  },
  {
    name: 'Studio',
    price: 'Custom',
    period: null,
    desc: 'Untuk agensi & tim produksi besar.',
    features: ['Semua fitur Kreator', 'White-label dashboard', 'API akses penuh', 'Custom n8n pipeline', 'Account manager dedicated', 'SLA & support 24/7', 'Onboarding & pelatihan'],
    cta: 'Hubungi Kami',
    href: '#',
    popular: false,
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-28 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-16 text-center">
        <span className="badge badge-violet mb-5 inline-flex">Harga</span>
        <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-tight text-[var(--text-primary)]">
          Transparan,{' '}
          <span className="gradient-text italic">tanpa kejutan.</span>
        </h2>
        <p className="text-[var(--text-muted)] mt-4 text-lg max-w-lg mx-auto">
          Pilih paket sesuai kebutuhan. Upgrade atau downgrade kapan saja.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative glass-card rounded-3xl p-8 flex flex-col transition-all duration-300 ${
              plan.popular
                ? 'border-[rgba(139,92,246,0.5)] shadow-[0_0_0_1px_rgba(139,92,246,0.3),0_20px_60px_rgba(139,92,246,0.15)] md:-translate-y-3'
                : 'hover:border-[var(--border-hover)] hover:-translate-y-1'
            }`}
          >
            {/* Popular glow top */}
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'var(--grad-primary)' }} />
            )}

            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="badge badge-violet">
                  <Zap className="w-2.5 h-2.5" /> Paling Populer
                </span>
              </div>
            )}

            {/* Plan */}
            <div className="mb-6 mt-2">
              <h3 className="text-2xl font-black font-display text-[var(--text-primary)] mb-1">{plan.name}</h3>
              <p className="text-sm text-[var(--text-muted)]">{plan.desc}</p>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-black font-display ${plan.popular ? 'gradient-text' : 'text-[var(--text-primary)]'}`}>
                  {plan.price}
                </span>
                {plan.period && <span className="text-[var(--text-muted)]">{plan.period}</span>}
              </div>
            </div>

            {/* CTA */}
            <Link
              href={plan.href}
              className={`block text-center py-3.5 rounded-2xl font-bold text-sm mb-8 transition-all duration-200 ${
                plan.popular
                  ? 'btn-primary justify-center'
                  : 'btn-ghost justify-center'
              }`}
            >
              {plan.cta}
            </Link>

            {/* Features */}
            <div className="space-y-3 flex-1">
              {plan.features.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-[var(--accent-bright)]' : 'text-[var(--text-muted)]'}`} />
                  <span className="text-sm text-[var(--text-muted)]">{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-[var(--text-muted)] text-sm mt-10">
        Ada pertanyaan?{' '}
        <a href="#" className="text-[var(--accent-bright)] hover:underline font-semibold">Chat dengan tim kami</a>
      </p>
    </section>
  )
}

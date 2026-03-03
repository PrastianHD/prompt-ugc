'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t py-16 px-6" style={{ borderColor: 'var(--border)', background: 'var(--bg-deep)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-black text-xl text-[var(--text-primary)] font-display">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              PromptCraft
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Platform UGC bertenaga AI untuk brand dan kreator Indonesia yang ingin scale konten tanpa ribet.
            </p>
          </div>
          {[
            { title: 'Produk', links: ['Fitur', 'Harga', 'Cara Kerja', 'Dokumentasi'] },
            { title: 'Perusahaan', links: ['Tentang Kami', 'Blog', 'Karir', 'Kontak'] },
            { title: 'Legal', links: ['Kebijakan Privasi', 'Syarat & Ketentuan', 'Keamanan Data', 'Cookies'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-[var(--text-primary)] mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-bright)] transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm text-[var(--text-muted)]">&copy; {year} PromptCraft UGC. Dibuat dengan ❤️ di Indonesia.</p>
          <div className="flex gap-6">
            {['Twitter', 'Instagram', 'LinkedIn'].map((s) => (
              <a key={s} href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-bright)] transition-colors font-medium">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

import type { Metadata } from 'next'
import { DM_Sans, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

// Setup Font Utama (DM Sans)
const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
})

// Setup Font Display (Instrument Serif)
const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  weight: ['400'], 
  style: ['normal', 'italic'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'PromptCraft — UGC AI untuk Brand Indonesia',
  description: 'Buat konten UGC profesional otomatis dengan AI. Dari foto produk hingga script, frame visual, dan prompt video — semua berjalan otomatis.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      {/* Inject variabel font ke dalam body */}
      <body className={`${dmSans.variable} ${instrumentSerif.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
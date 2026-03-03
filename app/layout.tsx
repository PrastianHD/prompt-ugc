import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'PromptCraft — UGC AI untuk Brand Indonesia',
  description: 'Buat konten UGC profesional otomatis dengan AI. Dari foto produk hingga script, frame visual, dan prompt video — semua berjalan otomatis.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

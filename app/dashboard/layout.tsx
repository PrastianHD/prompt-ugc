'use client'

// Import AppProvider dihapus dari sini
import DashboardHeader from '@/components/dashboard/header' 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // AppProvider sudah dilepas dari sini
    <div className="min-h-screen flex flex-col bg-background">
      
      {/* Headbar / Navbar Dashboard */}
      <DashboardHeader />

      {/* Konten Utama (Dashboard, New Task, Settings, dll) */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
    </div>
  )
}
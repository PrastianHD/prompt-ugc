import Header from '@/components/home/header'
import HeroSection from '@/components/home/hero-section'
import BentoGrid from '@/components/home/bento-grid'
import HowItWorks from '@/components/home/how-it-works'
import PricingSection from '@/components/home/pricing-section'
import Footer from '@/components/home/footer'

export default function HomePage() {
  return (
    <main style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Header />
      <HeroSection />
      <BentoGrid />
      <HowItWorks />
      <PricingSection />
      <Footer />
    </main>
  )
}

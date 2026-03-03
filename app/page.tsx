import Header from '@/components/home/header'
import HeroSection from '@/components/home/hero-section'
import BentoGrid from '@/components/home/bento-grid'
import HowItWorks from '@/components/home/how-it-works'
import PricingSection from '@/components/home/pricing-section'
import Footer from '@/components/home/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <HeroSection />
        <div id="features">
          <BentoGrid />
        </div>
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="pricing">
          <PricingSection />
        </div>
        <Footer />
      </div>
    </main>
  )
}

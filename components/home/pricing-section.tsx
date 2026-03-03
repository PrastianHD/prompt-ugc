'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for trying it out',
    features: [
      'Up to 5 scripts/month',
      'Basic AI model',
      'Standard frames',
      'Download in PDF',
      'Community support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Creator',
    price: '$29',
    period: '/month',
    description: 'For serious content creators',
    features: [
      'Unlimited scripts',
      'Advanced AI model',
      'Custom frames & backgrounds',
      'Multiple export formats',
      'Priority email support',
      'API access',
      'Team collaboration',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Studio',
    price: 'Custom',
    description: 'For production teams',
    features: [
      'Everything in Creator',
      'Dedicated account manager',
      'Custom AI training',
      'White-label solution',
      '24/7 phone support',
      'SLA guarantee',
      'Advanced analytics',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function PricingSection() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl md:text-5xl font-bold">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Choose the plan that works for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl transition-all duration-300 ${
              plan.popular
                ? 'glass-card border-indigo-500/50 md:scale-105 md:shadow-2xl'
                : 'glass-card border-white/10'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full">
                Most Popular
              </div>
            )}

            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
              </div>

              {/* CTA */}
              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-foreground'
                }`}
              >
                {plan.cta}
              </Button>

              {/* Features */}
              <div className="space-y-3 border-t border-white/10 pt-6">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Notice */}
      <div className="mt-16 text-center">
        <p className="text-muted-foreground">
          Need something custom?{' '}
          <a href="#" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Contact our sales team
          </a>
        </p>
      </div>
    </section>
  )
}

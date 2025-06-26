'use client'

import { useAuthContext } from '@/components/context/AuthContext'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function HomePage() {
  const { isAuthenticated, loading } = useAuthContext()
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8">
            <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300">
              🚀 Launch Your Business in Minutes
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Launch Your Business
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get a professional logo, website, contracts, and marketing materials
            automatically generated for your cleaning, tutoring, photography, or consulting business.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex items-center justify-center gap-4">
            {!loading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard">
                      <Button size="lg" className="px-8 py-4">
                        Go to Dashboard →
                      </Button>
                    </Link>
                    <Link href="/onboarding">
                      <Button variant="outline" size="lg" className="px-8 py-4">
                        Start New Business
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/register">
                      <Button size="lg" className="px-8 py-4">
                        Start Building →
                      </Button>
                    </Link>
                    <Link href="/auth/login">
                      <Button variant="outline" size="lg" className="px-8 py-4">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What You'll Get in Minutes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon="🎨"
              title="AI-Generated Logo"
              description="Professional logos created instantly for your business type"
            />
            <FeatureCard
              icon="🌐"
              title="Custom Website"
              description="Responsive website with booking forms and contact info"
            />
            <FeatureCard
              icon="📄"
              title="Legal Contracts"
              description="Pre-built contracts and invoice templates ready to use"
            />
            <FeatureCard
              icon="📱"
              title="Marketing Kit"
              description="Business cards, social media templates, and SEO guide"
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Perfect for Aspiring Entrepreneurs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Cleaners', 'Tutors', 'Photographers', 'Consultants'].map((business) => (
              <div key={business} className="text-gray-600 dark:text-gray-300 font-medium">
                ✓ {business}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {description}
      </p>
    </Card>
  )
}
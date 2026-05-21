import { createServerClient } from '@/lib/supabase'
import Hero from '@/components/Hero'
import ProtocolSection from '@/components/ProtocolSection'
import HowItWorks from '@/components/HowItWorks'
import ModalityGrid from '@/components/ModalityGrid'
import EmailCapture from '@/components/EmailCapture'
import Footer from '@/components/Footer'
import VenueCard from '@/components/VenueCard'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Venue } from '@/lib/types'

async function getFeaturedVenues(): Promise<Venue[]> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('venues')
    .select('*')
    .eq('is_featured', true)
    .limit(4)
  return (data as Venue[]) ?? []
}

export default async function Home() {
  const featuredVenues = await getFeaturedVenues()

  return (
    <>
      <main>
        {/* Hero */}
        <Hero />

        {/* Protocol form */}
        <ProtocolSection />

        {/* How it works */}
        <HowItWorks />

        {/* Modality grid */}
        <ModalityGrid />

        {/* Featured venues */}
        {featuredVenues.length > 0 && (
          <section className="py-24 px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-3">
                  Partners
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-recvr-text">
                  Founding venue partners
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {featuredVenues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} variant="featured" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Email capture */}
        <EmailCapture />

        {/* For Teams teaser */}
        <section className="py-16 px-6 border-t border-[#1F1F1F]">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl border border-[#1F1F1F] bg-[#111111]">
              <div>
                <span className="text-xs font-mono text-[#C4813A] uppercase tracking-widest">
                  RECVR for Teams
                </span>
                <h3
                  className="text-xl font-bold text-[#F5F1EB] mt-2 mb-2"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Running a club or coaching a team?
                </h3>
                <p className="text-sm text-[#8A8480] max-w-md">
                  Give every athlete personalised recovery programmes.
                  £199/month. Unlimited athletes.
                </p>
              </div>
              <Link
                href="/for-teams"
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#C4813A]/40 text-[#C4813A] text-sm font-medium hover:bg-[#C4813A]/10 transition-colors whitespace-nowrap shrink-0"
              >
                Learn more <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer outside main so it sits flush at page bottom */}
      <Footer />
    </>
  )
}

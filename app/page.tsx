import { createServerClient } from '@/lib/supabase'
import Hero from '@/components/Hero'
import Ticker from '@/components/Ticker'
import ProtocolSection from '@/components/ProtocolSection'
import HowItWorks from '@/components/HowItWorks'
import ModalityGrid from '@/components/ModalityGrid'
import ProtocolPreview from '@/components/ProtocolPreview'
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

const Divider = () => (
  <div
    aria-hidden="true"
    className="w-full"
    style={{ height: '1px', background: 'rgba(184, 115, 51, 0.08)' }}
  />
)

export default async function Home() {
  const featuredVenues = await getFeaturedVenues()

  return (
    <>
      <main>
        {/* 1. Hero — full atmosphere */}
        <Hero />

        <Divider />

        {/* 2. Ticker — quiet, full-width motion */}
        <Ticker />

        {/* No divider between ticker and how it works — let them flow */}

        {/* 3. How it works — warm #0D0B09, editorial rows */}
        <HowItWorks />

        <Divider />

        {/* 4. Protocol preview — framed with copper borders, 120px padding */}
        <ProtocolPreview />

        <Divider />

        {/* 5. Modalities — back to base #0A0A0A, 100px padding */}
        <ModalityGrid />

        <Divider />

        {/* 6. Founding venue partners — 120px padding, heaviest content */}
        {featuredVenues.length > 0 && (
          <section style={{ paddingTop: '120px', paddingBottom: '120px' }} className="px-12">
            <div className="max-w-[1400px] mx-auto">
              <div className="text-center mb-12">
                <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-3">
                  Partners
                </p>
                <h2 className="font-tiempos text-recvr-text" style={{ fontSize: 'clamp(48px, 6vw, 88px)', fontWeight: 600 }}>
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

        <Divider />

        {/* 7. Protocol form — considered pause, #0D0B09, 720px, 140px padding */}
        <ProtocolSection />

        <Divider />

        {/* 8. CTA — loudest moment after hero, full-bleed #B87333, 480px min-height */}
        <EmailCapture />

        <Divider />

        {/* For Teams teaser */}
        <section className="py-16 px-12">
          <div className="max-w-[1400px] mx-auto">
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

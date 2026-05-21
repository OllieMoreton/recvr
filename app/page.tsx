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
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-recvr-copper mb-3">
                  The protocol is the product. Venues are the delivery.
                </p>
                <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-3">
                  Venues
                </p>
                <h2 className="font-tiempos text-recvr-text" style={{ fontSize: 'clamp(48px, 6vw, 88px)', fontWeight: 600 }}>
                  Featured venues
                </h2>
                <p className="text-recvr-text-secondary mt-4 mx-auto" style={{ fontSize: '17px', lineHeight: 1.8, maxWidth: '560px' }}>
                  A curated selection of the UK&apos;s best recovery venues, vetted by the RECVR team.
                </p>
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

        {/* 7. Protocol form — considered pause, #0D0B09, 720px, 60px padding */}
        <div
          className="text-center px-12"
          style={{ background: '#0D0B09', paddingTop: '60px' }}
        >
          <div className="max-w-[860px] mx-auto">
            <h2
              className="font-tiempos text-recvr-text mb-3"
              style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 600 }}
            >
              This week&apos;s protocol starts here.
            </h2>
            <p className="text-recvr-text-secondary" style={{ fontSize: '17px', lineHeight: 1.8 }}>
              Takes 90 seconds. Updates every training week.
            </p>
          </div>
        </div>
        <ProtocolSection />

        <Divider />

        {/* 8. CTA — loudest moment after hero, full-bleed #B87333, 480px min-height */}
        <EmailCapture />

        <Divider />

        {/* For Teams teaser */}
        <section className="px-12" style={{ paddingTop: '80px', paddingBottom: '80px', background: '#0D0B09' }}>
          <div className="max-w-[1400px] mx-auto">
            <div
              className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-16 items-center py-10"
              style={{ borderTop: '1px solid rgba(184,115,51,0.15)', borderBottom: '1px solid rgba(184,115,51,0.08)' }}
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-recvr-copper mb-4">
                  RECVR for Teams
                </p>
                <h3
                  className="font-tiempos text-recvr-text mb-3"
                  style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 600, letterSpacing: '-0.02em' }}
                >
                  Running a club or coaching a team?
                </h3>
                <p
                  className="text-recvr-text-secondary max-w-lg"
                  style={{ fontSize: '16px', fontFamily: "'DM Serif Text', Georgia, serif", fontWeight: 300, lineHeight: 1.7 }}
                >
                  Give every athlete a personalised weekly recovery programme.
                  One plan. Unlimited athletes. £199/month.
                </p>
              </div>
              <Link
                href="/for-teams"
                className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold transition-colors duration-200"
                style={{ background: 'rgba(196,129,58,0.1)', border: '1px solid rgba(196,129,58,0.3)', color: '#C4813A' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(196,129,58,0.18)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,129,58,0.6)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(196,129,58,0.1)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,129,58,0.3)'
                }}
              >
                Learn more →
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

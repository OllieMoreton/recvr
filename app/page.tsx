import { createServerClient } from '@/lib/supabase'
import Hero from '@/components/Hero'
import ProtocolSection from '@/components/ProtocolSection'
import HowItWorks from '@/components/HowItWorks'
import ModalityGrid from '@/components/ModalityGrid'
import EmailCapture from '@/components/EmailCapture'
import Footer from '@/components/Footer'
import VenueCard from '@/components/VenueCard'
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
      </main>

      {/* Footer outside main so it sits flush at page bottom */}
      <Footer />
    </>
  )
}

import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Recovery Venues',
  description:
    'Find the best cryotherapy, infrared sauna, float tanks, cold plunge and more across London, Manchester, Edinburgh and Bristol.',
  openGraph: {
    title: 'Recovery Venues — RECVR',
    description: 'Find vetted recovery venues near you. Filter by city and modality.',
    url: 'https://recvr.uk/venues',
  },
  alternates: { canonical: 'https://recvr.uk/venues' },
}
import VenueCard from '@/components/VenueCard'
import VenueFilters from '@/components/VenueFilters'
import type { Venue } from '@/lib/types'

async function fetchVenues(city?: string, modality?: string): Promise<Venue[]> {
  const supabase = createServerClient()
  let query = supabase.from('venues').select('*').order('is_featured', { ascending: false })

  if (city) {
    query = query.ilike('city', city)
  }
  if (modality) {
    query = query.contains('modalities', [modality])
  }

  const { data, error } = await query
  if (error) {
    console.error('fetchVenues error:', error)
    return []
  }
  return (data as Venue[]) ?? []
}

async function fetchCities(): Promise<string[]> {
  const supabase = createServerClient()
  const { data } = await supabase.from('venues').select('city')
  if (!data) return []
  return Array.from(new Set(data.map((r: { city: string }) => r.city))).sort() as string[]
}

interface PageProps {
  searchParams: Promise<{ city?: string; modality?: string }>
}

export default async function VenuesPage({ searchParams }: PageProps) {
  const { city, modality } = await searchParams
  const [venues, cities] = await Promise.all([
    fetchVenues(city, modality),
    fetchCities(),
  ])

  const hasFilters = !!city || !!modality

  return (
    <main className="min-h-screen" style={{ background: '#0A0A0A' }}>

      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-36 pb-20 px-12"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 60%, rgba(196,129,58,0.10) 0%, transparent 60%),
            #0A0A0A
          `,
        }}
      >
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(30,36,51,0.5) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse at 20% 60%, black 20%, transparent 65%)',
          }}
        />

        <div className="relative max-w-[1400px] mx-auto">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-recvr-copper mb-6">
            Directory
          </p>
          <h1
            className="font-tiempos text-recvr-text leading-none mb-6"
            style={{ fontSize: 'clamp(48px, 6.5vw, 84px)', fontWeight: 600, letterSpacing: '-0.02em' }}
          >
            Recovery venues
          </h1>
          <p
            className="max-w-xl leading-relaxed mb-2"
            style={{
              color: '#C8BFB0',
              fontSize: '18px',
              fontFamily: "'DM Serif Text', Georgia, serif",
              fontWeight: 300,
            }}
          >
            Every RECVR protocol links directly to venues near you. Book in one click.
          </p>
          <p
            className="font-mono text-[11px] text-recvr-text-secondary"
            style={{ letterSpacing: '0.05em' }}
          >
            Partner venues offer preferred availability to RECVR members.
          </p>
        </div>
      </section>

      {/* Copper rule */}
      <div style={{ height: '1px', background: 'rgba(184, 115, 51, 0.08)' }} />

      {/* ─── Filters + Results ─────────────────────────────────────────────── */}
      <section className="px-12 py-12" style={{ background: '#0D0B09' }}>
        <div className="max-w-[1400px] mx-auto">

          {/* Filters */}
          <div className="mb-10">
            <Suspense fallback={<div className="h-16 animate-pulse bg-recvr-surface rounded" />}>
              <VenueFilters cities={cities} />
            </Suspense>
          </div>

          {/* Results count */}
          {venues.length > 0 && (
            <p className="font-mono text-[11px] uppercase tracking-widest text-recvr-text-secondary mb-8">
              {venues.length} venue{venues.length !== 1 ? 's' : ''} found
            </p>
          )}

          {/* Grid */}
          {venues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} variant={venue.is_featured ? 'featured' : 'default'} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <p
                className="font-tiempos font-light italic text-[24px] text-recvr-text mb-3"
              >
                No venues found
              </p>
              <p className="text-recvr-text-secondary text-sm mb-8">
                Try adjusting your filters
              </p>
              {hasFilters && (
                <Link
                  href="/venues"
                  className="inline-block px-6 py-3 rounded-md border border-recvr-border text-recvr-muted text-sm hover:border-recvr-copper/50 hover:text-recvr-text transition-colors"
                >
                  Clear filters
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

    </main>
  )
}

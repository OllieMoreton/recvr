import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Recovery Venues',
  description:
    'Find the best cryotherapy, infrared sauna, IV therapy, float tanks, cold plunge and more across London, Manchester, Edinburgh and Bristol.',
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
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-3">
            Directory
          </p>
          <h1 className="text-4xl font-bold text-recvr-text mb-2"
              style={{ letterSpacing: '-0.02em' }}>
            Recovery venues
          </h1>
          <p className="text-recvr-muted text-lg">
            Every RECVR protocol links directly to venues near you. Book in one click.
          </p>
          <p className="text-sm text-[#8A8480] mt-2">
            Founding partner venues offer preferred availability to RECVR members.
          </p>
        </div>

        {/* Filters — client component, wrapped in Suspense for useSearchParams */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-16 animate-pulse bg-recvr-surface rounded-xl" />}>
            <VenueFilters cities={cities} />
          </Suspense>
        </div>

        {/* Results */}
        {venues.length > 0 ? (
          <>
            <p className="text-recvr-muted text-sm mb-6">
              {venues.length} venue{venues.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} variant={venue.is_featured ? 'featured' : 'default'} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <p className="text-recvr-muted text-lg mb-2">No venues found</p>
            <p className="text-recvr-muted/60 text-sm mb-6">Try adjusting your filters</p>
            {hasFilters && (
              <Link
                href="/venues"
                className="inline-block px-5 py-2 rounded-xl border border-recvr-border text-recvr-muted text-sm hover:border-recvr-cyan hover:text-recvr-text transition-colors"
              >
                Clear filters
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

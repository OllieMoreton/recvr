import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowLeft,
  CheckCircle,
  Star,
  Globe,
  AtSign,
  ExternalLink,
  MapPin,
} from 'lucide-react'
import {
  Snowflake, Flame, Droplets, Waves, Sun, Thermometer,
  ArrowLeftRight, Wind, CircleDot, HandMetal,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase'
import { MODALITIES } from '@/lib/modalities'
import { getModalityConfig } from '@/lib/modality-config'
import type { Venue, Modality } from '@/lib/types'
import VenueBundles from '@/components/VenueBundles'
import VenueCard from '@/components/VenueCard'

// ─── Icon map ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Snowflake, Flame, Droplets, Waves, Sun, Thermometer,
  ArrowLeftRight, Wind, CircleDot, HandMetal,
}

// ─── Data helpers ─────────────────────────────────────────────────────────────

async function getVenue(slug: string): Promise<Venue | null> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error || !data) return null
  return data as Venue
}

async function getRelatedVenues(venue: Venue): Promise<Venue[]> {
  const supabase = createServerClient()
  // Try overlaps (PostgREST && operator) — same city, shared modality, not self
  const { data, error } = await supabase
    .from('venues')
    .select('id, name, slug, city, postcode, modalities, price_from, price_range, hero_image, rating, review_count, is_verified, is_featured, booking_url, bundles')
    .neq('slug', venue.slug)
    .ilike('city', venue.city)
    .overlaps('modalities', venue.modalities)
    .limit(3)

  if (!error && data && data.length > 0) return data as Venue[]

  // Fallback: match on first modality only
  const { data: fallback } = await supabase
    .from('venues')
    .select('id, name, slug, city, postcode, modalities, price_from, price_range, hero_image, rating, review_count, is_verified, is_featured, booking_url, bundles')
    .neq('slug', venue.slug)
    .ilike('city', venue.city)
    .contains('modalities', [venue.modalities[0]])
    .limit(3)

  return (fallback as Venue[]) ?? []
}

export async function generateStaticParams() {
  const supabase = createServerClient()
  const { data } = await supabase.from('venues').select('slug')
  return (data ?? []).map((row: { slug: string }) => ({ slug: row.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const venue = await getVenue(slug)
  if (!venue) return { title: 'Venue not found' }
  return {
    title: venue.name,   // layout template appends "— RECVR"
    description: venue.description,
    openGraph: {
      title: `${venue.name} — RECVR`,
      description: venue.description,
      images: venue.hero_image ? [{ url: venue.hero_image, width: 1200, height: 630 }] : [],
      url: `https://recvr.uk/venues/${venue.slug}`,
    },
  }
}

// ─── Booking CTA ──────────────────────────────────────────────────────────────

function BookingCTA({ venue }: { venue: Venue }) {
  return (
    <a
      href={venue.booking_url || venue.website || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full md:w-auto md:inline-block
                 px-8 py-4 text-center
                 bg-recvr-copper hover:bg-recvr-copper-light
                 text-white font-medium text-[15px] tracking-wide
                 rounded-md transition-colors duration-150"
    >
      Book at {venue.name} →
    </a>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function VenueProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const venue = await getVenue(slug)
  if (!venue) notFound()

  const relatedVenues = await getRelatedVenues(venue)

  return (
    <main className="min-h-screen pb-24">

      {/* ── BACK LINK ─────────────────────────────────────────────────────── */}
      <div className="max-w-screen-lg mx-auto px-6 pt-6 pb-2">
        <Link
          href="/venues"
          className="inline-flex items-center gap-1.5 text-recvr-text-secondary hover:text-recvr-text transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to venues
        </Link>
      </div>

      {/* ── FULL-WIDTH HERO ───────────────────────────────────────────────── */}
      <div className="w-full h-64 md:h-96 overflow-hidden">
        {venue.hero_image ? (
          <img
            src={venue.hero_image}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-recvr-surface to-recvr-bg" />
        )}
      </div>

      {/* ── CONTENT CONTAINER ─────────────────────────────────────────────── */}
      <div className="max-w-screen-lg mx-auto px-6 py-10">

        {/* ── VENUE HEADER ──────────────────────────────────────────────── */}
        <div className="mb-6">
          {/* Badge */}
          {venue.is_featured ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-recvr-copper/30 bg-recvr-copper/10 mb-3">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z"
                      fill="#C4813A"/>
              </svg>
              <span className="text-xs font-mono text-recvr-copper uppercase tracking-widest">
                RECVR Listed
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="#C4813A" strokeWidth="1"/>
                <path d="M3.5 6L5 7.5L8.5 4" stroke="#C4813A" strokeWidth="1.2"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ) : venue.is_verified ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-recvr-border mb-3">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="#8A8480" strokeWidth="1"/>
                <path d="M2.5 5L4 6.5L7.5 3" stroke="#8A8480" strokeWidth="1"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs font-mono text-recvr-text-secondary uppercase tracking-widest">
                Verified
              </span>
            </div>
          ) : null}

          {/* Name */}
          <h1
            className="text-3xl md:text-4xl font-bold text-recvr-text leading-tight mb-2"
            style={{ letterSpacing: '-0.02em' }}
          >
            {venue.name}
          </h1>

          {/* Location + rating */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-recvr-text-secondary">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{venue.city}{venue.postcode ? `, ${venue.postcode}` : ''}</span>
            </div>
            {venue.rating > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-recvr-copper text-[12px]">★</span>
                <span className="font-medium text-recvr-text">{venue.rating.toFixed(1)}</span>
                {venue.review_count > 0 && (
                  <span>({venue.review_count} reviews)</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── BOOKING CTA #1 — above the fold ───────────────────────────── */}
        <div className="mb-10">
          <BookingCTA venue={venue} />
        </div>

        {/* ── MAIN GRID ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">

            {/* Description */}
            {venue.description && (
              <p className="text-recvr-muted text-base leading-relaxed">
                {venue.description}
              </p>
            )}

            {/* Services offered */}
            {venue.modalities && venue.modalities.length > 0 && (
              <section>
                <h2 className="text-recvr-text font-bold text-lg mb-4"
                    style={{ letterSpacing: '-0.02em' }}>
                  Services offered
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {venue.modalities.map((mod: Modality) => {
                    const modalityMeta = MODALITIES[mod]
                    const colorConfig = getModalityConfig(mod)
                    if (!modalityMeta) return null
                    const Icon = ICON_MAP[modalityMeta.icon] ?? CircleDot
                    return (
                      <div
                        key={mod}
                        className="flex items-start gap-3 bg-recvr-surface border border-recvr-border rounded-xl p-4"
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: colorConfig.bg }}
                        >
                          <div style={{ color: colorConfig.color }}>
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: colorConfig.color }}>
                            {colorConfig.label}
                          </p>
                          <p className="text-recvr-muted text-xs leading-relaxed mt-0.5">
                            {modalityMeta.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Amenities */}
            {venue.amenities && venue.amenities.length > 0 && (
              <section>
                <h2 className="text-recvr-text font-bold text-lg mb-4"
                    style={{ letterSpacing: '-0.02em' }}>
                  Amenities
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {venue.amenities.map((amenity: string) => (
                    <li key={amenity} className="flex items-center gap-2 text-recvr-muted text-sm">
                      <CheckCircle className="w-4 h-4 text-recvr-copper shrink-0" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN — sticky sidebar */}
          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-24 lg:self-start">

            {/* Booking card */}
            <div className="bg-recvr-surface border border-recvr-border rounded-2xl p-6 space-y-4">
              <div>
                <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-1">
                  Price guide
                </p>
                <p className="text-recvr-text text-xl font-semibold font-mono">
                  From £{(venue.price_from / 100).toFixed(0)}
                  <span className="text-recvr-muted text-sm font-normal font-sans"> per session</span>
                </p>
                {venue.price_range && (
                  <p className="text-recvr-muted text-sm mt-0.5">{venue.price_range}</p>
                )}
              </div>

              {/* Founding partner callout */}
              {venue.is_featured && (
                <div className="rounded-xl border border-recvr-copper/20 bg-recvr-copper/5 p-4">
                  <p className="text-sm text-recvr-copper font-medium mb-1">RECVR listed</p>
                  <p className="text-xs text-recvr-text-secondary leading-relaxed">
                    Featured on RECVR. This venue is part of the RECVR recovery network.
                    Reference your protocol when booking for context on your recommended treatment.
                  </p>
                </div>
              )}

              {/* Bundles — client component owns modal state */}
              <VenueBundles
                bundles={venue.bundles ?? []}
                venueName={venue.name}
                venueSlug={venue.slug}
              />

              {/* Sidebar booking button */}
              <a
                href={venue.booking_url || venue.website || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 rounded-md bg-recvr-copper hover:bg-recvr-copper-light text-white font-medium text-sm transition-colors duration-150"
              >
                Book a session →
              </a>
              <p className="text-recvr-muted text-xs text-center">
                Booking managed by {venue.name}
              </p>
            </div>

            {/* Contact card */}
            {(venue.website || venue.instagram) && (
              <div className="bg-recvr-surface border border-recvr-border rounded-2xl p-5 space-y-3">
                <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase">
                  Contact
                </p>
                {venue.website && (
                  <a
                    href={venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-recvr-muted hover:text-recvr-text text-sm transition-colors"
                  >
                    <Globe className="w-4 h-4 shrink-0" />
                    <span className="truncate">{venue.website.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 ml-auto" />
                  </a>
                )}
                {venue.instagram && (
                  <a
                    href={`https://instagram.com/${venue.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-recvr-muted hover:text-recvr-text text-sm transition-colors"
                  >
                    <AtSign className="w-4 h-4 shrink-0" />
                    <span>{venue.instagram}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 ml-auto" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── MAP ───────────────────────────────────────────────────────── */}
        <div className="mt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-recvr-text-secondary mb-4">
            Location
          </p>
          <a
            href={`https://maps.google.com/maps?q=${encodeURIComponent((venue.postcode ?? venue.city) + ', UK')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-recvr-text-secondary hover:text-recvr-text text-xs font-mono transition-colors mb-3"
          >
            Open in Maps →
          </a>
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-recvr-surface">
            <iframe
              title={`${venue.name} location`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent((venue.postcode ?? venue.city) + ', UK')}&output=embed&z=15`}
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter: 'invert(90%) hue-rotate(180deg) brightness(0.85)',
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* ── BOOKING CTA #2 — after map ─────────────────────────────────── */}
        <div className="mt-10">
          <BookingCTA venue={venue} />
        </div>

        {/* ── RELATED VENUES ────────────────────────────────────────────── */}
        {relatedVenues.length > 0 && (
          <div className="mt-16 pt-10 border-t border-recvr-border">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-recvr-text-secondary mb-6">
              Also in {venue.city}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedVenues.map((v) => (
                <VenueCard key={v.id} venue={v} />
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}

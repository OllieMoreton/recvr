import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function VenueProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const venue = await getVenue(slug)
  if (!venue) notFound()

  return (
    <main className="min-h-screen pb-24">
      {/* ── 1. HERO HEADER ─────────────────────────────────────────────── */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden">
        {venue.hero_image ? (
          <Image
            src={venue.hero_image}
            alt={venue.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-recvr-surface to-recvr-bg" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Back link */}
        <Link
          href="/venues"
          className="absolute top-6 left-4 md:left-8 flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to venues
        </Link>

        {/* Venue name */}
        <div className="absolute bottom-6 left-4 md:left-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-1"
              style={{ letterSpacing: '-0.02em' }}>
            {venue.name}
          </h1>
          <div className="flex items-center gap-1.5 text-white/70 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{venue.city}{venue.postcode ? `, ${venue.postcode}` : ''}</span>
          </div>
        </div>
      </div>

      {/* ── 2. MAIN CONTENT ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Single consolidated badge */}
            {venue.is_featured ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 mb-4">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z"
                        fill="#06B6D4"/>
                </svg>
                <span className="text-xs font-mono text-[#06B6D4] uppercase tracking-widest">
                  Founding Partner
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke="#06B6D4" strokeWidth="1"/>
                  <path d="M3.5 6L5 7.5L8.5 4" stroke="#06B6D4" strokeWidth="1.2"
                        strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#1E2433] mb-4">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" stroke="#94A3B8" strokeWidth="1"/>
                  <path d="M2.5 5L4 6.5L7.5 3" stroke="#94A3B8" strokeWidth="1"
                        strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs font-mono text-[#94A3B8] uppercase tracking-widest">
                  Verified
                </span>
              </div>
            )}

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
                      <CheckCircle className="w-4 h-4 text-recvr-cyan shrink-0" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN ─────────────────────────────────────────────── */}
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

              {venue.rating > 0 && (
                <div className="flex items-center gap-2 text-recvr-muted text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-recvr-text font-medium font-mono">{venue.rating.toFixed(1)}</span>
                  {venue.review_count > 0 && (
                    <span>({venue.review_count} reviews)</span>
                  )}
                </div>
              )}

              {/* Preferential access callout for founding partners */}
              {venue.is_featured && (
                <div className="rounded-xl border border-[#06B6D4]/20 bg-[#06B6D4]/5 p-4">
                  <p className="text-sm text-[#06B6D4] font-medium mb-1">RECVR member access</p>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    As a founding partner venue, {venue.name} prioritises RECVR-referred bookings.
                    Mention RECVR when booking for preferred availability.
                  </p>
                </div>
              )}

              <a
                href={venue.booking_url || venue.website || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 rounded-full bg-recvr-cyan text-recvr-bg font-semibold text-sm hover:bg-recvr-blue transition-colors"
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

        {/* ── MAP — dark-themed iframe ──────────────────────────────────── */}
        {venue.postcode && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-[#F8FAFC] mb-4"
                style={{ letterSpacing: '-0.02em' }}>
              Location
            </h2>
            <div className="rounded-xl overflow-hidden border border-[#1E2433]" style={{ height: '280px' }}>
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(venue.postcode + ', UK')}&output=embed`}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── 3. BOTTOM CTA ─────────────────────────────────────────────────── */}
      <div className="border-t border-recvr-border mt-4 py-8 text-center">
        <p className="text-recvr-muted text-sm mb-2">
          Looking for other recovery options?
        </p>
        <Link
          href="/venues"
          className="text-recvr-cyan text-sm font-medium hover:underline underline-offset-4"
        >
          Browse all venues →
        </Link>
      </div>
    </main>
  )
}

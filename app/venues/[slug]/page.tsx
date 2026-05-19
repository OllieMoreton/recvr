import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowLeft,
  ShieldCheck,
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
  if (!venue) return { title: 'Venue not found — RECVR' }
  return {
    title: `${venue.name} — RECVR`,
    description: venue.description,
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
        {/* Background */}
        {venue.hero_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={venue.hero_image}
            alt={venue.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-recvr-surface to-recvr-bg" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Back link — top left */}
        <Link
          href="/venues"
          className="absolute top-6 left-4 md:left-8 flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to venues
        </Link>

        {/* Venue name — bottom left */}
        <div className="absolute bottom-6 left-4 md:left-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-1">
            {venue.name}
          </h1>
          <div className="flex items-center gap-1.5 text-white/70 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{venue.city}{venue.postcode ? `, ${venue.postcode}` : ''}</span>
          </div>
        </div>
      </div>

      {/* ── 2. MAIN CONTENT ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Verified badge */}
            {venue.is_verified && (
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 text-sm font-medium px-3 py-1.5 rounded-full border border-cyan-500/20">
                <ShieldCheck className="w-4 h-4" />
                RECVR Verified
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
                <h2 className="text-recvr-text font-semibold text-lg mb-4">
                  Services offered
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {venue.modalities.map((mod: Modality) => {
                    const config = MODALITIES[mod]
                    if (!config) return null
                    const Icon = ICON_MAP[config.icon] ?? CircleDot
                    return (
                      <div
                        key={mod}
                        className="flex items-start gap-3 bg-recvr-surface border border-recvr-border rounded-xl p-4"
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.colour}`}>
                          <Icon className={`w-4.5 h-4.5 ${config.textColour}`} />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${config.textColour}`}>
                            {config.label}
                          </p>
                          <p className="text-recvr-muted text-xs leading-relaxed mt-0.5">
                            {config.description}
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
                <h2 className="text-recvr-text font-semibold text-lg mb-4">
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
          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-24 self-start">

            {/* Booking card */}
            <div className="bg-recvr-surface border border-recvr-border rounded-2xl p-6 space-y-4">
              <div>
                <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-1">
                  Price guide
                </p>
                <p className="text-recvr-text text-xl font-semibold">
                  From £{(venue.price_from / 100).toFixed(0)}
                  <span className="text-recvr-muted text-sm font-normal"> per session</span>
                </p>
                {venue.price_range && (
                  <p className="text-recvr-muted text-sm mt-0.5">{venue.price_range}</p>
                )}
              </div>

              {venue.rating > 0 && (
                <div className="flex items-center gap-2 text-recvr-muted text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-recvr-text font-medium">{venue.rating.toFixed(1)}</span>
                  {venue.review_count > 0 && (
                    <span>({venue.review_count} reviews)</span>
                  )}
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

        {/* ── MAP ──────────────────────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="text-recvr-text font-semibold text-lg mb-4">Location</h2>
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(venue.postcode || venue.city)}&output=embed`}
            className="w-full h-64 rounded-2xl border border-recvr-border"
            loading="lazy"
            title={`Map for ${venue.name}`}
          />
        </div>
      </div>

      {/* ── 3. BOTTOM CTA ────────────────────────────────────────────────── */}
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

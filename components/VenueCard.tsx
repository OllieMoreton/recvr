'use client'

import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { useState } from 'react'
import type { Venue, Modality } from '@/lib/types'
import { ModalityPill } from './ModalityPill'
import type { ModalityKey } from '@/lib/modality-config'

// Per-modality fallback images — used when a venue has no hero_image set
const MODALITY_FALLBACKS: Partial<Record<Modality, string>> = {
  cryotherapy:     'https://images.unsplash.com/photo-1649928367017-a102ec4e3cca?auto=format&fit=crop&w=1200&q=80',
  infrared_sauna:  'https://images.unsplash.com/photo-1770625468096-ff53cd24ee38?auto=format&fit=crop&w=1200&q=80',
  sports_massage:  'https://images.unsplash.com/photo-1745327883508-b6cd32e5dde5?auto=format&fit=crop&w=1200&q=80',
  float_tank:      'https://images.unsplash.com/photo-1605158743762-f887b36eef11?auto=format&fit=crop&w=1200&q=80',
  red_light:       'https://images.unsplash.com/photo-1710056618331-6c384da680a9?auto=format&fit=crop&w=1200&q=80',
  cold_plunge:     'https://images.unsplash.com/photo-1681980016814-0bac16721969?auto=format&fit=crop&w=1200&q=80',
  contrast_therapy:'https://images.unsplash.com/photo-1583417657209-d3dd44dc9c09?auto=format&fit=crop&w=1200&q=80',
}

interface VenueCardProps {
  venue: Venue
  variant?: 'default' | 'featured'
}

export default function VenueCard({ venue, variant = 'default' }: VenueCardProps) {
  const initial =
    venue.hero_image && !venue.hero_image.includes('PLACEHOLDER')
      ? venue.hero_image
      : MODALITY_FALLBACKS[venue.modalities[0]] ?? null

  const [heroImage, setHeroImage] = useState<string | null>(initial)

  const handleImageError = () => {
    const fallback = MODALITY_FALLBACKS[venue.modalities[0]] ?? null
    if (heroImage !== fallback) setHeroImage(fallback)
    else setHeroImage(null)
  }

  return (
    <Link
      href={`/venues/${venue.slug}`}
      className={`group block rounded-lg overflow-hidden bg-recvr-surface
                  border border-recvr-border
                  transition-colors duration-200
                  hover:border-recvr-border-active
                  ${variant === 'featured' ? 'ring-1 ring-recvr-copper/30' : ''}`}
    >
      {/* Hero image */}
      <div className="aspect-video w-full overflow-hidden relative">
        {heroImage ? (
          <img
            src={heroImage}
            alt={`${venue.name} recovery venue in ${venue.city}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #161616 0%, #0D0B09 100%)' }} />
        )}

        {/* Single badge — Verified only on non-featured cards */}
        {venue.is_verified && !venue.is_featured && (
          <div className="absolute top-3 right-3 bg-recvr-copper/90 text-recvr-bg text-xs font-semibold px-2 py-0.5 rounded-full">
            Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">

        {/* Name */}
        <h3 className="text-lg font-semibold text-recvr-text leading-tight mb-1">
          {venue.name}
        </h3>

        {/* City + price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-recvr-muted text-sm">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{venue.city}{venue.postcode ? `, ${venue.postcode}` : ''}</span>
          </div>
          <span className="font-mono text-[13px] text-recvr-copper">
            From £{(venue.price_from / 100).toFixed(0)}
          </span>
        </div>

        {/* Modality pills — max 3 + overflow count */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          {venue.modalities.slice(0, 3).map((m) => (
            <ModalityPill key={m} modality={m as ModalityKey} size="sm" />
          ))}
          {venue.modalities.length > 3 && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-recvr-text-muted self-center px-2">
              +{venue.modalities.length - 3}
            </span>
          )}
        </div>

        {/* Bundle badge */}
        {venue.bundles && venue.bundles.length > 0 && (
          <div className="mb-3">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono border"
              style={{
                color: '#C4813A',
                borderColor: 'rgba(196,129,58,0.3)',
                backgroundColor: 'rgba(196,129,58,0.08)',
              }}
            >
              Bundle available
            </span>
          </div>
        )}

        {/* Bottom row: rating left, CTA right */}
        <div className="flex items-center justify-between pt-3 border-t border-recvr-border">
          {venue.rating > 0 ? (
            <div className="flex items-center gap-1.5">
              <span className="text-recvr-copper text-[12px]">★</span>
              <span className="text-[13px] font-medium text-recvr-text">{venue.rating.toFixed(1)}</span>
              <span className="text-[12px] text-recvr-text-secondary">({venue.review_count})</span>
            </div>
          ) : (
            <span className="text-[12px] text-recvr-text-muted font-mono">—</span>
          )}
          <span className="text-[13px] text-recvr-copper group-hover:text-recvr-copper-light transition-colors duration-150">
            View venue →
          </span>
        </div>

      </div>
    </Link>
  )
}

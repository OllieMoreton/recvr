import Link from 'next/link'
import { MapPin } from 'lucide-react'
import type { Venue } from '@/lib/types'
import { ModalityPill } from './ModalityPill'
import type { ModalityKey } from '@/lib/modality-config'

interface VenueCardProps {
  venue: Venue
  variant?: 'default' | 'featured'
}

export default function VenueCard({ venue, variant = 'default' }: VenueCardProps) {
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
        {venue.hero_image ? (
          <img
            src={venue.hero_image}
            alt={`${venue.name} recovery venue in ${venue.city}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-recvr-bg to-recvr-surface" />
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

        {/* Founding Partner badge */}
        {venue.is_featured && (
          <div className="flex items-center gap-1.5 mt-1 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-recvr-copper" />
            <span className="text-xs font-mono text-recvr-copper uppercase tracking-widest">
              Founding Partner
            </span>
          </div>
        )}

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

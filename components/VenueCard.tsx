import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star } from 'lucide-react'
import type { Venue } from '@/lib/types'
import { getModalityConfig } from '@/lib/modality-config'

interface VenueCardProps {
  venue: Venue
  variant?: 'default' | 'featured'
}

export default function VenueCard({ venue, variant = 'default' }: VenueCardProps) {
  const priceDisplay = `From £${(venue.price_from / 100).toFixed(0)}`

  return (
    <Link
      href={`/venues/${venue.slug}`}
      className={`group block rounded-2xl overflow-hidden bg-recvr-surface border transition-all duration-200
        border-recvr-border hover:border-cyan-500/50 hover:scale-[1.02]
        ${variant === 'featured' ? 'ring-1 ring-recvr-cyan/30' : ''}`}
    >
      {/* Hero image */}
      <div className="aspect-video w-full overflow-hidden relative">
        {venue.hero_image ? (
          <Image
            src={venue.hero_image}
            alt={`${venue.name} recovery venue in ${venue.city}`}
            fill
            priority={variant === 'featured'}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-recvr-bg to-recvr-surface" />
        )}
        {venue.is_verified && (
          <div className="absolute top-3 right-3 bg-recvr-cyan/90 text-recvr-bg text-xs font-semibold px-2 py-0.5 rounded-full">
            Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-recvr-text leading-tight mb-1">
          {venue.name}
        </h3>
        {venue.is_featured && (
          <div className="flex items-center gap-1.5 mt-1 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
            <span className="text-xs font-mono text-[#06B6D4] uppercase tracking-widest">
              Founding Partner
            </span>
          </div>
        )}
        <div className="flex items-center gap-1 text-recvr-muted text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{venue.city}{venue.postcode ? `, ${venue.postcode}` : ''}</span>
        </div>

        {/* Modality pills */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {venue.modalities.slice(0, 4).map((mod) => {
            const config = getModalityConfig(mod)
            return (
              <span
                key={mod}
                style={{
                  color: config.color,
                  backgroundColor: config.bg,
                  borderColor: `${config.color}30`,
                }}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border"
              >
                {config.label}
              </span>
            )
          })}
          {venue.modalities.length > 4 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-recvr-border text-recvr-muted">
              +{venue.modalities.length - 4} more
            </span>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-recvr-border">
          <span className="text-recvr-cyan text-sm font-medium font-mono">{priceDisplay}</span>
          {venue.rating > 0 && (
            <div className="flex items-center gap-1 text-recvr-muted text-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-mono">{venue.rating.toFixed(1)}</span>
            </div>
          )}
          <span className="ml-auto text-recvr-cyan text-sm group-hover:underline underline-offset-2">
            View venue →
          </span>
        </div>
      </div>
    </Link>
  )
}

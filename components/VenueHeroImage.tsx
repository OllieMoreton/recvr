'use client'

import { useState } from 'react'
import type { Modality } from '@/lib/types'

const MODALITY_FALLBACKS: Partial<Record<Modality, string>> = {
  cryotherapy:      'https://images.unsplash.com/photo-1649928367017-a102ec4e3cca?auto=format&fit=crop&w=1400&q=80',
  infrared_sauna:   'https://images.unsplash.com/photo-1770625468096-ff53cd24ee38?auto=format&fit=crop&w=1400&q=80',
  sports_massage:   'https://images.unsplash.com/photo-1745327883508-b6cd32e5dde5?auto=format&fit=crop&w=1400&q=80',
  float_tank:       'https://images.unsplash.com/photo-1605158743762-f887b36eef11?auto=format&fit=crop&w=1400&q=80',
  red_light:        'https://images.unsplash.com/photo-1710056618331-6c384da680a9?auto=format&fit=crop&w=1400&q=80',
  cold_plunge:      'https://images.unsplash.com/photo-1681980016814-0bac16721969?auto=format&fit=crop&w=1400&q=80',
  contrast_therapy: 'https://images.unsplash.com/photo-1770625468096-ff53cd24ee38?auto=format&fit=crop&w=1400&q=80',
  compression:      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80',
}

interface VenueHeroImageProps {
  heroImage: string | null
  name: string
  modalities: Modality[]
}

export default function VenueHeroImage({ heroImage, name, modalities }: VenueHeroImageProps) {
  const fallback = MODALITY_FALLBACKS[modalities[0]] ?? null
  const initial = heroImage && !heroImage.includes('PLACEHOLDER') ? heroImage : fallback
  const [src, setSrc] = useState<string | null>(initial)

  const handleError = () => {
    if (src !== fallback) setSrc(fallback)
    else setSrc(null)
  }

  if (!src) {
    return (
      <div
        className="w-full h-full"
        style={{ background: 'linear-gradient(135deg, #161616 0%, #0D0B09 100%)' }}
      />
    )
  }

  return (
    <img
      src={src}
      alt={name}
      className="w-full h-full object-cover"
      onError={handleError}
    />
  )
}

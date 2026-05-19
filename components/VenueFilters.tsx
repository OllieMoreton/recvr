'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const CITIES = ['London', 'Manchester', 'Bristol', 'Edinburgh']

const MODALITY_FILTERS = [
  { key: 'cryotherapy', label: 'Cryotherapy' },
  { key: 'infrared_sauna', label: 'Infrared Sauna' },
  { key: 'iv_therapy', label: 'IV Therapy' },
  { key: 'float_tank', label: 'Float Tank' },
  { key: 'red_light', label: 'Red Light' },
  { key: 'cold_plunge', label: 'Cold Plunge' },
]

export default function VenueFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeCity = searchParams.get('city') ?? ''
  const activeModality = searchParams.get('modality') ?? ''

  const setFilter = useCallback(
    (key: 'city' | 'modality', value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/venues?${params.toString()}`)
    },
    [router, searchParams]
  )

  const pill = (active: boolean) =>
    `px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
      active
        ? 'bg-recvr-cyan text-recvr-bg border-recvr-cyan'
        : 'border-recvr-border text-recvr-muted hover:border-recvr-cyan/50 hover:text-recvr-text'
    }`

  const scrollRow = 'flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'

  return (
    <div className="space-y-3">
      {/* City filters — horizontal scroll on mobile */}
      <div className={scrollRow}>
        <button
          onClick={() => setFilter('city', '')}
          className={`${pill(!activeCity)} whitespace-nowrap shrink-0`}
        >
          All cities
        </button>
        {CITIES.map((city) => (
          <button
            key={city}
            onClick={() => setFilter('city', activeCity === city ? '' : city)}
            className={`${pill(activeCity === city)} whitespace-nowrap shrink-0`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Modality filters — horizontal scroll on mobile */}
      <div className={scrollRow}>
        <button
          onClick={() => setFilter('modality', '')}
          className={`${pill(!activeModality)} whitespace-nowrap shrink-0`}
        >
          All modalities
        </button>
        {MODALITY_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter('modality', activeModality === key ? '' : key)}
            className={`${pill(activeModality === key)} whitespace-nowrap shrink-0`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { getModalityConfig } from '@/lib/modality-config'

const CITIES = ['London', 'Manchester', 'Bristol', 'Edinburgh']

const MODALITY_FILTERS = [
  'cryotherapy',
  'infrared_sauna',
  'iv_therapy',
  'float_tank',
  'red_light',
  'cold_plunge',
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

  const cityPill = (active: boolean) =>
    `px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
      active
        ? 'bg-recvr-cyan text-recvr-bg border-recvr-cyan'
        : 'border-recvr-border text-recvr-muted hover:border-recvr-cyan/50 hover:text-recvr-text'
    }`

  const scrollRow =
    'flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'

  return (
    <div className="space-y-3">
      {/* City filters */}
      <div className={scrollRow}>
        <button
          onClick={() => setFilter('city', '')}
          className={cityPill(!activeCity)}
        >
          All cities
        </button>
        {CITIES.map((city) => (
          <button
            key={city}
            onClick={() => setFilter('city', activeCity === city ? '' : city)}
            className={cityPill(activeCity === city)}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Modality filters — colour-coded */}
      <div className={scrollRow}>
        <button
          onClick={() => setFilter('modality', '')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            !activeModality
              ? 'bg-recvr-cyan text-recvr-bg border-recvr-cyan'
              : 'border-recvr-border text-recvr-muted hover:border-recvr-cyan/50 hover:text-recvr-text'
          }`}
        >
          All modalities
        </button>
        {MODALITY_FILTERS.map((key) => {
          const config = getModalityConfig(key)
          const isActive = activeModality === key
          return (
            <button
              key={key}
              onClick={() => setFilter('modality', isActive ? '' : key)}
              style={
                isActive
                  ? {
                      color: config.color,
                      backgroundColor: config.bg,
                      borderColor: `${config.color}50`,
                    }
                  : undefined
              }
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? ''
                  : 'border-recvr-border text-recvr-muted hover:border-recvr-cyan/50 hover:text-recvr-text'
              }`}
            >
              {config.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

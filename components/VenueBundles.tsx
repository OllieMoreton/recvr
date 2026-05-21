'use client'

import { useState } from 'react'
import type { VenueBundle } from '@/lib/types'
import { getModalityConfig } from '@/lib/modality-config'
import BundleClaimModal from './BundleClaimModal'

interface VenueBundlesProps {
  bundles: VenueBundle[]
  venueName: string
  venueSlug: string
}

export default function VenueBundles({ bundles, venueName, venueSlug }: VenueBundlesProps) {
  const [activeBundle, setActiveBundle] = useState<VenueBundle | null>(null)
  const [bundleModalOpen, setBundleModalOpen] = useState(false)

  if (!bundles || bundles.length === 0) return null

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono text-[#C4813A] uppercase tracking-widest">
            RECVR Bundles
          </span>
          <span className="text-xs text-[#8A8480]">— exclusive to RECVR members</span>
        </div>
        <div className="space-y-3">
          {bundles.map((bundle) => {
            const config = getModalityConfig(bundle.modality)
            return (
              <div
                key={bundle.id}
                className="flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer"
                style={{
                  borderColor: '#1F1F1F',
                  backgroundColor: '#0A0A0A',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${config.color}40`
                  e.currentTarget.style.backgroundColor = `${config.color}05`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1F1F1F'
                  e.currentTarget.style.backgroundColor = '#0A0A0A'
                }}
                onClick={() => {
                  setActiveBundle(bundle)
                  setBundleModalOpen(true)
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0"
                    style={{ backgroundColor: config.bg, color: config.color }}
                  >
                    ×{bundle.sessions}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#F5F1EB]">
                      {bundle.title}
                    </div>
                    <div className="text-xs text-[#8A8480] mt-0.5">
                      Valid {bundle.validity_days} days
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-[#F5F1EB]">
                    £{bundle.price_bundle}
                  </div>
                  <div className="text-xs font-mono" style={{ color: config.color }}>
                    Save £{bundle.saving}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <BundleClaimModal
        isOpen={bundleModalOpen}
        onClose={() => setBundleModalOpen(false)}
        bundle={activeBundle}
        venueName={venueName}
        venueSlug={venueSlug}
      />
    </>
  )
}

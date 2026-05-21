'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import type { VenueBundle } from '@/lib/types'
import { getModalityConfig } from '@/lib/modality-config'

interface BundleClaimModalProps {
  isOpen: boolean
  onClose: () => void
  bundle: VenueBundle | null
  venueName: string
  venueSlug: string
}

export default function BundleClaimModal({
  isOpen,
  onClose,
  bundle,
  venueName,
  venueSlug,
}: BundleClaimModalProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!bundle) return null

  const config = getModalityConfig(bundle.modality)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'bundle_claim',
          metadata: {
            bundle_id: bundle.id,
            bundle_title: bundle.title,
            venue_name: venueName,
            venue_slug: venueSlug,
            price_bundle: bundle.price_bundle,
            saving: bundle.saving,
          },
        }),
      })
      setSubmitted(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-[#0F1117] border border-[#1E2433] rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span
                    className="text-xs font-mono uppercase tracking-widest"
                    style={{ color: config.color }}
                  >
                    RECVR Bundle
                  </span>
                  <h3 className="text-lg font-semibold text-[#F8FAFC] mt-1">
                    {bundle.title}
                  </h3>
                  <p className="text-sm text-[#94A3B8] mt-0.5">{venueName}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[#1E2433] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {!submitted ? (
                <>
                  {/* Pricing */}
                  <div
                    className="flex items-center justify-between p-4 rounded-xl mb-4"
                    style={{
                      backgroundColor: `${config.color}08`,
                      border: `1px solid ${config.color}20`,
                    }}
                  >
                    <div>
                      <div className="text-2xl font-bold font-mono text-[#F8FAFC]">
                        £{bundle.price_bundle}
                      </div>
                      <div className="text-xs text-[#94A3B8] mt-0.5">
                        for {bundle.sessions} sessions
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#94A3B8] line-through">
                        £{bundle.price_direct} direct
                      </div>
                      <div
                        className="text-sm font-semibold mt-0.5"
                        style={{ color: config.color }}
                      >
                        Save £{bundle.saving}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[#94A3B8] mb-5 leading-relaxed">
                    {bundle.description}
                    {' '}Valid for {bundle.validity_days} days from claim.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#94A3B8] outline-none transition-colors"
                      style={{
                        background: '#080A0F',
                        border: '1px solid #1E2433',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#06B6D4')}
                      onBlur={(e) => (e.target.style.borderColor = '#1E2433')}
                    />
                    <button
                      type="submit"
                      disabled={loading || !email}
                      className="w-full py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40"
                      style={{ backgroundColor: config.color, color: '#080A0F' }}
                    >
                      {loading ? 'Claiming...' : 'Claim this bundle →'}
                    </button>
                  </form>

                  <p className="text-xs text-[#94A3B8] text-center mt-3">
                    We&apos;ll send your redemption details within 24 hours.
                  </p>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${config.color}15` }}
                  >
                    <Check size={20} style={{ color: config.color }} />
                  </div>
                  <h4 className="text-[#F8FAFC] font-semibold mb-2">Bundle claimed</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Check your inbox — we&apos;ll send your {venueName} bundle redemption
                    code within 24 hours.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

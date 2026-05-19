'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Snowflake, Flame, Droplets, Waves, Sun, Thermometer,
  ArrowLeftRight, Wind, CircleDot, HandMetal,
  ExternalLink, Clock, MapPin, CheckCircle2,
} from 'lucide-react'
import type { Protocol, ProtocolItem, Venue, Modality } from '@/lib/types'
import { MODALITIES } from '@/lib/modalities'
import { supabase } from '@/lib/supabase'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Snowflake, Flame, Droplets, Waves, Sun, Thermometer,
  ArrowLeftRight, Wind, CircleDot, HandMetal,
}

function ModalityIcon({ modalityKey, className }: { modalityKey: Modality; className?: string }) {
  const config = MODALITIES[modalityKey]
  const Icon = ICON_MAP[config?.icon ?? 'CircleDot'] ?? CircleDot
  return <Icon className={className} />
}

async function fetchVenueMatch(modalityKey: Modality, city: string): Promise<Venue | null> {
  const { data } = await supabase
    .from('venues')
    .select('*')
    .ilike('city', city)
    .contains('modalities', [modalityKey])
    .eq('is_featured', true)
    .limit(1)
    .single()
  return (data as Venue) ?? null
}

function VenueCard({ venue }: { venue: Venue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-3 flex items-center justify-between bg-recvr-bg border border-recvr-border rounded-xl px-4 py-3"
    >
      <div className="flex items-center gap-3 min-w-0">
        <MapPin className="w-3.5 h-3.5 text-recvr-cyan shrink-0" />
        <div className="min-w-0">
          <p className="text-recvr-text text-sm font-medium truncate">{venue.name}</p>
          <p className="text-recvr-muted text-xs">{venue.city} · from £{(venue.price_from / 100).toFixed(0)}</p>
        </div>
      </div>
      <a
        href={`/venues/${venue.slug}`}
        className="shrink-0 ml-3 text-xs text-recvr-cyan hover:text-recvr-blue transition-colors flex items-center gap-1 min-h-[44px] py-2"
      >
        View venue <ExternalLink className="w-3 h-3" />
      </a>
    </motion.div>
  )
}

function ProtocolCard({ item, index, city, isLast }: { item: ProtocolItem; index: number; city: string; isLast: boolean }) {
  const [venue, setVenue] = useState<Venue | null>(null)
  const config = MODALITIES[item.modality_key]

  useEffect(() => {
    fetchVenueMatch(item.venue_modality_match, city).then(setVenue)
  }, [item.venue_modality_match, city])

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative flex gap-5"
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config?.colour ?? 'bg-recvr-border'}`}>
          <ModalityIcon modalityKey={item.modality_key} className={`w-5 h-5 ${config?.textColour ?? 'text-recvr-muted'}`} />
        </div>
        {/* connector line — hidden for last item */}
        {!isLast && <div className="w-px flex-1 bg-recvr-border mt-2" />}
      </div>

      {/* Card */}
      <div className="flex-1 pb-8">
        <div className="bg-recvr-surface border border-recvr-border rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-1">
                {item.day_label}
              </p>
              <h3 className="text-recvr-text font-semibold text-lg leading-tight">
                {item.modality}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 text-recvr-muted text-xs">
                <Clock className="w-3 h-3" />
                <span>{item.duration_minutes} min</span>
              </div>
              <p className="text-recvr-cyan text-sm font-medium mt-0.5">from £{item.price_from}</p>
            </div>
          </div>

          <p className="text-recvr-muted text-sm leading-relaxed">{item.reason}</p>

          {venue && <VenueCard venue={venue} />}
        </div>
      </div>
    </motion.div>
  )
}

function EmailCapture({ summary, city }: { summary: string; city: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setStatus('loading')
    try {
      const res = await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, protocol_summary: summary, city }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('done')
    } catch {
      setErrorMsg('Something went wrong. Try again.')
      setStatus('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      id="email-capture"
      className="mt-6 bg-gradient-to-br from-recvr-surface to-recvr-bg border border-recvr-cyan/30 rounded-2xl p-6 text-center"
    >
      {status === 'done' ? (
        <div className="flex flex-col items-center gap-3 py-2">
          <CheckCircle2 className="w-8 h-8 text-recvr-cyan" />
          <p className="text-recvr-text font-medium">You&apos;re on the list.</p>
          <p className="text-recvr-muted text-sm">We&apos;ll notify you when RECVR launches in your city.</p>
        </div>
      ) : (
        <>
          <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-2">Early access</p>
          <h3 className="text-recvr-text text-xl font-semibold mb-1">Book this protocol</h3>
          <p className="text-recvr-muted text-sm mb-5">
            Get notified when RECVR launches and we&apos;ll hold your slot at partnered venues.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-recvr-bg border border-recvr-border rounded-xl px-4 py-2.5 text-sm text-recvr-text placeholder:text-recvr-muted/50 focus:outline-none focus:border-recvr-cyan transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto px-5 py-3 sm:py-2.5 min-h-[44px] rounded-xl bg-recvr-cyan text-recvr-bg text-sm font-semibold hover:bg-recvr-blue transition-colors disabled:opacity-60"
            >
              {status === 'loading' ? 'Saving...' : 'Notify me'}
            </button>
          </form>
          {status === 'error' && (
            <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
          )}
        </>
      )}
    </motion.div>
  )
}

export default function ProtocolOutput({
  protocol,
  city,
  onReset,
}: {
  protocol: Protocol
  city: string
  onReset: () => void
}) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-3">
          Your 7-day recovery protocol
        </p>
        <p className="text-recvr-text text-lg leading-relaxed max-w-xl mx-auto">
          {protocol.summary}
        </p>
      </motion.div>

      {/* Timeline */}
      <div>
        {protocol.protocol.map((item, i) => (
          <ProtocolCard
            key={`${item.day}-${item.modality_key}`}
            item={item}
            index={i}
            city={city}
            isLast={i === protocol.protocol.length - 1}
          />
        ))}
      </div>

      {/* Email capture */}
      <EmailCapture summary={protocol.summary} city={city} />

      {/* Reset */}
      <div className="mt-8 text-center">
        <button
          onClick={onReset}
          className="text-recvr-muted text-sm hover:text-recvr-text transition-colors underline underline-offset-4"
        >
          Generate a new protocol
        </button>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Lock } from 'lucide-react'
import Link from 'next/link'
import type { Protocol, ProtocolItem, Venue, Modality, ProtocolFormData } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { ModalityPill } from './ModalityPill'
import RecoveryScore from './RecoveryScore'
import ShareModal from './ShareModal'

// ─── Venue fetching ───────────────────────────────────────────────────────────

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

// ─── Animation variants ───────────────────────────────────────────────────────

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

// ─── Protocol item — document style ──────────────────────────────────────────

function ProtocolItemRow({
  item,
  city,
  preloadedVenue,
}: {
  item: ProtocolItem
  city: string
  preloadedVenue?: Venue | null
}) {
  // Use pre-loaded venue if available (week 1 from ProtocolSection pre-fetch).
  // Fall back to on-demand fetch if not pre-loaded.
  const [venue, setVenue] = useState<Venue | null>(preloadedVenue ?? null)

  useEffect(() => {
    if (preloadedVenue !== undefined) return // already have it
    fetchVenueMatch(item.venue_modality_match, city).then(setVenue)
  }, [item.venue_modality_match, city, preloadedVenue])

  return (
    <div
      className="
        sm:bg-transparent sm:border-0 sm:rounded-none sm:p-0
        bg-recvr-surface border border-recvr-border rounded-lg p-4
      "
    >
      {/* Day label */}
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-recvr-copper mb-3">
        Day {item.day}
      </p>

      {/* Modality + duration + price — single row */}
      <div className="flex items-baseline gap-4 flex-wrap mb-2">
        <span className="text-[18px] font-medium text-recvr-text leading-tight">
          {item.modality}
        </span>
        <span className="font-mono text-[13px] text-recvr-text-secondary">
          {item.duration_minutes} min
        </span>
        <span className="font-mono text-[13px] text-recvr-copper">
          From £{item.price_from}
        </span>
      </div>

      {/* Venue line */}
      {venue ? (
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px] text-recvr-text-secondary">
            {venue.name}
            <span className="text-recvr-text-muted mx-1.5">·</span>
            {venue.city}
          </span>
          <Link
            href={`/venues/${venue.slug}`}
            className="text-[13px] text-recvr-copper hover:text-recvr-copper-light transition-colors duration-150"
          >
            View venue →
          </Link>
        </div>
      ) : (
        <div className="mb-4">
          <Link
            href={`/venues?modality=${item.venue_modality_match}&city=${encodeURIComponent(city)}`}
            className="text-[13px] text-recvr-text-muted hover:text-recvr-text transition-colors duration-150"
          >
            Search venues near you →
          </Link>
        </div>
      )}

      {/* Modality pill */}
      <div className="mb-4">
        <ModalityPill modality={item.modality_key} size="sm" />
      </div>

      {/* Physiological reason */}
      <p className="text-[15px] text-recvr-text-secondary leading-relaxed max-w-[600px]">
        {item.reason}
      </p>

      {/* Not-instead-of — subtle footnote */}
      {item.not_instead_of && (
        <p className="mt-3 text-[12px] text-recvr-text-muted italic leading-relaxed max-w-[560px]">
          Not instead of: {item.not_instead_of}
        </p>
      )}
    </div>
  )
}

// ─── Email capture ────────────────────────────────────────────────────────────

function EmailCapture({ summary, city }: { summary: string; city: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) return
    setStatus('loading')
    try {
      const res = await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, protocol_summary: summary, city, source: 'protocol_output' }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-recvr-text-secondary mb-4">
        Get this protocol by email
      </p>
      {status === 'done' ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[14px] text-recvr-success"
        >
          Sent. Check your inbox.
        </motion.p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-[420px]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="flex-1 bg-recvr-surface border border-recvr-border rounded-md px-3 py-2
                         text-[14px] text-recvr-text placeholder:text-recvr-text-muted
                         focus:outline-none focus:border-recvr-border-active transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 bg-recvr-copper hover:bg-recvr-copper-light text-white
                         rounded-md text-[13px] font-medium transition-colors duration-150 whitespace-nowrap
                         disabled:opacity-60"
            >
              {status === 'loading' ? 'Sending…' : 'Send it →'}
            </button>
          </form>
          {status === 'error' && (
            <p className="text-red-400 text-[12px] mt-2">Something went wrong. Try again.</p>
          )}
        </>
      )}
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ProtocolOutput({
  protocol,
  matchedVenues = {},
  city,
  formData,
  onReset,
}: {
  protocol: Protocol
  matchedVenues?: Record<number, Venue | null>
  city: string
  formData: ProtocolFormData
  onReset: () => void
}) {
  const [displayedProtocol] = useState<Protocol>(protocol)
  const weekNumber = 1
  const [activeWeek, setActiveWeek] = useState(1)
  const lastResponse = undefined
  const currentIssues = formData.issues
  const [shareOpen, setShareOpen] = useState(false)
  const { hasEvent, eventDate } = formData

  return (
    <div className="w-full max-w-[720px] mx-auto">

      {/* Recovery Readiness Score */}
      <RecoveryScore
        input={{
          trainingLoad: formData.trainingLoad,
          issues: currentIssues,
          previousResponse: lastResponse,
        }}
      />

      {/* Week tab bar */}
      <div className="flex items-center gap-1 border-b border-recvr-border mb-8">
        {[1, 2, 3].map((week) => (
          <button
            key={week}
            onClick={() => setActiveWeek(week)}
            className={`px-4 py-2.5 text-sm font-mono flex items-center gap-2 transition-all border-b-2 -mb-px ${
              activeWeek === week
                ? 'text-recvr-copper border-recvr-copper'
                : 'text-recvr-text-secondary border-transparent opacity-50 hover:opacity-70'
            }`}
          >
            {week > weekNumber && <Lock size={12} />}
            Week {week}
          </button>
        ))}
      </div>

      {/* Race countdown banner */}
      {hasEvent && eventDate && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-4 py-3 rounded-xl border border-recvr-copper/20 bg-recvr-copper/5 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-recvr-copper animate-pulse" />
            <span className="text-sm text-recvr-text font-medium">Race countdown active</span>
          </div>
          <span className="text-sm font-mono text-recvr-copper">
            {Math.ceil(
              (new Date(eventDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7)
            )}{' '}
            weeks to race day
          </span>
        </motion.div>
      )}

      {/* Week 1 content */}
      {activeWeek === 1 && (
        <>
          {/* Header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`header-week-${weekNumber}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-recvr-copper mb-4">
                This Week — 7-Day Recovery Protocol
              </p>
              <p className="font-tiempos font-light italic text-[22px] md:text-[24px] leading-snug text-recvr-text">
                {displayedProtocol.summary}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Top divider */}
          <div className="border-t border-recvr-border mb-8" />

          {/* Protocol items — document style */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`items-week-${weekNumber}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {displayedProtocol.protocol.map((item, index) => (
                <motion.div key={`${item.day}-${item.modality_key}-w${weekNumber}`} variants={itemVariants}>
                  <ProtocolItemRow
                    item={item}
                    city={city}
                    preloadedVenue={matchedVenues[item.day]}
                  />
                  {index < displayedProtocol.protocol.length - 1 && (
                    <div className="border-t border-recvr-border my-8" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Bottom divider */}
          <div className="border-t border-recvr-border mt-8 mb-10" />

          {/* Share button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <button
              onClick={() => setShareOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-recvr-border text-recvr-muted hover:border-recvr-copper/50 hover:text-recvr-text transition-colors text-sm"
            >
              <Share2 className="w-4 h-4" />
              Share this programme
            </button>
          </motion.div>

          {/* Email capture */}
          <div className="mb-10">
            <EmailCapture summary={displayedProtocol.summary} city={city} />
          </div>

          {/* Weekly work note */}
          <div className="mb-8">
            <p className="text-[15px] font-medium text-recvr-text mb-1">Recovery is weekly work.</p>
            <p className="text-[14px] text-recvr-text-secondary leading-relaxed">
              Come back each Monday with your new training context and we&apos;ll rebuild your protocol from scratch.
            </p>
          </div>

          {/* Monday reminder CTA */}
          <div className="border border-recvr-border rounded-xl px-6 py-5 mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-recvr-copper mb-1">
                Next week
              </p>
              <p className="text-[14px] text-recvr-text-secondary leading-relaxed">
                Come back on Monday to unlock your Week 2 protocol — adapted to how this week's training went.
              </p>
            </div>
            <a
              href="/"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-recvr-border text-recvr-text-secondary hover:border-recvr-copper/50 hover:text-recvr-text transition-colors text-[13px] font-mono"
            >
              Set a reminder →
            </a>
          </div>

          {/* Reset */}
          <div className="mt-8 mb-4">
            <button
              onClick={onReset}
              className="text-[13px] text-recvr-text-secondary hover:text-recvr-text transition-colors duration-150"
            >
              ← Generate a new protocol
            </button>
          </div>
        </>
      )}

      {/* Locked week panels */}
      {activeWeek === 2 && (
        <motion.div
          key="locked-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center text-center py-20 px-6"
        >
          <div className="w-12 h-12 rounded-full border border-recvr-border flex items-center justify-center mb-6">
            <Lock className="w-5 h-5 text-recvr-text-muted" />
          </div>
          <p className="font-tiempos font-light italic text-[22px] text-recvr-text mb-3">
            Week 2 unlocks after Week 1
          </p>
          <p className="text-[14px] text-recvr-text-secondary max-w-[400px] leading-relaxed mb-8">
            Complete your Week 1 recovery, then come back and tell us how you trained. We&apos;ll build Week 2 around how your body actually responded — not a pre-set plan.
          </p>
          <Link
            href="/protocol"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-recvr-copper hover:bg-recvr-copper-light text-white text-[13px] font-medium transition-colors duration-150"
          >
            Rebuild for Week 2 →
          </Link>
        </motion.div>
      )}

      {activeWeek === 3 && (
        <motion.div
          key="locked-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center text-center py-20 px-6"
        >
          <div className="w-12 h-12 rounded-full border border-recvr-border flex items-center justify-center mb-6">
            <Lock className="w-5 h-5 text-recvr-text-muted" />
          </div>
          <p className="font-tiempos font-light italic text-[22px] text-recvr-text mb-3">
            Week 3 unlocks after Week 2
          </p>
          <p className="text-[14px] text-recvr-text-secondary max-w-[400px] leading-relaxed mb-8">
            Your recovery programme builds week by week. Come back after Week 2 and we&apos;ll adapt your protocol to your evolving training load.
          </p>
          <Link
            href="/protocol"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-recvr-border text-recvr-text-secondary hover:border-recvr-copper/50 hover:text-recvr-text text-[13px] font-medium transition-colors duration-150"
          >
            Complete Week 2 first
          </Link>
        </motion.div>
      )}

      {/* Share modal */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        protocol={displayedProtocol}
        formData={formData}
      />
    </div>
  )
}

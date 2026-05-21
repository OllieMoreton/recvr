'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Snowflake, Flame, Droplets, Waves, Sun, Thermometer,
  ArrowLeftRight, Wind, CircleDot, HandMetal,
  ExternalLink, Clock, MapPin, CheckCircle2, Share2,
} from 'lucide-react'
import type { Protocol, ProtocolItem, Venue, Modality, ProtocolFormData } from '@/lib/types'
import { MODALITIES } from '@/lib/modalities'
import { getModalityConfig } from '@/lib/modality-config'
import { supabase } from '@/lib/supabase'
import WeeklyCheckin from './WeeklyCheckin'
import RecoveryScore from './RecoveryScore'
import ShareModal from './ShareModal'

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
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-recvr-text text-sm font-medium truncate">{venue.name}</p>
            {venue.is_featured && (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-[#C4813A] uppercase tracking-widest shrink-0">
                <div className="w-1 h-1 rounded-full bg-[#C4813A]" />
                Founding Partner
              </span>
            )}
          </div>
          <p className="text-recvr-muted text-xs">{venue.city} · from £{(venue.price_from / 100).toFixed(0)}</p>
          {venue.bundles && venue.bundles.length > 0 && (
            <div className="mt-1">
              <span className="text-xs font-mono" style={{ color: '#C4813A' }}>
                Bundle available — save up to £{Math.max(...venue.bundles.map((b) => b.saving))}{' '}→{' '}
                <a href={`/venues/${venue.slug}`} className="underline underline-offset-2">
                  View venue
                </a>
              </span>
            </div>
          )}
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
  const colorConfig = getModalityConfig(item.modality_key)

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
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: colorConfig.bg }}
        >
          <div style={{ color: colorConfig.color }}>
            <ModalityIcon modalityKey={item.modality_key} className="w-5 h-5" />
          </div>
        </div>
        {/* connector line — hidden for last item */}
        {!isLast && <div className="w-px flex-1 bg-recvr-border mt-2" />}
      </div>

      {/* Card */}
      <div className="flex-1 pb-8">
        <div className="bg-recvr-surface border border-recvr-border rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-recvr-copper mb-1">
                {item.day_label}
              </p>
              <h3 className="font-sohne font-semibold text-recvr-text text-lg leading-tight">
                {item.modality}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 text-recvr-muted text-xs">
                <Clock className="w-3 h-3" />
                <span>{item.duration_minutes} min</span>
              </div>
              <p className="font-mono text-[13px] text-recvr-copper mt-0.5">From £{item.price_from}</p>
            </div>
          </div>

          <p className="text-recvr-muted text-sm leading-relaxed">{item.reason}</p>

          {item.not_instead_of && (
            <div className="mt-3 pt-3 border-t border-[#1F1F1F]">
              <div className="flex items-start gap-2">
                <span className="text-xs font-mono text-[#8A8480] uppercase tracking-widest shrink-0 mt-0.5">Not instead</span>
                <p className="text-xs text-[#8A8480] leading-relaxed italic">
                  {item.not_instead_of}
                </p>
              </div>
            </div>
          )}

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
      className="mt-6 bg-gradient-to-br from-recvr-surface to-recvr-bg border border-recvr-copper/30 rounded-2xl p-6 text-center"
    >
      {status === 'done' ? (
        <div className="flex flex-col items-center gap-3 py-2">
          <CheckCircle2 className="w-8 h-8 text-recvr-cyan" />
          <p className="text-recvr-text font-medium">Programme saved.</p>
          <p className="text-recvr-muted text-sm">We&apos;ll send it to your inbox and remind you when Week 2 is ready.</p>
        </div>
      ) : (
        <>
          <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-2">Save your programme</p>
          <h3 className="text-recvr-text text-xl font-semibold mb-1">Get this in your inbox</h3>
          <p className="text-recvr-muted text-sm mb-5">
            We&apos;ll send you your Week 1 programme and check in when it&apos;s time to start Week 2.
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
              {status === 'loading' ? 'Saving...' : 'Save my programme →'}
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

function JourneyProgress({ weekNumber }: { weekNumber: number }) {
  const weeks = [1, 2, 3]
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center gap-3 mb-8"
    >
      <span className="text-recvr-muted text-xs font-mono tracking-widest uppercase">Your Recovery Journey</span>
      <div className="flex items-center gap-1.5">
        {weeks.map((w) => (
          <div key={w} className="flex items-center gap-1.5">
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                w < weekNumber
                  ? 'bg-recvr-copper/20 text-recvr-cyan border border-recvr-cyan/40'
                  : w === weekNumber
                  ? 'bg-recvr-cyan text-recvr-bg'
                  : 'bg-recvr-surface border border-recvr-border text-recvr-muted'
              }`}
            >
              {w < weekNumber && <CheckCircle2 className="w-3 h-3" />}
              Week {w}
            </div>
            {w < 3 && (
              <div className={`w-4 h-px ${w < weekNumber ? 'bg-recvr-cyan/40' : 'bg-recvr-border'}`} />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function ProtocolOutput({
  protocol,
  city,
  formData,
  onReset,
}: {
  protocol: Protocol
  city: string
  formData: ProtocolFormData
  onReset: () => void
}) {
  const [displayedProtocol, setDisplayedProtocol] = useState<Protocol>(protocol)
  const [weekNumber, setWeekNumber] = useState(1)
  const [lastResponse, setLastResponse] = useState<string | undefined>(undefined)
  const [currentIssues, setCurrentIssues] = useState<string[]>(formData.issues)
  const [shareOpen, setShareOpen] = useState(false)
  const { hasEvent, eventDate } = formData

  const handleNewProtocol = (newProtocol: Protocol, response?: string, newIssues?: string[]) => {
    setDisplayedProtocol(newProtocol)
    setWeekNumber((w) => w + 1)
    if (response) setLastResponse(response)
    if (newIssues && newIssues.length > 0) setCurrentIssues(newIssues)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Recovery Readiness Score */}
      <RecoveryScore
        input={{
          trainingLoad: formData.trainingLoad,
          issues: currentIssues,
          previousResponse: lastResponse,
        }}
      />

      {/* Journey progress */}
      <JourneyProgress weekNumber={weekNumber} />

      {/* Race countdown banner */}
      {hasEvent && eventDate && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#C4813A]/20 bg-[#C4813A]/5 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#C4813A] animate-pulse" />
            <span className="text-sm text-[#F5F1EB] font-medium">Race countdown active</span>
          </div>
          <span className="text-sm font-mono text-[#C4813A]">
            {Math.ceil(
              (new Date(eventDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7)
            )}{' '}
            weeks to race day
          </span>
        </motion.div>
      )}

      {/* Header */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`header-week-${weekNumber}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-recvr-copper mb-3">
            Week {weekNumber} recovery programme
          </p>
          <p className="font-tiempos font-normal italic text-[22px] md:text-[26px] leading-snug text-recvr-text max-w-[640px] mx-auto mb-8">
            {displayedProtocol.summary}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Timeline */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`timeline-week-${weekNumber}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {displayedProtocol.protocol.map((item, i) => (
            <ProtocolCard
              key={`${item.day}-${item.modality_key}-w${weekNumber}`}
              item={item}
              index={i}
              city={city}
              isLast={i === displayedProtocol.protocol.length - 1}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Share button */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-2 mb-6 flex justify-center"
      >
        <button
          onClick={() => setShareOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-recvr-border text-recvr-muted hover:border-recvr-cyan/50 hover:text-recvr-text transition-colors text-sm"
        >
          <Share2 className="w-4 h-4" />
          Share this programme
        </button>
      </motion.div>

      {/* Email capture */}
      <EmailCapture summary={displayedProtocol.summary} city={city} />

      {/* Weekly check-in — only show for weeks 1 & 2 */}
      {weekNumber < 3 && (
        <WeeklyCheckin
          formData={formData}
          currentProtocol={displayedProtocol}
          weekNumber={weekNumber}
          currentIssues={currentIssues}
          onNewProtocol={handleNewProtocol}
        />
      )}

      {/* Reset */}
      <div className="mt-8 text-center">
        <button
          onClick={onReset}
          className="text-recvr-muted text-sm hover:text-recvr-text transition-colors underline underline-offset-4"
        >
          Start a new programme
        </button>
      </div>

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

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

const easeOut = { duration: 0.6, ease: 'easeOut' as const }

// ─── Phone frame ──────────────────────────────────────────────────────────────

function PhoneFrame({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`w-[180px] h-[360px] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden shrink-0 ${className}`}
      style={{
        background: '#0D0B09',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Notch */}
      <div
        className="w-16 h-1.5 rounded-full mx-auto mt-3 mb-2 shrink-0"
        style={{ background: 'rgba(255,255,255,0.07)' }}
      />
      {/* Screen content */}
      <div className="flex-1 overflow-hidden min-h-0">{children}</div>
    </div>
  )
}

// ─── Screen 1: Protocol output ────────────────────────────────────────────────

function ProtocolScreen() {
  return (
    <div className="px-2 pb-2 h-full flex flex-col">
      <p className="font-mono text-[8px] uppercase tracking-widest text-recvr-copper mb-2">
        This Week
      </p>

      {/* Day 1 card */}
      <div
        className="rounded-xl p-3 mb-2 shrink-0"
        style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="font-mono text-[8px] text-recvr-copper uppercase tracking-widest mb-1">
          Day 1
        </p>
        <p
          className="text-[13px] text-recvr-text font-semibold leading-none mb-1"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Cryotherapy
        </p>
        <p className="font-mono text-[8px] text-recvr-text-secondary mb-1">3 min · From £85</p>
        <p className="text-[8px] text-recvr-text-secondary mb-2">LondonCryo · London</p>
        <span
          className="inline-block font-mono text-[7px] rounded-full px-2 py-0.5 mb-2"
          style={{ border: '1px solid rgba(255,255,255,0.07)', color: '#8A8480' }}
        >
          CRYOTHERAPY
        </span>
        <p className="text-[7px] text-recvr-text-secondary leading-relaxed mb-1">
          Reduces inflammatory markers and accelerates lactate clearance after heavy load.
        </p>
        <p className="text-[7px] italic" style={{ color: 'rgba(138,132,128,0.55)' }}>
          Not instead of an ice bath — the temperature precision matters.
        </p>
      </div>

      {/* Day 3 peeking */}
      <div
        className="rounded-xl p-3 shrink-0"
        style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="font-mono text-[8px] text-recvr-copper uppercase tracking-widest mb-1">
          Day 3
        </p>
        <p
          className="text-[13px] text-recvr-text font-semibold leading-none"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Infrared Sauna
        </p>
      </div>
    </div>
  )
}

// ─── Screen 2: Week lock ──────────────────────────────────────────────────────

function WeekLockScreen() {
  return (
    <div className="px-2 h-full flex flex-col">
      {/* Tab row */}
      <div
        className="flex items-center gap-2.5 pb-2 mb-3 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span
          className="font-mono text-[7px] uppercase text-recvr-text pb-0.5"
          style={{ borderBottom: '1px solid #C4813A' }}
        >
          Week 1
        </span>
        <span className="font-mono text-[7px] uppercase text-recvr-text-secondary opacity-50 flex items-center gap-0.5">
          <Lock size={7} />
          Week 2
        </span>
        <span className="font-mono text-[7px] uppercase text-recvr-text-secondary opacity-50 flex items-center gap-0.5">
          <Lock size={7} />
          Week 3
        </span>
      </div>

      {/* Lock panel */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-1">
        <Lock
          size={16}
          style={{ color: '#C4813A', opacity: 0.6, marginBottom: '10px' }}
        />
        <p
          className="text-[11px] text-recvr-text leading-snug mb-2"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Week 2 unlocks after Week 1
        </p>
        <p className="text-[8px] text-recvr-text-secondary leading-relaxed mb-4 px-1">
          Come back after your first week. We&apos;ll adapt to how you trained.
        </p>
        <div
          className="rounded-full px-3 py-1.5 text-[8px] font-medium"
          style={{ background: '#C4813A', color: '#0A0A0A' }}
        >
          Rebuild for Week 2 →
        </div>
      </div>
    </div>
  )
}

// ─── Screen 3: Venue profile ──────────────────────────────────────────────────

function VenueScreen() {
  return (
    <div className="h-full flex flex-col">
      {/* Sauna image */}
      <div className="h-24 w-full shrink-0 overflow-hidden relative">
        <img
          src="https://images.unsplash.com/photo-1770625468096-ff53cd24ee38?w=400&q=75&auto=format&fit=crop"
          alt="Sauna interior"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.75) saturate(0.9)' }}
        />
        {/* Subtle gradient fade into card body */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 40%, #0D0B09 100%)' }}
        />
      </div>

      {/* Venue info */}
      <div className="px-2 pt-2 pb-3 flex flex-col flex-1 min-h-0">
        <p
          className="text-[13px] text-recvr-text font-semibold leading-tight mb-0.5"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Sauna &amp; Plunge
        </p>
        <p className="text-[8px] text-recvr-text-secondary">London, E1 6RF</p>
        <p className="text-[8px] text-recvr-copper mt-1">★ 4.7 (28)</p>

        {/* Modality pills */}
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          <span
            className="font-mono text-[6px] rounded-full px-1.5 py-0.5"
            style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#8A8480' }}
          >
            INFRARED SAUNA
          </span>
          <span
            className="font-mono text-[6px] rounded-full px-1.5 py-0.5"
            style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#8A8480' }}
          >
            COLD PLUNGE
          </span>
        </div>

        <p className="text-[8px] text-recvr-text-secondary mt-2">From £40 per session</p>

        {/* Book button */}
        <div
          className="rounded-full py-2 text-center text-[8px] font-medium mt-auto"
          style={{ background: '#C4813A', color: '#0A0A0A' }}
        >
          Book a session →
        </div>
      </div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const scrollToProtocol = () => {
    const el = document.getElementById('protocol-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="relative flex items-start overflow-hidden pt-[18vh] pb-24"
      style={{
        background: `
          radial-gradient(ellipse 70% 60% at 38% 35%, rgba(196, 129, 58, 0.18) 0%, transparent 65%),
          #0A0A0A
        `,
      }}
    >
      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(30,36,51,0.6) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse at 40% 50%, black 20%, transparent 75%)',
        }}
      />

      {/* Content — two columns */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-12 flex items-center gap-12">

        {/* ── LEFT COLUMN ── */}
        <div className="flex-1 max-w-[600px]">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...easeOut, delay: 0.15 }}
            className="mb-6"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-recvr-copper">
              Your Weekly Recovery Protocol
            </p>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...easeOut, delay: 0.3 }}
            className="font-tiempos leading-none tracking-[-0.03em] text-recvr-text mb-6"
            style={{ fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 600 }}
          >
            Recover by design.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...easeOut, delay: 0.45 }}
            className="font-sohne text-[18px] leading-relaxed max-w-[500px] mb-8"
            style={{ color: '#C8BFB0', fontFamily: "'DM Serif Text', Georgia, serif", fontWeight: 300 }}
          >
            Every serious athlete has a training plan. RECVR gives you the recovery to match.
            Sync your data or tell us about your week, and we&apos;ll build your dynamic protocol — matched to premium venues near you, or guided at-home methods for when you&apos;re on the move.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...easeOut, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-start gap-4 mb-12"
          >
            <button
              onClick={scrollToProtocol}
              className="w-full sm:w-auto bg-recvr-copper text-recvr-bg font-semibold px-8 py-4 rounded-md hover:bg-recvr-copper-light transition-all duration-200 text-sm"
            >
              Start my programme →
            </button>
            <Link
              href="/venues"
              className="w-full sm:w-auto text-recvr-text px-8 py-4 rounded-md transition-all duration-200 text-center text-sm hover:text-recvr-copper"
              style={{ border: '1px solid rgba(184, 115, 51, 0.4)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 1)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.4)')}
            >
              Browse venues →
            </Link>
          </motion.div>

          {/* Stat chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...easeOut, delay: 0.75 }}
            className="flex items-center justify-start gap-6 text-sm"
            style={{ color: '#8A8480' }}
          >
            <div className="flex items-center gap-2">
              <span>Vetted venues</span>
            </div>
            <div className="w-px h-4 bg-recvr-border" />
            <div className="flex items-center gap-2">
              <span>Adapts every training week</span>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN — phone mockups ── */}
        <div className="hidden lg:flex items-center justify-center gap-4 relative">

          {/* Phone 1 — protocol output */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.8 }}
          >
            <PhoneFrame>
              <ProtocolScreen />
            </PhoneFrame>
          </motion.div>

          {/* Phone 2 — week lock (raised) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.95 }}
            className="-translate-y-6"
          >
            <PhoneFrame>
              <WeekLockScreen />
            </PhoneFrame>
          </motion.div>

          {/* Phone 3 — venue profile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 1.1 }}
          >
            <PhoneFrame>
              <VenueScreen />
            </PhoneFrame>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

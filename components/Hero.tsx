'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const easeOut = { duration: 0.6, ease: 'easeOut' as const }

export default function Hero() {
  const scrollToProtocol = () => {
    const el = document.getElementById('protocol-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="relative min-h-screen flex items-start overflow-hidden pt-[18vh]"
      style={{
        background: `
          radial-gradient(ellipse 70% 60% at 38% 35%, rgba(196, 129, 58, 0.18) 0%, transparent 65%),
          #0A0A0A
        `,
      }}
    >
      {/* Large typographic background — atmosphere only */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      >
        <span
          className="absolute font-mono font-bold text-recvr-copper leading-none"
          style={{
            fontSize: 'clamp(80px, 12vw, 170px)',
            opacity: 0.06,
            letterSpacing: '-0.04em',
            top: '50%',
            left: '55vw',
            transform: 'translateY(-54%)',
            whiteSpace: 'nowrap',
          }}
        >
          RECVR
        </span>
      </div>

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(30,36,51,0.6) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse at 40% 50%, black 20%, transparent 75%)',
        }}
      />

      {/* Content — left-offset */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-12">
        <div className="max-w-[700px]">

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
            style={{ color: '#C8BFB0', fontFamily: "'DM Serif Text', Georgia, serif" }}
          >
            Every serious athlete has a training plan. RECVR gives you the recovery to match.
            Tell us about your week and we&apos;ll build your protocol — matched to real venues you can book today.
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
              className="w-full sm:w-auto bg-recvr-copper text-recvr-bg font-semibold px-8 py-4 rounded-full hover:bg-recvr-copper-light transition-all duration-200"
            >
              Start my programme →
            </button>
            <Link
              href="/venues"
              className="w-full sm:w-auto text-recvr-text px-8 py-4 rounded-full transition-all duration-200 text-center hover:text-recvr-copper"
              style={{ border: '1px solid rgba(184, 115, 51, 0.4)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 1)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.4)')}
            >
              Browse venues →
            </Link>
          </motion.div>
        </div>

        {/* Stat chips — centred */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...easeOut, delay: 0.75 }}
          className="flex items-center justify-start gap-6 text-sm"
          style={{ color: '#8A8480' }}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-recvr-copper font-semibold">12</span>
            <span>vetted venues</span>
          </div>
          <div className="w-px h-4 bg-recvr-border" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-recvr-copper font-semibold">10</span>
            <span>modalities covered</span>
          </div>
          <div className="w-px h-4 bg-recvr-border" />
          <div className="flex items-center gap-2">
            <span>Adapts every training week</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
  const scrollToProtocol = () => {
    const el = document.getElementById('protocol-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% -10%, rgba(196, 129, 58, 0.05) 0%, transparent 60%),
          #0A0A0A
        `,
      }}
    >
      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(30,36,51,0.8) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Eyebrow */}
        <div className="mb-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-recvr-copper">
            AI Recovery Protocols
          </p>
        </div>

        {/* Headline */}
        <h1 className="font-tiempos font-light text-[48px] md:text-[64px] leading-none tracking-[-0.03em] text-recvr-text mb-6">
          Recover by design.
        </h1>

        {/* Subheadline */}
        <p className="font-sohne text-[16px] md:text-[18px] leading-relaxed text-recvr-text-secondary max-w-[500px] mx-auto mb-8">
          Tell us about your training week. We&apos;ll generate a personalised
          7-day recovery protocol matched to real UK venues you can book today.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <button
            onClick={scrollToProtocol}
            className="w-full sm:w-auto bg-recvr-cyan text-recvr-bg font-semibold px-8 py-4 rounded-full hover:bg-recvr-copper-light transition-all duration-200"
          >
            Start my programme →
          </button>
          <Link
            href="/venues"
            className="w-full sm:w-auto border border-recvr-border text-recvr-text px-8 py-4 rounded-full hover:border-recvr-copper/50 hover:text-recvr-cyan transition-all duration-200 text-center"
          >
            Browse venues →
          </Link>
        </div>

        {/* Stat chips */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-[#8A8480]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#C4813A] font-semibold">12</span>
            <span>vetted venues</span>
          </div>
          <div className="w-px h-4 bg-[#1F1F1F]" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#C4813A] font-semibold">10</span>
            <span>modalities covered</span>
          </div>
          <div className="w-px h-4 bg-[#1F1F1F]" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#C4813A] font-semibold">4</span>
            <span>UK cities</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

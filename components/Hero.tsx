'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
  const scrollToProtocol = () => {
    const el = document.getElementById('protocol-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #080A0F 0%, #0A0F1A 100%)',
        }}
      />

      {/* Radial cyan glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(6,182,212,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Badge */}
        <div className="inline-flex items-center bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs uppercase tracking-widest rounded-full px-4 py-1.5 mb-8">
          AI Recovery Intelligence
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-recvr-text mb-6 leading-[1.05]">
          Recover smarter.
          <br />
          <span className="text-recvr-cyan">Perform better.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-recvr-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          The AI recovery protocol platform for serious athletes. Tell us how
          you&apos;re training — we&apos;ll build your protocol and book it for you.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={scrollToProtocol}
            className="w-full sm:w-auto bg-recvr-cyan text-recvr-bg font-semibold px-8 py-4 rounded-full hover:bg-cyan-400 transition-all duration-200"
          >
            Start my programme →
          </button>
          <Link
            href="/venues"
            className="w-full sm:w-auto border border-recvr-border text-recvr-text px-8 py-4 rounded-full hover:border-cyan-500/50 hover:text-recvr-cyan transition-all duration-200 text-center"
          >
            Browse venues →
          </Link>
        </div>

        {/* Social proof hint */}
        <p className="text-sm text-recvr-muted/60">
          12 vetted recovery venues · London, Manchester, Edinburgh &amp; Bristol
        </p>
      </motion.div>
    </section>
  )
}

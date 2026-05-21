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
          radial-gradient(ellipse at 50% 0%, rgba(6, 182, 212, 0.10) 0%, transparent 65%),
          radial-gradient(ellipse at 85% 85%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 15% 70%, rgba(6, 182, 212, 0.04) 0%, transparent 40%),
          #080A0F
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
        {/* Badge */}
        <div className="inline-flex items-center bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs uppercase tracking-widest rounded-full px-4 py-1.5 mb-8">
          AI Recovery Coach
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-recvr-text mb-6 leading-[1.05]"
          style={{ letterSpacing: '-0.02em' }}
        >
          Recovery without guesswork.
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-recvr-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          The AI recovery coach for serious athletes. Tell us how you&apos;re training — we&apos;ll
          build your personalised weekly programme and match you to the best venues near you.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
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

        {/* Stat chips */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#06B6D4] font-semibold">12</span>
            <span>vetted venues</span>
          </div>
          <div className="w-px h-4 bg-[#1E2433]" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#06B6D4] font-semibold">10</span>
            <span>modalities covered</span>
          </div>
          <div className="w-px h-4 bg-[#1E2433]" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#06B6D4] font-semibold">4</span>
            <span>UK cities</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

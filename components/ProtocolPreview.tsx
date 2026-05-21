'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ModalityPill } from './ModalityPill'

const ease = [0.16, 1, 0.3, 1] as const

export default function ProtocolPreview() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section ref={ref} className="py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className="mb-12"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-recvr-copper mb-4">
            What you&apos;ll receive
          </p>
          <h2
            className="font-tiempos font-bold text-recvr-text leading-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
          >
            Your protocol. Every detail reasoned.
          </h2>
        </motion.div>

        {/* Preview card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="max-w-[720px] bg-recvr-surface border border-recvr-border rounded-lg p-8 lg:p-10"
        >
          {/* Protocol summary — Playfair italic */}
          <p className="font-tiempos font-normal italic text-[20px] md:text-[22px] leading-snug text-recvr-text mb-8">
            You&apos;ve been running high volume through a heavy training block. This week, priority is parasympathetic recovery and connective tissue repair.
          </p>

          <div className="border-t border-recvr-border mb-8" />

          {/* Day entry */}
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-recvr-copper mb-3">
            Day 2
          </p>

          <div className="flex items-baseline gap-4 flex-wrap mb-2">
            <span className="text-[18px] font-medium text-recvr-text leading-tight">Cold Plunge</span>
            <span className="font-mono text-[13px] text-recvr-text-secondary">8 min</span>
            <span className="font-mono text-[13px] text-recvr-copper">From £25</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] text-recvr-text-secondary">
              Sauna &amp; Plunge
              <span className="text-recvr-text-muted mx-1.5">·</span>
              London
            </span>
          </div>

          <div className="mb-4">
            <ModalityPill modality="cold_plunge" size="sm" />
          </div>

          <p className="text-[15px] text-recvr-text-secondary leading-relaxed max-w-[580px] mb-3">
            Cold water immersion accelerates muscle recovery by reducing inflammatory markers — ideal 24–36 hours after your peak effort day.
          </p>

          <p className="text-[12px] text-recvr-text-muted italic leading-relaxed max-w-[540px]">
            Not instead of: Sleep. Eight hours of sleep does more recovery work than any modality on this list.
          </p>

          {/* Footer label */}
          <div className="border-t border-recvr-border mt-8 pt-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-recvr-copper" style={{ opacity: 0.6 }}>
              This is generated for you
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

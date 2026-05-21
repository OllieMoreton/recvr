'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    title: 'Tell us how you\'re training',
    description: 'Answer 5 quick questions about your sport, load, and goals.',
  },
  {
    number: '02',
    title: 'Get your AI recovery programme',
    description: 'Your coach maps your context to evidence-based recovery science.',
  },
  {
    number: '03',
    title: 'Book in one click',
    description: 'Protocols link directly to vetted venues near you.',
  },
]

const ease = [0.16, 1, 0.3, 1] as const

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section
      ref={ref}
      className="py-24 px-12"
      style={{ background: '#0D0B09' }}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Section eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-recvr-copper mb-16"
        >
          The process
        </motion.p>

        {/* Editorial rows */}
        {STEPS.map((step, i) => (
          <div key={step.number}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
              className="flex items-start gap-8 lg:gap-16 py-20"
            >
              {/* Step number — large, copper, Playfair */}
              <div
                className="font-tiempos font-bold text-recvr-copper leading-none shrink-0 select-none"
                style={{ fontSize: 'clamp(86px, 10.8vw, 151px)', width: '15%', minWidth: '86px' }}
              >
                {step.number}
              </div>

              {/* Title + description */}
              <div className="pt-2 lg:pt-4">
                <h3
                  className="font-tiempos font-bold text-recvr-text leading-tight mb-4"
                  style={{ fontSize: 'clamp(26px, 3.24vw, 39px)' }}
                >
                  {step.title}
                </h3>
                <p
                  className="font-sohne text-recvr-text-secondary leading-relaxed"
                  style={{ fontSize: '16px', maxWidth: '480px' }}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>

            {/* Copper rule between rows — not after last */}
            {i < STEPS.length - 1 && (
              <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.6, ease, delay: i * 0.1 + 0.2 }}
                className="w-full h-px"
                style={{ background: 'rgba(196, 129, 58, 0.25)' }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

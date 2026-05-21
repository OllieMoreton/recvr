'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MODALITIES } from '@/lib/modalities'

const FEATURED_MODALITIES = [
  { key: 'cryotherapy',   tag: 'COLD'     },
  { key: 'infrared_sauna', tag: 'THERMAL' },
  { key: 'iv_therapy',    tag: 'INFUSION' },
  { key: 'float_tank',    tag: 'FLOAT'    },
  { key: 'red_light',     tag: 'LIGHT'    },
  { key: 'cold_plunge',   tag: 'PLUNGE'   },
] as const

const ease = [0.16, 1, 0.3, 1] as const

export default function ModalityGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section className="relative py-24 px-12 bg-recvr-surface/40 overflow-hidden">
      {/* SVG noise texture overlay — 3% opacity */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="recvr-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#recvr-noise)" />
        </svg>
      </div>

      <div ref={ref} className="relative max-w-[1400px] mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className="text-center mb-12"
        >
          <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-3">
            Modalities
          </p>
          <h2 className="font-tiempos text-recvr-text" style={{ fontSize: 'clamp(48px, 6vw, 88px)', fontWeight: 600 }}>
            Everything we cover
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {FEATURED_MODALITIES.map(({ key, tag }, i) => {
            const config = MODALITIES[key]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease, delay: i * 0.1 }}
              >
                <Link
                  href={`/venues?modality=${key}`}
                  className="group flex flex-col items-start bg-recvr-surface border border-recvr-border rounded-2xl hover:border-recvr-copper/40 transition-colors duration-200"
                  style={{ padding: '28px' }}
                >
                  <p className="font-mono text-[11px] uppercase tracking-widest text-recvr-copper mb-3">
                    {tag}
                  </p>
                  <p className="font-tiempos font-semibold text-recvr-text mb-1" style={{ fontSize: '20px' }}>
                    {config.label}
                  </p>
                  <p className="text-recvr-muted" style={{ fontSize: '15px', lineHeight: 1.7 }}>
                    {config.benefit}
                  </p>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

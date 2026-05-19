'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Snowflake, Flame, Droplets, Waves, Sun, Thermometer,
} from 'lucide-react'
import { MODALITIES } from '@/lib/modalities'

const FEATURED_MODALITIES = [
  { key: 'cryotherapy', Icon: Snowflake },
  { key: 'infrared_sauna', Icon: Flame },
  { key: 'iv_therapy', Icon: Droplets },
  { key: 'float_tank', Icon: Waves },
  { key: 'red_light', Icon: Sun },
  { key: 'cold_plunge', Icon: Thermometer },
] as const

export default function ModalityGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 px-4 bg-recvr-surface/40">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-3">
            Modalities
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-recvr-text">
            Everything we cover
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {FEATURED_MODALITIES.map(({ key, Icon }, i) => {
            const config = MODALITIES[key]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
              >
                <Link
                  href={`/venues?modality=${key}`}
                  className="group flex flex-col items-start bg-recvr-surface border border-recvr-border rounded-2xl p-5 hover:border-recvr-cyan/50 transition-colors duration-200"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${config.colour}`}>
                    <Icon className={`w-5 h-5 ${config.textColour}`} />
                  </div>
                  <p className={`text-sm font-semibold mb-1 group-hover:${config.textColour} transition-colors ${config.textColour}`}>
                    {config.label}
                  </p>
                  <p className="text-recvr-muted text-xs leading-relaxed">
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

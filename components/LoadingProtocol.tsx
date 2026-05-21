'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MESSAGES = [
  'Analysing your training load...',
  'Identifying optimal recovery sequence...',
  'Sequencing treatment modalities...',
  'Applying evidence-based protocols...',
  'Matching venues in your city...',
  'Finalising your 7-day plan...',
]

export default function LoadingProtocol({ city }: { city?: string }) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1))
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  const displayMessage =
    city && messageIndex === 4
      ? `Matching venues in ${city}...`
      : MESSAGES[messageIndex]

  return (
    <div className="max-w-lg mx-auto text-center py-20 px-4">

      {/* RECVR wordmark */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0 }}
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-recvr-copper mb-12"
      >
        RECVR
      </motion.p>

      {/* Drawing line */}
      <div className="flex justify-center mb-10">
        <div className="relative h-px w-[200px] bg-recvr-border/40 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 origin-left"
            animate={{ scaleX: [0, 1, 1, 0] }}
            transition={{
              duration: 2.4,
              times: [0, 0.5, 0.72, 1],
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ width: '100%', background: '#B87333' }}
          />
        </div>
      </div>

      {/* Rotating trust messages */}
      <div className="h-7 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="text-recvr-text text-lg font-light"
          >
            {displayMessage}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

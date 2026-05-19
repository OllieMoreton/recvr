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
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1))
    }, 1800)

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 1.2, 92))
    }, 100)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [])

  const displayMessage = city && messageIndex === 4
    ? `Matching venues in ${city}...`
    : MESSAGES[messageIndex]

  return (
    <div className="max-w-2xl mx-auto text-center py-16 px-4">
      {/* Animated orb */}
      <div className="relative w-24 h-24 mx-auto mb-10">
        <motion.div
          className="absolute inset-0 rounded-full bg-recvr-cyan/20"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-3 rounded-full bg-recvr-cyan/30"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        <div className="absolute inset-6 rounded-full bg-recvr-cyan flex items-center justify-center">
          <motion.div
            className="w-3 h-3 rounded-full bg-recvr-bg"
            animate={{ scale: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>

      <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-6">
        Building your protocol
      </p>

      {/* Rotating message */}
      <div className="h-7 mb-8 overflow-hidden">
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

      {/* Progress bar */}
      <div className="w-full max-w-xs mx-auto h-0.5 bg-recvr-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-recvr-cyan to-recvr-blue rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  )
}

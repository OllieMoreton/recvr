'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ProtocolForm from './ProtocolForm'
import LoadingProtocol from './LoadingProtocol'
import ProtocolOutput from './ProtocolOutput'
import type { Protocol, ProtocolFormData, Venue } from '@/lib/types'
import { parseProtocolFromStream } from '@/lib/parseProtocol'

type Stage = 'form' | 'loading' | 'output' | 'error'

export default function ProtocolSection() {
  const [stage, setStage] = useState<Stage>('form')
  const [protocol, setProtocol] = useState<Protocol | null>(null)
  const [matchedVenues, setMatchedVenues] = useState<Record<number, Venue | null>>({})
  const [formData, setFormData] = useState<ProtocolFormData | null>(null)
  const [city, setCity] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleFormSubmit = async (data: ProtocolFormData) => {
    setFormData(data)
    setCity(data.city)
    setStage('loading')

    try {
      const res = await fetch('/api/generate-protocol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errData.error ?? `HTTP ${res.status}`)
      }

      const raw = await res.text()
      const parsed = parseProtocolFromStream(raw)

      if (!parsed || !parsed.protocol || parsed.protocol.length === 0) {
        throw new Error('Protocol generation failed — empty response. Please try again.')
      }

      // Pre-fetch matched venues for all items in parallel
      // so they're ready the moment the output animates in
      const venues: Record<number, Venue | null> = {}
      await Promise.all(
        parsed.protocol.map(async (item) => {
          try {
            const r = await fetch(
              `/api/match-venue?city=${encodeURIComponent(data.city)}&modality=${item.venue_modality_match}`
            )
            const json = await r.json()
            venues[item.day] = json.venue ?? null
          } catch {
            venues[item.day] = null
          }
        })
      )

      setMatchedVenues(venues)
      setProtocol(parsed)
      setStage('output')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setErrorMsg(message)
      setStage('error')
    }
  }

  const handleReset = () => {
    setStage('form')
    setProtocol(null)
    setMatchedVenues({})
    setErrorMsg('')
  }

  return (
    <section id="protocol-section" className="py-24 px-4">
      <AnimatePresence mode="wait">
        {stage === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <ProtocolForm onSubmit={handleFormSubmit} isLoading={false} />
          </motion.div>
        )}

        {stage === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LoadingProtocol city={city} />
          </motion.div>
        )}

        {stage === 'output' && protocol && (
          <motion.div
            key="output"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProtocolOutput
              protocol={protocol}
              matchedVenues={matchedVenues}
              city={city}
              formData={formData!}
              onReset={handleReset}
            />
          </motion.div>
        )}

        {stage === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl mx-auto text-center py-16"
          >
            <p className="text-red-400 text-sm mb-6">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-recvr-surface border border-recvr-border text-recvr-text text-sm hover:border-recvr-copper/50 transition-colors"
            >
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

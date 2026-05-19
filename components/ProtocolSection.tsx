'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ProtocolForm from './ProtocolForm'
import LoadingProtocol from './LoadingProtocol'
import ProtocolOutput from './ProtocolOutput'
import type { ProtocolFormData } from '@/lib/types'
import type { Protocol } from '@/lib/types'

type Stage = 'form' | 'loading' | 'output' | 'error'

function parseProtocolFromStream(raw: string): Protocol | null {
  // Anthropic SSE: lines starting with "data: " containing JSON events
  // We accumulate text_delta content and parse the final JSON
  let accumulated = ''

  const lines = raw.split('\n')
  for (const line of lines) {
    if (!line.startsWith('data: ')) continue
    const jsonStr = line.slice(6).trim()
    if (jsonStr === '[DONE]') continue
    try {
      const event = JSON.parse(jsonStr)
      if (
        event.type === 'content_block_delta' &&
        event.delta?.type === 'text_delta'
      ) {
        accumulated += event.delta.text
      }
    } catch {
      // non-JSON line — skip
    }
  }

  // Trim and parse accumulated JSON
  const trimmed = accumulated.trim()
  if (!trimmed) return null

  try {
    return JSON.parse(trimmed) as Protocol
  } catch {
    // Try to extract JSON object from the text (fallback for extra whitespace/BOM)
    const match = trimmed.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0]) as Protocol
      } catch {
        return null
      }
    }
    return null
  }
}

export default function ProtocolSection() {
  const [stage, setStage] = useState<Stage>('form')
  const [protocol, setProtocol] = useState<Protocol | null>(null)
  const [city, setCity] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleFormSubmit = async (data: ProtocolFormData) => {
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

      // Read the full SSE stream as text
      const raw = await res.text()
      const parsed = parseProtocolFromStream(raw)

      if (!parsed || !parsed.protocol || parsed.protocol.length === 0) {
        throw new Error('Protocol generation failed — empty response. Please try again.')
      }

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
            exit={{ opacity: 0, y: -12 }}
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
            transition={{ duration: 0.3 }}
          >
            <LoadingProtocol city={city} />
          </motion.div>
        )}

        {stage === 'output' && protocol && (
          <motion.div
            key="output"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ProtocolOutput protocol={protocol} city={city} onReset={handleReset} />
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
              className="px-6 py-2.5 rounded-xl bg-recvr-surface border border-recvr-border text-recvr-text text-sm hover:border-recvr-cyan transition-colors"
            >
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

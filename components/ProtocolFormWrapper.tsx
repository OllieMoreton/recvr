'use client'

import { useState } from 'react'
import ProtocolForm from './ProtocolForm'
import type { ProtocolFormData } from '@/lib/types'

export default function ProtocolFormWrapper() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState<ProtocolFormData | null>(null)

  const handleSubmit = async (data: ProtocolFormData) => {
    setIsLoading(true)
    // API call will be wired in Block 8 — for now just log the data
    console.log('Protocol form submitted:', data)
    setSubmitted(data)
    setIsLoading(false)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-recvr-surface border border-recvr-border rounded-2xl p-8 text-center">
        <p className="text-recvr-muted text-sm font-mono tracking-widest uppercase mb-2">
          Submitted
        </p>
        <pre className="text-xs text-recvr-muted/60 text-left mt-4 overflow-auto">
          {JSON.stringify(submitted, null, 2)}
        </pre>
      </div>
    )
  }

  return <ProtocolForm onSubmit={handleSubmit} isLoading={isLoading} />
}

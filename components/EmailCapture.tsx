'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setStatus('loading')

    try {
      const res = await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          protocol_summary: null,
          city: null,
          source: 'homepage_waitlist',
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="early-access" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-recvr-surface border border-recvr-border rounded-3xl p-10 sm:p-12 text-center">
          {status === 'done' ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <CheckCircle2 className="w-12 h-12 text-recvr-cyan" />
              <p className="text-recvr-text text-2xl font-bold">You&apos;re in.</p>
              <p className="text-recvr-muted text-base">We&apos;ll be in touch.</p>
            </div>
          ) : (
            <>
              <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-4">
                Early access
              </p>
              <h2 className="text-4xl font-bold text-recvr-text mb-3">
                Be first.
              </h2>
              <p className="text-recvr-muted text-lg mb-8 max-w-lg mx-auto">
                Join athletes already on the RECVR waitlist. Early access only.
              </p>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-recvr-bg border border-recvr-border text-recvr-text placeholder:text-recvr-muted/50 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-recvr-cyan transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-recvr-cyan text-recvr-bg font-semibold rounded-full px-6 py-3 text-sm hover:bg-cyan-400 transition-colors disabled:opacity-60 shrink-0"
                >
                  {status === 'loading' ? 'Joining...' : 'Join the waitlist →'}
                </button>
              </form>

              {status === 'error' && (
                <p className="text-red-400 text-xs mt-3">
                  Something went wrong. Please try again.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

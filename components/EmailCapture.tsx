'use client'

import { useState } from 'react'

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
    <section
      id="early-access"
      className="w-full px-12 flex items-center"
      style={{
        backgroundColor: '#B87333',
        minHeight: '480px',
      }}
    >
      <div className="max-w-[1400px] mx-auto w-full py-20">
        {status === 'done' ? (
          <div>
            <h2
              className="font-tiempos font-extrabold text-recvr-bg leading-none tracking-[-0.03em] mb-6"
              style={{ fontSize: 'clamp(80px, 10vw, 140px)', fontWeight: 600 }}
            >
              You&apos;re in.
            </h2>
            <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: 'rgba(10,10,10,0.6)' }}>
              We&apos;ll be in touch.
            </p>
          </div>
        ) : (
          <>
            {/* Statement headline */}
            <h2
              className="font-tiempos font-extrabold text-recvr-bg leading-none tracking-[-0.03em] mb-10"
              style={{ fontSize: 'clamp(80px, 10vw, 140px)', fontWeight: 600 }}
            >
              Be first.
            </h2>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-[520px]"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-5 py-3.5 text-[15px] rounded-md outline-none transition-all"
                style={{
                  background: 'rgba(10,10,10,0.15)',
                  border: '1px solid rgba(10,10,10,0.25)',
                  color: '#0A0A0A',
                  fontFamily: "'DM Serif Text', Georgia, serif",
                }}
                onFocus={(e) => (e.target.style.background = 'rgba(10,10,10,0.22)')}
                onBlur={(e) => (e.target.style.background = 'rgba(10,10,10,0.15)')}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-7 py-3.5 rounded-md text-[14px] font-semibold shrink-0 transition-all duration-150 disabled:opacity-60"
                style={{
                  background: '#0A0A0A',
                  color: '#C4813A',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 600,
                  fontSize: '18px',
                }}
              >
                {status === 'loading' ? 'Joining...' : 'Join the waitlist →'}
              </button>
            </form>

            {status === 'error' && (
              <p className="mt-3 text-[12px]" style={{ color: 'rgba(10,10,10,0.7)' }}>
                Something went wrong. Please try again.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}

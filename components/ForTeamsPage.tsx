'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check } from 'lucide-react'

const TEAM_TYPES = [
  'Running clubs',
  'Cycling teams',
  'CrossFit boxes',
  'Triathlon clubs',
  'Sports teams',
  'Fight gyms',
]

const FEATURES = [
  {
    tag: 'PROTOCOLS',
    title: 'Unlimited protocol generation',
    description:
      'Generate personalised recovery programmes for every athlete on your roster. No caps, no per-seat pricing.',
  },
  {
    tag: 'VENUES',
    title: 'Venue access & at-home methods',
    description:
      'Athletes get preferred pricing at RECVR partner venues for premium modalities, alongside guided, zero-cost at-home protocols (like breathwork and active mobility) for every budget.',
  },
  {
    tag: 'PLANNING',
    title: 'Training block protocols',
    description:
      'Build recovery programmes around your season calendar. Base phase, race build, taper — all covered.',
  },
  {
    tag: 'SCIENCE',
    title: 'Evidence-based & safety-first',
    description:
      'Every recommendation links to peer-reviewed physiology. Built-in guardrails distinguish between normal training fatigue and acute injury risk, keeping your athletes safe.',
  },
  {
    tag: 'ADAPTIVE',
    title: 'Dynamic, frictionless updates',
    description:
      'Athletes connect their wearables (coming soon) or log a quick check-in. The system monitors their strain and adapts their protocol automatically. No nagging required.',
  },
  {
    tag: 'DASHBOARD',
    title: 'Coach telemetry dashboard (Q3 2026)',
    description:
      'A real-time biological view of your entire roster. See aggregated team recovery scores, spot overtraining trends, and know exactly who to push and who to rest.',
    badge: 'Q3 2026',
  },
]

const PLAN_INCLUDES = [
  'Unlimited protocol generation for your team',
  'Race countdown and training block planning',
  'Recovery Readiness scoring for all athletes',
  'RECVR partner venue bundle access',
  'Shareable protocols for athlete self-service',
  'Priority email support',
  'Coach dashboard (Q3 2026)',
]

const Divider = () => (
  <div style={{ height: '1px', background: 'rgba(184, 115, 51, 0.08)' }} />
)

export default function ForTeamsPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'teams_inquiry',
          metadata: { page: 'for-teams', intent: 'team_plan' },
        }),
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F1EB]">

      {/* ─── HERO ─── */}
      <section
        className="relative pt-32 pb-24 px-12 overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 30% 20%, rgba(196,129,58,0.12) 0%, transparent 60%),
            #0A0A0A
          `,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(30,36,51,0.6) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse at 30% 50%, black 20%, transparent 70%)',
          }}
        />

        <div className="relative max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-recvr-copper mb-8">
              RECVR for Teams
            </p>

            <h1
              className="font-tiempos text-[#F5F1EB] leading-none mb-8"
              style={{
                fontSize: 'clamp(52px, 8.64vw, 88px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                maxWidth: '820px',
              }}
            >
              Recovery intelligence<br />
              <span style={{ color: '#C4813A' }}>for your whole team.</span>
            </h1>

            <p
              className="mb-10 max-w-xl leading-relaxed"
              style={{
                color: '#C8BFB0',
                fontSize: '18px',
                fontFamily: "'DM Serif Text', Georgia, serif",
                fontWeight: 300,
              }}
            >
              Give every athlete a personalised weekly recovery programme.
              Built for coaches who want to do more than just say &quot;rest up.&quot;
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a
                href="#get-started"
                className="px-8 py-4 bg-[#C4813A] text-[#0A0A0A] font-semibold text-sm hover:bg-recvr-copper-light transition-colors rounded-md"
              >
                Talk to us →
              </a>
              <Link
                href="/protocol"
                className="px-8 py-4 text-[#F5F1EB] text-sm hover:border-[#C4813A]/80 hover:text-[#C4813A] transition-colors rounded-md"
                style={{ border: '1px solid rgba(184, 115, 51, 0.4)' }}
              >
                Try the protocol engine
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ─── TEAM TYPES STRIP ─── */}
      <section className="py-5 px-12">
        <div className="max-w-[1400px] mx-auto flex items-center gap-4 flex-wrap">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8480] mr-2">
            Built for
          </span>
          {TEAM_TYPES.map((type, i) => (
            <span key={type} className="flex items-center gap-4">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#8A8480]">
                {type}
              </span>
              {i < TEAM_TYPES.length - 1 && (
                <span style={{ color: 'rgba(196,129,58,0.3)' }}>·</span>
              )}
            </span>
          ))}
        </div>
      </section>

      <Divider />

      {/* ─── FEATURES ─── */}
      <section className="py-24 px-12" style={{ background: '#0D0B09' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-recvr-copper mb-4">
              What&apos;s included
            </p>
            <h2
              className="font-tiempos text-[#F5F1EB]"
              style={{
                fontSize: 'clamp(32px, 4.32vw, 52px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                maxWidth: '600px',
              }}
            >
              Everything your coaching staff needs
            </h2>
          </div>

          <div>
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-[140px_1fr_1fr] gap-4 md:gap-8 items-start py-8"
                style={{ borderTop: '1px solid rgba(184,115,51,0.08)' }}
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-recvr-copper pt-1">
                  {feature.tag}
                </span>
                <h3
                  className="font-tiempos text-[#F5F1EB]"
                  style={{ fontSize: '22px', fontWeight: 500, letterSpacing: '-0.01em' }}
                >
                  {feature.title}
                  {feature.badge && (
                    <span
                      className="ml-3 font-mono text-[9px] uppercase tracking-widest text-[#8A8480] border border-[#2A2A2A] px-2 py-0.5 rounded-sm align-middle"
                    >
                      {feature.badge}
                    </span>
                  )}
                </h3>
                <p
                  className="text-[#8A8480] leading-relaxed"
                  style={{
                    fontSize: '15px',
                    fontFamily: "'DM Serif Text', Georgia, serif",
                    fontWeight: 300,
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ─── PRICING ─── */}
      <section className="py-24 px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — price */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-recvr-copper mb-4">
              Pricing
            </p>
            <h2
              className="font-tiempos text-[#F5F1EB] mb-6"
              style={{
                fontSize: 'clamp(32px, 4.32vw, 52px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}
            >
              Simple, flat pricing
            </h2>
            <p
              className="text-[#8A8480] leading-relaxed mb-10"
              style={{
                fontSize: '17px',
                fontFamily: "'DM Serif Text', Georgia, serif",
                fontWeight: 300,
              }}
            >
              One plan. Your whole team. Cancel any time.
              No per-athlete fees, no setup costs, no contracts.
            </p>

            <div className="flex items-end gap-2 mb-1">
              <span
                className="font-mono text-[#F5F1EB]"
                style={{ fontSize: '72px', fontWeight: 600, lineHeight: 1, letterSpacing: '-0.03em' }}
              >
                £199
              </span>
              <span className="text-[#8A8480] mb-3 font-mono text-sm">/month</span>
            </div>
            <p className="text-[#8A8480] text-sm font-mono mb-4">
              Per club or team. Unlimited athletes.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C4813A]" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#C4813A]">
                Founding partner pricing — locked for 12 months
              </span>
            </div>
          </div>

          {/* Right — includes */}
          <div
            className="rounded-md p-8"
            style={{ background: '#0D0B09', border: '1px solid rgba(196,129,58,0.2)' }}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-recvr-copper mb-6">
              Plan includes
            </p>
            <div className="space-y-4 mb-8">
              {PLAN_INCLUDES.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check size={14} className="text-[#C4813A] mt-1 shrink-0" />
                  <span
                    className="text-[#8A8480] leading-relaxed"
                    style={{
                      fontSize: '14px',
                      fontFamily: "'DM Serif Text', Georgia, serif",
                      fontWeight: 300,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <a
              href="#get-started"
              className="block w-full py-4 text-center bg-[#C4813A] text-[#0A0A0A] font-semibold text-sm hover:bg-recvr-copper-light transition-colors rounded-md"
            >
              Get started →
            </a>
            <p className="text-[11px] text-[#8A8480] text-center mt-3 font-mono">
              No setup fees · No contracts · Talk to us first
            </p>
          </div>
        </div>
      </section>

      <Divider />

      {/* ─── CONTACT ─── */}
      <section id="get-started" className="py-24 px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-recvr-copper mb-4">
              Get started
            </p>
            <h2
              className="font-tiempos text-[#F5F1EB] mb-6"
              style={{
                fontSize: 'clamp(32px, 4.32vw, 52px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}
            >
              Talk to us
            </h2>
            <p
              className="text-[#8A8480] leading-relaxed"
              style={{
                fontSize: '17px',
                fontFamily: "'DM Serif Text', Georgia, serif",
                fontWeight: 300,
              }}
            >
              We onboard teams personally. Drop your email and we&apos;ll reach out
              within one business day.
            </p>
          </div>

          <div className="pt-2">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  placeholder="coach@yourclub.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 text-[14px] text-[#F5F1EB] placeholder:text-[#8A8480] outline-none transition-colors rounded-md"
                  style={{
                    background: '#0D0B09',
                    border: '1px solid rgba(184,115,51,0.2)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#C4813A')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(184,115,51,0.2)')}
                />
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="px-8 py-4 bg-[#C4813A] text-[#0A0A0A] font-semibold text-sm hover:bg-recvr-copper-light transition-colors disabled:opacity-40 rounded-md"
                >
                  {loading ? 'Sending...' : 'Get in touch →'}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-8"
              >
                <p className="font-mono text-[11px] uppercase tracking-widest text-recvr-copper mb-3">
                  Message received
                </p>
                <p
                  className="text-[#F5F1EB] text-xl mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}
                >
                  We&apos;ll be in touch soon.
                </p>
                <p className="text-[#8A8480] text-sm">
                  Expect a reply within one business day.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

    </main>
  )
}

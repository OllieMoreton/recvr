'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

const TEAM_TYPES = [
  { icon: '🏃', label: 'Running clubs' },
  { icon: '🚴', label: 'Cycling teams' },
  { icon: '🏋️', label: 'CrossFit boxes' },
  { icon: '🏊', label: 'Triathlon clubs' },
  { icon: '⚽', label: 'Sports teams' },
  { icon: '🥊', label: 'Fight gyms' },
]

const FEATURES = [
  {
    tag: 'PROTOCOLS',
    title: 'Unlimited protocol generation',
    description:
      'Generate personalised recovery programmes for every athlete on your roster. No caps, no per-seat pricing.',
  },
  {
    tag: 'DASHBOARD',
    title: 'Coach dashboard',
    description:
      'One view across your whole team. See who needs recovery support before the next session.',
    badge: 'Coming Q3',
  },
  {
    tag: 'VENUES',
    title: 'Venue partnerships',
    description:
      'Your athletes get preferred access and bundle pricing at RECVR partner venues near you.',
  },
  {
    tag: 'PLANNING',
    title: 'Training block protocols',
    description:
      'Build recovery programmes around your season calendar. Base phase, race build, taper — all covered.',
  },
  {
    tag: 'SCIENCE',
    title: 'Evidence-based guidance',
    description:
      'Every recommendation is grounded in exercise physiology. Give your athletes a reason behind every session.',
  },
  {
    tag: 'ADAPTIVE',
    title: 'Weekly programme updates',
    description:
      "Athletes check in weekly and their protocol adapts. The system learns what works for each person.",
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
        className="relative pt-32 pb-24 px-6 text-center overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(196,129,58,0.10) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.05) 0%, transparent 50%),
            #0A0A0A
          `,
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(30,36,51,0.8) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)',
          }}
        />

        <div className="relative max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1F1F1F] text-xs font-mono text-[#C4813A] uppercase tracking-widest mb-6">
              RECVR for Teams
            </span>

            <h1
              className="font-bold tracking-tight text-[#F5F1EB] mb-6 leading-[1.05]"
              style={{ fontSize: 'clamp(52px, 8.64vw, 78px)', letterSpacing: '-0.02em' }}
            >
              Recovery intelligence<br />
              <span className="text-[#C4813A]">for your whole team.</span>
            </h1>

            <p className="text-lg text-[#8A8480] max-w-xl mx-auto mb-10 leading-relaxed">
              Give every athlete a personalised weekly recovery programme.
              Built for coaches who want to do more than just say &quot;rest up.&quot;
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#get-started"
                className="px-8 py-3.5 rounded-full bg-[#C4813A] text-[#0A0A0A] font-semibold text-sm hover:bg-recvr-copper-light transition-colors"
              >
                Talk to us →
              </a>
              <Link
                href="/protocol"
                className="px-8 py-3.5 rounded-full border border-[#1F1F1F] text-[#F5F1EB] text-sm hover:border-[#C4813A]/50 transition-colors"
              >
                Try the protocol engine
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── TEAM TYPES STRIP ─── */}
      <section className="border-y border-[#1F1F1F] py-6 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xs font-mono text-[#8A8480] uppercase tracking-widest">
              Built for
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {TEAM_TYPES.map((type) => (
              <div
                key={type.label}
                className="px-4 py-2 rounded-full border border-[#1F1F1F] bg-[#111111]"
              >
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#8A8480]">{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="font-bold tracking-tight mb-4"
              style={{ letterSpacing: '-0.02em', fontSize: 'clamp(32px, 4.32vw, 39px)' }}
            >
              Everything your coaching staff needs
            </h2>
            <p className="text-[#8A8480] max-w-lg mx-auto">
              One flat monthly plan. Every feature included. No per-athlete fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-[#1F1F1F] bg-[#111111] hover:border-[#C4813A]/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#C4813A]">
                    {feature.tag}
                  </p>
                  {feature.badge && (
                    <span className="text-xs font-mono text-[#8A8480] border border-[#1F1F1F] px-2 py-0.5 rounded-full">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-[#F5F1EB] mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-[#8A8480] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="py-24 px-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-12">
            <h2
              className="font-bold tracking-tight mb-4"
              style={{ letterSpacing: '-0.02em', fontSize: 'clamp(32px, 4.32vw, 39px)' }}
            >
              Simple, flat pricing
            </h2>
            <p className="text-[#8A8480]">
              One plan. Your whole team. Cancel any time.
            </p>
          </div>

          <div
            className="rounded-2xl p-8 border"
            style={{
              background: '#1A1008',
              borderColor: 'rgba(196,129,58,0.3)',
              boxShadow: '0 0 40px rgba(196,129,58,0.06)',
            }}
          >
            {/* Price */}
            <div className="mb-8">
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-bold font-mono text-[#F5F1EB]">£199</span>
                <span className="text-[#8A8480] mb-2">/month</span>
              </div>
              <div className="text-sm text-[#8A8480]">
                Per club or team. Unlimited athletes.
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono text-[#C4813A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C4813A] inline-block" />
                Founding partner pricing — locked for 12 months
              </div>
            </div>

            {/* Includes list */}
            <div className="space-y-3 mb-8">
              {PLAN_INCLUDES.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check size={15} className="text-[#C4813A] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#8A8480]">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#get-started"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#C4813A] text-[#0A0A0A] font-semibold text-sm hover:bg-recvr-copper-light transition-colors"
            >
              Get started <ArrowRight size={16} />
            </a>

            <p className="text-xs text-[#8A8480] text-center mt-3">
              No setup fees. No contracts. Talk to us first.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CONTACT / EMAIL CAPTURE ─── */}
      <section id="get-started" className="py-24 px-6 border-t border-[#1F1F1F]">
        <div className="max-w-lg mx-auto text-center">
          <h2
            className="font-bold tracking-tight mb-4"
            style={{ letterSpacing: '-0.02em', fontSize: 'clamp(32px, 4.32vw, 39px)' }}
          >
            Talk to us
          </h2>
          <p className="text-[#8A8480] mb-8">
            We onboard teams personally. Drop your email and we&apos;ll reach out
            within one business day.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="coach@yourclub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl text-sm text-[#F5F1EB] placeholder:text-[#8A8480] outline-none transition-colors"
                style={{ background: '#111111', border: '1px solid #1F1F1F' }}
                onFocus={(e) => (e.target.style.borderColor = '#C4813A')}
                onBlur={(e) => (e.target.style.borderColor = '#1F1F1F')}
              />
              <button
                type="submit"
                disabled={loading || !email}
                className="px-6 py-3 rounded-xl bg-[#C4813A] text-[#0A0A0A] font-semibold text-sm hover:bg-recvr-copper-light transition-colors disabled:opacity-40 whitespace-nowrap"
              >
                {loading ? 'Sending...' : 'Get in touch →'}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-[#C4813A]/10 flex items-center justify-center">
                <Check size={20} className="text-[#C4813A]" />
              </div>
              <p className="text-[#F5F1EB] font-medium">We&apos;ll be in touch soon.</p>
              <p className="text-sm text-[#8A8480]">
                Expect a reply within one business day.
              </p>
            </motion.div>
          )}
        </div>
      </section>

    </main>
  )
}

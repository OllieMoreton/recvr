import type { Metadata } from 'next'
import ProtocolSection from '@/components/ProtocolSection'

export const metadata: Metadata = {
  title: 'Start your recovery programme',
  description:
    'Tell us how you\'re training and we\'ll build you a personalised weekly recovery programme with venue recommendations.',
}

export default function ProtocolPage() {
  return (
    <main className="min-h-screen" style={{ background: '#0A0A0A' }}>

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-36 pb-16 px-12"
        style={{
          background: `
            radial-gradient(ellipse 55% 50% at 50% 60%, rgba(196,129,58,0.10) 0%, transparent 65%),
            #0A0A0A
          `,
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(30,36,51,0.5) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse at 50% 60%, black 20%, transparent 65%)',
          }}
        />

        <div className="relative max-w-[860px] mx-auto text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-recvr-copper mb-6">
            Your Weekly Recovery Coach
          </p>
          <h1
            className="font-tiempos text-recvr-text leading-none mb-5"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 600, letterSpacing: '-0.02em' }}
          >
            Start your recovery programme
          </h1>
          <p
            className="leading-relaxed mx-auto mb-4"
            style={{
              color: '#C8BFB0',
              fontSize: '18px',
              fontFamily: "'DM Serif Text', Georgia, serif",
              fontWeight: 300,
              maxWidth: '540px',
            }}
          >
            Tell us about this week&apos;s training. We&apos;ll build your protocol and match it to real venues near you.
          </p>
          <p
            className="font-mono text-[11px] text-recvr-text-secondary"
            style={{ letterSpacing: '0.04em' }}
          >
            Built on exercise physiology — lactate clearance, parasympathetic recovery, tissue repair sequencing.
          </p>
        </div>
      </section>

      {/* Copper rule */}
      <div style={{ height: '1px', background: 'rgba(184, 115, 51, 0.08)' }} />

      {/* Form */}
      <div style={{ background: '#0D0B09', paddingTop: '48px', paddingBottom: '80px' }}>
        <ProtocolSection />
      </div>

    </main>
  )
}

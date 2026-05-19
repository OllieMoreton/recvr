import type { Metadata } from 'next'
import ProtocolSection from '@/components/ProtocolSection'

export const metadata: Metadata = {
  title: 'Build your recovery protocol — RECVR',
  description:
    'Tell us how you\'re training and we\'ll build you a personalised 7-day recovery protocol with venue recommendations.',
}

export default function ProtocolPage() {
  return (
    <main className="min-h-screen bg-recvr-bg">
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-8 text-center">
        <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-3">
          AI Recovery Engine
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-recvr-text mb-3">
          Build your recovery protocol
        </h1>
        <p className="text-recvr-muted text-lg">
          Tell us how you&apos;re training and we&apos;ll tell you exactly how to recover.
        </p>
      </div>

      <ProtocolSection />
    </main>
  )
}

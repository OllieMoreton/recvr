import type { Metadata } from 'next'
import ProtocolSection from '@/components/ProtocolSection'

export const metadata: Metadata = {
  title: 'Start your recovery programme',
  description:
    'Tell us how you\'re training and we\'ll build you a personalised weekly recovery programme with venue recommendations.',
}

export default function ProtocolPage() {
  return (
    <main className="min-h-screen bg-recvr-bg">
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-8 text-center">
        <p className="text-recvr-muted text-xs font-mono tracking-widest uppercase mb-3">
          Your Weekly Recovery Coach
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-recvr-text mb-3">
          Start your recovery programme
        </h1>
        <p className="text-recvr-muted text-lg">
          Tell us about this week&apos;s training. We&apos;ll build your recovery protocol and match it to real venues near you.
        </p>
        <p className="font-mono text-xs text-recvr-text-secondary mt-4">
          Built on exercise physiology research covering lactate clearance, parasympathetic recovery, tissue repair sequencing, and CNS stress management.
        </p>
      </div>

      <ProtocolSection />
    </main>
  )
}

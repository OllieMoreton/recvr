import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { decodeShareData } from '@/lib/share-utils'
import { getModalityConfig } from '@/lib/modality-config'

interface Props {
  params: Promise<{ encoded: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { encoded } = await params
  const data = decodeShareData(encoded)
  if (!data) return { title: 'Recovery Programme' }
  return {
    title: `${data.sport.join(', ')} recovery programme — score ${data.score}`,
    description: data.summary,
  }
}

export default async function SharePage({ params }: Props) {
  const { encoded } = await params
  const data = decodeShareData(encoded)
  if (!data) return notFound()

  const scoreColor =
    data.score >= 75 ? '#06B6D4' : data.score >= 55 ? '#F59E0B' : '#F97316'

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.08) 0%, transparent 60%), #080A0F',
      }}
    >
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.svg" alt="" width={24} height={24} />
          <span className="font-bold text-lg tracking-tight text-[#F8FAFC]">RECVR</span>
        </div>

        {/* Score */}
        <div className="text-center mb-8">
          <div
            className="text-7xl font-bold font-mono mb-2"
            style={{ color: scoreColor }}
          >
            {data.score}
          </div>
          <div className="text-[#94A3B8] text-sm">Recovery Readiness Score</div>
          <div
            className="text-xs font-mono text-[#94A3B8] mt-2 uppercase tracking-widest"
            style={{ color: scoreColor }}
          >
            {data.scoreLabel}
          </div>
          <div className="text-xs font-mono text-[#94A3B8] mt-1 uppercase tracking-widest">
            {data.sport.join(' · ')} · {data.trainingLoad.split(' ')[0]} load · {data.city}
          </div>
        </div>

        {/* Protocol items */}
        <div className="space-y-3 mb-8">
          {data.protocol.map((item, i) => {
            const config = getModalityConfig(item.modality_key)
            return (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl border border-[#1E2433] bg-[#0F1117]"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0"
                  style={{ backgroundColor: config.bg, color: config.color }}
                >
                  D{item.day}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#F8FAFC]">{item.modality}</div>
                  <div className="text-xs text-[#94A3B8]">{item.duration_minutes} min</div>
                </div>
                <div className="text-xs font-mono shrink-0" style={{ color: config.color }}>
                  £{item.price_from}+
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        {data.summary && (
          <p className="text-sm text-[#94A3B8] leading-relaxed text-center mb-8 px-2">
            {data.summary}
          </p>
        )}

        {/* CTA */}
        <div className="text-center">
          <p className="text-sm text-[#94A3B8] mb-4">
            Build your own recovery programme
          </p>
          <Link
            href="/protocol"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#06B6D4] text-[#080A0F] font-semibold text-sm hover:bg-cyan-400 transition-colors"
          >
            Get my RECVR programme →
          </Link>
        </div>
      </div>
    </main>
  )
}

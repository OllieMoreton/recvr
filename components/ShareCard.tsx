import type { Protocol } from '@/lib/types'
import { getModalityConfig } from '@/lib/modality-config'

interface ShareCardProps {
  protocol: Protocol
  sport: string[]
  trainingLoad: string
  score: number
  scoreLabel: string
  scoreColor: string
  city: string
}

export default function ShareCard({
  protocol,
  sport,
  trainingLoad,
  score,
  scoreLabel,
  scoreColor,
  city,
}: ShareCardProps) {
  const topItems = protocol.protocol.slice(0, 3)

  return (
    <div
      id="recvr-share-card"
      style={{
        width: '600px',
        height: '380px',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #0D1018 100%)',
        borderRadius: '16px',
        padding: '32px',
        fontFamily: 'Geist, system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #1F1F1F',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        left: '-40px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(196,129,58,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.svg" alt="" width={18} height={18} />
            <span style={{ color: '#F5F1EB', fontWeight: 700, fontSize: '16px', letterSpacing: '-0.02em' }}>
              RECVR
            </span>
          </div>
          <div style={{ color: '#8A8480', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Recovery Programme
          </div>
        </div>

        {/* Score */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: scoreColor, fontSize: '42px', fontWeight: 700, fontFamily: 'monospace', lineHeight: 1 }}>
            {score}
          </div>
          <div style={{ color: '#8A8480', fontSize: '11px', marginTop: '2px' }}>
            Recovery Readiness
          </div>
          <div style={{ color: scoreColor, fontSize: '11px', fontFamily: 'monospace', marginTop: '2px' }}>
            {scoreLabel}
          </div>
        </div>
      </div>

      {/* Protocol items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, margin: '20px 0' }}>
        {topItems.map((item, i) => {
          const config = getModalityConfig(item.modality_key)
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: `${config.color}15`,
                border: `1px solid ${config.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ color: config.color, fontSize: '10px', fontFamily: 'monospace', fontWeight: 700 }}>
                  D{item.day}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#F5F1EB', fontSize: '13px', fontWeight: 600 }}>
                  {item.modality}
                </div>
                <div style={{ color: '#8A8480', fontSize: '11px', marginTop: '1px' }}>
                  {item.duration_minutes} min · {item.matched_venue?.name || city}
                </div>
              </div>
              <div style={{ color: config.color, fontSize: '11px', fontFamily: 'monospace' }}>
                £{item.price_from}+
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1F1F1F', paddingTop: '14px' }}>
        <div style={{ color: '#8A8480', fontSize: '11px', fontFamily: 'monospace' }}>
          {sport.slice(0, 2).join(' · ')} · {trainingLoad.split(' ')[0]} load · {city}
        </div>
        <div style={{ color: '#C4813A', fontSize: '11px', fontFamily: 'monospace' }}>
          recvr.uk
        </div>
      </div>
    </div>
  )
}

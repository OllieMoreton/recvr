import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'RECVR — AI Recovery Protocols for Serious Athletes'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            height: 400,
            background:
              'radial-gradient(ellipse at center, rgba(196,129,58,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Wordmark */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '0.3em',
            color: '#C4813A',
            textTransform: 'uppercase',
            marginBottom: 32,
          }}
        >
          RECVR
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#F5F1EB',
            textAlign: 'center',
            lineHeight: 1.1,
            maxWidth: 900,
            marginBottom: 24,
          }}
        >
          Recover smarter.{' '}
          <span style={{ color: '#C4813A' }}>Perform better.</span>
        </div>

        {/* Sub */}
        <div
          style={{
            fontSize: 24,
            color: '#8A8480',
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          AI recovery protocols for serious athletes.
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 16,
            color: '#475569',
            letterSpacing: '0.1em',
          }}
        >
          recvr.uk
        </div>
      </div>
    ),
    { ...size }
  )
}

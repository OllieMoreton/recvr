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
          background: '#080A0F',
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
              'radial-gradient(ellipse at center, rgba(6,182,212,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Wordmark */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '0.3em',
            color: '#06B6D4',
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
            color: '#F8FAFC',
            textAlign: 'center',
            lineHeight: 1.1,
            maxWidth: 900,
            marginBottom: 24,
          }}
        >
          Recover smarter.{' '}
          <span style={{ color: '#06B6D4' }}>Perform better.</span>
        </div>

        {/* Sub */}
        <div
          style={{
            fontSize: 24,
            color: '#94A3B8',
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

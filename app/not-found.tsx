import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-12 text-center"
      style={{
        background: `
          radial-gradient(ellipse 50% 40% at 50% 50%, rgba(196,129,58,0.08) 0%, transparent 65%),
          #0A0A0A
        `,
      }}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-recvr-copper mb-6">
        404
      </p>
      <h1
        className="font-tiempos text-recvr-text leading-none mb-5"
        style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 600, letterSpacing: '-0.02em' }}
      >
        Page not found.
      </h1>
      <p
        className="mb-10"
        style={{
          color: '#C8BFB0',
          fontSize: '18px',
          fontFamily: "'DM Serif Text', Georgia, serif",
          fontWeight: 300,
          maxWidth: '400px',
          lineHeight: 1.7,
        }}
      >
        This page doesn&apos;t exist. Let&apos;s get you back to your programme.
      </p>
      <Link
        href="/"
        className="bg-recvr-copper text-recvr-bg font-semibold px-8 py-4 rounded-md hover:bg-recvr-copper-light transition-all duration-200 text-sm"
      >
        Back to RECVR →
      </Link>
    </main>
  )
}

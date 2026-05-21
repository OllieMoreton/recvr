'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-recvr-bg/80 backdrop-blur-md transition-colors duration-300"
      style={{
        borderBottom: `1px solid ${scrolled ? 'rgba(196, 129, 58, 0.12)' : 'transparent'}`,
      }}
    >
      <div className="max-w-[1400px] mx-auto px-12 h-full flex items-center justify-between">

        {/* Logo lockup */}
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo-mark.svg" alt="" width={22} height={22} />
          <div className="flex flex-col leading-none">
            <span className="font-bold text-base tracking-tight text-recvr-text">RECVR</span>
            <span className="font-mono text-[8px] uppercase tracking-widest text-recvr-copper" style={{ letterSpacing: '0.12em' }}>
              Recovery Intelligence
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-6">
          <Link
            href="/protocol"
            className="hidden sm:block text-sm text-recvr-muted hover:text-recvr-text transition-colors duration-200"
          >
            Protocol
          </Link>
          <Link
            href="/venues"
            className="hidden sm:block text-sm text-recvr-muted hover:text-recvr-text transition-colors duration-200"
          >
            Venues
          </Link>
          <Link
            href="/for-teams"
            className="hidden sm:block text-sm text-recvr-muted hover:text-recvr-text transition-colors duration-200"
          >
            For teams
          </Link>
          <Link
            href="/#early-access"
            className="text-sm font-semibold bg-recvr-copper text-recvr-bg px-5 py-2 rounded-md hover:bg-recvr-copper-light transition-colors duration-200"
          >
            Get early access
          </Link>
        </div>
      </div>
    </nav>
  )
}

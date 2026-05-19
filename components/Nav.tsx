'use client'

import Link from 'next/link'

export default function Nav() {
  const scrollToEmailCapture = () => {
    const el = document.getElementById('early-access')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-recvr-bg/80 backdrop-blur-md border-b border-recvr-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-bold text-recvr-cyan tracking-widest uppercase text-lg"
        >
          RECVR
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
          <button
            onClick={scrollToEmailCapture}
            className="text-sm font-medium bg-recvr-cyan text-recvr-bg px-4 py-2 rounded-full hover:bg-cyan-400 transition-colors duration-200"
          >
            Get early access
          </button>
        </div>
      </div>
    </nav>
  )
}

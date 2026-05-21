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
        {/* Logo mark + wordmark */}
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo-mark.svg" alt="" width={24} height={24} />
          <span className="font-bold text-lg tracking-tight text-[#F5F1EB]">RECVR</span>
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
          <button
            onClick={scrollToEmailCapture}
            className="text-sm font-medium bg-recvr-cyan text-recvr-bg px-4 py-2 rounded-full hover:bg-recvr-copper-light transition-colors duration-200"
          >
            Get early access
          </button>
        </div>
      </div>
    </nav>
  )
}

import Link from 'next/link'
import { AtSign, Globe } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-recvr-bg border-t border-recvr-border">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          {/* Left: brand */}
          <div>
            <p className="font-bold text-recvr-cyan tracking-widest uppercase text-lg mb-2">
              RECVR
            </p>
            <p className="text-recvr-muted text-sm leading-relaxed">
              The AI recovery coach for serious athletes.
            </p>
          </div>

          {/* Middle: links */}
          <div>
            <p className="text-recvr-text text-sm font-semibold mb-4 uppercase tracking-widest">
              Navigate
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/venues"
                  className="text-recvr-muted text-sm hover:text-recvr-text transition-colors"
                >
                  Venues
                </Link>
              </li>
              <li>
                <Link
                  href="/for-teams"
                  className="text-recvr-muted text-sm hover:text-recvr-text transition-colors"
                >
                  For teams
                </Link>
              </li>
              <li>
                <a
                  href="/#protocol-section"
                  className="text-recvr-muted text-sm hover:text-recvr-text transition-colors"
                >
                  Protocol
                </a>
              </li>
              <li>
                <a
                  href="mailto:venues@recvr.uk"
                  className="text-recvr-muted text-sm hover:text-recvr-text transition-colors"
                >
                  venues@recvr.uk
                </a>
              </li>
            </ul>
          </div>

          {/* Right: social */}
          <div>
            <p className="text-recvr-text text-sm font-semibold mb-4 uppercase tracking-widest">
              Follow
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/recvr.uk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-recvr-surface border border-recvr-border flex items-center justify-center text-recvr-muted hover:text-recvr-text hover:border-recvr-cyan/50 transition-colors"
              >
                <AtSign className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/recvr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-recvr-surface border border-recvr-border flex items-center justify-center text-recvr-muted hover:text-recvr-text hover:border-recvr-cyan/50 transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-recvr-border pt-6">
          <p className="text-recvr-muted text-xs text-center">
            © 2026 RECVR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

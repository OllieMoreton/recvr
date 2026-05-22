import Link from 'next/link'
import RecvrLogo from './RecvrLogo'

export default function Footer() {
  return (
    <footer style={{ background: '#0A0A0A', borderTop: '1px solid rgba(184,115,51,0.08)' }}>
      <div className="max-w-[1400px] mx-auto px-12 py-16">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-12 md:gap-24 mb-14">

          {/* Brand */}
          <div>
            <div className="mb-3">
              <RecvrLogo size="md" />
            </div>
            <p
              className="text-recvr-text-secondary leading-relaxed max-w-[280px]"
              style={{ fontSize: '14px', fontFamily: "'DM Serif Text', Georgia, serif", fontWeight: 300 }}
            >
              The weekly recovery system for serious athletes.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-recvr-copper mb-5">
              Navigate
            </p>
            <ul className="space-y-3">
              {[
                { label: 'Protocol', href: '/protocol' },
                { label: 'Venues', href: '/venues' },
                { label: 'For teams', href: '/for-teams' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-recvr-text-secondary hover:text-recvr-text transition-colors duration-150"
                    style={{ fontSize: '14px', fontFamily: "'DM Serif Text', Georgia, serif" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-recvr-copper mb-5">
              Contact
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:venues@recvr.uk"
                  className="text-recvr-text-secondary hover:text-recvr-text transition-colors duration-150"
                  style={{ fontSize: '14px', fontFamily: "'DM Serif Text', Georgia, serif" }}
                >
                  venues@recvr.uk
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/recvr.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-recvr-text-secondary hover:text-recvr-text transition-colors duration-150"
                  style={{ fontSize: '14px', fontFamily: "'DM Serif Text', Georgia, serif" }}
                >
                  @recvr.uk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between pt-8"
          style={{ borderTop: '1px solid rgba(184,115,51,0.08)' }}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-recvr-text-muted">
            © 2026 RECVR
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-recvr-text-muted">
            Recovery Intelligence
          </p>
        </div>
      </div>
    </footer>
  )
}

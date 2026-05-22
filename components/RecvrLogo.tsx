interface RecvrLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
  className?: string
}

const SIZE_CONFIG = {
  sm: { mark: 20, name: 16,  sub: 0  },
  md: { mark: 28, name: 20,  sub: 8  },
  lg: { mark: 56, name: 40,  sub: 16 },
}

export default function RecvrLogo({ size = 'md', showWordmark = true, className = '' }: RecvrLogoProps) {
  const cfg = SIZE_CONFIG[size]

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Mark */}
      <svg
        width={cfg.mark}
        height={cfg.mark}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <polygon
          points="476.0,256.0 390.0,107.1 218.0,107.1 132.0,256.0 218.0,404.9 390.0,404.9"
          fill="none"
          stroke="#C4813A"
          strokeWidth="16"
          strokeLinejoin="round"
        />
        <polyline
          points="90,256 150,256 185,236 210,256 230,111 250,356 268,256 295,216 320,256 420,256"
          fill="none"
          stroke="#C4813A"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span
            className="font-bold tracking-tight"
            style={{ fontSize: `${cfg.name}px`, color: '#F5F1EB' }}
          >
            RECVR
          </span>
          {cfg.sub > 0 && (
            <span
              className="font-mono uppercase hidden sm:block"
              style={{
                fontSize: `${cfg.sub}px`,
                color: '#C4813A',
                letterSpacing: '0.15em',
                marginTop: '2px',
              }}
            >
              Recovery Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  )
}

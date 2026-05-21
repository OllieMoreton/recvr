const ITEMS = [
  'Cryotherapy',
  'Infrared Sauna',
  'Cold Plunge',
  'Float Tank',
  'Red Light Therapy',
  'IV Therapy',
  'Contrast Therapy',
  'Sports Massage',
  'Hyperbaric Oxygen',
  'Compression Therapy',
]

const SEP = <span className="mx-5" aria-hidden="true">·</span>

function TickerContent() {
  return (
    <>
      {ITEMS.map((item) => (
        <span key={item} className="inline-flex items-center shrink-0">
          <span>{item}</span>
          {SEP}
        </span>
      ))}
    </>
  )
}

export default function Ticker() {
  return (
    <div className="w-full overflow-hidden py-4" aria-hidden="true">
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: 'ticker-scroll 40s linear infinite',
        }}
      >
        {/* Two identical copies — at translateX(-50%) the loop resets seamlessly */}
        <span
          className="flex items-center shrink-0"
          style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '13px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(196, 129, 58, 0.6)',
          }}
        >
          <TickerContent />
          <TickerContent />
        </span>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

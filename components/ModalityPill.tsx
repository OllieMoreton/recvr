import { MODALITY_CONFIG, ModalityKey } from '@/lib/modality-config'

interface ModalityPillProps {
  modality: ModalityKey | string
  size?: 'sm' | 'md'
}

export function ModalityPill({ modality, size = 'md' }: ModalityPillProps) {
  const config = MODALITY_CONFIG[modality as ModalityKey]
  if (!config) return null

  return (
    <span
      className="inline-flex items-center rounded-full font-mono uppercase tracking-wider whitespace-nowrap"
      style={{
        backgroundColor: config.bg,
        color: config.color,
        fontSize: size === 'sm' ? '10px' : '11px',
        letterSpacing: '0.06em',
        padding: size === 'sm' ? '2px 8px' : '3px 10px',
      }}
    >
      {config.label}
    </span>
  )
}

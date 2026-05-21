export type ModalityKey =
  | 'cryotherapy' | 'infrared_sauna' | 'iv_therapy' | 'float_tank'
  | 'red_light' | 'cold_plunge' | 'contrast_therapy' | 'compression'
  | 'hyperbaric_oxygen' | 'sports_massage'

export interface ModalityConfig {
  label: string
  color: string       // For pill text and icon
  bg: string          // For pill background
  icon: string        // Lucide icon name
}

export const MODALITY_CONFIG: Record<ModalityKey, ModalityConfig> = {
  cryotherapy:        { label: 'Cryotherapy',       color: '#60A5FA', bg: 'rgba(96,165,250,0.1)',   icon: 'Snowflake' },
  infrared_sauna:     { label: 'Infrared Sauna',     color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  icon: 'Flame' },
  iv_therapy:         { label: 'IV Therapy',         color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', icon: 'Droplets' },
  float_tank:         { label: 'Float Tank',         color: '#34D399', bg: 'rgba(52,211,153,0.1)',  icon: 'Waves' },
  red_light:          { label: 'Red Light',          color: '#F87171', bg: 'rgba(248,113,113,0.1)', icon: 'Sun' },
  cold_plunge:        { label: 'Cold Plunge',        color: '#38BDF8', bg: 'rgba(56,189,248,0.1)',  icon: 'Thermometer' },
  contrast_therapy:   { label: 'Contrast Therapy',  color: '#FB923C', bg: 'rgba(251,146,60,0.1)',  icon: 'ArrowLeftRight' },
  compression:        { label: 'Compression',        color: '#94A3B8', bg: 'rgba(148,163,184,0.1)', icon: 'Wind' },
  hyperbaric_oxygen:  { label: 'Hyperbaric Oxygen', color: '#C084FC', bg: 'rgba(192,132,252,0.1)', icon: 'Circle' },
  sports_massage:     { label: 'Sports Massage',    color: '#86EFAC', bg: 'rgba(134,239,172,0.1)', icon: 'Hand' },
}

export function getModalityConfig(key: string): ModalityConfig {
  return MODALITY_CONFIG[key as ModalityKey] ?? {
    label: key,
    color: '#94A3B8',
    bg: 'rgba(148,163,184,0.1)',
    icon: 'Circle',
  }
}

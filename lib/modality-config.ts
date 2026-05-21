export const MODALITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  cryotherapy:        { label: 'Cryotherapy',        color: '#06B6D4', bg: 'rgba(6,182,212,0.1)'   },
  infrared_sauna:     { label: 'Infrared Sauna',      color: '#F59E0B', bg: 'rgba(245,158,11,0.1)'  },
  iv_therapy:         { label: 'IV Therapy',          color: '#A78BFA', bg: 'rgba(167,139,250,0.1)' },
  float_tank:         { label: 'Float Tank',          color: '#2DD4BF', bg: 'rgba(45,212,191,0.1)'  },
  red_light:          { label: 'Red Light',           color: '#F87171', bg: 'rgba(248,113,113,0.1)' },
  cold_plunge:        { label: 'Cold Plunge',         color: '#38BDF8', bg: 'rgba(56,189,248,0.1)'  },
  contrast_therapy:   { label: 'Contrast Therapy',    color: '#818CF8', bg: 'rgba(129,140,248,0.1)' },
  compression:        { label: 'Compression',         color: '#34D399', bg: 'rgba(52,211,153,0.1)'  },
  hyperbaric_oxygen:  { label: 'Hyperbaric Oxygen',   color: '#60A5FA', bg: 'rgba(96,165,250,0.1)'  },
  sports_massage:     { label: 'Sports Massage',      color: '#FB923C', bg: 'rgba(251,146,60,0.1)'  },
}

export function getModalityConfig(key: string) {
  return MODALITY_CONFIG[key] ?? { label: key, color: '#94A3B8', bg: 'rgba(148,163,184,0.1)' }
}

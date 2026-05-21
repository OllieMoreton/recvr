export interface ShareData {
  sport: string[]
  trainingLoad: string
  score: number
  scoreLabel: string
  city: string
  summary: string
  protocol: Array<{
    day: number
    modality: string
    modality_key: string
    duration_minutes: number
    price_from: number
  }>
}

export function encodeShareData(data: ShareData): string {
  const json = JSON.stringify(data)
  return btoa(encodeURIComponent(json))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export function decodeShareData(encoded: string): ShareData | null {
  try {
    const padded = encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(encoded.length + (4 - (encoded.length % 4)) % 4, '=')
    return JSON.parse(decodeURIComponent(atob(padded)))
  } catch {
    return null
  }
}

export function buildShareUrl(data: ShareData): string {
  const encoded = encodeShareData(data)
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://recvr.uk'
  return `${base}/share/${encoded}`
}

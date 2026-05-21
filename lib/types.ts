export interface VenueBundle {
  id: string
  title: string
  sessions: number
  modality: Modality
  price_bundle: number
  price_direct: number
  saving: number
  validity_days: number
  description: string
}

export type Modality =
  | 'cryotherapy'
  | 'infrared_sauna'
  | 'iv_therapy'
  | 'float_tank'
  | 'red_light'
  | 'cold_plunge'
  | 'contrast_therapy'
  | 'compression'
  | 'hyperbaric_oxygen'
  | 'sports_massage'

export interface Venue {
  id: string
  name: string
  slug: string
  city: string
  postcode: string
  description: string
  modalities: Modality[]
  price_from: number
  price_range: '£' | '££' | '£££'
  hero_image: string
  images: string[]
  booking_url: string
  website: string
  instagram: string
  phone: string
  is_featured: boolean
  is_verified: boolean
  rating: number
  review_count: number
  amenities: string[]
  lat: number
  lng: number
  created_at: string
  bundles?: VenueBundle[]
}

export interface ProtocolItem {
  day: number
  day_label: string
  modality: string
  modality_key: Modality
  duration_minutes: number
  price_from: number
  reason: string
  not_instead_of: string
  venue_modality_match: Modality
  matched_venue?: Venue
}

export interface Protocol {
  summary: string
  protocol: ProtocolItem[]
}

export interface ProtocolFormData {
  sport: string[]
  trainingLoad: string
  issues: string[]
  goal: string
  city: string
  hasEvent: boolean
  eventDate?: string  // ISO date string e.g. "2026-08-15"
}

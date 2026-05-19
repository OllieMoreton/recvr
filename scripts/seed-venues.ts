import { createClient } from '@supabase/supabase-js'
import type { Venue } from '../lib/types'

// Load env vars from .env.local when running locally
import { config } from 'dotenv'
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type VenueSeed = Omit<Venue, 'id' | 'created_at'>

const venues: VenueSeed[] = [
  {
    name: 'LondonCryo',
    slug: 'londoncryo',
    city: 'London',
    postcode: 'SW1X 7PL',
    description:
      "London's premier whole-body cryotherapy centre, offering cryotherapy, infrared sauna, IV drips, red light therapy and lymphatic drainage across three central London locations.",
    modalities: ['cryotherapy', 'infrared_sauna', 'iv_therapy', 'red_light'],
    price_from: 8500,
    price_range: '£££',
    hero_image: 'PLACEHOLDER_londoncryo_hero.jpg',
    images: ['PLACEHOLDER_londoncryo_1.jpg', 'PLACEHOLDER_londoncryo_2.jpg'],
    booking_url: 'https://www.londoncryo.com/booking',
    website: 'https://www.londoncryo.com',
    instagram: '@londoncryo',
    phone: '',
    is_featured: true,
    is_verified: true,
    rating: 4.9,
    review_count: 47,
    amenities: ['Changing rooms', 'Showers', 'Consultation', 'Parking nearby'],
    lat: 51.494,
    lng: -0.155,
  },
  {
    name: 'Repose Space',
    slug: 'repose-space',
    city: 'London',
    postcode: 'W1T 3JH',
    description:
      "London's dedicated biohacking sanctuary offering cryotherapy, infrared sauna, photobiomodulation and hyperbaric oxygen therapy in a premium, science-led environment.",
    modalities: ['cryotherapy', 'infrared_sauna', 'red_light', 'hyperbaric_oxygen'],
    price_from: 7500,
    price_range: '£££',
    hero_image: 'PLACEHOLDER_repose_hero.jpg',
    images: ['PLACEHOLDER_repose_1.jpg', 'PLACEHOLDER_repose_2.jpg'],
    booking_url: 'https://repose-space.co.uk',
    website: 'https://repose-space.co.uk',
    instagram: '@reposespace',
    phone: '',
    is_featured: true,
    is_verified: true,
    rating: 4.8,
    review_count: 31,
    amenities: ['Private suites', 'Consultation', 'Changing rooms', 'City centre'],
    lat: 51.522,
    lng: -0.134,
  },
  {
    name: 'Sauna & Plunge',
    slug: 'sauna-and-plunge',
    city: 'London',
    postcode: 'E1 6RF',
    description:
      "Shoreditch's Nordic-inspired contrast therapy studio. Private infrared sauna cabins, ice plunge pools at three temperatures, and a social wellness experience built for recovery.",
    modalities: ['infrared_sauna', 'cold_plunge', 'contrast_therapy'],
    price_from: 4000,
    price_range: '££',
    hero_image: 'PLACEHOLDER_saunaplunge_hero.jpg',
    images: ['PLACEHOLDER_saunaplunge_1.jpg', 'PLACEHOLDER_saunaplunge_2.jpg'],
    booking_url: 'https://saunaandplunge.life',
    website: 'https://saunaandplunge.life',
    instagram: '@saunaandplunge',
    phone: '',
    is_featured: true,
    is_verified: true,
    rating: 4.7,
    review_count: 28,
    amenities: ['Private cabins', 'Three plunge temperatures', 'Towels provided', 'Shoreditch'],
    lat: 51.522,
    lng: -0.071,
  },
]

async function seed() {
  console.log(`\nSeeding ${venues.length} venues...\n`)

  for (const venue of venues) {
    const { error } = await supabase.from('venues').insert(venue)

    if (error) {
      // Duplicate slug — skip gracefully
      if (error.code === '23505') {
        console.log(`⚠️  Skipped "${venue.name}" — already exists`)
      } else {
        console.error(`✗  Failed "${venue.name}":`, error.message)
      }
    } else {
      console.log(`✓  Inserted "${venue.name}"`)
    }
  }

  console.log('\nDone.\n')
  process.exit(0)
}

seed()

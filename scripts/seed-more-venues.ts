import { createClient } from '@supabase/supabase-js'
import type { Venue } from '../lib/types'

import { config } from 'dotenv'
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type VenueSeed = Omit<Venue, 'id' | 'created_at'>

const venues: VenueSeed[] = [
  // ── London ──────────────────────────────────────────────────────────────
  {
    name: 'Floatworks',
    slug: 'floatworks',
    city: 'London',
    postcode: 'SE11 5QY',
    description:
      "London's largest float centre, with ten isolation tanks, an infrared sauna and sports massage. Based in Vauxhall, Floatworks is the go-to destination for deep nervous system reset and injury recovery.",
    modalities: ['float_tank', 'infrared_sauna', 'sports_massage'],
    price_from: 6500,
    price_range: '££',
    hero_image: '',
    images: [],
    booking_url: 'https://www.floatworks.com/book',
    website: 'https://www.floatworks.com',
    instagram: '@floatworks',
    phone: '',
    is_featured: true,
    is_verified: true,
    rating: 4.8,
    review_count: 112,
    amenities: ['10 float tanks', 'Infrared sauna', 'Sports massage', 'Showers', 'Changing rooms'],
    lat: 51.488,
    lng: -0.114,
  },
  {
    name: 'Glow Bar',
    slug: 'glow-bar',
    city: 'London',
    postcode: 'W1B 5AH',
    description:
      'A Carnaby Street wellness studio specialising in red light therapy, infrared sauna and IV drips. Glow Bar blends photobiomodulation with nutritional science for a modern recovery-as-lifestyle experience.',
    modalities: ['red_light', 'infrared_sauna', 'iv_therapy'],
    price_from: 4500,
    price_range: '££',
    hero_image: '',
    images: [],
    booking_url: 'https://glow-bar.co.uk/book',
    website: 'https://glow-bar.co.uk',
    instagram: '@glowbarlondon',
    phone: '',
    is_featured: false,
    is_verified: true,
    rating: 4.7,
    review_count: 83,
    amenities: ['Central London', 'IV lounges', 'Red light beds', 'Nutritional consultation'],
    lat: 51.513,
    lng: -0.138,
  },
  {
    name: 'The Altitude Centre',
    slug: 'altitude-centre',
    city: 'London',
    postcode: 'EC1R 1UL',
    description:
      'Farringdon performance lab offering hyperbaric oxygen therapy, altitude training and red light therapy. Used by Premier League clubs and endurance athletes training for altitude events.',
    modalities: ['hyperbaric_oxygen', 'red_light', 'compression'],
    price_from: 9500,
    price_range: '£££',
    hero_image: '',
    images: [],
    booking_url: 'https://www.altitudecentre.com/book',
    website: 'https://www.altitudecentre.com',
    instagram: '@thealtitudecentre',
    phone: '',
    is_featured: false,
    is_verified: true,
    rating: 4.9,
    review_count: 56,
    amenities: ['Hyperbaric chambers', 'Altitude rooms', 'Performance testing', 'City location'],
    lat: 51.524,
    lng: -0.110,
  },
  {
    name: 'Form Recovery',
    slug: 'form-recovery',
    city: 'London',
    postcode: 'E2 9DA',
    description:
      'Bethnal Green recovery studio built for athletes. Sequential compression, cold plunge, contrast therapy and sports massage under one roof — designed around training blocks not spa days.',
    modalities: ['compression', 'cold_plunge', 'contrast_therapy', 'sports_massage'],
    price_from: 3500,
    price_range: '££',
    hero_image: '',
    images: [],
    booking_url: 'https://formrecovery.co.uk/book',
    website: 'https://formrecovery.co.uk',
    instagram: '@formrecovery',
    phone: '',
    is_featured: false,
    is_verified: true,
    rating: 4.8,
    review_count: 39,
    amenities: ['Athletes only', 'Walk-in slots', 'Monthly memberships', 'East London'],
    lat: 51.527,
    lng: -0.058,
  },
  {
    name: 'Recovery Lab London',
    slug: 'recovery-lab-london',
    city: 'London',
    postcode: 'SW6 1RX',
    description:
      'Fulham performance recovery clinic offering cryotherapy, NormaTec compression, IV infusions and sports massage. Popular with Chelsea FC academy players and West London amateur athletes alike.',
    modalities: ['cryotherapy', 'compression', 'iv_therapy', 'sports_massage'],
    price_from: 6000,
    price_range: '££',
    hero_image: '',
    images: [],
    booking_url: 'https://recoverylablondon.co.uk/book',
    website: 'https://recoverylablondon.co.uk',
    instagram: '@recoverylabldn',
    phone: '',
    is_featured: false,
    is_verified: true,
    rating: 4.6,
    review_count: 44,
    amenities: ['Sports clinic', 'NormaTec compression', 'IV bar', 'Physio referrals', 'Parking'],
    lat: 51.478,
    lng: -0.192,
  },

  // ── Manchester ───────────────────────────────────────────────────────────
  {
    name: 'Manchester Cryo',
    slug: 'manchester-cryo',
    city: 'Manchester',
    postcode: 'M1 2WD',
    description:
      'The North West\'s leading cryotherapy studio, located in the Northern Quarter. Full-body cryo chambers, localised cryotherapy, infrared sauna and compression therapy — built for Manchester\'s growing endurance and CrossFit community.',
    modalities: ['cryotherapy', 'infrared_sauna', 'compression'],
    price_from: 7000,
    price_range: '£££',
    hero_image: '',
    images: [],
    booking_url: 'https://manchestercryo.co.uk/book',
    website: 'https://manchestercryo.co.uk',
    instagram: '@manchestercryo',
    phone: '',
    is_featured: true,
    is_verified: true,
    rating: 4.7,
    review_count: 29,
    amenities: ['Full-body cryo', 'Localised cryo', 'Infrared sauna', 'Northern Quarter'],
    lat: 53.481,
    lng: -2.237,
  },
  {
    name: 'Float Manchester',
    slug: 'float-manchester',
    city: 'Manchester',
    postcode: 'M4 1LE',
    description:
      'Manchester city centre float centre with five private float suites, red light therapy beds and an infrared sauna. Designed for deep parasympathetic recovery between hard training blocks.',
    modalities: ['float_tank', 'red_light', 'infrared_sauna'],
    price_from: 5500,
    price_range: '££',
    hero_image: '',
    images: [],
    booking_url: 'https://floatmanchester.co.uk/book',
    website: 'https://floatmanchester.co.uk',
    instagram: '@floatmanchester',
    phone: '',
    is_featured: false,
    is_verified: true,
    rating: 4.8,
    review_count: 61,
    amenities: ['5 private suites', 'Towels included', 'City centre', 'Shower rooms'],
    lat: 53.487,
    lng: -2.232,
  },

  // ── Edinburgh ────────────────────────────────────────────────────────────
  {
    name: 'Nordic Batch',
    slug: 'nordic-batch',
    city: 'Edinburgh',
    postcode: 'EH6 6QA',
    description:
      'Leith\'s Nordic-inspired wellness studio offering traditional sauna, cold water immersion and contrast therapy. Nordic Batch is Edinburgh\'s answer to high-performance recovery culture, with group and private sessions available.',
    modalities: ['infrared_sauna', 'cold_plunge', 'contrast_therapy'],
    price_from: 3500,
    price_range: '££',
    hero_image: '',
    images: [],
    booking_url: 'https://nordicbatch.co.uk/book',
    website: 'https://nordicbatch.co.uk',
    instagram: '@nordicbatch',
    phone: '',
    is_featured: false,
    is_verified: true,
    rating: 4.9,
    review_count: 34,
    amenities: ['Group sessions', 'Private hire', 'Harbour view', 'Towels provided'],
    lat: 55.975,
    lng: -3.170,
  },

  // ── Bristol ──────────────────────────────────────────────────────────────
  {
    name: 'Restore Bristol',
    slug: 'restore-bristol',
    city: 'Bristol',
    postcode: 'BS1 4DJ',
    description:
      'Bristol\'s first dedicated athlete recovery studio, in the heart of Stokes Croft. Contrast therapy, sports massage, red light beds and a cold plunge pool — built around the city\'s thriving triathlon and running community.',
    modalities: ['contrast_therapy', 'sports_massage', 'red_light', 'cold_plunge'],
    price_from: 4000,
    price_range: '££',
    hero_image: '',
    images: [],
    booking_url: 'https://restorebristol.co.uk/book',
    website: 'https://restorebristol.co.uk',
    instagram: '@restorebristol',
    phone: '',
    is_featured: false,
    is_verified: true,
    rating: 4.7,
    review_count: 22,
    amenities: ['Cold plunge', 'Sports massage', 'City centre', 'Bike storage'],
    lat: 51.462,
    lng: -2.594,
  },
]

async function seed() {
  console.log(`\nSeeding ${venues.length} additional venues...\n`)

  for (const venue of venues) {
    const { error } = await supabase.from('venues').insert(venue)

    if (error) {
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

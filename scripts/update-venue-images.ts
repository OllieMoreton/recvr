import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Unsplash CDN — free to use, no API key needed for direct photo URLs
const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`

const updates: { slug: string; hero_image: string }[] = [
  // ── London ──────────────────────────────────────────────────────────────
  {
    slug: 'londoncryo',
    hero_image: u('photo-91-EaA_zrCk'), // ice / cold immersion
  },
  {
    slug: 'repose-space',
    hero_image: u('photo-pu7s4tOegNQ'), // red light therapy bed
  },
  {
    slug: 'sauna-and-plunge',
    hero_image: u('photo-4NOd0__WVxk'), // two people in wooden sauna
  },
  {
    slug: 'floatworks',
    hero_image: u('photo-1cACY7-wizY'), // float / isolation pod
  },
  {
    slug: 'glow-bar',
    hero_image: u('photo-lFcSN-izsxM'), // red light / glow aesthetic
  },
  {
    slug: 'altitude-centre',
    hero_image: u('photo-ZG7UzVg-UmQ'), // dark wellness / performance
  },
  {
    slug: 'form-recovery',
    hero_image: u('photo-U9NE20ql_io'), // cold plunge / ice bath
  },
  {
    slug: 'recovery-lab-london',
    hero_image: u('photo-1761284758997-1074f2a33114'), // sports massage
  },

  // ── Manchester ───────────────────────────────────────────────────────────
  {
    slug: 'manchester-cryo',
    hero_image: u('photo-YbQhnwrAUio'), // infrared sauna interior
  },
  {
    slug: 'float-manchester',
    hero_image: u('photo-z8yBce_dXVs'), // float / water therapy
  },

  // ── Edinburgh ────────────────────────────────────────────────────────────
  {
    slug: 'nordic-batch',
    hero_image: u('photo-v8U1U6FVkeg'), // nordic / snow / sauna exterior
  },

  // ── Bristol ──────────────────────────────────────────────────────────────
  {
    slug: 'restore-bristol',
    hero_image: u('photo-1649751361457-01d3a696c7e6'), // sports massage / recovery
  },
]

async function run() {
  console.log(`\nUpdating hero images for ${updates.length} venues...\n`)

  for (const { slug, hero_image } of updates) {
    const { error } = await supabase
      .from('venues')
      .update({ hero_image })
      .eq('slug', slug)

    if (error) {
      console.error(`✗  Failed "${slug}":`, error.message)
    } else {
      console.log(`✓  Updated "${slug}"`)
    }
  }

  console.log('\nDone.\n')
  process.exit(0)
}

run()

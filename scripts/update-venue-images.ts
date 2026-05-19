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
    hero_image: u('photo-1712161321522-c24f686e4ace'), // cold plunge / ice bath
  },
  {
    slug: 'repose-space',
    hero_image: u('photo-1761933401849-12dd7fe4dd35'), // red light therapy bed
  },
  {
    slug: 'sauna-and-plunge',
    hero_image: u('photo-1583417657209-d3dd44dc9c09'), // sauna interior
  },
  {
    slug: 'floatworks',
    hero_image: u('photo-1605158743762-f887b36eef11'), // float / isolation pod
  },
  {
    slug: 'glow-bar',
    hero_image: u('photo-1707248543225-fb0d00feaad6'), // red light glow
  },
  {
    slug: 'altitude-centre',
    hero_image: u('photo-1593351887122-1a38db91a164'), // red light / performance lab
  },
  {
    slug: 'form-recovery',
    hero_image: u('photo-1681980016814-0bac16721969'), // ice bath / cold plunge
  },
  {
    slug: 'recovery-lab-london',
    hero_image: u('photo-1649751361457-01d3a696c7e6'), // sports massage
  },

  // ── Manchester ───────────────────────────────────────────────────────────
  {
    slug: 'manchester-cryo',
    hero_image: u('photo-1583416750470-965b2707b355'), // sauna / steam
  },
  {
    slug: 'float-manchester',
    hero_image: u('photo-1593612561300-5460aec25658'), // float tank
  },

  // ── Edinburgh ────────────────────────────────────────────────────────────
  {
    slug: 'nordic-batch',
    hero_image: u('photo-1583417267826-aebc4d1542e1'), // nordic sauna
  },

  // ── Bristol ──────────────────────────────────────────────────────────────
  {
    slug: 'restore-bristol',
    hero_image: u('photo-1591380666581-7e0e1cb5fc41'), // sports massage
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

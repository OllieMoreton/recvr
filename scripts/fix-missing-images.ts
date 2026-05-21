import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`

const fixes = [
  // Puffin Sauna — contrast_therapy (hot/cold, sauna + plunge)
  { slug: 'puffin-sauna-edinburgh', hero_image: u('photo-1770625468096-ff53cd24ee38') },
  // Nimaya Mindstation — primary modality is cryotherapy
  { slug: 'nimaya-mindstation', hero_image: u('photo-1649928367017-a102ec4e3cca') },
]

async function run() {
  for (const { slug, hero_image } of fixes) {
    const { error } = await supabase.from('venues').update({ hero_image }).eq('slug', slug)
    if (error) console.error(`✗ ${slug}:`, error.message)
    else console.log(`✓ ${slug}`)
  }
  process.exit(0)
}
run()

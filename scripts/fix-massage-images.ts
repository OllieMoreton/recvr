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
  { slug: 'recovery-lab-london', hero_image: u('photo-1661962357391-4f6b280ee3cc') },
  { slug: 'restore-bristol',     hero_image: u('photo-1661962357391-4f6b280ee3cc') },
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

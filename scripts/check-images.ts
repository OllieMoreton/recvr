import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  const { data } = await supabase.from('venues').select('slug, name, hero_image').order('name')
  data?.forEach(v => {
    const status = !v.hero_image ? '✗ EMPTY' : v.hero_image.includes('PLACEHOLDER') ? '✗ PLACEHOLDER' : '✓'
    console.log(`${status}  ${v.name}: ${v.hero_image?.slice(0, 80) || '(none)'}`)
  })
  process.exit(0)
}
run()

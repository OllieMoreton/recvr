import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function run() {
  const { error } = await supabase
    .from('venues')
    .update({
      price_from: 6000,
      hero_image: 'https://images.unsplash.com/photo-1745327883508-b6cd32e5dde5?auto=format&fit=crop&w=1200&q=80'
    })
    .eq('slug', 'recovery-lab-london')
  if (error) console.error('✗', error.message)
  else console.log('✓ recovery-lab-london updated')
  process.exit(0)
}
run()

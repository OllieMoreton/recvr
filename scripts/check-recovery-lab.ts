import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function run() {
  const { data } = await supabase.from('venues').select('slug, name, price_from, hero_image').eq('slug', 'recovery-lab-london')
  console.log(JSON.stringify(data, null, 2))
  process.exit(0)
}
run()

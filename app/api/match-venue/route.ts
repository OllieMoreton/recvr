import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Public anon key — read-only venue data, safe to use here
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const VENUE_SELECT =
  'id, name, slug, city, postcode, modalities, price_from, price_range, booking_url, is_featured, is_verified, rating, review_count, hero_image'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city') || 'London'
  const modality = searchParams.get('modality') || ''

  // 1. Featured venue in requested city
  let { data: venue } = await supabase
    .from('venues')
    .select(VENUE_SELECT)
    .ilike('city', city)
    .contains('modalities', [modality])
    .eq('is_featured', true)
    .limit(1)
    .maybeSingle()

  // 2. Any venue with that modality in that city
  if (!venue) {
    const { data: fallback } = await supabase
      .from('venues')
      .select(VENUE_SELECT)
      .ilike('city', city)
      .contains('modalities', [modality])
      .limit(1)
      .maybeSingle()
    venue = fallback
  }

  // 3. Any venue with that modality (ignore city)
  if (!venue) {
    const { data: anyCity } = await supabase
      .from('venues')
      .select(VENUE_SELECT)
      .contains('modalities', [modality])
      .limit(1)
      .maybeSingle()
    venue = anyCity
  }

  return NextResponse.json({ venue: venue ?? null })
}

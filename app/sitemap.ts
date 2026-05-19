import type { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient()
  const { data: venues } = await supabase.from('venues').select('slug, created_at')

  const venueUrls: MetadataRoute.Sitemap = (venues ?? []).map((v) => ({
    url: `https://recvr.uk/venues/${v.slug}`,
    lastModified: v.created_at,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    { url: 'https://recvr.uk', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://recvr.uk/protocol', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://recvr.uk/venues', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    ...venueUrls,
  ]
}

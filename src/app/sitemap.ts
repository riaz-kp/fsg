import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/firm'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { path: '', priority: 1, changeFrequency: 'monthly' as const },
    { path: '/services', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/due-dates', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/documents', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'yearly' as const },
  ].map(({ path, ...rest }) => ({ url: `${SITE_URL}${path}`, ...rest }))
}

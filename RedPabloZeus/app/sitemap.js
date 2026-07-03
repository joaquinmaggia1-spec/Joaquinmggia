import { CONFIG } from './config'

export default function sitemap() {
  return [
    {
      url: CONFIG.SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}

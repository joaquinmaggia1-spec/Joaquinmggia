import { CONFIG } from './config'

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${CONFIG.SITE_URL}/sitemap.xml`,
  }
}

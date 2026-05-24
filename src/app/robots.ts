import type { MetadataRoute } from 'next';

const baseUrl = 'https://doughmath.ymirtool.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}

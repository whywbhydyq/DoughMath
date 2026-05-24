import { BASE_URL, type ToolPageData } from '@/lib/pageData';

export function BreadcrumbJsonLd({ page }: { page: ToolPageData }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: page.h1, item: `${BASE_URL}${page.canonicalPath}` }
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function WebApplicationJsonLd({ page }: { page: ToolPageData }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: page.h1,
    url: `${BASE_URL}${page.canonicalPath}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    description: page.description,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

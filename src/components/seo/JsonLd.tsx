import { BASE_URL, type ToolPageData } from '@/lib/pageData';
import type { GuidePage } from '@/lib/guideData';

function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function SiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'DoughMath',
        url: BASE_URL
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name: 'DoughMath',
        url: BASE_URL,
        description: 'Browser-only bread, sourdough, starter feeding, dough scaling, and pizza dough calculators.',
        publisher: { '@id': `${BASE_URL}/#organization` },
        inLanguage: 'en'
      }
    ]
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}

export function BreadcrumbJsonLd({ page }: { page: ToolPageData }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: page.h1, item: `${BASE_URL}${page.canonicalPath}` }
    ]
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}

export function WebApplicationJsonLd({ page }: { page: ToolPageData }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${BASE_URL}${page.canonicalPath}#webapplication`,
    name: page.h1,
    description: page.description,
    url: `${BASE_URL}${page.canonicalPath}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript in a modern web browser.',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    provider: { '@id': `${BASE_URL}/#organization` },
    featureList: page.formulaNotes,
    inLanguage: 'en'
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}


type HomeDirectoryItem = {
  href: string;
  title: string;
  description: string;
  type: string;
};

export function HomeItemListJsonLd({ items }: { items: HomeDirectoryItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${BASE_URL}/#calculator-directory`,
    name: 'DoughMath core calculator directory',
    description: 'A short directory of the main bread, sourdough, starter feeding, dough scaling, pizza dough, and baker’s percentage calculators.',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      description: item.description,
      url: `${BASE_URL}${item.href}`,
      item: {
        '@type': 'WebApplication',
        name: item.title,
        url: `${BASE_URL}${item.href}`
      }
    }))
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}

export function GuideJsonLd({ page }: { page: GuidePage }) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${BASE_URL}${page.canonicalPath}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${BASE_URL}/#guides` },
          { '@type': 'ListItem', position: 3, name: page.h1, item: `${BASE_URL}${page.canonicalPath}` }
        ]
      },
      {
        '@type': 'Article',
        '@id': `${BASE_URL}${page.canonicalPath}#article`,
        headline: page.h1,
        name: page.title.replace(' | DoughMath', ''),
        description: page.description,
        url: `${BASE_URL}${page.canonicalPath}`,
        mainEntityOfPage: `${BASE_URL}${page.canonicalPath}`,
        isAccessibleForFree: true,
        publisher: { '@id': `${BASE_URL}/#organization` },
        inLanguage: 'en'
      }
    ]
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}

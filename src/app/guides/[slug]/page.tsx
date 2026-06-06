import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GuideJsonLd } from '@/components/seo/JsonLd';
import { getGuidePage, guidePages } from '@/lib/guideData';
import { BASE_URL } from '@/lib/pageData';

export function generateStaticParams() {
  return guidePages.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getGuidePage(params.slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.canonicalPath },
    openGraph: { title: page.title, description: page.description, url: `${BASE_URL}${page.canonicalPath}`, type: 'article' }
  };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const page = getGuidePage(params.slug);
  if (!page) notFound();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <GuideJsonLd page={page} />
      <nav aria-label="Breadcrumb" className="no-print text-sm font-semibold text-stone-500">
        <Link href="/" className="hover:text-dough-900">Home</Link>
        <span className="px-2">/</span>
        <Link href="/#guides" className="hover:text-dough-900">Guides</Link>
        <span className="px-2">/</span>
        <span className="text-stone-800">{page.h1}</span>
      </nav>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-dough-700">DoughMath guide</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">{page.h1}</h1>
      <p className="mt-4 text-lg leading-8 text-stone-600">{page.intro}</p>
      <article className="mt-8 space-y-8 rounded-3xl border bg-white p-6 shadow-sm">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-semibold">{section.heading}</h2>
            {section.body.map((paragraph) => <p className="mt-3 leading-7 text-stone-700" key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
        <section className="no-print" id="related-calculators">
          <h2 className="text-2xl font-semibold">Related calculators</h2>
          <p className="mt-3 leading-7 text-stone-700">Use these calculators when you want to turn the guide concept into exact gram weights.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {page.related.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full border px-3 py-1 text-sm hover:bg-stone-50">{item.label}</Link>
            ))}
          </div>
        </section>
        <p className="rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-500">DoughMath guides are educational explanations for formula math. Use the linked calculators for exact weights before baking.</p>
      </article>
    </main>
  );
}

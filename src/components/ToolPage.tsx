import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Calculator from '@/components/Calculator';
import { AdSlot } from '@/components/layout/AdSlot';
import { AffiliatePanel } from '@/components/layout/AffiliatePanel';
import { BASE_URL, getToolPage, getToolPageOrThrow, toolPages } from '@/lib/pageData';

export function generateStaticParams() {
  return toolPages.map((page) => ({ slug: page.slug }));
}

export function metadataForTool(slug: string): Metadata {
  const page = getToolPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.canonicalPath },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${BASE_URL}${page.canonicalPath}`,
      type: 'website'
    }
  };
}

export function ToolPage({ slug }: { slug: string }) {
  const page = getToolPage(slug);
  if (!page) notFound();

  const related = page.relatedSlugs.map(getToolPageOrThrow);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-dough-700">DoughMath calculator</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{page.h1}</h1>
        <p className="mt-4 text-lg text-stone-600">{page.intro}</p>
        <p className="mt-2 text-sm text-stone-500">All calculations run locally in your browser. No login, upload, or cloud recipe storage.</p>
      </section>

      <div className="mt-8">
        <Suspense fallback={<p>Loading calculator…</p>}>
          <Calculator slug={slug} defaultInputs={page.defaultInputs} />
        </Suspense>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="no-print space-y-8 rounded-3xl border bg-white p-6 shadow-sm">
          <section>
            <h2 className="text-2xl font-semibold">Example calculation</h2>
            {page.examples.map((example) => (
              <div key={example.title} className="mt-4 rounded-2xl bg-stone-50 p-4 text-sm text-stone-700">
                <h3 className="font-semibold text-stone-950">{example.title}</h3>
                <p className="mt-2"><strong>Input:</strong> {example.input}</p>
                <p className="mt-1"><strong>Output:</strong> {example.output}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Formula explanation</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-stone-600">
              {page.formulaNotes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Common mistakes</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-stone-600">
              <li>Do not confuse added hydration with total hydration when starter is included.</li>
              <li>Do not treat 100% hydration starter as 100% water; it is equal flour and water by weight.</li>
              <li>Use grams for repeatable formulas. Cups vary by flour type and packing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">FAQ</h2>
            <div className="mt-3 space-y-4">
              {page.faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="mt-1 text-stone-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Related calculators</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {related.map((item) => (
                <Link key={item.slug} href={item.canonicalPath} className="rounded-full border px-3 py-1 text-sm hover:bg-stone-50">
                  {item.h1}
                </Link>
              ))}
            </div>
          </section>

          <p className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-500">Disclaimer: DoughMath provides formula calculations only. It does not guarantee baking outcomes, fermentation timing, starter activity, food safety, or professional culinary results.</p>
        </article>

        <aside className="space-y-4">
          <AdSlot />
          <AffiliatePanel />
        </aside>
      </div>
    </main>
  );
}

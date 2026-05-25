import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Calculator from '@/components/Calculator';
import { AdSlot } from '@/components/layout/AdSlot';
import { AffiliatePanel } from '@/components/layout/AffiliatePanel';
import { BreadcrumbJsonLd, WebApplicationJsonLd } from '@/components/seo/JsonLd';
import { TrackedFaq, TrackedRelatedToolLink } from '@/components/TrackedInteractions';
import { BASE_URL, getToolPage, getToolPageOrThrow, longTailPages } from '@/lib/pageData';

export function generateStaticParams() {
  return longTailPages.map((page) => ({ slug: page.slug }));
}

export function metadataForTool(slug: string): Metadata {
  const page = getToolPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.canonicalPath },
    openGraph: { title: page.title, description: page.description, url: `${BASE_URL}${page.canonicalPath}`, type: 'website' }
  };
}

export function ToolPage({ slug }: { slug: string }) {
  const page = getToolPage(slug);
  if (!page) notFound();
  const related = page.relatedSlugs.map(getToolPageOrThrow);
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:px-6">
      <BreadcrumbJsonLd page={page} />
      <WebApplicationJsonLd page={page} />
      <section className="rounded-[2rem] border border-amber-200/80 bg-white/80 p-5 shadow-soft sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-dough-700">DoughMath calculator</p>
            <h1 className="mt-2 max-w-4xl text-3xl font-black tracking-tight text-stone-950 sm:text-5xl">{page.h1}</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-stone-600 sm:text-lg">{page.intro}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-stone-600">
            <span className="rounded-full bg-amber-50 px-3 py-2">No login</span>
            <span className="rounded-full bg-amber-50 px-3 py-2">No uploads</span>
            <span className="rounded-full bg-amber-50 px-3 py-2">Print-ready</span>
          </div>
        </div>
      </section>

      <div className="mt-5">
        <Suspense fallback={<p className="rounded-2xl border bg-white p-5">Loading calculator…</p>}>
          <Calculator calculatorType={page.calculatorType} slug={slug} defaultInputs={page.defaultInputs} />
        </Suspense>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="no-print space-y-8 rounded-[2rem] border border-amber-200/80 bg-white p-5 shadow-soft sm:p-7">
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-dough-700">Example</p>
            <h2 className="mt-1 text-2xl font-bold text-stone-950">Example calculation</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {page.examples.map((example) => (
                <div key={example.title} className="rounded-3xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
                  <h3 className="font-bold text-stone-950">{example.title}</h3>
                  <p className="mt-2"><strong>Input:</strong> {example.input}</p>
                  <p className="mt-1"><strong>Output:</strong> {example.output}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-dough-700">Formula</p>
            <h2 className="mt-1 text-2xl font-bold text-stone-950">How this calculator works</h2>
            <ul className="mt-4 grid gap-3 text-stone-650 md:grid-cols-2">
              {page.formulaNotes.map((note) => <li key={note} className="rounded-2xl bg-amber-50/70 p-4 text-sm leading-6 text-stone-700">{note}</li>)}
            </ul>
          </section>
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-dough-700">Common mistakes</p>
            <h2 className="mt-1 text-2xl font-bold text-stone-950">What to check before baking</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-stone-700">
              {page.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}
            </ul>
          </section>
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-dough-700">FAQ</p>
            <h2 className="mt-1 text-2xl font-bold text-stone-950">Questions</h2>
            <div className="mt-4 divide-y divide-stone-100 rounded-3xl border border-stone-200">
              {page.faqs.map((faq) => (
                <TrackedFaq key={faq.question} slug={slug} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </section>
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-dough-700">Related tools</p>
            <h2 className="mt-1 text-2xl font-bold text-stone-950">Next calculators</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((item) => (
                <TrackedRelatedToolLink key={item.slug} slug={slug} href={item.canonicalPath}>
                  {item.h1}
                </TrackedRelatedToolLink>
              ))}
            </div>
          </section>
          <p className="rounded-3xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">Disclaimer: DoughMath provides formula calculations only. Dough behavior depends on flour, temperature, starter activity, mixing, fermentation, and handling. Use the results as a starting point and adjust based on your dough.</p>
        </article>
        <aside className="no-print space-y-4">
          <AdSlot />
          <AffiliatePanel />
        </aside>
      </div>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Calculator from '@/components/Calculator';
import { BreadcrumbJsonLd, WebApplicationJsonLd } from '@/components/seo/JsonLd';
import { TrackedFaq } from '@/components/TrackedInteractions';
import { getExplanationModule, getLinkCardCopy, getPresetModule, getResultMicrocopy } from '@/lib/contentModules';
import { BASE_URL, getToolPage, getToolPageOrThrow, longTailPages, type ToolPageData } from '@/lib/pageData';
import { isIndexableToolSlug } from '@/lib/publicPolicy';

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
    openGraph: { title: page.title, description: page.description, url: `${BASE_URL}${page.canonicalPath}`, type: 'website' },
    robots: isIndexableToolSlug(slug) ? { index: true, follow: true } : { index: false, follow: true }
  };
}

function ExplanationModule({ page }: { page: ToolPageData }) {
  const module = getExplanationModule(page);
  return (
    <section className="rounded-[2rem] border border-amber-200/80 bg-white p-5 shadow-soft sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-dough-700">{module.eyebrow}</p>
      <h2 className="mt-1 text-2xl font-bold text-stone-950">{module.heading}</h2>
      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4 text-sm leading-7 text-stone-700 sm:text-base">
          {module.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-4">
          <h3 className="text-sm font-bold text-stone-950">Use this section for</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
            {module.bullets.map((bullet) => <li key={bullet}>• {bullet}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function PresetModule({ page }: { page: ToolPageData }) {
  const preset = getPresetModule(page);
  if (!preset) return null;
  return (
    <section className="rounded-[2rem] border border-dough-200/80 bg-dough-50/70 p-5 shadow-soft sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-dough-700">{preset.eyebrow}</p>
      <div className="mt-1 grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          <h2 className="text-2xl font-bold text-stone-950">{preset.heading}</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">{preset.description}</p>
          <p className="mt-4 rounded-2xl bg-white/80 p-4 text-sm leading-6 text-stone-700"><strong>Illustrative example:</strong> {preset.exampleNote}</p>
          <Link href="#calculator" className="mt-4 inline-flex rounded-full bg-stone-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-dough-900">{preset.ctaLabel} ↑</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {preset.parameters.map((item) => (
            <div key={`${item.label}-${item.value}`} className="rounded-2xl border border-white/80 bg-white p-3 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{item.label}</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-stone-950">{item.value}</p>
              {item.note ? <p className="mt-1 text-xs leading-5 text-stone-500">{item.note}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedToolCards({ page, related }: { page: ToolPageData; related: ToolPageData[] }) {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-dough-700">Related calculators and presets</p>
      <h2 className="mt-1 text-2xl font-bold text-stone-950">Next calculators and presets</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((item) => {
          const copy = getLinkCardCopy(page, item);
          return (
            <Link key={item.slug} href={item.canonicalPath} className="group rounded-3xl border border-amber-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-hover">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-dough-700">{copy.eyebrow}</p>
              <h3 className="mt-2 text-base font-black text-stone-950 group-hover:text-dough-900">{item.h1}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{copy.description}</p>
              <span className="mt-3 inline-flex text-sm font-bold text-dough-900">{copy.cta} →</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function ToolPage({ slug }: { slug: string }) {
  const page = getToolPage(slug);
  if (!page) notFound();
  const related = page.relatedSlugs.map(getToolPageOrThrow);
  const resultMicrocopy = getResultMicrocopy(page);
  const visibleFaqs = page.faqs.slice(0, 2);
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:px-6">
      <BreadcrumbJsonLd page={page} />
      <WebApplicationJsonLd page={page} />
      <div id="calculator" className="scroll-mt-24">
        <Suspense fallback={<div className="rounded-[2rem] border border-amber-200 bg-white p-6 shadow-soft" role="status"><p className="font-bold text-stone-950">Preparing the calculator</p><p className="mt-2 text-sm text-stone-600">Reload this page if the workspace does not appear.</p></div>}>
          <Calculator calculatorType={page.calculatorType} slug={slug} defaultInputs={page.defaultInputs} resultMicrocopy={resultMicrocopy} />
        </Suspense>
      </div>

      <section className="mt-6 rounded-[2rem] border border-amber-200/80 bg-white/80 p-5 shadow-soft sm:p-7">
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



      <div className="mt-8">
        <article className="no-print space-y-8 rounded-[2rem] border border-amber-200/80 bg-white p-5 shadow-soft sm:p-7">
          <ExplanationModule page={page} />
          <PresetModule page={page} />
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-dough-700">Example</p>
            <h2 className="mt-1 text-2xl font-bold text-stone-950">Example calculation</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">These are illustrative inputs for the calculator on this page. Change the fields above to make the result match your own dough.</p>
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
              {page.commonMistakes.slice(0, 4).map((mistake) => <li key={mistake}>{mistake}</li>)}
            </ul>
          </section>
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-dough-700">FAQ</p>
            <h2 className="mt-1 text-2xl font-bold text-stone-950">Questions</h2>
            <div className="mt-4 divide-y divide-stone-100 rounded-3xl border border-stone-200">
              {visibleFaqs.map((faq) => (
                <TrackedFaq key={faq.question} slug={slug} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </section>
          <RelatedToolCards page={page} related={related} />
          <section>
            <p className="rounded-3xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">Disclaimer: DoughMath provides formula calculations only. Dough behavior depends on flour, temperature, starter activity, mixing, fermentation, and handling. Use the results as a starting point and adjust based on your dough.</p>
          </section>
        </article>
      </div>
    </main>
  );
}

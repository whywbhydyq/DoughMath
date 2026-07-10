'use client';

import Link from 'next/link';
import { trackCalculatorEvent } from '@/lib/analytics';

export function TrackedFaq({ slug, question, answer }: { slug: string; question: string; answer: string }) {
  return (
    <details className="group p-4 open:bg-amber-50/50" onToggle={(event) => {
      if (event.currentTarget.open) trackCalculatorEvent('faq_expanded', slug, { question });
    }}>
      <summary className="cursor-pointer list-none font-bold text-stone-950 group-open:text-dough-900">{question}</summary>
      <p className="mt-2 text-sm leading-6 text-stone-700">{answer}</p>
    </details>
  );
}

export function TrackedRelatedToolLink({ slug, href, children }: { slug: string; href: string; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={() => trackCalculatorEvent('related_tool_clicked', slug, { href })} className="rounded-2xl border border-amber-200 bg-white p-4 text-sm font-bold text-dough-900 shadow-soft transition hover:-translate-y-0.5 hover:shadow-hover">
      {children}
    </Link>
  );
}

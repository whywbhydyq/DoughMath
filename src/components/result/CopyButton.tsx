'use client';

import { trackCalculatorEvent } from '@/lib/analytics';

export function CopyButton({ text, calculator }: { text: string; calculator: string }) {
  return <button className="rounded-xl bg-dough-900 px-4 py-2 text-white" onClick={async () => { await navigator.clipboard.writeText(text); trackCalculatorEvent('calculator_copy', calculator); }}>Copy result</button>;
}

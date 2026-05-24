'use client';

import { trackCalculatorEvent } from '@/lib/analytics';

export function ShareUrlButton({ calculator }: { calculator: string }) {
  return <button className="rounded-xl border bg-white px-4 py-2" onClick={async () => { await navigator.clipboard.writeText(location.href); trackCalculatorEvent('share_url', calculator); }}>Copy share URL</button>;
}

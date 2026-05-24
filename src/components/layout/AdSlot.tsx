'use client';
import { useEffect } from 'react';
import { trackCalculatorEvent } from '@/lib/analytics';
export function AdSlot({ slotId='tool-sidebar' }: { slotId?: string }) { useEffect(() => { trackCalculatorEvent('ad_slot_view','site',{ slot_id: slotId }); }, [slotId]); return <aside className="no-print rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-4 text-center text-sm text-stone-500">Ad placeholder. Kept outside inputs, buttons, result tables, and print output.</aside>; }

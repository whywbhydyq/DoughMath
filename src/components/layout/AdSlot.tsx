'use client';

import { useEffect } from 'react';
import { trackCalculatorEvent } from '@/lib/analytics';

export function AdSlot({ slotId = 'tool-sidebar' }: { slotId?: string }) {
  useEffect(() => {
    trackCalculatorEvent('ad_slot_view', 'site', { slot_id: slotId });
  }, [slotId]);

  return null;
}

import { track } from '@vercel/analytics';

type AnalyticsProperty = string | number | boolean | null;

export type CalculatorEventName =
  | 'calculator_view'
  | 'calculator_input_changed'
  | 'calculator_result_generated'
  | 'calculator_result_used'
  | 'copy_result_clicked'
  | 'print_clicked'
  | 'unit_changed'
  | 'preset_clicked'
  | 'related_tool_clicked'
  | 'faq_expanded'
  | 'affiliate_clicked'
  | 'ad_slot_view'
  | 'warning_shown'
  | 'share_url_copied'
  | 'home_mode_selected'
  | 'home_result_copied'
  | 'home_full_calculator_opened'
  | 'home_sample_reset';

export function trackCalculatorEvent(name: CalculatorEventName, calculator: string, data: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const detail = { name, calculator, ...data };
  const properties = { calculator, ...sanitizeAnalyticsProperties(data) };
  track(name, properties);
  window.dispatchEvent(new CustomEvent('doughmath:event', { detail }));
}

function sanitizeAnalyticsProperties(data: Record<string, unknown>): Record<string, AnalyticsProperty> {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return [key, value];
      if (value === null || value === undefined) return [key, null];
      return [key, String(value)];
    })
  );
}

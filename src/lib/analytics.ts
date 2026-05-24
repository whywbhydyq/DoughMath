export type CalculatorEvent =
  | 'calculator_view'
  | 'calculate_click'
  | 'copy_result'
  | 'print_recipe'
  | 'share_url'
  | 'unit_toggle'
  | 'warning_shown'
  | 'affiliate_click'
  | 'ad_slot_view';

type Payload = Record<string, string | number | boolean | undefined>;

export function trackCalculatorEvent(event: CalculatorEvent, calculator: string, payload: Payload = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('doughmath:analytics', { detail: { event, calculator_type: calculator, ...payload } }));
}

export type CalculatorEventName = 'calculator_view' | 'calculate_click' | 'copy_result' | 'print_recipe' | 'share_url' | 'unit_toggle' | 'warning_shown' | 'affiliate_click' | 'ad_slot_view';
export function trackCalculatorEvent(name: CalculatorEventName, calculator: string, data: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('doughmath:event', { detail: { name, calculator, ...data } }));
}

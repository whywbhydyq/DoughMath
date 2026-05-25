export type CalculatorEventName =
  | 'calculator_view'
  | 'calculator_input_changed'
  | 'calculator_result_generated'
  | 'copy_result_clicked'
  | 'print_clicked'
  | 'unit_changed'
  | 'preset_clicked'
  | 'related_tool_clicked'
  | 'faq_expanded'
  | 'affiliate_clicked'
  | 'ad_slot_view'
  | 'warning_shown'
  | 'share_url_copied';

export function trackCalculatorEvent(name: CalculatorEventName, calculator: string, data: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('doughmath:event', { detail: { name, calculator, ...data } }));
}

export type CalculatorEvent='calculator_view'|'calculator_copy'|'calculator_print'|'calculator_share';
export function trackCalculatorEvent(event:CalculatorEvent,calculator:string){if(typeof window==='undefined')return;window.dispatchEvent(new CustomEvent('doughmath:analytics',{detail:{event,calculator}}));}

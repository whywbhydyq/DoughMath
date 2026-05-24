import type { Warn } from './bakingMath';
export function isPositiveFinite(value:number){return Number.isFinite(value)&&value>0;}
export function assertPositiveFinite(value:number,field:string){if(!isPositiveFinite(value))throw new Error(`${field} must be greater than 0.`)}
export function assertNonNegativeFinite(value:number,field:string){if(!Number.isFinite(value)||value<0)throw new Error(`${field} must be 0 or greater.`)}
export function warning(code:string,message:string,severity:Warn['severity']='warning'):Warn{return{code,message,severity}}

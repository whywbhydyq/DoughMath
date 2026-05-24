export const r1 = (n: number) => Math.round(n * 10) / 10;
export const r2 = (n: number) => Math.round(n * 100) / 100;
export const r3 = (n: number) => Math.round(n * 1000) / 1000;
export const displayRound = (n: number, u: 'g' | 'oz' | 'lb') => u === 'g' ? Math.round(n) : (u === 'oz' ? r2(n) : r3(n));

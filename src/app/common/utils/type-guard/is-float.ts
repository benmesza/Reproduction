export function isFloat(n: any): boolean {
  return Number(n) === n && n % 1 !== 0;
}

export function isInt(n: any): boolean {
  return Number(n) === n && n % 1 === 0;
}

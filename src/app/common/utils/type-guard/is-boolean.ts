export function isBoolean(obj: any): obj is boolean {
  return typeof obj === 'boolean' || obj === 'true' || obj === 'false';
}

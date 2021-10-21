export function isObject(item: any): boolean {
  return item && !Array.isArray(item) && typeof item === 'object';
}

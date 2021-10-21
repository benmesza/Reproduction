export function isUndefined(obj: any): obj is undefined {
  return typeof obj === 'undefined';
}

export function isNotUndefined(obj: any): obj is any {
  return typeof obj !== 'undefined';
}

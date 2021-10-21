// tslint:disable
export function isFunctionReturnAny(obj: any): obj is (...args: any[]) => any {
  return typeof obj === 'function';
}

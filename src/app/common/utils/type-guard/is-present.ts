import { isNil } from './is-nil';
import { isString } from './is-string';

export function isPresent(obj: any): obj is object {
  return isString(obj) ? isString(obj) && obj !== 'null' && obj !== 'undefined' : obj !== null && obj !== undefined;
}

export function isPresent2<T>(value: T | null | undefined): value is T {
  return !isNil(value);
}

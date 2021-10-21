import { isBoolean } from './is-boolean';

export function isTrue(obj: any): boolean {
  if (isBoolean(obj)) {
    if ((obj as any) === 'true' || obj === true) {
      return true;
    }
  } else {
    throw new Error('Object is not boolean');
  }
  return false;
}

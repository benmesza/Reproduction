export function isNumeric(obj: any): obj is number {
  return !Array.isArray(obj) && obj - parseFloat(obj) + 1 >= 0;
}

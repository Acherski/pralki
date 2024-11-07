// Converts date from backend format to xx.xx.xxxx
export function formatDatePipe(value: string): string {
  return value.split("-").reverse().join(".");
}
/**
 * Checks a simple email shape. This is not a full RFC parser.
 *
 * @param value - Raw email input.
 * @returns True when the value looks like an email address.
 */
export function is_valid_email(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

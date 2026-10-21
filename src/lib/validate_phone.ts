/**
 * Validates Nigerian numbers and reasonable international numbers.
 * Nigerian forms: 08012345678, 2348012345678, +2348012345678.
 * International form: a leading + and 8 to 15 digits.
 *
 * @param value - Raw phone input.
 * @returns True when the number is acceptable.
 */
export function is_valid_phone(value: string): boolean {
  const compact = value.trim().replace(/[\s().-]/g, '');
  if (/^0[7-9]\d{9}$/.test(compact)) {
    return true;
  }
  if (/^\+?234[7-9]\d{9}$/.test(compact)) {
    return true;
  }
  if (/^\+[1-9]\d{7,14}$/.test(compact)) {
    return true;
  }
  return false;
}

import type { DemoOrder } from '../types/order.ts';

const order_storage_key = 'alotym_demo_order_v1';

/**
 * Runtime check for a demo order stored in the session.
 *
 * @param value - Parsed JSON value.
 * @returns True when the value is a demo order request.
 */
function is_demo_order(value: unknown): value is DemoOrder {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const order = value as Partial<DemoOrder>;
  return order.status === 'demo_request'
    && typeof order.reference === 'string'
    && typeof order.customer_name === 'string'
    && typeof order.total === 'number'
    && Array.isArray(order.lines);
}

/**
 * Reads the latest demo order request for this browser tab.
 *
 * @returns The stored order, or null when checkout has not been submitted.
 */
export function read_last_order(): DemoOrder | null {
  try {
    const raw = sessionStorage.getItem(order_storage_key);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    return is_demo_order(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Stores a demo order request so the confirmation page can render it.
 *
 * @param order - Validated demo order.
 */
export function write_last_order(order: DemoOrder): void {
  sessionStorage.setItem(order_storage_key, JSON.stringify(order));
}

/**
 * Creates a short demo reference. It is not a payment reference.
 *
 * @param date - Clock time used in the reference. Defaults to now.
 * @returns A reference such as `ALY-20261020-AB12`.
 */
export function create_order_reference(date: Date = new Date()): string {
  const stamp = date.toISOString().slice(0, 10).replaceAll('-', '');
  const bytes = new Uint8Array(2);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes);
  } else {
    bytes[0] = Math.floor(Math.random() * 256);
    bytes[1] = Math.floor(Math.random() * 256);
  }
  const suffix = Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `ALY-${stamp}-${suffix}`;
}

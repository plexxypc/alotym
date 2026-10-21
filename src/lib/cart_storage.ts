import type { CartLine } from '../types/cart.ts';

const cart_storage_key = 'alotym_cart_v1';

/**
 * Runtime check for a cart line read from localStorage.
 *
 * @param value - Parsed JSON value.
 * @returns True when the value has the fields the cart needs.
 */
function is_cart_line(value: unknown): value is CartLine {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const line = value as Partial<CartLine>;
  return typeof line.line_id === 'string'
    && typeof line.product_id === 'string'
    && typeof line.slug === 'string'
    && typeof line.name === 'string'
    && typeof line.image_url === 'string'
    && typeof line.image_alt === 'string'
    && typeof line.unit_price === 'number'
    && typeof line.size === 'string'
    && typeof line.colour === 'string'
    && typeof line.quantity === 'number'
    && typeof line.max_quantity === 'number';
}

/**
 * Reads the persisted cart. Corrupt storage returns an empty cart.
 *
 * @returns Stored cart lines.
 */
export function read_stored_cart(): CartLine[] {
  try {
    const raw = localStorage.getItem(cart_storage_key);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(is_cart_line);
  } catch {
    return [];
  }
}

/**
 * Persists the cart in localStorage.
 *
 * @param lines - Current cart lines.
 */
export function write_stored_cart(lines: readonly CartLine[]): void {
  localStorage.setItem(cart_storage_key, JSON.stringify(lines));
}

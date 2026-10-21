import { get_unit_price } from './catalog.ts';
import type { AddCartItemInput, CartLine, CartMutationResult } from '../types/cart.ts';
import type { Product } from '../types/catalog.ts';

/**
 * Turns a variant label into a safe id fragment.
 *
 * @param value - Size or colour text.
 * @returns A lowercase fragment without spaces.
 */
function slug_part(value: string): string {
  const trimmed = value.trim().toLowerCase().replace(/\s+/g, '-');
  return trimmed || '-';
}

/**
 * Stable id for a product plus the chosen size and colour.
 *
 * @param product_id - Product id.
 * @param size - Selected size, or an empty string.
 * @param colour - Selected colour name, or an empty string.
 * @returns A cart line id.
 */
export function build_line_id(product_id: string, size: string, colour: string): string {
  return [product_id, slug_part(size), slug_part(colour)].join('__');
}

/**
 * Sum of line totals in whole naira.
 *
 * @param lines - Cart lines.
 * @returns Subtotal before delivery.
 */
export function get_cart_subtotal(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.unit_price * line.quantity, 0);
}

/**
 * Total piece count, not the number of distinct lines.
 *
 * @param lines - Cart lines.
 * @returns Quantity sum.
 */
export function get_cart_count(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

/**
 * Adds a product or increases an existing variant, never above stock.
 *
 * @param lines - Current cart lines.
 * @param input - Product, quantity, and variant.
 * @returns The next cart and a shopper-facing message.
 */
export function add_cart_line(lines: readonly CartLine[], input: AddCartItemInput): CartMutationResult {
  const { product, size, colour } = input;
  const quantity = input.quantity;
  const unchanged = [...lines];

  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, message: 'Enter a whole quantity of at least 1.', lines: unchanged };
  }
  if (product.stock_status === 'out_of_stock' || product.stock_quantity < 1) {
    return { ok: false, message: `${product.name} is sold out.`, lines: unchanged };
  }
  if (product.sizes.length > 0 && !product.sizes.includes(size)) {
    return { ok: false, message: 'Select a size.', lines: unchanged };
  }
  if (product.colours.length > 0 && !product.colours.some((item) => item.name === colour)) {
    return { ok: false, message: 'Select a colour.', lines: unchanged };
  }

  const line_id = build_line_id(product.id, size, colour);
  const existing = lines.find((line) => line.line_id === line_id);
  const next_quantity = (existing?.quantity ?? 0) + quantity;
  if (next_quantity > product.stock_quantity) {
    const remaining = product.stock_quantity - (existing?.quantity ?? 0);
    const message = remaining > 0
      ? `Only ${remaining} more can be added. ${product.stock_quantity} are available.`
      : `Only ${product.stock_quantity} available for this selection.`;
    return { ok: false, message, lines: unchanged };
  }

  const next_line: CartLine = {
    line_id,
    product_id: product.id,
    slug: product.slug,
    name: product.name,
    image_url: product.image_urls[0] ?? '',
    image_alt: product.image_alts[0] ?? product.name,
    unit_price: get_unit_price(product),
    size,
    colour,
    quantity: next_quantity,
    max_quantity: product.stock_quantity,
  };
  const next_lines = existing
    ? lines.map((line) => (line.line_id === line_id ? next_line : line))
    : [...lines, next_line];
  const variant = [size, colour].filter(Boolean).join(' / ');
  const variant_note = variant ? ` (${variant})` : '';
  return { ok: true, message: `Added ${product.name}${variant_note} to cart.`, lines: next_lines };
}

/**
 * Updates a line quantity. Values above stock are clamped and reported.
 *
 * @param lines - Current cart lines.
 * @param line_id - Line to change.
 * @param quantity - Requested quantity.
 * @returns The next cart and a shopper-facing message.
 */
export function update_cart_quantity(
  lines: readonly CartLine[],
  line_id: string,
  quantity: number,
): CartMutationResult {
  const line = lines.find((item) => item.line_id === line_id);
  if (!line) {
    return { ok: false, message: 'That item is no longer in the cart.', lines: [...lines] };
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, message: 'Quantity must be at least 1.', lines: [...lines] };
  }
  if (quantity > line.max_quantity) {
    return {
      ok: false,
      message: `Only ${line.max_quantity} available.`,
      lines: lines.map((item) => (item.line_id === line_id ? { ...item, quantity: item.max_quantity } : item)),
    };
  }
  return {
    ok: true,
    message: 'Quantity updated.',
    lines: lines.map((item) => (item.line_id === line_id ? { ...item, quantity } : item)),
  };
}

/**
 * Removes one cart line.
 *
 * @param lines - Current cart lines.
 * @param line_id - Line to remove.
 * @returns The remaining lines.
 */
export function remove_cart_line(lines: readonly CartLine[], line_id: string): CartLine[] {
  return lines.filter((line) => line.line_id !== line_id);
}

/**
 * Drops missing products and clamps quantities to current stock and prices.
 *
 * @param lines - Stored cart lines.
 * @param source - Current catalogue.
 * @returns Cart lines that can still be purchased.
 */
export function reconcile_cart_lines(lines: readonly CartLine[], source: readonly Product[]): CartLine[] {
  const next: CartLine[] = [];
  lines.forEach((line) => {
    const product = source.find((item) => item.id === line.product_id);
    if (!product || product.stock_quantity < 1 || product.stock_status === 'out_of_stock') {
      return;
    }
    const quantity = Math.min(line.quantity, product.stock_quantity);
    if (quantity < 1) {
      return;
    }
    next.push({
      ...line,
      name: product.name,
      slug: product.slug,
      image_url: product.image_urls[0] ?? line.image_url,
      image_alt: product.image_alts[0] ?? product.name,
      unit_price: get_unit_price(product),
      max_quantity: product.stock_quantity,
      quantity,
    });
  });
  return next;
}

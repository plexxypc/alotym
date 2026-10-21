import type { Product } from './catalog.ts';

/**
 * One persisted cart row.
 * `unit_price` is the naira amount charged for a single piece.
 */
export type CartLine = {
  line_id: string;
  product_id: string;
  slug: string;
  name: string;
  image_url: string;
  image_alt: string;
  unit_price: number;
  size: string;
  colour: string;
  quantity: number;
  max_quantity: number;
};

/** Input required to add a catalogue product to the cart. */
export type AddCartItemInput = {
  product: Product;
  quantity: number;
  size: string;
  colour: string;
};

/** Result of a pure cart change, including the next line list. */
export type CartMutationResult = {
  ok: boolean;
  message: string;
  lines: CartLine[];
};

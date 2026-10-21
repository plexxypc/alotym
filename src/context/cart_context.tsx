import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { products } from '../data/products.ts';
import {
  add_cart_line,
  get_cart_count,
  get_cart_subtotal,
  reconcile_cart_lines,
  remove_cart_line,
  update_cart_quantity,
} from '../lib/cart_math.ts';
import { read_stored_cart, write_stored_cart } from '../lib/cart_storage.ts';
import type { AddCartItemInput, CartLine } from '../types/cart.ts';

/** Result returned to buttons after a cart change. */
export type CartActionResult = {
  ok: boolean;
  message: string;
};

/** Cart state and actions available through `use_cart`. */
export type CartContextValue = {
  lines: CartLine[];
  item_count: number;
  subtotal: number;
  notice: string;
  is_drawer_open: boolean;
  is_hydrated: boolean;
  add_item: (input: AddCartItemInput) => CartActionResult;
  update_quantity: (line_id: string, quantity: number) => CartActionResult;
  remove_item: (line_id: string) => void;
  clear_cart: () => void;
  open_drawer: () => void;
  close_drawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Provides the cart, localStorage persistence, and the cart drawer flag.
 *
 * @param props - React children that can call `use_cart`.
 * @returns The provider element.
 */
export function CartProvider(props: { children: ReactNode }): ReactElement {
  const [lines, set_lines] = useState<CartLine[]>([]);
  const [notice, set_notice] = useState('');
  const [is_drawer_open, set_is_drawer_open] = useState(false);
  const [is_hydrated, set_is_hydrated] = useState(false);
  const lines_ref = useRef<CartLine[]>([]);
  lines_ref.current = lines;

  useEffect(() => {
    const stored = reconcile_cart_lines(read_stored_cart(), products);
    set_lines(stored);
    set_is_hydrated(true);
  }, []);

  useEffect(() => {
    if (!is_hydrated) {
      return;
    }
    write_stored_cart(lines);
  }, [lines, is_hydrated]);

  const add_item = useCallback((input: AddCartItemInput): CartActionResult => {
    const next = add_cart_line(lines_ref.current, input);
    lines_ref.current = next.lines;
    set_lines(next.lines);
    set_notice(next.message);
    if (next.ok) {
      set_is_drawer_open(true);
    }
    return { ok: next.ok, message: next.message };
  }, []);

  const update_quantity = useCallback((line_id: string, quantity: number): CartActionResult => {
    const next = update_cart_quantity(lines_ref.current, line_id, quantity);
    lines_ref.current = next.lines;
    set_lines(next.lines);
    set_notice(next.message);
    return { ok: next.ok, message: next.message };
  }, []);

  const remove_item = useCallback((line_id: string): void => {
    const next_lines = remove_cart_line(lines_ref.current, line_id);
    lines_ref.current = next_lines;
    set_lines(next_lines);
    set_notice('Item removed from cart.');
  }, []);

  const clear_cart = useCallback((): void => {
    lines_ref.current = [];
    set_lines([]);
  }, []);

  const open_drawer = useCallback((): void => {
    set_is_drawer_open(true);
  }, []);

  const close_drawer = useCallback((): void => {
    set_is_drawer_open(false);
  }, []);

  const value = useMemo<CartContextValue>(() => ({
    lines,
    item_count: get_cart_count(lines),
    subtotal: get_cart_subtotal(lines),
    notice,
    is_drawer_open,
    is_hydrated,
    add_item,
    update_quantity,
    remove_item,
    clear_cart,
    open_drawer,
    close_drawer,
  }), [
    lines,
    notice,
    is_drawer_open,
    is_hydrated,
    add_item,
    update_quantity,
    remove_item,
    clear_cart,
    open_drawer,
    close_drawer,
  ]);

  return <CartContext.Provider value={value}>{props.children}</CartContext.Provider>;
}

/**
 * Reads the cart context.
 *
 * @returns Cart state and actions.
 */
export function use_cart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error('use_cart must be used within CartProvider');
  }
  return value;
}

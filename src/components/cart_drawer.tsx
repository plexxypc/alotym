import { useRef } from 'react';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { CartSummary } from './cart_summary.tsx';
import { use_cart } from '../context/cart_context.tsx';
import { use_dialog_effects } from '../hooks/use_dialog_effects.ts';
import { format_money } from '../lib/format_money.ts';

/**
 * Slide-in cart. Empty carts explain how to start shopping.
 *
 * @returns The drawer when open, otherwise null.
 */
export function CartDrawer(): ReactElement | null {
  const { lines, subtotal, is_drawer_open, close_drawer } = use_cart();
  const close_ref = useRef<HTMLButtonElement>(null);
  use_dialog_effects(is_drawer_open, close_drawer, close_ref);

  if (!is_drawer_open) {
    return null;
  }

  return (
    <div className="vx_drawer" role="presentation">
      <button className="vx_backdrop" type="button" aria-label="Close cart" onClick={close_drawer} />
      <aside
        className="vx_drawer_panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <header className="vx_drawer_head">
          <h2 id="cart-drawer-title">Cart</h2>
          <button ref={close_ref} type="button" className="vx_icon_button" onClick={close_drawer} aria-label="Close cart">
            <X size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </header>
        {lines.length === 0 ? (
          <div className="vx_empty">
            <p>Your cart is empty.</p>
            <Link className="vx_btn" to="/shop" onClick={close_drawer}>Shop the edit</Link>
          </div>
        ) : (
          <>
            <CartSummary lines={lines} subtotal={subtotal} show_controls />
            <div className="vx_drawer_foot">
              <p>Subtotal {format_money(subtotal)}</p>
              <Link className="vx_btn vx_btn_full" to="/cart" onClick={close_drawer}>Review cart</Link>
              <Link className="vx_btn vx_btn_secondary vx_btn_full" to="/checkout" onClick={close_drawer}>Checkout</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

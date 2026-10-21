import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { CartSummary } from '../components/cart_summary.tsx';
import { Seo } from '../components/seo.tsx';
import { use_cart } from '../context/cart_context.tsx';
import { page_title } from '../lib/page_meta.ts';
import { store } from '../config/store.ts';

/**
 * Full cart page with quantity edits, removal, and an empty state.
 *
 * @returns The cart page.
 */
export function CartPage(): ReactElement {
  const { lines, subtotal } = use_cart();
  return (
    <>
      <Seo
        title={page_title('Cart')}
        description={`Review your ${store.store_name} cart before checkout.`}
        path="/cart"
      />
      <section className="vx_shell vx_page_block">
        <header className="vx_page_header">
          <p className="vx_kicker">Cart</p>
          <h1>Your selection</h1>
        </header>
        {lines.length === 0 ? (
          <div className="vx_empty">
            <h2>The cart is empty</h2>
            <p>Add a piece from the shop. Your cart stays in this browser.</p>
            <Link className="vx_btn" to="/shop">Shop the edit</Link>
          </div>
        ) : (
          <>
            <CartSummary lines={lines} subtotal={subtotal} show_controls />
            <p className="vx_fine">Delivery is added at checkout. Nothing is charged on this page.</p>
            <Link className="vx_btn" to="/checkout">Continue to checkout</Link>
          </>
        )}
      </section>
    </>
  );
}

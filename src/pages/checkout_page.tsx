import type { ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartSummary } from '../components/cart_summary.tsx';
import { CheckoutForm } from '../components/checkout_form.tsx';
import { Seo } from '../components/seo.tsx';
import { store } from '../config/store.ts';
import { use_cart } from '../context/cart_context.tsx';
import { get_delivery_option, get_order_total } from '../lib/delivery.ts';
import { create_order_reference, write_last_order } from '../lib/order_storage.ts';
import { page_title } from '../lib/page_meta.ts';
import { is_whatsapp_ready } from '../lib/contact_channels.ts';
import { build_order_whatsapp_message, build_whatsapp_url } from '../lib/whatsapp.ts';
import type { CheckoutPayload, DemoOrder } from '../types/order.ts';

/**
 * Checkout collects a demo order request and stores it for the confirmation page.
 *
 * @returns The checkout page.
 */
export function CheckoutPage(): ReactElement {
  const navigate = useNavigate();
  const { lines, subtotal, clear_cart } = use_cart();

  function handle_submit(payload: CheckoutPayload): void {
    const delivery = get_delivery_option(payload.delivery_method_id);
    if (!delivery || lines.length === 0) {
      return;
    }
    const delivery_cost = delivery.cost;
    const draft: DemoOrder = {
      reference: create_order_reference(),
      created_at: new Date().toISOString(),
      status: 'demo_request',
      customer_name: payload.customer_name,
      phone: payload.phone,
      email: payload.email,
      delivery_address: payload.delivery_address,
      delivery_method_id: delivery.id,
      delivery_method_label: delivery.label,
      delivery_cost,
      fulfilment_method: payload.fulfilment_method,
      lines: lines.map((line) => ({ ...line })),
      subtotal,
      total: get_order_total(subtotal, delivery_cost),
      whatsapp_url: '',
    };
    if (payload.fulfilment_method === 'whatsapp' && is_whatsapp_ready()) {
      const message = build_order_whatsapp_message(draft, store.store_name);
      draft.whatsapp_url = build_whatsapp_url(store.contact.whatsapp_number, message);
    }
    write_last_order(draft);
    clear_cart();
    navigate('/order-success');
  }

  return (
    <>
      <Seo
        title={page_title('Checkout')}
        description={`Demo checkout for ${store.store_name}. Online payment is not enabled.`}
        path="/checkout"
      />
      <section className="vx_shell vx_page_block">
        <header className="vx_page_header">
          <p className="vx_kicker">Checkout</p>
          <h1>Delivery details</h1>
        </header>
        {lines.length === 0 ? (
          <div className="vx_empty">
            <h2>Nothing to check out</h2>
            <p>Add a piece before requesting an order.</p>
            <Link className="vx_btn" to="/shop">Shop the edit</Link>
          </div>
        ) : (
          <div className="vx_checkout_grid">
            <CheckoutForm on_submit={handle_submit} />
            <aside aria-label="Order summary">
              <h2>Order summary</h2>
              <CartSummary lines={lines} subtotal={subtotal} />
            </aside>
          </div>
        )}
      </section>
    </>
  );
}

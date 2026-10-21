import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/seo.tsx';
import { store } from '../config/store.ts';
import { format_money } from '../lib/format_money.ts';
import { read_last_order } from '../lib/order_storage.ts';
import { page_title } from '../lib/page_meta.ts';

/**
 * Confirmation for a demo order request. Direct visits without checkout see a gate, not a fake receipt.
 *
 * @returns The order success page.
 */
export function OrderSuccessPage(): ReactElement {
  const order = read_last_order();

  if (!order) {
    return (
      <section className="vx_shell vx_not_found">
        <Seo
          title={page_title('Order request')}
          description="A demo order request appears here only after checkout."
          path="/order-success"
        />
        <p className="vx_kicker">Order request</p>
        <h1>No demo order in this session</h1>
        <p>This page opens after a valid checkout submission. It does not confirm a payment.</p>
        <Link className="vx_btn" to="/cart">Return to cart</Link>
      </section>
    );
  }

  return (
    <section className="vx_shell vx_page_block vx_success">
      <Seo
        title={page_title('Demo order request')}
        description="This is a demo order request, not a paid order."
        path="/order-success"
      />
      <p className="vx_demo_banner">Demo order request — not a paid order. No payment was taken.</p>
      <header className="vx_page_header">
        <p className="vx_kicker">Request received</p>
        <h1>{order.reference}</h1>
        <p className="vx_lede">
          {order.customer_name}, this request is stored in this browser tab only. {store.store_name} has not charged you.
        </p>
      </header>
      <dl className="vx_totals">
        <div>
          <dt>Subtotal</dt>
          <dd>{format_money(order.subtotal)}</dd>
        </div>
        <div>
          <dt>{order.delivery_method_label}</dt>
          <dd>{format_money(order.delivery_cost)}</dd>
        </div>
        <div className="vx_total_due">
          <dt>Requested total</dt>
          <dd>{format_money(order.total)}</dd>
        </div>
      </dl>
      <ul className="vx_success_lines">
        {order.lines.map((line) => (
          <li key={line.line_id}>
            {line.name}
            {[line.size, line.colour].filter(Boolean).length > 0
              ? ` (${[line.size, line.colour].filter(Boolean).join(' / ')})`
              : ''}
            {' '}× {line.quantity}
          </li>
        ))}
      </ul>
      <p>Deliver to {order.delivery_address}</p>
      {order.fulfilment_method === 'whatsapp' && order.whatsapp_url ? (
        <p>
          <a className="vx_btn" href={order.whatsapp_url} target="_blank" rel="noreferrer">
            Open WhatsApp summary
          </a>
        </p>
      ) : null}
      {order.fulfilment_method === 'whatsapp' && !order.whatsapp_url ? (
        <p>The official WhatsApp number has not been added, so a chat link was not created. This request is still only a demonstration in this browser tab.</p>
      ) : null}
      {order.fulfilment_method === 'bank_transfer' ? (
        <div className="vx_bank_box">
          <h2>Bank transfer instructions</h2>
          <p>{store.payment.bank_transfer.bank_name}</p>
          <p>{store.payment.bank_transfer.account_name}</p>
          <p>Account number {store.payment.bank_transfer.account_number}</p>
          <p>Use {order.reference} as the narration.</p>
          <p>{store.payment.bank_transfer.instructions}</p>
        </div>
      ) : null}
      <Link className="vx_text_link" to="/shop">Continue browsing</Link>
    </section>
  );
}

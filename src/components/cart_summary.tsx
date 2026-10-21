import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { QuantitySelector } from './quantity_selector.tsx';
import { use_cart } from '../context/cart_context.tsx';
import { format_money } from '../lib/format_money.ts';
import type { CartLine } from '../types/cart.ts';

/** Props for the shared cart summary. */
export type CartSummaryProps = {
  lines: CartLine[];
  subtotal: number;
  delivery_cost?: number;
  delivery_label?: string;
  show_controls?: boolean;
};

/**
 * Line list with subtotal and optional delivery. Controls edit the live cart.
 *
 * @param props - Lines, totals, and whether quantity controls are shown.
 * @returns The summary.
 */
export function CartSummary(props: CartSummaryProps): ReactElement {
  const { update_quantity, remove_item } = use_cart();
  const delivery_cost = props.delivery_cost ?? 0;
  const show_delivery = props.delivery_label !== undefined;
  const total = props.subtotal + (show_delivery ? delivery_cost : 0);

  return (
    <div className="vx_summary">
      <ul className="vx_cart_lines">
        {props.lines.map((line) => {
          const variant = [line.size, line.colour].filter(Boolean).join(' / ');
          return (
            <li key={line.line_id} className="vx_cart_line">
              <Link to={`/product/${line.slug}`}>
                <img src={line.image_url} alt={line.image_alt} width={120} height={150} loading="lazy" />
              </Link>
              <div className="vx_cart_copy">
                <h3><Link to={`/product/${line.slug}`}>{line.name}</Link></h3>
                {variant ? <p>{variant}</p> : null}
                <p>{format_money(line.unit_price)}</p>
                {props.show_controls ? (
                  <QuantitySelector
                    input_id={`qty-${line.line_id}`}
                    quantity={line.quantity}
                    max={line.max_quantity}
                    on_change={(next_quantity) => update_quantity(line.line_id, next_quantity)}
                  />
                ) : (
                  <p>Qty {line.quantity}</p>
                )}
                {props.show_controls ? (
                  <button type="button" className="vx_text_button" onClick={() => remove_item(line.line_id)}>
                    Remove
                  </button>
                ) : null}
              </div>
              <p className="vx_line_total">{format_money(line.unit_price * line.quantity)}</p>
            </li>
          );
        })}
      </ul>
      <dl className="vx_totals">
        <div>
          <dt>Subtotal</dt>
          <dd>{format_money(props.subtotal)}</dd>
        </div>
        {show_delivery ? (
          <div>
            <dt>{props.delivery_label}</dt>
            <dd>{format_money(delivery_cost)}</dd>
          </div>
        ) : null}
        {show_delivery ? (
          <div className="vx_total_due">
            <dt>Total</dt>
            <dd>{format_money(total)}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

import { useState } from 'react';
import type { ReactElement } from 'react';
import { use_cart } from '../context/cart_context.tsx';
import type { Product } from '../types/catalog.ts';

/** Props for adding a specific variant to the cart. */
export type AddToCartButtonProps = {
  product: Product;
  quantity: number;
  size: string;
  colour: string;
  label?: string;
  class_name?: string;
};

/**
 * Adds the chosen variant to the cart and shows the result beside the button.
 *
 * @param props - Product, quantity, and any required size or colour.
 * @returns The add-to-cart control and feedback.
 */
export function AddToCartButton(props: AddToCartButtonProps): ReactElement {
  const { add_item } = use_cart();
  const [feedback, set_feedback] = useState('');
  const sold_out = props.product.stock_status === 'out_of_stock' || props.product.stock_quantity < 1;
  const class_name = props.class_name ? `vx_btn ${props.class_name}` : 'vx_btn';

  function handle_add(): void {
    const result = add_item({
      product: props.product,
      quantity: props.quantity,
      size: props.size,
      colour: props.colour,
    });
    set_feedback(result.message);
  }

  return (
    <div className="vx_add_wrap">
      <button className={class_name} type="button" onClick={handle_add} disabled={sold_out}>
        {sold_out ? 'Sold out' : (props.label ?? 'Add to cart')}
      </button>
      {feedback ? <p className="vx_feedback">{feedback}</p> : null}
    </div>
  );
}

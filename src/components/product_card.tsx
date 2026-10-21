import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { AddToCartButton } from './add_to_cart_button.tsx';
import { format_product_price } from '../lib/format_money.ts';
import { is_bespoke_listing, label_category } from '../lib/catalog.ts';
import type { Product } from '../types/catalog.ts';

/** Props for a catalogue card. */
export type ProductCardProps = {
  product: Product;
};

/**
 * Product card with a fixed image ratio, price, and add-to-cart.
 * The first size and colour are used so the grid can add without a dead control.
 *
 * @param props - Product to display.
 * @returns The card.
 */
export function ProductCard(props: ProductCardProps): ReactElement {
  const product = props.product;
  const price = format_product_price(product);
  const on_sale = product.sale_price !== undefined && product.sale_price < product.price && product.listing_mode === 'ready';
  const bespoke = is_bespoke_listing(product);
  const image = product.image_urls[0];
  const hover_image = product.image_urls[1];
  const alt = product.image_alts[0] ?? product.name;
  const hover_alt = product.image_alts[1] ?? alt;

  return (
    <article className="vx_product_card">
      <Link className="vx_card_media" to={`/product/${product.slug}`}>
        {image ? (
          <img
            className="vx_card_image"
            src={image}
            alt={alt}
            width={800}
            height={1000}
            loading="lazy"
          />
        ) : null}
        {hover_image ? (
          <img
            className="vx_card_image vx_card_image_alt"
            src={hover_image}
            alt=""
            width={800}
            height={1000}
            loading="lazy"
          />
        ) : null}
        <span className="visually-hidden">{hover_image ? hover_alt : ''}</span>
        {bespoke ? <span className="vx_flag">Made to order</span> : null}
        {!bespoke && product.stock_status === 'out_of_stock' ? <span className="vx_flag">Sold out</span> : null}
        {on_sale && product.stock_status !== 'out_of_stock' ? <span className="vx_flag">Sale</span> : null}
      </Link>
      <div className="vx_card_body">
        <p className="vx_kicker">{label_category(product.category)}</p>
        <h3><Link to={`/product/${product.slug}`}>{product.name}</Link></h3>
        <p className="vx_price">
          <span>{price.label}</span>
          {price.is_demo ? <span className="al_demo_chip">Sample price</span> : null}
          {product.bestseller ? <span className="vx_chip">Bestseller</span> : null}
        </p>
        {bespoke ? (
          <Link className="vx_btn vx_btn_small" to={`/bespoke?design=${product.slug}`}>Customize</Link>
        ) : (
          <AddToCartButton
            product={product}
            quantity={1}
            size={product.sizes[0] ?? ''}
            colour={product.colours[0]?.name ?? ''}
            label={product.sizes.length > 1 || product.colours.length > 1 ? 'Add default option' : 'Add to cart'}
            class_name="vx_btn_small"
          />
        )}
      </div>
    </article>
  );
}

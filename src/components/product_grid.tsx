import type { ReactElement } from 'react';
import { ProductCard } from './product_card.tsx';
import type { Product } from '../types/catalog.ts';

/** Props for the responsive product grid. */
export type ProductGridProps = {
  products: Product[];
  empty_title?: string;
  empty_text?: string;
};

/**
 * Responsive product grid with an empty state.
 *
 * @param props - Products and optional empty copy.
 * @returns The grid or the empty state.
 */
export function ProductGrid(props: ProductGridProps): ReactElement {
  if (props.products.length === 0) {
    return (
      <div className="vx_empty">
        <h2>{props.empty_title ?? 'No designs match'}</h2>
        <p>{props.empty_text ?? 'Try another category, or clear the search.'}</p>
      </div>
    );
  }

  return (
    <div className="row g-4 g-xl-5 vx_product_grid">
      {props.products.map((product) => (
        <div className="col-6 col-lg-4 col-xl-3" key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

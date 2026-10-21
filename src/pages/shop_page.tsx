import type { ReactElement } from 'react';
import { CatalogView } from '../components/catalog_view.tsx';
import { store } from '../config/store.ts';

/**
 * Full product catalogue with search, category, and sort.
 *
 * @returns The shop page.
 */
export function ShopPage(): ReactElement {
  return (
    <CatalogView
      title="Shop all designs"
      lede={`${store.tagline} ${store.pricing.demo_label}`}
      path="/shop"
    />
  );
}

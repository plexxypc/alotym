import { store } from '../config/store.ts';
import type { Product } from '../types/catalog.ts';
import { get_unit_price } from './catalog.ts';
import { absolute_url } from './page_meta.ts';

/**
 * Product JSON-LD for the detail page.
 *
 * @param product - Product being viewed.
 * @returns A schema.org Product object.
 */
export function build_product_json_ld(product: Product): Record<string, unknown> {
  const in_stock = product.stock_status !== 'out_of_stock';
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.id,
    image: product.image_urls,
    brand: {
      '@type': 'Brand',
      name: store.store_name,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: store.currency.code,
      price: get_unit_price(product),
      description: product.listing_mode === 'bespoke'
        ? 'Starting price for a bespoke enquiry. Not a confirmed quote or a completed purchase.'
        : undefined,
      availability: product.listing_mode === 'bespoke'
        ? undefined
        : in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: absolute_url(`/product/${product.slug}`),
    },
  };
}

/**
 * Store JSON-LD for the homepage.
 *
 * @returns A schema.org ClothingStore object.
 */
export function build_store_json_ld(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: store.store_name,
    description: store.seo.default_description,
    url: absolute_url('/'),
    image: store.seo.og_image,
    email: store.contact.email || undefined,
    telephone: store.contact.phone_tel || undefined,
    slogan: store.tagline,
  };
}

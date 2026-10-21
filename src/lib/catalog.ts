import { get_collection_by_slug } from '../data/collections.ts';
import { products } from '../data/products.ts';
import type { Product } from '../types/catalog.ts';

/** Sort modes supported by the catalogue. */
export type SortKey = 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'bestseller';

/** Filters applied to the product list. */
export type CatalogQuery = {
  search?: string;
  category?: string;
  collection_slug?: string;
  sort?: SortKey;
};

const category_labels: Record<string, string> = {
  occasion: 'Occasion',
  evening: 'Evening',
  daywear: 'Daywear',
  ceremony: 'Ceremony',
  tops: 'Tops',
  bottoms: 'Bottoms',
  outerwear: 'Outerwear',
  footwear: 'Footwear',
  accessories: 'Accessories',
};

/**
 * Returns the price a shopper pays, preferring an active sale price.
 *
 * @param product - Catalogue product.
 * @returns Unit price in whole naira.
 */
export function get_unit_price(product: Product): number {
  if (product.sale_price !== undefined && product.sale_price >= 0 && product.sale_price < product.price) {
    return product.sale_price;
  }
  return product.price;
}

/**
 * Human label for a category slug.
 *
 * @param category - Category slug stored on the product.
 * @returns A display label.
 */
export function label_category(category: string): string {
  return category_labels[category] ?? category.replaceAll('-', ' ');
}

/**
 * Type guard for catalogue sort keys coming from the URL.
 *
 * @param value - Raw query value.
 * @returns True when the value is a supported sort.
 */
export function is_sort_key(value: string | null): value is SortKey {
  return value === 'featured'
    || value === 'newest'
    || value === 'price_asc'
    || value === 'price_desc'
    || value === 'bestseller';
}

/**
 * Distinct categories present in a product list, in first-seen order.
 *
 * @param source - Products to inspect.
 * @returns Category slugs.
 */
export function list_categories(source: readonly Product[]): string[] {
  return [...new Set(source.map((product) => product.category))];
}

/**
 * Filters and sorts products. Search matches name, description, category, and collection.
 *
 * @param source - Products to search.
 * @param query - Active filters.
 * @returns A new sorted array.
 */
export function filter_products(source: readonly Product[], query: CatalogQuery): Product[] {
  const search = query.search?.trim().toLowerCase() ?? '';
  const category = query.category?.trim().toLowerCase() ?? '';
  const collection_slug = query.collection_slug?.trim().toLowerCase() ?? '';
  const sort = query.sort && is_sort_key(query.sort) ? query.sort : 'featured';

  const filtered = source.filter((product) => {
    if (category && product.category !== category) {
      return false;
    }
    if (collection_slug && product.collection_slug !== collection_slug) {
      return false;
    }
    if (!search) {
      return true;
    }
    const collection_name = get_collection_by_slug(product.collection_slug)?.name ?? '';
    const haystack = [
      product.name,
      product.description,
      product.full_description,
      product.category,
      product.style_attributes.join(' '),
      collection_name,
    ].join(' ').toLowerCase();
    return haystack.includes(search);
  });

  const sorted = [...filtered];
  sorted.sort((left, right) => compare_products(left, right, sort));
  return sorted;
}

/**
 * Compare two products for a sort mode.
 *
 * @param left - First product.
 * @param right - Second product.
 * @param sort - Active sort key.
 * @returns A numeric sort comparison.
 */
function compare_products(left: Product, right: Product, sort: SortKey): number {
  if (sort === 'price_asc') {
    return get_unit_price(left) - get_unit_price(right);
  }
  if (sort === 'price_desc') {
    return get_unit_price(right) - get_unit_price(left);
  }
  if (sort === 'newest') {
    return right.created_at.localeCompare(left.created_at);
  }
  if (sort === 'bestseller') {
    return Number(right.bestseller) - Number(left.bestseller) || right.created_at.localeCompare(left.created_at);
  }
  return Number(right.featured) - Number(left.featured) || right.created_at.localeCompare(left.created_at);
}

/**
 * Featured in-stock products for the homepage.
 *
 * @param limit - Maximum number of products.
 * @returns Featured products.
 */
export function get_featured_products(limit = 4): Product[] {
  return products.filter((product) => product.featured && product.stock_status !== 'out_of_stock').slice(0, limit);
}

/**
 * Newest products that are not already in the featured homepage set.
 *
 * @param limit - Maximum number of products.
 * @returns New arrival products.
 */
export function get_new_arrivals(limit = 4): Product[] {
  const featured_ids = new Set(get_featured_products().map((product) => product.id));
  return [...products]
    .filter((product) => !featured_ids.has(product.id) && product.stock_status !== 'out_of_stock')
    .sort((left, right) => right.created_at.localeCompare(left.created_at))
    .slice(0, limit);
}

/**
 * Related products from the same collection, then the same category.
 *
 * @param product - Current product.
 * @param limit - Maximum number of related products.
 * @returns Related products, excluding the current one.
 */
export function get_related_products(product: Product, limit = 4): Product[] {
  const same_collection = products.filter((item) => {
    return item.id !== product.id && item.collection_slug === product.collection_slug;
  });
  const same_category = products.filter((item) => {
    return item.id !== product.id
      && item.category === product.category
      && item.collection_slug !== product.collection_slug;
  });
  return [...same_collection, ...same_category].slice(0, limit);
}

/**
 * Readable stock label for a product detail page.
 *
 * @param product - Catalogue product.
 * @returns Short stock copy.
 */
export function stock_label(product: Product): string {
  if (product.listing_mode === 'bespoke') {
    return 'Made to order — enquiry only';
  }
  if (product.stock_status === 'out_of_stock') {
    return 'Sold out';
  }
  if (product.stock_status === 'low_stock') {
    return `Only ${product.stock_quantity} left`;
  }
  return 'In stock';
}

/**
 * True when the design should open the bespoke enquiry instead of the cart.
 *
 * @param product - Catalogue design.
 * @returns Whether the listing is bespoke.
 */
export function is_bespoke_listing(product: Product): boolean {
  return product.listing_mode === 'bespoke';
}

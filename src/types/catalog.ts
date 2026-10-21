/**
 * Catalogue types shared by data files and the storefront UI.
 */

/** Saleable colour choice for a product. */
export type ProductColour = {
  name: string;
  hex: string;
};

/** Stock state derived from the available quantity. */
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

/**
 * How a design is purchased.
 * `bespoke` opens the custom-order enquiry. `ready` can use the cart.
 */
export type ListingMode = 'bespoke' | 'ready';

/**
 * A storefront product or bespoke design.
 * Prices are whole currency units, not minor units. For bespoke designs, `price` is a starting price.
 */
export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  full_description: string;
  price: number;
  sale_price?: number;
  price_note: string;
  category: string;
  collection_slug: string;
  image_urls: string[];
  image_alts: string[];
  sizes: string[];
  colours: ProductColour[];
  fabrics: string[];
  style_attributes: string[];
  customization_options: string[];
  production_timeframe: string;
  listing_mode: ListingMode;
  is_demo_price: boolean;
  seo_title: string;
  seo_description: string;
  stock_quantity: number;
  stock_status: StockStatus;
  featured: boolean;
  bestseller: boolean;
  created_at: string;
};

/** Editorial collection used by listing pages and the homepage. */
export type Collection = {
  slug: string;
  name: string;
  description: string;
  image_url: string;
  image_alt: string;
  featured: boolean;
};

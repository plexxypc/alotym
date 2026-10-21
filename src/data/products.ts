import type { Product, ProductColour } from '../types/catalog.ts';
import { brand_photos } from './image.ts';

const gold: ProductColour = { name: 'Gold', hex: '#946c2a' };
const black: ProductColour = { name: 'Black', hex: '#1c1410' };
const white: ProductColour = { name: 'White', hex: '#f4f1ec' };
const indigo: ProductColour = { name: 'Indigo', hex: '#243456' };
const cobalt: ProductColour = { name: 'Cobalt', hex: '#1f4fd0' };
const lemon: ProductColour = { name: 'Lemon', hex: '#efe6a0' };
const coral: ProductColour = { name: 'Coral', hex: '#e9897a' };
const orange: ProductColour = { name: 'Orange', hex: '#e24a12' };

const price_note = 'Sample starting price. Alotym confirms the final quote before an order is accepted.';

/**
 * Builds one bespoke demo design. Prices are sample figures, not Alotym quotes.
 *
 * @param product - Design fields.
 * @returns A catalogue product in enquiry mode.
 */
function bespoke_design(product: Product): Product {
  return product;
}

/**
 * Catalogue for Alotym.
 * Replace names, prices, and image URLs in this file. Prices are whole naira starting points.
 */
export const products: Product[] = [
  bespoke_design({
    id: 'aly-solenne',
    slug: 'solenne-print-dress',
    name: 'Solenne Print Dress',
    description: 'A short-sleeve collared mini in a blue, gold, and white leaf print.',
    full_description: 'Solenne is a fitted shirt-dress mini in a botanical print. Length, sleeves, neckline, and cloth can be discussed. The starting price is sample data.',
    price: 185000,
    price_note,
    category: 'occasion',
    collection_slug: 'signature-prints',
    image_urls: [
      brand_photos.leaf_dress,
      brand_photos.shirt_dress,
    ],
    image_alts: [
      'Woman in a blue, gold, and white leaf-print shirt dress',
      'Woman in a black shirt dress with gold and white motifs',
    ],
    sizes: [],
    colours: [indigo, gold, white],
    fabrics: ['Printed shirting (sample)'],
    style_attributes: ['Collared mini', 'Short sleeve', 'Botanical print'],
    customization_options: ['Length', 'Sleeve', 'Neckline', 'Fabric substitution, if Alotym confirms it'],
    production_timeframe: '',
    listing_mode: 'bespoke',
    is_demo_price: true,
    seo_title: 'Solenne Print Dress',
    seo_description: 'Sample Alotym shirt dress in a blue, gold, and white leaf print. The starting price is a demonstration figure.',
    stock_quantity: 1,
    stock_status: 'in_stock',
    featured: true,
    bestseller: true,
    created_at: '2026-03-02',
  }),
  bespoke_design({
    id: 'aly-motif',
    slug: 'motif-shirt-dress',
    name: 'Motif Shirt Dress',
    description: 'A black shirt dress patterned with gold and white motifs.',
    full_description: 'Motif Shirt Dress is a collared mini with a close fit and a geometric print. Length, sleeve, and cloth can change. The price is not a quote.',
    price: 165000,
    price_note,
    category: 'daywear',
    collection_slug: 'day-dresses',
    image_urls: [
      brand_photos.shirt_dress,
      brand_photos.wide_tunic,
    ],
    image_alts: [
      'Woman in a black shirt dress with gold and white motifs',
      'Woman in a charcoal tunic with wide printed sleeves',
    ],
    sizes: [],
    colours: [black, gold, white],
    fabrics: ['Printed shirting (sample)'],
    style_attributes: ['Collared', 'Short sleeve', 'Geometric print'],
    customization_options: ['Length', 'Sleeve', 'Neckline', 'Colour'],
    production_timeframe: '',
    listing_mode: 'bespoke',
    is_demo_price: true,
    seo_title: 'Motif Shirt Dress',
    seo_description: 'Sample black shirt dress with gold and white motifs. The listed figure is a demonstration starting price.',
    stock_quantity: 1,
    stock_status: 'in_stock',
    featured: true,
    bestseller: false,
    created_at: '2026-03-18',
  }),
  bespoke_design({
    id: 'aly-fuchsia',
    slug: 'azure-midi-dress',
    name: 'Azure Midi Dress',
    description: 'A royal blue midi with a gathered bodice and a full skirt.',
    full_description: 'Azure Midi Dress is a fitted blue midi with short sleeves and a full skirt. Length, sleeve, neckline, and cloth can be discussed. The starting price is sample data.',
    price: 210000,
    price_note,
    category: 'evening',
    collection_slug: 'evening',
    image_urls: [
      brand_photos.blue_dress,
      brand_photos.leaf_dress,
    ],
    image_alts: [
      'Woman in a royal blue midi dress with a gathered bodice and full skirt',
      'Woman in a blue, gold, and white leaf-print shirt dress',
    ],
    sizes: [],
    colours: [cobalt, white],
    fabrics: ['Fluid dress cloth (sample)'],
    style_attributes: ['Gathered bodice', 'Short sleeve', 'Full skirt'],
    customization_options: ['Length', 'Neckline', 'Sleeve', 'Colour'],
    production_timeframe: '',
    listing_mode: 'bespoke',
    is_demo_price: true,
    seo_title: 'Azure Midi Dress',
    seo_description: 'Sample royal blue midi dress with a gathered bodice and full skirt. The starting price is demonstration data.',
    stock_quantity: 1,
    stock_status: 'in_stock',
    featured: true,
    bestseller: false,
    created_at: '2026-02-11',
  }),
  bespoke_design({
    id: 'aly-drift',
    slug: 'drift-day-tunic',
    name: 'Drift Day Tunic',
    description: 'A coral dress with a square neck, short sleeves, and an asymmetric hem.',
    full_description: 'Drift Day Tunic is a coral dress with a fitted bodice and a dipped hem. Length, sleeve, and cloth can change. The price is not a quote.',
    price: 145000,
    price_note,
    category: 'daywear',
    collection_slug: 'day-dresses',
    image_urls: [
      brand_photos.coral_dress,
    ],
    image_alts: [
      'Woman in a coral square-neck dress with short sleeves and an asymmetric hem',
    ],
    sizes: [],
    colours: [coral],
    fabrics: ['Woven dress cloth (sample)'],
    style_attributes: ['Square neck', 'Short sleeve', 'Asymmetric hem'],
    customization_options: ['Length', 'Sleeve', 'Neckline', 'Hem'],
    production_timeframe: '',
    listing_mode: 'bespoke',
    is_demo_price: true,
    seo_title: 'Drift Day Tunic',
    seo_description: 'Sample coral dress with a square neck and an asymmetric hem. The listed price is a demonstration starting point.',
    stock_quantity: 1,
    stock_status: 'in_stock',
    featured: false,
    bestseller: false,
    created_at: '2026-04-04',
  }),
  bespoke_design({
    id: 'aly-canopy',
    slug: 'canopy-ceremony-gown',
    name: 'Canopy Ceremony Gown',
    description: 'A lemon dress with a boat neck, short sleeves, and an asymmetric hem.',
    full_description: 'Canopy Ceremony Gown is a lemon dress with a fitted bodice and a dipped hem. Neckline, sleeves, length, and cloth can be discussed. The starting price is sample data.',
    price: 230000,
    price_note,
    category: 'ceremony',
    collection_slug: 'ceremony',
    image_urls: [
      brand_photos.lemon_dress,
    ],
    image_alts: [
      'Woman in a lemon boat-neck dress with short sleeves and an asymmetric hem',
    ],
    sizes: [],
    colours: [lemon],
    fabrics: ['Woven dress cloth (sample)'],
    style_attributes: ['Boat neck', 'Short sleeve', 'Asymmetric hem'],
    customization_options: ['Length', 'Neckline', 'Sleeve', 'Hem'],
    production_timeframe: '',
    listing_mode: 'bespoke',
    is_demo_price: true,
    seo_title: 'Canopy Ceremony Gown',
    seo_description: 'Sample lemon dress with a boat neck and an asymmetric hem. The starting price is demonstration data.',
    stock_quantity: 1,
    stock_status: 'in_stock',
    featured: true,
    bestseller: true,
    created_at: '2026-01-20',
  }),
  bespoke_design({
    id: 'aly-kente',
    slug: 'kente-day-dress',
    name: 'Kente Day Dress',
    description: 'An orange and black halter dress with a full black-and-white printed skirt.',
    full_description: 'Kente Day Dress is a halter shape with a ruched printed bodice and a full geometric skirt. Length, neckline, and cloth can change. The price is not a quote.',
    price: 175000,
    price_note,
    category: 'daywear',
    collection_slug: 'signature-prints',
    image_urls: [
      brand_photos.orange_print_dress,
    ],
    image_alts: [
      'Woman in an orange and black halter dress with a full black-and-white printed skirt',
    ],
    sizes: [],
    colours: [orange, black, white],
    fabrics: ['Printed dress cloth (sample)'],
    style_attributes: ['Halter neck', 'Printed bodice', 'Full skirt'],
    customization_options: ['Length', 'Neckline', 'Sleeve', 'Cloth'],
    production_timeframe: '',
    listing_mode: 'bespoke',
    is_demo_price: true,
    seo_title: 'Kente Day Dress',
    seo_description: 'Sample orange and black halter dress with a printed skirt. The listed price is a demonstration starting point.',
    stock_quantity: 1,
    stock_status: 'in_stock',
    featured: false,
    bestseller: false,
    created_at: '2026-05-01',
  }),
];

/**
 * Finds a product by its public slug.
 *
 * @param slug - Slug from the route.
 * @returns The product, or undefined when it is not in the catalogue.
 */
export function get_product_by_slug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

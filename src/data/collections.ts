import type { Collection } from '../types/catalog.ts';
import { brand_photos } from './image.ts';

/**
 * Editorial collections. Product `collection_slug` values must match a slug here.
 * Copy and photographs are sample content for the demonstration.
 */
export const collections: Collection[] = [
  {
    slug: 'signature-prints',
    name: 'Signature prints',
    description: 'Sample designs built around printed cloth, a fitted bodice, and a fuller skirt.',
    image_url: brand_photos.leaf_dress,
    image_alt: 'Woman in a blue, gold, and white leaf-print shirt dress',
    featured: true,
  },
  {
    slug: 'evening',
    name: 'Evening',
    description: 'Sample evening silhouettes. Each piece is a starting point for a custom dress.',
    image_url: brand_photos.blue_dress,
    image_alt: 'Woman in a royal blue midi dress with a gathered bodice and full skirt',
    featured: true,
  },
  {
    slug: 'day-dresses',
    name: 'Day dresses',
    description: 'Lighter sample shapes for daytime occasions. Fabrics are confirmed with Alotym.',
    image_url: brand_photos.shirt_dress,
    image_alt: 'Woman in a black shirt dress with gold and white motifs',
    featured: true,
  },
  {
    slug: 'ceremony',
    name: 'Ceremony',
    description: 'Sample ceremony dresses. Timing, fabric, and price are confirmed per enquiry.',
    image_url: brand_photos.lemon_dress,
    image_alt: 'Woman in a lemon boat-neck dress with short sleeves and an asymmetric hem',
    featured: true,
  },
];

/**
 * Finds a collection by its slug.
 *
 * @param slug - Collection slug from the route or a product.
 * @returns The collection, or undefined when the slug is unknown.
 */
export function get_collection_by_slug(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

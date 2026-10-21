/**
 * Brand photographs in `public/images`.
 * These are the storefront pictures. `stock_photo` remains a fallback only.
 */
export const brand_photos = {
  shirt_dress: '/images/look_shirt_dress.jpg',
  leaf_dress: '/images/look_leaf_dress.jpg',
  pink_dress: '/images/look_pink_dress.jpg',
  blue_dress: '/images/look_blue_dress.jpg',
  ceremony_gown: '/images/look_ceremony_gown.jpg',
  wide_tunic: '/images/look_wide_tunic.jpg',
  kente_dress: '/images/look_kente_dress.jpg',
  coral_dress: '/images/look_coral_dress.jpg',
  orange_print_dress: '/images/look_orange_print_dress.jpg',
  lemon_dress: '/images/look_lemon_dress.jpg',
} as const;

/**
 * Builds stable demo image URLs.
 * Replace a returned URL with your own file, for example `/images/reference-dress.jpg`.
 */

/**
 * Public path for the owner's reference dress photograph.
 * Add the file at `public/images/reference-dress.jpg`, then point a product image at this path.
 */
export const reference_dress_public_path = '/images/reference-dress.jpg';

/**
 * Unsplash photograph URL locked to one photo id so it does not change on refresh.
 *
 * @param photo_id - Unsplash id including the `photo-` prefix.
 * @param width - Requested width in pixels.
 * @returns Absolute image URL for that photograph.
 */
export function stock_photo(photo_id: string, width: number): string {
  return `https://images.unsplash.com/${photo_id}?auto=format&fit=crop&w=${width}&q=80`;
}

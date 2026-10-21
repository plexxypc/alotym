import { useState } from 'react';
import type { ReactElement } from 'react';

/** Props for the product image gallery. */
export type ProductGalleryProps = {
  image_urls: string[];
  image_alts: string[];
  product_name: string;
};

/**
 * Main product image with selectable thumbnails.
 *
 * @param props - Image URLs and alt text parallel to those URLs.
 * @returns The gallery.
 */
export function ProductGallery(props: ProductGalleryProps): ReactElement {
  const [active_index, set_active_index] = useState(0);
  const safe_index = Math.min(active_index, Math.max(props.image_urls.length - 1, 0));
  const active_url = props.image_urls[safe_index];
  const active_alt = props.image_alts[safe_index] ?? props.product_name;

  return (
    <div className="vx_gallery">
      <div className="vx_gallery_main">
        {active_url ? (
          <img src={active_url} alt={active_alt} width={1200} height={1500} />
        ) : null}
      </div>
      {props.image_urls.length > 1 ? (
        <div className="vx_thumbs" role="group" aria-label={`${props.product_name} images`}>
          {props.image_urls.map((url, index) => {
            const alt = props.image_alts[index] ?? `${props.product_name} view ${index + 1}`;
            const selected = index === safe_index;
            return (
              <button
                key={url}
                type="button"
                className={selected ? 'is_selected' : ''}
                aria-label={`Show image ${index + 1}`}
                aria-pressed={selected}
                onClick={() => set_active_index(index)}
              >
                <img src={url} alt={alt} width={160} height={200} loading="lazy" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

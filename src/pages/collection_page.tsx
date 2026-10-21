import type { ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CatalogView } from '../components/catalog_view.tsx';
import { Seo } from '../components/seo.tsx';
import { get_collection_by_slug } from '../data/collections.ts';
import { page_title } from '../lib/page_meta.ts';

/**
 * Collection listing. Unknown slugs get a clear missing state.
 *
 * @returns The collection page.
 */
export function CollectionPage(): ReactElement {
  const { slug = '' } = useParams();
  const collection = get_collection_by_slug(slug);

  if (!collection) {
    return (
      <section className="vx_shell vx_not_found">
        <Seo title={page_title('Collection not found')} description="That collection is not in the edit." path={`/collections/${slug}`} />
        <p className="vx_kicker">Collection</p>
        <h1>This collection is not in the catalogue.</h1>
        <p>Check the name, or browse every design.</p>
        <Link className="vx_btn" to="/shop">Shop all designs</Link>
      </section>
    );
  }

  return (
    <CatalogView
      title={collection.name}
      lede={collection.description}
      path={`/collections/${collection.slug}`}
      collection_slug={collection.slug}
      image_url={collection.image_url}
      image_alt={collection.image_alt}
    />
  );
}

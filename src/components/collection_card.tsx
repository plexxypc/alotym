import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import type { Collection } from '../types/catalog.ts';

/** Props for a collection teaser. */
export type CollectionCardProps = {
  collection: Collection;
  index_label?: string;
};

/**
 * Editorial collection card linking to the collection route.
 *
 * @param props - Collection and optional index label.
 * @returns The card.
 */
export function CollectionCard(props: CollectionCardProps): ReactElement {
  const collection = props.collection;
  return (
    <article className="vx_collection_card">
      <Link to={`/collections/${collection.slug}`}>
        <img
          src={collection.image_url}
          alt={collection.image_alt}
          width={900}
          height={1200}
          loading="lazy"
        />
        <span className="vx_collection_copy">
          {props.index_label ? <span className="vx_kicker">{props.index_label}</span> : null}
          <span className="vx_collection_name">{collection.name}</span>
        </span>
      </Link>
    </article>
  );
}

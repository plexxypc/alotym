import type { ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductFilters } from './product_filters.tsx';
import { ProductGrid } from './product_grid.tsx';
import { Seo } from './seo.tsx';
import { products } from '../data/products.ts';
import { filter_products, is_sort_key, list_categories } from '../lib/catalog.ts';
import type { SortKey } from '../lib/catalog.ts';
import { page_title } from '../lib/page_meta.ts';
import { store } from '../config/store.ts';

/** Props for a filterable product listing. */
export type CatalogViewProps = {
  title: string;
  lede: string;
  path: string;
  collection_slug?: string;
  image_url?: string;
  image_alt?: string;
};

/**
 * Shared catalogue screen for the shop and collection routes.
 *
 * @param props - Heading, route path, and optional collection constraint.
 * @returns The listing page content.
 */
export function CatalogView(props: CatalogViewProps): ReactElement {
  const [search_params, set_search_params] = useSearchParams();
  const search = search_params.get('q') ?? '';
  const category = search_params.get('category') ?? '';
  const sort_param = search_params.get('sort');
  const sort: SortKey = is_sort_key(sort_param) ? sort_param : 'featured';
  const scoped = props.collection_slug
    ? products.filter((product) => product.collection_slug === props.collection_slug)
    : products;
  const visible = filter_products(scoped, {
    search,
    category,
    sort,
  });

  function replace_param(key: string, value: string): void {
    const next = new URLSearchParams(search_params);
    if (!value || (key === 'sort' && value === 'featured')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    set_search_params(next);
  }

  return (
    <>
      <Seo
        title={page_title(props.title)}
        description={props.lede}
        path={props.path}
        image_url={props.image_url}
      />
      <header className={props.image_url ? 'vx_collection_hero' : 'vx_page_header vx_shell'}>
        {props.image_url ? (
          <img src={props.image_url} alt={props.image_alt ?? ''} width={1600} height={900} />
        ) : null}
        <div className={props.image_url ? 'vx_collection_hero_copy vx_shell' : ''}>
          <p className="vx_kicker">{store.store_name}</p>
          <h1>{props.title}</h1>
          <p className="vx_lede">{props.lede}</p>
          {visible.some((product) => product.is_demo_price) ? (
            <p className="al_price_note">{store.pricing.disclaimer}</p>
          ) : null}
        </div>
      </header>
      <section className="vx_section vx_shell">
        <ProductFilters
          search={search}
          category={category}
          sort={sort}
          categories={list_categories(scoped)}
          result_count={visible.length}
          on_search={(value) => replace_param('q', value.trim())}
          on_category={(value) => replace_param('category', value)}
          on_sort={(value) => replace_param('sort', value)}
        />
        <ProductGrid products={visible} />
      </section>
    </>
  );
}

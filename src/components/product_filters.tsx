import { useEffect, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { is_sort_key, label_category } from '../lib/catalog.ts';
import type { SortKey } from '../lib/catalog.ts';

/** Props for catalogue search, category, and sort controls. */
export type ProductFiltersProps = {
  search: string;
  category: string;
  sort: SortKey;
  categories: string[];
  result_count: number;
  on_search: (value: string) => void;
  on_category: (value: string) => void;
  on_sort: (value: SortKey) => void;
};

const sort_options: Array<{ value: SortKey; label: string }> = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'bestseller', label: 'Bestsellers' },
  { value: 'price_asc', label: 'Starting price, low to high' },
  { value: 'price_desc', label: 'Starting price, high to low' },
];

/**
 * Search, category, and sort controls for a product listing.
 *
 * @param props - Current query and change handlers.
 * @returns The filter bar.
 */
export function ProductFilters(props: ProductFiltersProps): ReactElement {
  const [draft, set_draft] = useState(props.search);

  useEffect(() => {
    set_draft(props.search);
  }, [props.search]);

  function handle_search(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    props.on_search(draft);
  }

  return (
    <div className="vx_filters">
      <form className="vx_filter_search" role="search" onSubmit={handle_search}>
        <label htmlFor="catalogue-search">Search designs</label>
        <input
          id="catalogue-search"
          className="form-control vx_input"
          name="q"
          type="search"
          value={draft}
          placeholder="Search name or style"
          onChange={(event) => set_draft(event.target.value)}
        />
      </form>
      <div className="vx_filter_categories" role="group" aria-label="Categories">
        <button
          type="button"
          className={props.category === '' ? 'is_selected' : ''}
          onClick={() => props.on_category('')}
        >
          All
        </button>
        {props.categories.map((category) => (
          <button
            key={category}
            type="button"
            className={props.category === category ? 'is_selected' : ''}
            onClick={() => props.on_category(category)}
          >
            {label_category(category)}
          </button>
        ))}
      </div>
      <div className="vx_field vx_sort">
        <label htmlFor="catalogue-sort">Sort</label>
        <select
          id="catalogue-sort"
          className="form-select vx_input"
          value={props.sort}
          onChange={(event) => {
            const value = event.target.value;
            if (is_sort_key(value)) {
              props.on_sort(value);
            }
          }}
        >
          {sort_options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <p className="vx_result_count" aria-live="polite">
        {props.result_count} {props.result_count === 1 ? 'design' : 'designs'}
      </p>
    </div>
  );
}

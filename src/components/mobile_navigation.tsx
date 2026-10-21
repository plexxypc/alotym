import { useRef, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { Search, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { store } from '../config/store.ts';
import { use_dialog_effects } from '../hooks/use_dialog_effects.ts';
import { NavItemLink } from './nav_item_link.tsx';

/** Props for the mobile menu. */
export type MobileNavigationProps = {
  is_open: boolean;
  on_close: () => void;
};

/**
 * Full-screen mobile navigation with search and nested shop links.
 *
 * @param props - Open state and close handler.
 * @returns The dialog, or null when closed.
 */
export function MobileNavigation(props: MobileNavigationProps): ReactElement | null {
  const navigate = useNavigate();
  const close_ref = useRef<HTMLButtonElement>(null);
  const [search_value, set_search_value] = useState('');
  use_dialog_effects(props.is_open, props.on_close, close_ref);

  if (!props.is_open) {
    return null;
  }

  function handle_search(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const query = search_value.trim();
    props.on_close();
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop');
  }

  return (
    <div className="vx_mobile_nav" role="presentation">
      <button className="vx_backdrop" type="button" aria-label="Close menu" onClick={props.on_close} />
      <div className="vx_mobile_panel" role="dialog" aria-modal="true" aria-labelledby="mobile-nav-title">
        <header className="vx_drawer_head">
          <p id="mobile-nav-title">{store.store_name}</p>
          <button ref={close_ref} className="vx_icon_button" type="button" aria-label="Close menu" onClick={props.on_close}>
            <X size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </header>
        <form className="vx_search" role="search" onSubmit={handle_search}>
          <label className="visually-hidden" htmlFor="mobile-search">Search products</label>
          <input
            id="mobile-search"
            type="search"
            value={search_value}
            placeholder="Search"
            onChange={(event) => set_search_value(event.target.value)}
          />
          <button className="vx_icon_button" type="submit" aria-label="Search">
            <Search size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </form>
        <NavLink className="vx_btn al_mobile_cta" to={store.primary_cta.path} onClick={props.on_close}>
          {store.primary_cta.label}
        </NavLink>
        <nav aria-label="Mobile">
          {store.navigation.map((item) => (
            <div key={`${item.label}-${item.path}`} className="vx_mobile_group">
              <NavItemLink to={item.path} on_click={props.on_close}>{item.label}</NavItemLink>
              {item.children?.map((child) => (
                <NavItemLink key={`${child.label}-${child.path}`} to={child.path} on_click={props.on_close}>
                  {child.label}
                </NavItemLink>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}

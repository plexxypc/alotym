import type { FormEvent, ReactElement } from 'react';
import { useState } from 'react';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { store } from '../config/store.ts';
import { use_cart } from '../context/cart_context.tsx';
import { NavItemLink } from './nav_item_link.tsx';

/** Props for the site header. */
export type HeaderProps = {
  on_open_menu: () => void;
};

/**
 * Sticky header with logo, shop links, search, and cart count.
 *
 * @param props - Callback that opens the mobile navigation.
 * @returns The header.
 */
export function Header(props: HeaderProps): ReactElement {
  const navigate = useNavigate();
  const { item_count, open_drawer } = use_cart();
  const [search_value, set_search_value] = useState('');

  function handle_search(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const query = search_value.trim();
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop');
  }

  return (
    <header className="vx_header">
      <div className="vx_shell vx_header_inner">
        <button
          className="vx_icon_button vx_menu_button"
          type="button"
          aria-label="Open menu"
          onClick={props.on_open_menu}
        >
          <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <NavLink className="vx_logo" to="/" end>
          {store.logo.image_path ? (
            <img className="vx_logo_image" src={store.logo.image_path} alt={store.logo.alt} />
          ) : (
            store.logo.text
          )}
        </NavLink>
        <nav className="vx_nav" aria-label="Primary">
          {store.navigation.map((item) => {
            if (item.children && item.children.length > 0) {
              return (
                <details className="vx_nav_drop" key={`${item.label}-${item.path}`}>
                  <summary>{item.label}</summary>
                  <div className="vx_nav_menu">
                    {item.children.map((child) => (
                      <NavItemLink key={`${child.label}-${child.path}`} to={child.path}>
                        {child.label}
                      </NavItemLink>
                    ))}
                  </div>
                </details>
              );
            }
            return (
              <NavItemLink
                key={`${item.label}-${item.path}`}
                to={item.path}
                class_name="vx_nav_link"
              >
                {item.label}
              </NavItemLink>
            );
          })}
        </nav>
        <div className="vx_header_tools">
          <NavLink className="vx_btn vx_header_cta" to={store.primary_cta.path}>
            {store.primary_cta.label}
          </NavLink>
          <form className="vx_search vx_search_desktop" role="search" onSubmit={handle_search}>
            <label className="visually-hidden" htmlFor="header-search">Search designs</label>
            <input
              id="header-search"
              type="search"
              value={search_value}
              placeholder="Search designs"
              onChange={(event) => set_search_value(event.target.value)}
            />
            <button className="vx_icon_button" type="submit" aria-label="Search">
              <Search size={18} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </form>
          <button
            className="vx_icon_button vx_cart_button"
            type="button"
            aria-label={`Open cart, ${item_count} ${item_count === 1 ? 'item' : 'items'}`}
            onClick={open_drawer}
          >
            <ShoppingBag size={18} strokeWidth={1.5} aria-hidden="true" />
            <span className="vx_cart_count">{item_count}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

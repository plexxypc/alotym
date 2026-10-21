import type { ReactElement, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * True when the current location matches a nav path, including query filters.
 *
 * Paths without a query are current only when `category` and `q` are absent,
 * so "All pieces" does not stay current on `/shop?category=tops`.
 *
 * @param target - Configured path, optionally with a query or hash.
 * @param pathname - Current pathname.
 * @param search - Current search string, including the leading `?` when present.
 * @returns Whether this nav item should be marked current.
 */
export function link_is_current(target: string, pathname: string, search: string): boolean {
  const bare = target.split('#')[0] ?? target;
  const [target_path, target_query] = bare.split('?');
  if (pathname !== target_path) {
    return false;
  }
  const current = new URLSearchParams(search);
  if (!target_query) {
    return !current.has('category') && !current.has('q');
  }
  const wanted = new URLSearchParams(target_query);
  for (const [key, value] of wanted.entries()) {
    if (current.get(key) !== value) {
      return false;
    }
  }
  return true;
}

/** Props for a config-driven navigation link. */
export type NavItemLinkProps = {
  to: string;
  class_name?: string;
  children: ReactNode;
  on_click?: () => void;
};

/**
 * Navigation link that marks the current page, including catalogue query links.
 *
 * @param props - Destination, optional class, label, and click handler.
 * @returns An anchor with `aria-current` when the path matches.
 */
export function NavItemLink(props: NavItemLinkProps): ReactElement {
  const location = useLocation();
  const is_current = link_is_current(props.to, location.pathname, location.search);
  const class_name = [props.class_name, is_current ? 'is_active' : ''].filter(Boolean).join(' ');

  return (
    <Link
      to={props.to}
      className={class_name || undefined}
      aria-current={is_current ? 'page' : undefined}
      onClick={props.on_click}
    >
      {props.children}
    </Link>
  );
}

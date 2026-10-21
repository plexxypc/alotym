import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/seo.tsx';
import { page_title } from '../lib/page_meta.ts';
import { store } from '../config/store.ts';

/**
 * Custom 404 for unknown routes.
 *
 * @returns The not-found page.
 */
export function NotFoundPage(): ReactElement {
  return (
    <section className="vx_shell vx_not_found">
      <Seo
        title={page_title('Page not found')}
        description={`That page is not part of the ${store.store_name} storefront.`}
        path="/404"
      />
      <p className="vx_kicker">404</p>
      <h1>This page is not on the site.</h1>
      <p>The link may be old. The designs are still here.</p>
      <Link className="vx_btn" to="/shop">Shop all designs</Link>
    </section>
  );
}

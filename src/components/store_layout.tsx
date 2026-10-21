import { useCallback, useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnnouncementBar } from './announcement_bar.tsx';
import { CartDrawer } from './cart_drawer.tsx';
import { ConciergeWidget } from './concierge_widget.tsx';
import { Footer } from './footer.tsx';
import { Header } from './header.tsx';
import { MobileNavigation } from './mobile_navigation.tsx';
import { use_cart } from '../context/cart_context.tsx';

/**
 * Shared chrome: announcement, header, mobile nav, cart drawer, and footer.
 *
 * @returns The store layout around the active route.
 */
export function StoreLayout(): ReactElement {
  const location = useLocation();
  const { notice, is_drawer_open, close_drawer } = use_cart();
  const [is_mobile_open, set_is_mobile_open] = useState(false);
  const close_mobile = useCallback(() => {
    set_is_mobile_open(false);
  }, []);
  const open_mobile = useCallback(() => {
    close_drawer();
    set_is_mobile_open(true);
  }, [close_drawer]);

  useEffect(() => {
    if (is_drawer_open) {
      set_is_mobile_open(false);
    }
  }, [is_drawer_open]);

  useEffect(() => {
    if (location.hash.length > 1) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <>
      <a className="vx_skip" href="#main">Skip to content</a>
      <p className="visually-hidden" aria-live="polite">{notice}</p>
      <div className="vx_header_wrap">
        <AnnouncementBar />
        <Header on_open_menu={open_mobile} />
      </div>
      <MobileNavigation is_open={is_mobile_open} on_close={close_mobile} />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ConciergeWidget />
    </>
  );
}

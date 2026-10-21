import type { ReactElement } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsletterForm } from './newsletter_form.tsx';
import { WhatsAppButton } from './whatsapp_button.tsx';
import { store } from '../config/store.ts';
import { instagram_label, is_instagram_ready } from '../lib/contact_channels.ts';
import { format_store_address } from '../lib/page_meta.ts';

/**
 * Footer with contact, social links, policies, navigation, and the newsletter.
 *
 * @returns The site footer.
 */
export function Footer(): ReactElement {
  const year = new Date().getFullYear();
  return (
    <footer className="vx_footer">
      <div className="vx_shell">
        <div className="vx_footer_news">
          <div>
            <p className="vx_kicker">{store.store_name}</p>
            <h2>{store.homepage.newsletter_title}</h2>
          </div>
          <NewsletterForm />
        </div>
        <div className="row gy-5 vx_footer_grid">
          <div className="col-md-4">
            <p className="vx_logo">
              {store.logo.image_path ? (
                <img className="vx_logo_image" src={store.logo.image_path} alt={store.logo.alt} />
              ) : (
                store.logo.text
              )}
            </p>
            <p>{store.tagline}</p>
          </div>
          <div className="col-6 col-md-2">
            <h2>Visit</h2>
            <ul>
              {store.footer_navigation.map((item) => (
                <li key={`${item.label}-${item.path}`}>
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h2>Contact</h2>
            <p>{format_store_address()}</p>
            {store.hours ? <p>{store.hours}</p> : <p>Hours have not been added yet.</p>}
            {store.contact.email ? <p><a href={`mailto:${store.contact.email}`}>{store.contact.email}</a></p> : <p>Email has not been added yet.</p>}
            {store.contact.phone_tel ? <p><a href={`tel:${store.contact.phone_tel}`}>{store.contact.phone_display}</a></p> : null}
            <WhatsAppButton label="WhatsApp" />
            {is_instagram_ready() ? (
              <p><a href={store.contact.instagram_url} target="_blank" rel="noreferrer">{instagram_label()}</a></p>
            ) : (
              <p>Instagram has not been added yet.</p>
            )}
          </div>
          <div className="col-md-3">
            <h2>Social</h2>
            {store.social_links.length > 0 ? (
              <ul>
                {store.social_links.map((link) => (
                  <li key={link.url + link.label}>
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.label}
                      <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Social links have not been added yet.</p>
            )}
          </div>
        </div>
        <p className="vx_fine">© {year} {store.store_name}. Demonstration storefront. An enquiry is not a confirmed or paid order. Display currency: {store.currency.code}.</p>
      </div>
    </footer>
  );
}

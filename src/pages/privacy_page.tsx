import type { ReactElement } from 'react';
import { Seo } from '../components/seo.tsx';
import { store } from '../config/store.ts';
import { is_order_storage_configured } from '../lib/supabase_client.ts';
import { page_title } from '../lib/page_meta.ts';

/**
 * Explains what the enquiry collects. Policy wording stays a draft until the owner approves it.
 *
 * @returns The privacy page.
 */
export function PrivacyPage(): ReactElement {
  const storage_configured = is_order_storage_configured();
  return (
    <>
      <Seo
        title={page_title('Privacy')}
        description="What an Alotym bespoke enquiry collects, and how demo mode differs from private storage."
        path="/privacy"
      />
      <article className="vx_shell vx_page_block al_prose">
        <header className="vx_page_header">
          <p className="vx_kicker">Privacy</p>
          <h1>Privacy note</h1>
        </header>
        <p className="al_callout">{store.policies.review_note}</p>
        <p>{store.policies.privacy}</p>
        <h2>What the enquiry collects</h2>
        <p>The form asks for a design choice, dress preferences, measurements or a request for measurement help, your name, an optional email, a phone number, a country, a city, a delivery destination, and optional reference photos. This information is used so Alotym can reply to the enquiry and review the dress you want.</p>
        <h2>Where it is kept</h2>
        {storage_configured ? (
          <p>This deployment has Supabase credentials, so a successful submission is stored for the owner to review. Reference photos go to a private bucket. The page only says an enquiry or photo was saved after the server confirms it. Visitors cannot read other customers’ measurements or photos.</p>
        ) : (
          <p>Demo mode is active because Supabase credentials are not configured. The enquiry is not stored on a server. A short summary may stay in this browser tab so you can contact Alotym. Full measurements are not kept in local storage.</p>
        )}
        <p>The prefilled WhatsApp message contains the order reference and a short description. It does not include measurements, a street address, or a private image link. The page address is not used to carry those details.</p>
      </article>
    </>
  );
}

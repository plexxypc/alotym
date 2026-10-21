import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/seo.tsx';
import { store } from '../config/store.ts';
import { production_timing_text } from '../lib/page_meta.ts';
import { page_title } from '../lib/page_meta.ts';

/**
 * Explains the bespoke enquiry without treating it as a confirmed order.
 *
 * @returns The how-it-works page.
 */
export function HowItWorksPage(): ReactElement {
  return (
    <>
      <Seo
        title={page_title('How bespoke ordering works')}
        description="How an Alotym custom-dress enquiry moves from a design idea to a conversation with the studio."
        path="/how-it-works"
      />
      <article className="vx_shell vx_page_block al_how">
        <header className="vx_page_header">
          <p className="vx_kicker">{store.atelier.process_kicker}</p>
          <h1>{store.atelier.process_title}</h1>
        </header>
        <div className="al_how_main">
          <ol className="al_process_list">
            {store.atelier.steps.map((step, index) => (
              <li key={step.title}>
                <span>0{index + 1}</span>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <h2>Timing</h2>
          <p>{production_timing_text()}</p>
          <h2>Customers in Nigeria</h2>
          <p>{store.customer_notes.nigeria}</p>
          <h2>Customers abroad</h2>
          <p>{store.customer_notes.international}</p>
          <p>Prices shown on designs are starting prices in {store.currency.code}. {store.pricing.disclaimer}</p>
          <Link className="vx_btn" to={store.primary_cta.path}>{store.primary_cta.label}</Link>
        </div>
      </article>
    </>
  );
}

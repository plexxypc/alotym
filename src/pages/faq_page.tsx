import type { ReactElement } from 'react';
import { Seo } from '../components/seo.tsx';
import { store } from '../config/store.ts';
import { page_title } from '../lib/page_meta.ts';

/**
 * Full FAQ. Answers are the configured store copy.
 *
 * @returns The FAQ page.
 */
export function FaqPage(): ReactElement {
  return (
    <>
      <Seo
        title={page_title('Frequently asked questions')}
        description="Answers about Alotym custom dresses, starting prices, measurements, and international enquiries."
        path="/faq"
      />
      <section className="vx_shell vx_page_block">
        <header className="vx_page_header">
          <p className="vx_kicker">FAQ</p>
          <h1>Frequently asked questions</h1>
        </header>
        <div className="al_faq">
          {store.faqs.map((item) => (
            <details key={item.id} id={item.id}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

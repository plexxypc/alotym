import type { ReactElement } from 'react';
import { Seo } from '../components/seo.tsx';
import { store } from '../config/store.ts';
import { page_title } from '../lib/page_meta.ts';

/**
 * Custom-order, cancellation, alteration, returns, and delivery placeholders.
 *
 * @returns The policy page.
 */
export function CustomOrderPolicyPage(): ReactElement {
  const sections = [
    { id: 'custom-order', title: 'Custom orders', body: store.policies.custom_order },
    { id: 'cancellation', title: 'Cancellation', body: store.policies.cancellation },
    { id: 'alteration', title: 'Alterations', body: store.policies.alteration },
    { id: 'returns', title: 'Returns', body: store.policies.returns },
    { id: 'delivery', title: 'Delivery', body: store.policies.delivery },
  ];
  return (
    <>
      <Seo
        title={page_title('Custom-order policy')}
        description="Placeholder custom-order, cancellation, alteration, and delivery notes for Alotym."
        path="/custom-order-policy"
      />
      <article className="vx_shell vx_page_block al_prose">
        <header className="vx_page_header">
          <p className="vx_kicker">Policies</p>
          <h1>Custom orders and cancellations</h1>
        </header>
        <p className="al_callout">{store.policies.review_note}</p>
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </article>
    </>
  );
}

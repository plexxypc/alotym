import type { ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BespokeHandoff } from '../components/bespoke_handoff.tsx';
import { BespokeOrderForm } from '../components/bespoke_order_form.tsx';
import { Seo } from '../components/seo.tsx';
import { store } from '../config/store.ts';
import { clear_bespoke_enquiry, empty_bespoke_draft, read_bespoke_enquiry, write_bespoke_draft } from '../lib/bespoke_draft.ts';
import { page_title } from '../lib/page_meta.ts';

/**
 * Starts a bespoke enquiry, then shows the messaging handoff for this tab.
 *
 * @returns The bespoke order page.
 */
export function BespokeOrderPage(): ReactElement {
  const [search_params, set_search_params] = useSearchParams();
  const is_ready = search_params.get('status') === 'ready';

  function restart(): void {
    clear_bespoke_enquiry();
    write_bespoke_draft(empty_bespoke_draft());
    set_search_params({});
  }

  return (
    <>
      <Seo
        title={page_title('Start a bespoke order')}
        description={`Prepare a custom-dress enquiry for ${store.store_name}. Submitting does not confirm an order or a payment.`}
        path="/bespoke"
      />
      <section className="vx_shell vx_page_block">
        <header className="vx_page_header">
          <p className="vx_kicker">Bespoke order</p>
          <h1>{is_ready ? 'Enquiry reference' : 'Create your custom dress'}</h1>
          <p className="vx_lede">
            {is_ready
              ? 'Use the reference below when you contact Alotym. An enquiry is not an accepted order.'
              : 'Work through the steps. You can go back without losing what you have entered.'}
          </p>
        </header>
        {is_ready ? (
          <BespokeHandoff enquiry={read_bespoke_enquiry()} on_restart={restart} />
        ) : (
          <BespokeOrderForm on_submitted={() => set_search_params({ status: 'ready' })} />
        )}
      </section>
    </>
  );
}

import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { store } from '../config/store.ts';
import { is_valid_email } from '../lib/validate_email.ts';

/**
 * Newsletter form with validation and an explicit demo success state.
 * No address is sent to a mailing service.
 *
 * @returns The newsletter form.
 */
export function NewsletterForm(): ReactElement {
  const [email, set_email] = useState('');
  const [error, set_error] = useState('');
  const [demo_email, set_demo_email] = useState('');

  function handle_submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!is_valid_email(email)) {
      set_error('Enter a valid email address.');
      set_demo_email('');
      return;
    }
    set_error('');
    set_demo_email(email.trim());
  }

  return (
    <form className="vx_newsletter_form" onSubmit={handle_submit} noValidate>
      <div className="vx_field">
        <label htmlFor="newsletter-email">Email address</label>
        <div className="vx_newsletter_row">
          <input
            id="newsletter-email"
            className="form-control vx_input"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'newsletter-error' : undefined}
            onChange={(event) => {
              set_email(event.target.value);
            }}
          />
          <button className="vx_btn" type="submit">Join the list</button>
        </div>
        {error ? <p id="newsletter-error" className="vx_error">{error}</p> : null}
      </div>
      {demo_email ? (
        <p className="vx_demo_note" role="status">
          Demo signup received for {demo_email}. Nothing was sent to a mailing service.
        </p>
      ) : null}
      <p className="vx_fine">{store.homepage.newsletter_text}</p>
    </form>
  );
}

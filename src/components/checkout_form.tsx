import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { store } from '../config/store.ts';
import { use_cart } from '../context/cart_context.tsx';
import { get_order_total } from '../lib/delivery.ts';
import { is_whatsapp_ready } from '../lib/contact_channels.ts';
import { format_money } from '../lib/format_money.ts';
import { is_valid_email } from '../lib/validate_email.ts';
import { is_valid_phone } from '../lib/validate_phone.ts';
import { start_paystack_checkout } from '../payments/paystack.ts';
import type { CheckoutPayload, FulfilmentMethod } from '../types/order.ts';

/** Props for the checkout form. */
export type CheckoutFormProps = {
  on_submit: (payload: CheckoutPayload) => void;
};

type CheckoutErrors = {
  customer_name?: string;
  phone?: string;
  email?: string;
  delivery_address?: string;
  delivery_method_id?: string;
  fulfilment_method?: string;
};

/**
 * Collects delivery details for a demo order request.
 * Card fields are intentionally absent. Paystack stays disabled.
 *
 * @param props - Callback fired only after validation passes.
 * @returns The checkout form and order totals.
 */
export function CheckoutForm(props: CheckoutFormProps): ReactElement {
  const { subtotal } = use_cart();
  const [customer_name, set_customer_name] = useState('');
  const [phone, set_phone] = useState('');
  const [email, set_email] = useState('');
  const [delivery_address, set_delivery_address] = useState('');
  const [delivery_method_id, set_delivery_method_id] = useState(store.delivery_options[0]?.id ?? '');
  const [fulfilment_method, set_fulfilment_method] = useState<FulfilmentMethod | ''>(
    store.payment.whatsapp_enabled ? 'whatsapp' : store.payment.bank_transfer.enabled ? 'bank_transfer' : '',
  );
  const [errors, set_errors] = useState<CheckoutErrors>({});
  const [paystack_message, set_paystack_message] = useState('');

  const selected_delivery = store.delivery_options.find((option) => option.id === delivery_method_id);
  const delivery_cost = selected_delivery?.cost ?? 0;
  const total = selected_delivery ? get_order_total(subtotal, delivery_cost) : subtotal;

  function handle_submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const next_errors: CheckoutErrors = {};
    if (customer_name.trim().length < 2) {
      next_errors.customer_name = 'Enter the name for this order.';
    }
    if (!is_valid_phone(phone)) {
      next_errors.phone = 'Use a Nigerian number (080… or +234…) or an international number starting with +.';
    }
    if (!is_valid_email(email)) {
      next_errors.email = 'Enter a valid email address.';
    }
    if (delivery_address.trim().length < 8) {
      next_errors.delivery_address = 'Enter a delivery or contact address.';
    }
    if (!selected_delivery) {
      next_errors.delivery_method_id = 'Choose a delivery method.';
    }
    if (fulfilment_method !== 'whatsapp' && fulfilment_method !== 'bank_transfer') {
      next_errors.fulfilment_method = 'Choose WhatsApp or bank transfer. Online card payment is not available.';
    }
    set_errors(next_errors);
    if (Object.keys(next_errors).length > 0 || !fulfilment_method) {
      return;
    }
    props.on_submit({
      customer_name: customer_name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      delivery_address: delivery_address.trim(),
      delivery_method_id,
      fulfilment_method,
    });
  }

  function handle_paystack(): void {
    const result = start_paystack_checkout();
    set_paystack_message(result.message);
  }

  return (
    <form className="vx_checkout_form" onSubmit={handle_submit} noValidate>
      <div className="vx_demo_banner">
        <p>
          {store.payment.paystack.disabled_message}
          {' '}
          Submitting this form creates a demo order request, not a paid order.
        </p>
      </div>

      <div className="vx_field">
        <label htmlFor="checkout-name">Full name</label>
        <input
          id="checkout-name"
          className="form-control vx_input"
          name="name"
          autoComplete="name"
          value={customer_name}
          aria-invalid={errors.customer_name ? true : undefined}
          aria-describedby={errors.customer_name ? 'checkout-name-error' : undefined}
          onChange={(event) => set_customer_name(event.target.value)}
        />
        {errors.customer_name ? <p id="checkout-name-error" className="vx_error">{errors.customer_name}</p> : null}
      </div>

      <div className="vx_field">
        <label htmlFor="checkout-phone">Phone</label>
        <input
          id="checkout-phone"
          className="form-control vx_input"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? 'checkout-phone-error' : undefined}
          onChange={(event) => set_phone(event.target.value)}
        />
        {errors.phone ? <p id="checkout-phone-error" className="vx_error">{errors.phone}</p> : null}
      </div>

      <div className="vx_field">
        <label htmlFor="checkout-email">Email</label>
        <input
          id="checkout-email"
          className="form-control vx_input"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'checkout-email-error' : undefined}
          onChange={(event) => set_email(event.target.value)}
        />
        {errors.email ? <p id="checkout-email-error" className="vx_error">{errors.email}</p> : null}
      </div>

      <div className="vx_field">
        <label htmlFor="checkout-address">Delivery address</label>
        <textarea
          id="checkout-address"
          className="form-control vx_input"
          name="address"
          rows={3}
          autoComplete="street-address"
          value={delivery_address}
          aria-invalid={errors.delivery_address ? true : undefined}
          aria-describedby={errors.delivery_address ? 'checkout-address-error' : undefined}
          onChange={(event) => set_delivery_address(event.target.value)}
        />
        {errors.delivery_address ? <p id="checkout-address-error" className="vx_error">{errors.delivery_address}</p> : null}
      </div>

      <fieldset className="vx_choice_set">
        <legend>Delivery method</legend>
        {store.delivery_options.map((option) => (
          <label key={option.id} className="vx_choice">
            <input
              type="radio"
              name="delivery_method"
              value={option.id}
              checked={delivery_method_id === option.id}
              onChange={() => set_delivery_method_id(option.id)}
            />
            <span>
              <strong>{option.label}</strong>
              <span>{format_money(option.cost)} · {option.estimate}</span>
              <span>{option.description}</span>
            </span>
          </label>
        ))}
        {errors.delivery_method_id ? <p className="vx_error">{errors.delivery_method_id}</p> : null}
      </fieldset>

      <fieldset className="vx_choice_set">
        <legend>How should we follow up?</legend>
        {store.payment.whatsapp_enabled ? (
          <label className="vx_choice">
            <input
              type="radio"
              name="fulfilment_method"
              value="whatsapp"
              checked={fulfilment_method === 'whatsapp'}
              onChange={() => set_fulfilment_method('whatsapp')}
            />
            <span>
              <strong>WhatsApp summary</strong>
              <span>
                {is_whatsapp_ready()
                  ? 'A wa.me link is prepared. The message is not sent until you open it and press send.'
                  : 'The official WhatsApp number has not been added, so a chat link cannot be opened yet.'}
              </span>
            </span>
          </label>
        ) : null}
        {store.payment.bank_transfer.enabled ? (
          <label className="vx_choice">
            <input
              type="radio"
              name="fulfilment_method"
              value="bank_transfer"
              checked={fulfilment_method === 'bank_transfer'}
              onChange={() => set_fulfilment_method('bank_transfer')}
            />
            <span>
              <strong>Bank transfer instructions</strong>
              <span>Display only. This demo does not confirm a transfer.</span>
            </span>
          </label>
        ) : null}
        <div className="vx_paystack_block">
          <p><strong>Card payment via Paystack</strong></p>
          <p>Unavailable in this template. No card number is requested or stored.</p>
          <button className="vx_btn vx_btn_secondary" type="button" onClick={handle_paystack}>
            Why online payment is off
          </button>
          {paystack_message ? <p role="status">{paystack_message}</p> : null}
        </div>
        {errors.fulfilment_method ? <p className="vx_error">{errors.fulfilment_method}</p> : null}
      </fieldset>

      {fulfilment_method === 'bank_transfer' && store.payment.bank_transfer.enabled ? (
        <div className="vx_bank_box">
          <h2>Bank transfer details</h2>
          <p>{store.payment.bank_transfer.bank_name}</p>
          <p>{store.payment.bank_transfer.account_name}</p>
          <p>Account number {store.payment.bank_transfer.account_number}</p>
          <p>{store.payment.bank_transfer.instructions}</p>
        </div>
      ) : null}

      <dl className="vx_totals">
        <div>
          <dt>Subtotal</dt>
          <dd>{format_money(subtotal)}</dd>
        </div>
        <div>
          <dt>Delivery</dt>
          <dd>{selected_delivery ? format_money(delivery_cost) : '—'}</dd>
        </div>
        <div className="vx_total_due">
          <dt>Total</dt>
          <dd>{selected_delivery ? format_money(total) : format_money(subtotal)}</dd>
        </div>
      </dl>

      <button className="vx_btn vx_btn_full" type="submit">Submit demo order request</button>
    </form>
  );
}

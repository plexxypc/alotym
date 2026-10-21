import { store } from '../config/store.ts';
import type { StoreConfig } from '../config/types.ts';

/**
 * Client-side Paystack status.
 * `can_charge` is always false in this template.
 */
export type PaystackClientStatus = {
  enabled: boolean;
  can_charge: boolean;
  public_key_present: boolean;
  message: string;
};

/**
 * Paystack boundary for a future secure integration.
 *
 * Production flow this file does not implement:
 * 1. The browser sends the order to your server. It never calls Paystack with a secret.
 * 2. The server initializes the transaction with the Paystack secret key.
 * 3. The server returns an authorization URL. Only the public key may live in the client.
 * 4. Paystack calls your webhook. The server verifies the transaction with the secret key.
 * 5. Only a verified server response may mark an order paid.
 *
 * There is no secret key field in the store config. `can_charge` stays false even if
 * `payment.paystack.enabled` is turned on, because a public key alone cannot verify payment.
 */

/**
 * Reports the disabled client path. This never starts a charge.
 *
 * @param config - Resolved store configuration.
 * @returns A status object safe to show at checkout.
 */
export function get_paystack_client_status(config: StoreConfig): PaystackClientStatus {
  const public_key = config.payment.paystack.public_key.trim();
  return {
    enabled: config.payment.paystack.enabled,
    can_charge: false,
    public_key_present: public_key.length > 0,
    message: config.payment.paystack.disabled_message,
  };
}

/** Result of the disabled Paystack path. `ok` is always false. */
export type PaystackStartResult = {
  ok: false;
  message: string;
};

/**
 * Refuses to start a Paystack charge.
 * A public key in config does not enable payment. Initialization and verification stay on a server.
 *
 * @returns A failure result and the shopper-facing explanation.
 */
export function start_paystack_checkout(): PaystackStartResult {
  const status = get_paystack_client_status(store);
  const extra = status.public_key_present
    ? ' A public key is saved in config, but this template still cannot charge a card.'
    : '';
  return {
    ok: false,
    message: `${status.message}${extra}`,
  };
}

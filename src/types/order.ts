import type { CartLine } from './cart.ts';

/** Follow-up method for a demo order request. Online card payment is not included. */
export type FulfilmentMethod = 'whatsapp' | 'bank_transfer';

/**
 * Demo order request stored for the confirmation page.
 * This is not a paid order and must not be treated as payment confirmation.
 */
export type DemoOrder = {
  reference: string;
  created_at: string;
  status: 'demo_request';
  customer_name: string;
  phone: string;
  email: string;
  delivery_address: string;
  delivery_method_id: string;
  delivery_method_label: string;
  delivery_cost: number;
  fulfilment_method: FulfilmentMethod;
  lines: CartLine[];
  subtotal: number;
  total: number;
  whatsapp_url: string;
};

/** Validated checkout fields before an order request is created. */
export type CheckoutPayload = {
  customer_name: string;
  phone: string;
  email: string;
  delivery_address: string;
  delivery_method_id: string;
  fulfilment_method: FulfilmentMethod;
};

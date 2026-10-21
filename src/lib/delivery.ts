import { store } from '../config/store.ts';
import type { DeliveryOption } from '../config/types.ts';

/**
 * Finds a delivery option by id.
 *
 * @param delivery_method_id - Id from the checkout form.
 * @returns The option, or undefined when it is not in config.
 */
export function get_delivery_option(delivery_method_id: string): DeliveryOption | undefined {
  return store.delivery_options.find((option) => option.id === delivery_method_id);
}

/**
 * Adds delivery to the merchandise subtotal.
 *
 * @param subtotal - Cart subtotal in whole naira.
 * @param delivery_cost - Selected delivery cost in whole naira.
 * @returns Order total before any future payment provider fees.
 */
export function get_order_total(subtotal: number, delivery_cost: number): number {
  return subtotal + delivery_cost;
}

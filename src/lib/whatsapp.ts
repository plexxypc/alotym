import type { DemoOrder } from '../types/order.ts';
import { format_money } from './format_money.ts';

/**
 * Strips a phone number down to digits for a `wa.me` link.
 *
 * @param phone - Display phone or WhatsApp number from config.
 * @returns Digits only, including the country code.
 */
export function to_whatsapp_digits(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * True when a WhatsApp number has enough digits to open a chat.
 *
 * @param phone - Configured or entered phone number.
 * @returns Whether `wa.me` can be built.
 */
export function has_whatsapp_digits(phone: string): boolean {
  return to_whatsapp_digits(phone).length >= 8;
}

/**
 * Builds a WhatsApp click-to-chat URL. It does not send a message.
 *
 * @param phone - WhatsApp number with country code.
 * @param message - Plain-text message placed in the `text` query.
 * @returns A `https://wa.me` URL.
 */
export function build_whatsapp_url(phone: string, message: string): string {
  const digits = to_whatsapp_digits(phone);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a readable order summary for WhatsApp.
 *
 * @param order - Demo order request.
 * @param store_name - Brand name printed at the top of the message.
 * @returns Plain text suitable for a `wa.me` link.
 */
export function build_order_whatsapp_message(order: DemoOrder, store_name: string): string {
  const item_lines = order.lines.map((line) => {
    const variant = [line.size, line.colour].filter(Boolean).join(' / ');
    const variant_label = variant ? ` (${variant})` : '';
    return `- ${line.name}${variant_label} x${line.quantity} — ${format_money(line.unit_price * line.quantity)}`;
  });

  return [
    `${store_name} demo order request`,
    `Reference: ${order.reference}`,
    'This is not a paid order.',
    '',
    `Name: ${order.customer_name}`,
    `Phone: ${order.phone}`,
    `Email: ${order.email}`,
    `Address: ${order.delivery_address}`,
    `Delivery: ${order.delivery_method_label} — ${format_money(order.delivery_cost)}`,
    '',
    'Items:',
    ...item_lines,
    '',
    `Subtotal: ${format_money(order.subtotal)}`,
    `Delivery: ${format_money(order.delivery_cost)}`,
    `Total: ${format_money(order.total)}`,
  ].join('\n');
}

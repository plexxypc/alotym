import { store } from '../config/store.ts';
import { has_whatsapp_digits } from './whatsapp.ts';

/**
 * True when the configured WhatsApp number can open a chat.
 *
 * @returns Whether the official WhatsApp link is usable.
 */
export function is_whatsapp_ready(): boolean {
  return store.payment.whatsapp_enabled && has_whatsapp_digits(store.contact.whatsapp_number);
}

/**
 * True when an official Instagram URL has been configured.
 * A handle alone is not turned into a guessed profile URL.
 *
 * @returns Whether Instagram can be opened.
 */
export function is_instagram_ready(): boolean {
  return /^https:\/\/(www\.)?instagram\.com\//i.test(store.contact.instagram_url.trim());
}

/**
 * Visible Instagram label from the configured handle or URL.
 *
 * @returns A label, or a note that the profile is missing.
 */
export function instagram_label(): string {
  if (store.contact.instagram_handle.trim()) {
    const handle = store.contact.instagram_handle.trim().replace(/^@/, '');
    return `@${handle}`;
  }
  if (is_instagram_ready()) {
    return 'Instagram';
  }
  return 'Instagram profile has not been added';
}

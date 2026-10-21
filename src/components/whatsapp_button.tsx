import type { ReactElement } from 'react';
import { MessageCircle } from 'lucide-react';
import { store } from '../config/store.ts';
import { is_whatsapp_ready } from '../lib/contact_channels.ts';
import { build_whatsapp_url } from '../lib/whatsapp.ts';

/** Props for a WhatsApp enquiry link. */
export type WhatsAppButtonProps = {
  message?: string;
  label?: string;
  class_name?: string;
};

/**
 * Link that opens WhatsApp with a prepared message. It does not send the message.
 * Renders nothing when WhatsApp ordering is disabled in config.
 *
 * @param props - Optional message, label, and extra class.
 * @returns An anchor, or null when WhatsApp is off.
 */
export function WhatsAppButton(props: WhatsAppButtonProps): ReactElement | null {
  if (!store.payment.whatsapp_enabled) {
    return null;
  }
  if (!is_whatsapp_ready()) {
    return <p className="al_unconfigured">Official WhatsApp number has not been added yet.</p>;
  }
  const message = props.message ?? store.contact.whatsapp_default_message;
  const href = build_whatsapp_url(store.contact.whatsapp_number, message);
  const class_name = props.class_name ? `vx_btn vx_btn_secondary ${props.class_name}` : 'vx_btn vx_btn_secondary';
  return (
    <a className={class_name} href={href} target="_blank" rel="noreferrer">
      <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" />
      {props.label ?? 'WhatsApp'}
    </a>
  );
}

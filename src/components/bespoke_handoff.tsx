import { useState } from 'react';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../config/store.ts';
import { instagram_label, is_instagram_ready, is_whatsapp_ready } from '../lib/contact_channels.ts';
import { build_whatsapp_url } from '../lib/whatsapp.ts';
import type { BespokeEnquiry } from '../types/bespoke.ts';

/** Props for the next step after an enquiry reference exists. */
export type BespokeHandoffProps = {
  enquiry: BespokeEnquiry | null;
  on_restart: () => void;
};

/**
 * Shows the reference and offers WhatsApp or Instagram.
 * Opening a link does not send a message or accept the order.
 *
 * @param props - Enquiry from this tab, and a way to start again.
 * @returns The handoff screen.
 */
export function BespokeHandoff(props: BespokeHandoffProps): ReactElement {
  const enquiry = props.enquiry;
  const [copy_state, set_copy_state] = useState('');
  const [whatsapp_opened, set_whatsapp_opened] = useState(false);
  const [instagram_opened, set_instagram_opened] = useState(false);

  if (!enquiry) {
    return (
      <div className="al_panel">
        <h2>This tab does not have an enquiry</h2>
        <p>Start the form again. Nothing on this page means an order was saved.</p>
        <button className="vx_btn" type="button" onClick={props.on_restart}>Start an enquiry</button>
      </div>
    );
  }

  const whatsapp_href = is_whatsapp_ready()
    ? build_whatsapp_url(store.contact.whatsapp_number, enquiry.brief_summary)
    : '';

  async function copy_summary(): Promise<void> {
    if (!enquiry) {
      return;
    }
    try {
      await navigator.clipboard.writeText(enquiry.brief_summary);
      set_copy_state('Summary copied. Paste it into the conversation yourself.');
    } catch {
      set_copy_state('Copy was blocked by the browser. Select the summary and copy it manually.');
    }
  }

  return (
    <div className="al_panel al_handoff">
      <p className="vx_kicker">{enquiry.saved_on_server ? 'Enquiry received' : 'Demo mode'}</p>
      <h2>{enquiry.reference}</h2>
      {enquiry.saved_on_server ? (
        <p>Your enquiry has been received. It has not been accepted, booked, or paid. Alotym still needs to confirm the price, production timing, and any delivery arrangements.</p>
      ) : (
        <p>Demo mode: this enquiry was not saved on Alotym’s server. Use the reference only in this browser, then contact Alotym yourself. Nothing has been accepted or paid.</p>
      )}
      <p>{enquiry.storage_note}</p>
      <label htmlFor="enquiry-summary">Message to copy</label>
      <textarea id="enquiry-summary" className="form-control vx_input" readOnly rows={10} value={enquiry.brief_summary} />
      <p>This message leaves out measurements, your address, and any private photos.</p>
      <div className="al_form_actions">
        <button className="vx_btn vx_btn_secondary" type="button" onClick={() => { void copy_summary(); }}>Copy summary</button>
        {whatsapp_href ? (
          <a className="vx_btn" href={whatsapp_href} target="_blank" rel="noreferrer" onClick={() => set_whatsapp_opened(true)}>
            Continue on WhatsApp
          </a>
        ) : null}
        {is_instagram_ready() ? (
          <a className="vx_btn" href={store.contact.instagram_url} target="_blank" rel="noreferrer" onClick={() => set_instagram_opened(true)}>
            Continue on Instagram
          </a>
        ) : null}
      </div>
      {copy_state ? <p role="status">{copy_state}</p> : null}
      <div>
        <h3>WhatsApp</h3>
        {whatsapp_href ? (
          <p>WhatsApp opens a draft to {store.contact.phone_display}. Review it and press send yourself. Opening the link does not send the message.</p>
        ) : (
          <p>The official WhatsApp number is not available, so a chat link cannot be opened.</p>
        )}
        {whatsapp_opened ? <p role="status">WhatsApp was opened from this page. That does not mean the message was sent or that the dress is booked.</p> : null}
        <p>Share any reference photographs in the WhatsApp conversation. They are not attached by this page.</p>
      </div>
      <div>
        <h3>Instagram</h3>
        {is_instagram_ready() ? (
          <p>Open {instagram_label()}, send a direct message yourself, include {enquiry.reference}, paste the summary, and attach your reference photographs in that conversation. This page cannot send the message for you.</p>
        ) : (
          <p>The official Instagram profile is not available.</p>
        )}
        {instagram_opened ? <p role="status">Instagram was opened from this page. A message has not been sent.</p> : null}
      </div>
      {enquiry.full_summary ? (
        <div>
          <h3>Details kept in this browser</h3>
          <p>Demo mode did not store these details. You can copy them into the conversation if you choose. Do not put them in a public link.</p>
          <textarea className="form-control vx_input" readOnly rows={12} value={enquiry.full_summary} aria-label="Full enquiry details kept in this browser" />
        </div>
      ) : null}
      <p><Link to="/contact">Contact page</Link></p>
      <button className="vx_text_button" type="button" onClick={props.on_restart}>Start another enquiry</button>
    </div>
  );
}

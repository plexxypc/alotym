import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { MeasurementDiagram } from '../components/measurement_diagram.tsx';
import { Seo } from '../components/seo.tsx';
import { store } from '../config/store.ts';
import { is_instagram_ready, is_whatsapp_ready } from '../lib/contact_channels.ts';
import { page_title } from '../lib/page_meta.ts';
import { build_whatsapp_url } from '../lib/whatsapp.ts';

/**
 * Explains how to measure for a dress and where to ask for help.
 * The instructions stay marked as pending until the owner approves them.
 *
 * @returns The measurement guide.
 */
export function MeasurementGuidePage(): ReactElement {
  const help_message = 'Hello Alotym, I need help taking measurements for a custom dress.';
  const whatsapp_href = is_whatsapp_ready()
    ? build_whatsapp_url(store.contact.whatsapp_number, help_message)
    : '';

  return (
    <>
      <Seo
        title={page_title('Measurement guide')}
        description="Draft guide for measuring an Alotym dress in centimetres or inches, with a way to ask for help."
        path="/measurements"
      />
      <article className="vx_shell vx_page_block al_prose">
        <header className="vx_page_header">
          <p className="vx_kicker">{store.atelier.measure_kicker}</p>
          <h1>{store.atelier.measure_title}</h1>
          <p className="vx_lede">{store.atelier.measure_text}</p>
        </header>
        <p className="al_callout" role="note">{store.measurement_guide_review_note}</p>
        <h2>How to use the tape</h2>
        <ol>
          <li>Wear light, close-fitting clothes, or the undergarments you expect to wear with the dress.</li>
          <li>Stand straight and ask someone else to measure you when you can. A mirror helps if you are measuring alone.</li>
          <li>Keep the tape level and snug. It should not pinch the body or hang loose.</li>
          <li>Write the number in centimetres or inches. On the order form, choose that unit before you type. Switching the unit later only changes what you see.</li>
          <li>Skip a measurement when it does not apply to the dress. A sleeveless style does not need sleeve measurements.</li>
        </ol>
        <MeasurementDiagram
          title="Where the tape sits"
          caption="Dashed lines show bust, waist, hips, shoulder width, shoulder-to-waist, dress length, and sleeve. Match the line to the measurement you are taking."
        />
        <h2>Measurements</h2>
        <ol className="al_measure_guide">
          {store.measurement_points.map((point) => (
            <li key={point.id}>
              <h3>{point.label}</h3>
              <p>{point.guidance}</p>
            </li>
          ))}
        </ol>
        <h2>Centimetres and inches</h2>
        <p>Record the number from the tape in one unit. If you measured 90 centimetres, keep 90 centimetres as the measurement even if you later look at the inch equivalent. Do not retype a rounded conversion unless you measured again.</p>
        <div className="al_help_panel">
          <h2>I need help with my measurements</h2>
          <p>You can continue the order and ask Alotym to guide you. Choosing help does not send a message or accept the dress.</p>
          <div className="al_form_actions">
            <Link className="vx_btn" to="/bespoke?help=1">Continue and request help</Link>
            {whatsapp_href ? (
              <a className="vx_btn vx_btn_secondary" href={whatsapp_href} target="_blank" rel="noreferrer">Ask on WhatsApp</a>
            ) : null}
            {is_instagram_ready() ? (
              <a className="vx_btn vx_btn_secondary" href={store.contact.instagram_url} target="_blank" rel="noreferrer">Ask on Instagram</a>
            ) : null}
          </div>
          <p>WhatsApp can open a short draft. Instagram must be messaged manually. Neither option sends the message for you.</p>
        </div>
      </article>
    </>
  );
}

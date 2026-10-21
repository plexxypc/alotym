import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReferenceImagePicker } from './reference_image_picker.tsx';
import { store } from '../config/store.ts';
import {
  fit_choices,
  label_choice,
  length_choices,
  neckline_choices,
  occasion_choices,
  silhouette_choices,
  sleeve_choices,
} from '../data/bespoke_choices.ts';
import type { Choice } from '../data/bespoke_choices.ts';
import { country_options } from '../data/countries.ts';
import { get_product_by_slug, products } from '../data/products.ts';
import {
  clear_bespoke_draft,
  read_bespoke_draft,
  write_bespoke_draft,
  write_bespoke_enquiry,
} from '../lib/bespoke_draft.ts';
import { build_bespoke_summary, build_brief_handoff, country_label, design_label, validate_bespoke_step } from '../lib/bespoke_validation.ts';
import type { StepErrors } from '../lib/bespoke_validation.ts';
import { display_measurement, has_measurement, measurement_text, write_measurement } from '../lib/measurements.ts';
import { is_order_storage_configured } from '../lib/supabase_client.ts';
import { submit_bespoke_order } from '../lib/submit_bespoke_order.ts';
import { release_reference_image } from '../lib/reference_images.ts';
import type { StagedReferenceImage } from '../lib/reference_images.ts';
import type { BespokeDraft, MeasurementKey, MeasurementUnit } from '../types/bespoke.ts';

/** Props for the multi-step enquiry form. */
export type BespokeOrderFormProps = {
  on_submitted: () => void;
};

const step_labels = ['Design', 'Dress', 'Measurements', 'Details', 'Review'];

const measurement_fields: Array<{ key: MeasurementKey; label: string; optional: boolean; sleeve_only?: boolean }> = [
  { key: 'bust', label: 'Bust', optional: false },
  { key: 'underbust', label: 'Underbust', optional: true },
  { key: 'waist', label: 'Waist', optional: false },
  { key: 'hips', label: 'Hips', optional: false },
  { key: 'shoulder_width', label: 'Shoulder width', optional: true },
  { key: 'shoulder_to_waist', label: 'Shoulder to waist', optional: true },
  { key: 'dress_length', label: 'Dress length', optional: true },
  { key: 'sleeve_length', label: 'Sleeve length', optional: true, sleeve_only: true },
  { key: 'arm_circumference', label: 'Arm circumference', optional: true, sleeve_only: true },
];

/**
 * Guided bespoke enquiry.
 * A reference is shown only after demo mode or the server confirms the save.
 *
 * @param props - Called after a reference is ready for the handoff.
 * @returns The form.
 */
export function BespokeOrderForm(props: BespokeOrderFormProps): ReactElement {
  const [search_params] = useSearchParams();
  const [draft, set_draft] = useState<BespokeDraft>(() => read_bespoke_draft());
  const [errors, set_errors] = useState<StepErrors>({});
  const [images, set_images] = useState<StagedReferenceImage[]>([]);
  const [image_error, set_image_error] = useState('');
  const [submit_error, set_submit_error] = useState('');
  const [is_submitting, set_is_submitting] = useState(false);
  const design_param = search_params.get('design');
  const help_param = search_params.get('help');
  const storage_configured = is_order_storage_configured();

  useEffect(() => {
    write_bespoke_draft(draft);
  }, [draft]);

  useEffect(() => {
    function on_prefill(): void {
      set_draft(read_bespoke_draft());
    }
    window.addEventListener('alotym-bespoke-prefill', on_prefill);
    return () => window.removeEventListener('alotym-bespoke-prefill', on_prefill);
  }, []);

  useEffect(() => {
    if (!design_param) {
      return;
    }
    const product = design_param === 'own' ? undefined : get_product_by_slug(design_param);
    if (design_param !== 'own' && !product) {
      return;
    }
    set_draft((current) => {
      if (design_param === 'own') {
        return current.own_inspiration ? current : { ...current, own_inspiration: true, design_slug: '', step: 1 };
      }
      if (current.design_slug === product?.slug && !current.own_inspiration) {
        return current;
      }
      return { ...current, design_slug: product?.slug ?? '', own_inspiration: false, step: 1 };
    });
  }, [design_param]);

  useEffect(() => {
    if (help_param !== '1') {
      return;
    }
    set_draft((current) => (
      current.needs_measurement_help ? current : { ...current, needs_measurement_help: true }
    ));
  }, [help_param]);

  const images_ref = useRef(images);
  images_ref.current = images;
  useEffect(() => {
    return () => {
      images_ref.current.forEach(release_reference_image);
    };
  }, []);

  function patch(partial: Partial<BespokeDraft>): void {
    set_draft((current) => ({ ...current, ...partial }));
  }

  function set_unit(unit: MeasurementUnit): void {
    set_draft((current) => (current.unit === unit ? current : { ...current, unit }));
  }

  function go_to_step(next_step: number): void {
    if (next_step < draft.step) {
      set_errors({});
      patch({ step: next_step });
      return;
    }
    const next_errors = validate_bespoke_step(draft.step, draft, images.length);
    set_errors(next_errors);
    if (Object.keys(next_errors).length === 0 && next_step === draft.step + 1) {
      patch({ step: next_step });
    }
  }

  async function handle_submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (is_submitting) {
      return;
    }
    for (let step = 1; step <= 5; step += 1) {
      const step_errors = validate_bespoke_step(step, draft, images.length);
      if (Object.keys(step_errors).length > 0) {
        set_errors(step_errors);
        patch({ step });
        return;
      }
    }
    set_is_submitting(true);
    set_submit_error('');
    const result = await submit_bespoke_order(draft, images);
    set_is_submitting(false);
    if (!result.ok) {
      set_submit_error(result.message);
      return;
    }
    const image_names = images.map((image) => image.file_name);
    const saved_on_server = result.mode === 'stored';
    const images_saved = result.mode === 'stored' && result.images_saved;
    write_bespoke_enquiry({
      reference: result.reference,
      created_at: new Date().toISOString(),
      brief_summary: build_brief_handoff(draft, result.reference, image_names.length > 0),
      full_summary: saved_on_server ? '' : build_bespoke_summary(draft, result.reference, image_names),
      channel: draft.contact_channel,
      reference_image_names: image_names,
      saved_on_server,
      images_saved,
      storage_note: saved_on_server
        ? result.image_note
        : 'Demo mode: this enquiry was not saved on Alotym’s server. The reference exists only in this browser tab.',
    });
    clear_bespoke_draft();
    props.on_submitted();
  }

  const visible_measurements = measurement_fields.filter((field) => {
    return !(field.sleeve_only && draft.sleeve === 'sleeveless');
  });

  return (
    <form className="al_form" onSubmit={(event) => { void handle_submit(event); }} noValidate>
      <ol className="al_stepper" aria-label="Enquiry steps">
        {step_labels.map((label, index) => {
          const number = index + 1;
          const current = draft.step === number;
          return (
            <li key={label}>
              <button
                type="button"
                aria-current={current ? 'step' : undefined}
                disabled={number > draft.step}
                onClick={() => go_to_step(number)}
              >
                <span>{number}</span>
                {label}
              </button>
            </li>
          );
        })}
      </ol>
      <p className="al_form_note">
        This draft stays in this browser tab so you can move between steps.
        {storage_configured
          ? ' It is saved only after the server confirms the enquiry.'
          : ' Demo mode is active, so submitting will not store it on Alotym’s server.'}
      </p>

      {draft.step === 1 ? (
        <fieldset className="al_panel">
          <legend>Choose the design</legend>
          <div className="al_design_list">
            {products.map((product) => (
              <label key={product.id} className={!draft.own_inspiration && draft.design_slug === product.slug ? 'is_selected' : ''}>
                <input
                  type="radio"
                  name="design"
                  value={product.slug}
                  checked={!draft.own_inspiration && draft.design_slug === product.slug}
                  onChange={() => patch({ design_slug: product.slug, own_inspiration: false })}
                />
                <img src={product.image_urls[0]} alt="" />
                <span>{product.name}</span>
              </label>
            ))}
            <label className={draft.own_inspiration ? 'is_selected' : ''}>
              <input
                type="radio"
                name="design"
                value="own"
                checked={draft.own_inspiration}
                onChange={() => patch({ own_inspiration: true, design_slug: '' })}
              />
              <span>I have my own inspiration</span>
            </label>
          </div>
          {errors.design ? <p className="vx_error" role="alert">{errors.design}</p> : null}
          {draft.own_inspiration ? (
            <div className="vx_field">
              <label htmlFor="inspiration-notes">Describe your inspiration</label>
              <textarea
                id="inspiration-notes"
                className="form-control vx_input"
                rows={4}
                value={draft.inspiration_notes}
                onChange={(event) => patch({ inspiration_notes: event.target.value })}
              />
              {errors.inspiration ? <p className="vx_error" role="alert">{errors.inspiration}</p> : null}
            </div>
          ) : null}
          <ReferenceImagePicker
            images={images}
            error={image_error}
            on_change={(next, message) => {
              set_images(next);
              set_image_error(message);
            }}
          />
        </fieldset>
      ) : null}

      {draft.step === 2 ? (
        <div className="al_panel">
          <h2>Tell us about the dress</h2>
          <ChoiceGroup
            legend="Occasion"
            name="occasion"
            choices={occasion_choices}
            value={draft.occasion}
            other_value={draft.occasion_other}
            error={errors.occasion || errors.occasion_other}
            on_change={(occasion) => patch({ occasion })}
            on_other={(occasion_other) => patch({ occasion_other })}
          />
          <ChoiceGroup
            legend="Silhouette"
            name="silhouette"
            choices={silhouette_choices}
            value={draft.silhouette}
            other_value={draft.silhouette_other}
            error={errors.silhouette_other}
            on_change={(silhouette) => patch({ silhouette })}
            on_other={(silhouette_other) => patch({ silhouette_other })}
          />
          <ChoiceGroup
            legend="Length"
            name="length"
            choices={length_choices}
            value={draft.length}
            other_value={draft.length_other}
            error={errors.length_other}
            on_change={(length) => patch({ length })}
            on_other={(length_other) => patch({ length_other })}
          />
          <ChoiceGroup
            legend="Sleeves"
            name="sleeve"
            choices={sleeve_choices}
            value={draft.sleeve}
            other_value={draft.sleeve_other}
            error={errors.sleeve_other}
            on_change={(sleeve) => patch({ sleeve })}
            on_other={(sleeve_other) => patch({ sleeve_other })}
          />
          <ChoiceGroup
            legend="Neckline"
            name="neckline"
            choices={neckline_choices}
            value={draft.neckline}
            other_value={draft.neckline_other}
            error={errors.neckline_other}
            on_change={(neckline) => patch({ neckline })}
            on_other={(neckline_other) => patch({ neckline_other })}
          />
          <div className="vx_field">
            <label htmlFor="colours">Preferred colours</label>
            <input id="colours" className="form-control vx_input" value={draft.colours} onChange={(event) => patch({ colours: event.target.value })} />
          </div>
          <div className="vx_field">
            <label htmlFor="fabric">Fabric preferences</label>
            <textarea id="fabric" className="form-control vx_input" rows={3} value={draft.fabric} onChange={(event) => patch({ fabric: event.target.value })} />
            <p>Sharing a fabric idea does not mean that cloth is available.</p>
          </div>
          <ChoiceGroup
            legend="Fit"
            name="fit"
            choices={fit_choices}
            value={draft.fit}
            other_value={draft.fit_other}
            error={errors.fit_other}
            on_change={(fit) => patch({ fit })}
            on_other={(fit_other) => patch({ fit_other })}
          />
          <div className="vx_field">
            <label htmlFor="design-notes">Other design notes</label>
            <textarea id="design-notes" className="form-control vx_input" rows={4} value={draft.design_notes} onChange={(event) => patch({ design_notes: event.target.value })} />
          </div>
        </div>
      ) : null}

      {draft.step === 3 ? (
        <fieldset className="al_panel">
          <legend>Measurements</legend>
          <p>Use the unit you measured in. Switching units shows the other unit and does not replace the measurement you typed. Leave a field blank when that measurement does not apply to the dress. These are garment measurements, not a health assessment.</p>
          {!storage_configured ? (
            <p className="al_callout">Demo mode: this form is not connected to Alotym’s order database. Submitting will not store the enquiry.</p>
          ) : null}
          <div className="al_unit" role="group" aria-label="Measurement unit">
            <button type="button" className={draft.unit === 'cm' ? 'is_selected' : ''} aria-pressed={draft.unit === 'cm'} onClick={() => set_unit('cm')}>Centimetres</button>
            <button type="button" className={draft.unit === 'in' ? 'is_selected' : ''} aria-pressed={draft.unit === 'in'} onClick={() => set_unit('in')}>Inches</button>
          </div>
          <label className="al_check">
            <input
              type="checkbox"
              checked={draft.needs_measurement_help}
              onChange={(event) => patch({ needs_measurement_help: event.target.checked })}
            />
            I need help taking my measurements
          </label>
          <div className="al_measure_grid">
            {visible_measurements.map((field) => (
              <div className="vx_field" key={field.key}>
                <label htmlFor={`measure-${field.key}`}>
                  {field.label} ({draft.unit}){field.optional || draft.needs_measurement_help ? ' — optional' : ''}
                </label>
                <input
                  id={`measure-${field.key}`}
                  className="form-control vx_input"
                  inputMode="decimal"
                  value={display_measurement(draft.measurements[field.key], draft.unit)}
                  aria-invalid={errors[field.key] ? true : undefined}
                  onChange={(event) => patch({
                    measurements: {
                      ...draft.measurements,
                      [field.key]: write_measurement(draft.unit, event.target.value),
                    },
                  })}
                />
                {errors[field.key] ? <p className="vx_error" role="alert">{errors[field.key]}</p> : null}
              </div>
            ))}
          </div>
          <div className="vx_field">
            <label htmlFor="fit-notes">Additional fit notes</label>
            <textarea id="fit-notes" className="form-control vx_input" rows={3} value={draft.fit_notes} onChange={(event) => patch({ fit_notes: event.target.value })} />
          </div>
          <p><a href="/measurements">Open the measurement guide</a></p>
        </fieldset>
      ) : null}

      {draft.step === 4 ? (
        <div className="al_panel">
          <h2>Your details</h2>
          <div className="vx_field">
            <label htmlFor="full-name">Full name</label>
            <input id="full-name" className="form-control vx_input" autoComplete="name" value={draft.full_name} aria-invalid={errors.full_name ? true : undefined} onChange={(event) => patch({ full_name: event.target.value })} />
            {errors.full_name ? <p className="vx_error" role="alert">{errors.full_name}</p> : null}
          </div>
          <div className="vx_field">
            <label htmlFor="email">Email address — optional</label>
            <input id="email" className="form-control vx_input" type="email" autoComplete="email" value={draft.email} aria-invalid={errors.email ? true : undefined} onChange={(event) => patch({ email: event.target.value })} />
            {errors.email ? <p className="vx_error" role="alert">{errors.email}</p> : null}
          </div>
          <div className="vx_field">
            <label htmlFor="phone">WhatsApp number</label>
            <input id="phone" className="form-control vx_input" type="tel" autoComplete="tel" placeholder="+234…" value={draft.phone} aria-invalid={errors.phone ? true : undefined} onChange={(event) => patch({ phone: event.target.value })} />
            <p>Include the country code. The form does not assume a Nigerian number.</p>
            {errors.phone ? <p className="vx_error" role="alert">{errors.phone}</p> : null}
          </div>
          <div className="vx_field">
            <label htmlFor="country">Country</label>
            <select id="country" className="form-select vx_input" value={draft.country} onChange={(event) => patch({ country: event.target.value })}>
              <option value="">Select a country</option>
              {country_options.map((country) => (
                <option key={country.value} value={country.value}>{country.label}</option>
              ))}
            </select>
            {errors.country ? <p className="vx_error" role="alert">{errors.country}</p> : null}
          </div>
          {draft.country === 'other' ? (
            <div className="vx_field">
              <label htmlFor="country-other">Country name</label>
              <input id="country-other" className="form-control vx_input" value={draft.country_other} onChange={(event) => patch({ country_other: event.target.value })} />
              {errors.country_other ? <p className="vx_error" role="alert">{errors.country_other}</p> : null}
            </div>
          ) : null}
          <div className="vx_field">
            <label htmlFor="city">City</label>
            <input id="city" className="form-control vx_input" autoComplete="address-level2" value={draft.city} onChange={(event) => patch({ city: event.target.value })} />
            {errors.city ? <p className="vx_error" role="alert">{errors.city}</p> : null}
          </div>
          <div className="vx_field">
            <label htmlFor="destination">Delivery destination</label>
            <input id="destination" className="form-control vx_input" value={draft.delivery_destination} onChange={(event) => patch({ delivery_destination: event.target.value })} />
            <p>Shipping availability and cost are confirmed with Alotym. A city and country is enough here.</p>
            {errors.delivery_destination ? <p className="vx_error" role="alert">{errors.delivery_destination}</p> : null}
          </div>
          <fieldset className="al_choice_set">
            <legend>Preferred contact channel</legend>
            <label className={draft.contact_channel === 'whatsapp' ? 'is_selected' : ''}>
              <input type="radio" name="channel" value="whatsapp" checked={draft.contact_channel === 'whatsapp'} onChange={() => patch({ contact_channel: 'whatsapp' })} />
              WhatsApp
            </label>
            <label className={draft.contact_channel === 'instagram' ? 'is_selected' : ''}>
              <input type="radio" name="channel" value="instagram" checked={draft.contact_channel === 'instagram'} onChange={() => patch({ contact_channel: 'instagram' })} />
              Instagram
            </label>
            {errors.contact_channel ? <p className="vx_error" role="alert">{errors.contact_channel}</p> : null}
          </fieldset>
          <div className="vx_field">
            <label htmlFor="occasion-date">Desired occasion or delivery date — optional</label>
            <input id="occasion-date" className="form-control vx_input" type="date" value={draft.occasion_date} onChange={(event) => patch({ occasion_date: event.target.value })} />
            <p>This is a preference, not a guaranteed delivery date.</p>
          </div>
          <div className="vx_field">
            <label htmlFor="customer-notes">Additional notes</label>
            <textarea id="customer-notes" className="form-control vx_input" rows={3} value={draft.customer_notes} onChange={(event) => patch({ customer_notes: event.target.value })} />
          </div>
        </div>
      ) : null}

      {draft.step === 5 ? (
        <div className="al_panel">
          <h2>Review your enquiry</h2>
          <p>Check the details, then create a reference. That does not accept, book, or pay for the dress.</p>
          <ReviewRow label="Design" value={design_label(draft)} on_edit={() => go_to_step(1)} />
          {draft.own_inspiration ? <ReviewRow label="Inspiration" value={draft.inspiration_notes} on_edit={() => go_to_step(1)} /> : null}
          <ReviewRow label="Reference images" value={images.length > 0 ? `${images.length} selected on this device` : 'None selected'} on_edit={() => go_to_step(1)} />
          <ReviewRow label="Occasion" value={label_choice(occasion_choices, draft.occasion, draft.occasion_other)} on_edit={() => go_to_step(2)} />
          <ReviewRow label="Silhouette" value={label_choice(silhouette_choices, draft.silhouette, draft.silhouette_other)} on_edit={() => go_to_step(2)} />
          <ReviewRow label="Length" value={label_choice(length_choices, draft.length, draft.length_other)} on_edit={() => go_to_step(2)} />
          <ReviewRow label="Sleeves" value={label_choice(sleeve_choices, draft.sleeve, draft.sleeve_other)} on_edit={() => go_to_step(2)} />
          <ReviewRow label="Neckline" value={label_choice(neckline_choices, draft.neckline, draft.neckline_other)} on_edit={() => go_to_step(2)} />
          <ReviewRow label="Colours" value={draft.colours} on_edit={() => go_to_step(2)} />
          <ReviewRow label="Fabric" value={draft.fabric} on_edit={() => go_to_step(2)} />
          <ReviewRow label="Fit" value={label_choice(fit_choices, draft.fit, draft.fit_other)} on_edit={() => go_to_step(2)} />
          <ReviewRow label="Design notes" value={draft.design_notes} on_edit={() => go_to_step(2)} />
          <ReviewRow
            label="Measurements"
            value={draft.needs_measurement_help ? `Help requested. Unit: ${draft.unit}.` : `Unit: ${draft.unit}.`}
            on_edit={() => go_to_step(3)}
          />
          <ul className="al_review_list">
            {measurement_fields.filter((field) => has_measurement(draft.measurements[field.key])).map((field) => (
              <li key={field.key}>{field.label}: {measurement_text(draft.measurements[field.key])}</li>
            ))}
          </ul>
          <ReviewRow label="Name" value={draft.full_name} on_edit={() => go_to_step(4)} />
          <ReviewRow label="Email" value={draft.email || 'Not provided'} on_edit={() => go_to_step(4)} />
          <ReviewRow label="WhatsApp" value={draft.phone} on_edit={() => go_to_step(4)} />
          <ReviewRow label="Country" value={country_label(draft)} on_edit={() => go_to_step(4)} />
          <ReviewRow label="City" value={draft.city} on_edit={() => go_to_step(4)} />
          <ReviewRow label="Destination" value={draft.delivery_destination} on_edit={() => go_to_step(4)} />
          <ReviewRow label="Channel" value={draft.contact_channel} on_edit={() => go_to_step(4)} />
          <ReviewRow label="Requested date" value={draft.occasion_date || 'Not specified'} on_edit={() => go_to_step(4)} />
          <ReviewRow label="Notes" value={draft.customer_notes} on_edit={() => go_to_step(4)} />
          <label className="al_check">
            <input
              type="checkbox"
              checked={draft.privacy_consent}
              onChange={(event) => patch({ privacy_consent: event.target.checked })}
            />
            I agree that Alotym may use this information to respond to my enquiry. I have read the privacy note.
          </label>
          <p><a href="/privacy">Read the privacy note</a>. It still needs owner review before launch.</p>
          {errors.privacy_consent ? <p className="vx_error" role="alert">{errors.privacy_consent}</p> : null}
          <p>{store.pricing.disclaimer}</p>
          <p>{store.production_timeframe} Delivery timing is confirmed separately.</p>
          {!storage_configured ? (
            <p className="al_callout">Demo mode is active. Creating a reference will not save this enquiry or any photos.</p>
          ) : null}
          {submit_error ? <p className="vx_error" role="alert">{submit_error}</p> : null}
        </div>
      ) : null}

      <div className="al_form_actions">
        {draft.step > 1 ? (
          <button className="vx_btn vx_btn_secondary" type="button" onClick={() => go_to_step(draft.step - 1)}>Back</button>
        ) : null}
        {draft.step < 5 ? (
          <button className="vx_btn" type="button" onClick={() => go_to_step(draft.step + 1)}>Continue</button>
        ) : (
          <button className="vx_btn" type="submit" disabled={is_submitting}>
            {is_submitting ? 'Sending enquiry' : 'Create enquiry reference'}
          </button>
        )}
      </div>
    </form>
  );
}

/** Props for a radio group that includes Other. */
type ChoiceGroupProps = {
  legend: string;
  name: string;
  choices: Choice[];
  value: string;
  other_value: string;
  error?: string;
  on_change: (value: string) => void;
  on_other: (value: string) => void;
};

/**
 * Radio choices with an optional free-text field.
 *
 * @param props - Choice group settings.
 * @returns The fieldset.
 */
function ChoiceGroup(props: ChoiceGroupProps): ReactElement {
  const other_id = `${props.name}-other`;
  return (
    <fieldset className="al_choice_set">
      <legend>{props.legend}</legend>
      <div className="al_choice_grid">
        {props.choices.map((choice) => (
          <label key={choice.value} className={props.value === choice.value ? 'is_selected' : ''}>
            <input
              type="radio"
              name={props.name}
              value={choice.value}
              checked={props.value === choice.value}
              onChange={() => props.on_change(choice.value)}
            />
            {choice.label}
          </label>
        ))}
      </div>
      {props.value === 'other' ? (
        <div className="vx_field">
          <label htmlFor={other_id}>Describe {props.legend.toLowerCase()}</label>
          <input id={other_id} className="form-control vx_input" value={props.other_value} onChange={(event) => props.on_other(event.target.value)} />
        </div>
      ) : null}
      {props.error ? <p className="vx_error" role="alert">{props.error}</p> : null}
    </fieldset>
  );
}

/** Props for one review row. */
type ReviewRowProps = {
  label: string;
  value: string;
  on_edit: () => void;
};

/**
 * One line of the review, with a way back to the step that collected it.
 *
 * @param props - Label, value, and edit handler.
 * @returns The row.
 */
function ReviewRow(props: ReviewRowProps): ReactElement {
  return (
    <div className="al_review_row">
      <p><strong>{props.label}</strong> {props.value.trim() || 'Not specified'}</p>
      <button type="button" onClick={props.on_edit}>Edit</button>
    </div>
  );
}

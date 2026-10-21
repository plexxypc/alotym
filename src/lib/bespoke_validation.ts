import {
  fit_choices,
  label_choice,
  length_choices,
  neckline_choices,
  occasion_choices,
  silhouette_choices,
  sleeve_choices,
} from '../data/bespoke_choices.ts';
import { get_product_by_slug } from '../data/products.ts';
import { store } from '../config/store.ts';
import type { BespokeDraft, MeasurementKey } from '../types/bespoke.ts';
import { is_valid_email } from './validate_email.ts';
import { is_valid_phone } from './validate_phone.ts';
import { has_measurement, measurement_error, measurement_text } from './measurements.ts';

/** Field errors for one step. An empty object means the step can continue. */
export type StepErrors = Record<string, string>;

const measurement_labels: Record<MeasurementKey, string> = {
  bust: 'Bust',
  underbust: 'Underbust',
  waist: 'Waist',
  hips: 'Hips',
  shoulder_width: 'Shoulder width',
  shoulder_to_waist: 'Shoulder to waist',
  dress_length: 'Dress length',
  sleeve_length: 'Sleeve length',
  arm_circumference: 'Arm circumference',
};

/**
 * Resolved country label.
 *
 * @param draft - Current draft.
 * @returns The country the customer named.
 */
export function country_label(draft: BespokeDraft): string {
  if (draft.country === 'other') {
    return draft.country_other.trim();
  }
  return draft.country.trim();
}

/**
 * Design name for summaries.
 *
 * @param draft - Current draft.
 * @returns A human design label.
 */
export function design_label(draft: BespokeDraft): string {
  if (draft.own_inspiration) {
    return 'Own inspiration';
  }
  return get_product_by_slug(draft.design_slug)?.name ?? '';
}

/**
 * Validates one form step.
 *
 * @param step - Step number from 1 to 5.
 * @param draft - Current draft.
 * @param image_count - Reference images currently previewed.
 * @returns Errors keyed by field name.
 */
export function validate_bespoke_step(step: number, draft: BespokeDraft, image_count: number): StepErrors {
  const errors: StepErrors = {};
  if (step === 1) {
    if (!draft.own_inspiration && !draft.design_slug) {
      errors.design = 'Choose a design, or select your own inspiration.';
    }
    if (draft.own_inspiration && draft.inspiration_notes.trim().length < 8 && image_count === 0) {
      errors.inspiration = 'Add a short description or select a reference image.';
    }
  }
  if (step === 2) {
    if (!draft.occasion) {
      errors.occasion = 'Choose an occasion, or select Other.';
    }
    if (draft.occasion === 'other' && draft.occasion_other.trim().length < 2) {
      errors.occasion_other = 'Describe the occasion.';
    }
    if (draft.silhouette === 'other' && draft.silhouette_other.trim().length < 2) {
      errors.silhouette_other = 'Describe the silhouette.';
    }
    if (draft.length === 'other' && draft.length_other.trim().length < 2) {
      errors.length_other = 'Describe the length.';
    }
    if (draft.sleeve === 'other' && draft.sleeve_other.trim().length < 2) {
      errors.sleeve_other = 'Describe the sleeve.';
    }
    if (draft.neckline === 'other' && draft.neckline_other.trim().length < 2) {
      errors.neckline_other = 'Describe the neckline.';
    }
    if (draft.fit === 'other' && draft.fit_other.trim().length < 2) {
      errors.fit_other = 'Describe the fit.';
    }
  }
  if (step === 3) {
    const keys = Object.keys(draft.measurements) as MeasurementKey[];
    keys.forEach((key) => {
      if (draft.sleeve === 'sleeveless' && (key === 'sleeve_length' || key === 'arm_circumference')) {
        return;
      }
      const record = draft.measurements[key];
      const message = measurement_error(record.entered_value, record.entered_unit || draft.unit);
      if (message) {
        errors[key] = message;
      }
    });
    if (!draft.needs_measurement_help) {
      (['bust', 'waist', 'hips'] as MeasurementKey[]).forEach((key) => {
        if (!has_measurement(draft.measurements[key])) {
          errors[key] = `Enter ${measurement_labels[key].toLowerCase()}, or ask for measurement help.`;
        }
      });
    }
  }
  if (step === 4) {
    if (draft.full_name.trim().length < 2) {
      errors.full_name = 'Enter your full name.';
    }
    if (draft.email.trim() && !is_valid_email(draft.email)) {
      errors.email = 'Enter a valid email address, or leave it blank.';
    }
    if (!is_valid_phone(draft.phone)) {
      errors.phone = 'Enter a WhatsApp number with a country code, such as +234 or +44. Nigerian numbers starting with 0 are also accepted.';
    }
    if (!draft.country) {
      errors.country = 'Choose a country.';
    }
    if (draft.country === 'other' && draft.country_other.trim().length < 2) {
      errors.country_other = 'Enter the country.';
    }
    if (draft.city.trim().length < 2) {
      errors.city = 'Enter your city.';
    }
    if (draft.delivery_destination.trim().length < 2) {
      errors.delivery_destination = 'Enter the delivery destination. A city and country is enough.';
    }
    if (draft.contact_channel !== 'whatsapp' && draft.contact_channel !== 'instagram') {
      errors.contact_channel = 'Choose WhatsApp or Instagram.';
    }
  }
  if (step === 5 && !draft.privacy_consent) {
    errors.privacy_consent = 'Confirm that Alotym may use these details to respond to the enquiry.';
  }
  return errors;
}

/**
 * Builds a readable enquiry summary. It is not an accepted order.
 *
 * @param draft - Completed draft.
 * @param reference - Generated reference.
 * @param image_names - File names selected in this session.
 * @returns Plain text the customer can copy.
 */
export function build_bespoke_summary(draft: BespokeDraft, reference: string, image_names: string[]): string {
  const product = draft.own_inspiration ? undefined : get_product_by_slug(draft.design_slug);
  const measurements = (Object.keys(draft.measurements) as MeasurementKey[])
    .filter((key) => measurement_text(draft.measurements[key]))
    .map((key) => `${measurement_labels[key]}: ${measurement_text(draft.measurements[key])}`);
  const lines = [
    `${store.store_name} bespoke enquiry`,
    `Reference: ${reference}`,
    'This is an enquiry only. It is not an accepted, paid, or booked order.',
    '',
    `Design: ${design_label(draft) || 'Not selected'}`,
  ];
  if (draft.own_inspiration && draft.inspiration_notes.trim()) {
    lines.push(`Inspiration: ${draft.inspiration_notes.trim()}`);
  }
  if (product?.is_demo_price) {
    lines.push('The website starting price is sample data and is not the quote.');
  }
  lines.push(
    `Occasion: ${label_choice(occasion_choices, draft.occasion, draft.occasion_other) || 'Not specified'}`,
    `Silhouette: ${label_choice(silhouette_choices, draft.silhouette, draft.silhouette_other) || 'Not specified'}`,
    `Length: ${label_choice(length_choices, draft.length, draft.length_other) || 'Not specified'}`,
    `Sleeves: ${label_choice(sleeve_choices, draft.sleeve, draft.sleeve_other) || 'Not specified'}`,
    `Neckline: ${label_choice(neckline_choices, draft.neckline, draft.neckline_other) || 'Not specified'}`,
    `Colours: ${draft.colours.trim() || 'Not specified'}`,
    `Fabric: ${draft.fabric.trim() || 'Not specified'}`,
    `Fit: ${label_choice(fit_choices, draft.fit, draft.fit_other) || 'Not specified'}`,
    `Design notes: ${draft.design_notes.trim() || 'None'}`,
    '',
    'Measurements (as entered)',
    draft.needs_measurement_help ? 'Customer asked for help taking measurements.' : 'Customer entered measurements.',
    ...(measurements.length > 0 ? measurements : ['No measurements entered.']),
    `Fit notes: ${draft.fit_notes.trim() || 'None'}`,
    '',
    `Name: ${draft.full_name.trim()}`,
    `Email: ${draft.email.trim() || 'Not provided'}`,
    `WhatsApp: ${draft.phone.trim()}`,
    `Country: ${country_label(draft) || 'Not specified'}`,
    `City: ${draft.city.trim()}`,
    `Delivery destination: ${draft.delivery_destination.trim()}`,
    `Preferred channel: ${draft.contact_channel || 'Not specified'}`,
    `Requested date: ${draft.occasion_date || 'Not specified'} (preference only, not a delivery guarantee)`,
    `Notes: ${draft.customer_notes.trim() || 'None'}`,
    '',
    image_names.length > 0
      ? `Reference image file names: ${image_names.join(', ')}. This summary does not include image links. Share the photos in the conversation if they are still on your device.`
      : 'No reference image was selected on the website.',
    store.reference_images.storage_note,
  );
  return lines.join('\n');
}

/**
 * Builds the message that may be prefilled in WhatsApp or copied for Instagram.
 * It omits measurements, street addresses, phone numbers, and image links.
 *
 * @param draft - Completed draft.
 * @param reference - Enquiry reference returned for this submission.
 * @param has_images - Whether the customer selected reference photos.
 * @returns A short non-sensitive description.
 */
export function build_brief_handoff(draft: BespokeDraft, reference: string, has_images: boolean): string {
  return [
    `${store.store_name} bespoke enquiry`,
    `Reference: ${reference}`,
    'This is an enquiry. It has not been accepted, booked, or paid.',
    `Design: ${design_label(draft) || 'Not selected'}`,
    `Occasion: ${label_choice(occasion_choices, draft.occasion, draft.occasion_other) || 'Not specified'}`,
    `Colours: ${draft.colours.trim() || 'Not specified'}`,
    `Country: ${country_label(draft) || 'Not specified'}`,
    `City: ${draft.city.trim() || 'Not specified'}`,
    `Measurement help requested: ${draft.needs_measurement_help ? 'Yes' : 'No'}`,
    has_images
      ? 'Reference photos are not included in this message. The customer will share them in the conversation.'
      : 'No reference photo is included in this message.',
    'Please confirm the final price, production timing, and shipping arrangements.',
  ].join('\n');
}

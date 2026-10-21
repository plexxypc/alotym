import { empty_measurement_record } from './measurements.ts';
import type { BespokeDraft, BespokeEnquiry, BespokePrefill, MeasurementKey, MeasurementRecord, MeasurementUnit } from '../types/bespoke.ts';

const draft_key = 'alotym_bespoke_draft_v1';
const enquiry_key = 'alotym_bespoke_enquiry_v1';

const measurement_keys: MeasurementKey[] = [
  'bust',
  'underbust',
  'waist',
  'hips',
  'shoulder_width',
  'shoulder_to_waist',
  'dress_length',
  'sleeve_length',
  'arm_circumference',
];

/**
 * Empty measurement map.
 *
 * @returns Blank measurements.
 */
function empty_measurements(): Record<MeasurementKey, MeasurementRecord> {
  return {
    bust: empty_measurement_record(),
    underbust: empty_measurement_record(),
    waist: empty_measurement_record(),
    hips: empty_measurement_record(),
    shoulder_width: empty_measurement_record(),
    shoulder_to_waist: empty_measurement_record(),
    dress_length: empty_measurement_record(),
    sleeve_length: empty_measurement_record(),
    arm_circumference: empty_measurement_record(),
  };
}

/**
 * Reads one stored measurement, including older drafts that saved a plain string.
 *
 * @param value - Stored measurement.
 * @param fallback_unit - Unit used by an older draft.
 * @returns A measurement record.
 */
function read_measurement(value: unknown, fallback_unit: MeasurementUnit): MeasurementRecord {
  if (typeof value === 'string') {
    return value.trim()
      ? { entered_value: value, entered_unit: fallback_unit }
      : empty_measurement_record();
  }
  if (!value || typeof value !== 'object') {
    return empty_measurement_record();
  }
  const record = value as Partial<MeasurementRecord>;
  const entered_value = as_string(record.entered_value);
  const entered_unit = record.entered_unit === 'cm' || record.entered_unit === 'in' ? record.entered_unit : '';
  if (!entered_value.trim() || !entered_unit) {
    return empty_measurement_record();
  }
  return { entered_value, entered_unit };
}

/**
 * A blank enquiry draft.
 *
 * @returns The starting form state.
 */
export function empty_bespoke_draft(): BespokeDraft {
  return {
    step: 1,
    design_slug: '',
    own_inspiration: false,
    inspiration_notes: '',
    occasion: '',
    occasion_other: '',
    silhouette: '',
    silhouette_other: '',
    length: '',
    length_other: '',
    sleeve: '',
    sleeve_other: '',
    neckline: '',
    neckline_other: '',
    colours: '',
    fabric: '',
    fit: '',
    fit_other: '',
    design_notes: '',
    unit: 'cm',
    needs_measurement_help: false,
    measurements: empty_measurements(),
    fit_notes: '',
    full_name: '',
    email: '',
    phone: '',
    country: '',
    country_other: '',
    city: '',
    delivery_destination: '',
    contact_channel: '',
    occasion_date: '',
    customer_notes: '',
    privacy_consent: false,
  };
}

/**
 * Reads a string field from unknown storage.
 *
 * @param value - Stored value.
 * @returns A string, or empty.
 */
function as_string(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/**
 * Restores a draft from session storage. Corrupt data returns a blank draft.
 *
 * @returns The draft for this tab.
 */
export function read_bespoke_draft(): BespokeDraft {
  const blank = empty_bespoke_draft();
  try {
    const raw = sessionStorage.getItem(draft_key);
    if (!raw) {
      return blank;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return blank;
    }
    const source = parsed as Partial<BespokeDraft>;
    const measurements = empty_measurements();
    const stored_measurements = source.measurements;
    const fallback_unit: MeasurementUnit = source.unit === 'in' ? 'in' : 'cm';
    if (stored_measurements && typeof stored_measurements === 'object') {
      measurement_keys.forEach((key) => {
        measurements[key] = read_measurement(stored_measurements[key], fallback_unit);
      });
    }
    const step = typeof source.step === 'number' && source.step >= 1 && source.step <= 5
      ? Math.floor(source.step)
      : 1;
    return {
      ...blank,
      ...source,
      step,
      unit: source.unit === 'in' ? 'in' : 'cm',
      contact_channel: source.contact_channel === 'whatsapp' || source.contact_channel === 'instagram'
        ? source.contact_channel
        : '',
      own_inspiration: source.own_inspiration === true,
      needs_measurement_help: source.needs_measurement_help === true,
      privacy_consent: source.privacy_consent === true,
      measurements,
      full_name: as_string(source.full_name),
      email: as_string(source.email),
      phone: as_string(source.phone),
      design_slug: as_string(source.design_slug),
      inspiration_notes: as_string(source.inspiration_notes),
      occasion: as_string(source.occasion),
      occasion_other: as_string(source.occasion_other),
      silhouette: as_string(source.silhouette),
      silhouette_other: as_string(source.silhouette_other),
      length: as_string(source.length),
      length_other: as_string(source.length_other),
      sleeve: as_string(source.sleeve),
      sleeve_other: as_string(source.sleeve_other),
      neckline: as_string(source.neckline),
      neckline_other: as_string(source.neckline_other),
      colours: as_string(source.colours),
      fabric: as_string(source.fabric),
      fit: as_string(source.fit),
      fit_other: as_string(source.fit_other),
      design_notes: as_string(source.design_notes),
      fit_notes: as_string(source.fit_notes),
      country: as_string(source.country),
      country_other: as_string(source.country_other),
      city: as_string(source.city),
      delivery_destination: as_string(source.delivery_destination),
      occasion_date: as_string(source.occasion_date),
      customer_notes: as_string(source.customer_notes),
    };
  } catch {
    return blank;
  }
}

/**
 * Saves the draft in session storage for this tab only.
 * This is not secure server storage and is cleared when the tab closes.
 *
 * @param draft - Current form state.
 */
export function write_bespoke_draft(draft: BespokeDraft): void {
  sessionStorage.setItem(draft_key, JSON.stringify(draft));
}

/**
 * Removes the in-progress draft.
 */
export function clear_bespoke_draft(): void {
  sessionStorage.removeItem(draft_key);
}

/**
 * Fills only empty preference fields. It never writes measurements or contact details.
 *
 * @param draft - Current draft.
 * @param prefill - Concierge or route hints.
 * @returns The merged draft.
 */
export function merge_bespoke_prefill(draft: BespokeDraft, prefill: BespokePrefill): BespokeDraft {
  const has_design = Boolean(draft.design_slug) || draft.own_inspiration;
  const use_own = !has_design && (prefill.own_inspiration === true || prefill.design_slug === 'own');
  const incoming_slug = prefill.design_slug && prefill.design_slug !== 'own' ? prefill.design_slug : '';
  return {
    ...draft,
    own_inspiration: draft.own_inspiration || use_own,
    design_slug: draft.design_slug || (use_own ? '' : incoming_slug),
    occasion: draft.occasion || prefill.occasion || '',
    colours: draft.colours || prefill.colours || '',
    country: draft.country || prefill.destination_country || '',
    design_notes: draft.design_notes || prefill.design_notes || '',
    needs_measurement_help: draft.needs_measurement_help || prefill.needs_measurement_help === true,
  };
}

/**
 * Writes a prefill into the tab draft and notifies an open form.
 *
 * @param prefill - Non-sensitive preference hints.
 */
export function publish_bespoke_prefill(prefill: BespokePrefill): void {
  const next = merge_bespoke_prefill(read_bespoke_draft(), prefill);
  write_bespoke_draft(next);
  window.dispatchEvent(new CustomEvent('alotym-bespoke-prefill'));
}

/**
 * Saves the submitted summary for this tab.
 *
 * @param enquiry - Browser-only enquiry record.
 */
export function write_bespoke_enquiry(enquiry: BespokeEnquiry): void {
  sessionStorage.setItem(enquiry_key, JSON.stringify(enquiry));
}

/**
 * Reads the enquiry summary for this tab.
 *
 * @returns The enquiry, or null when this tab has not submitted one.
 */
export function read_bespoke_enquiry(): BespokeEnquiry | null {
  try {
    const raw = sessionStorage.getItem(enquiry_key);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    const enquiry = parsed as Partial<BespokeEnquiry>;
    if (typeof enquiry.reference !== 'string' || typeof enquiry.brief_summary !== 'string') {
      return null;
    }
    return {
      reference: enquiry.reference,
      created_at: typeof enquiry.created_at === 'string' ? enquiry.created_at : '',
      brief_summary: enquiry.brief_summary,
      full_summary: typeof enquiry.full_summary === 'string' ? enquiry.full_summary : '',
      channel: enquiry.channel === 'whatsapp' || enquiry.channel === 'instagram' ? enquiry.channel : '',
      reference_image_names: Array.isArray(enquiry.reference_image_names)
        ? enquiry.reference_image_names.filter((name): name is string => typeof name === 'string')
        : [],
      saved_on_server: enquiry.saved_on_server === true,
      images_saved: enquiry.images_saved === true,
      storage_note: typeof enquiry.storage_note === 'string' ? enquiry.storage_note : '',
    };
  } catch {
    return null;
  }
}

/**
 * Removes the tab enquiry summary.
 */
export function clear_bespoke_enquiry(): void {
  sessionStorage.removeItem(enquiry_key);
}

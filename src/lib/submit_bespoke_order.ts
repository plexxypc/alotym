import { design_label } from './bespoke_validation.ts';
import type { BespokeDraft, MeasurementKey } from '../types/bespoke.ts';
import type { StagedReferenceImage } from './reference_images.ts';
import { is_allowed_reference_image } from './reference_images.ts';
import { store } from '../config/store.ts';
import { get_supabase_client, is_order_storage_configured } from './supabase_client.ts';

/** Result of trying to store a bespoke enquiry. */
export type SubmitBespokeResult =
  | {
    ok: true;
    mode: 'stored';
    reference: string;
    images_saved: boolean;
    image_note: string;
  }
  | {
    ok: true;
    mode: 'demo';
    reference: string;
  }
  | {
    ok: false;
    message: string;
  };

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
 * Creates a non-guessable reference for demo mode.
 * Stored orders receive their reference from the database instead.
 *
 * @returns A reference beginning with ALY-.
 */
export function create_enquiry_reference(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `ALY-${hex}`;
}

/**
 * Turns a database error into a message that does not claim the enquiry was saved.
 *
 * @param error - Error returned by Supabase.
 * @returns Text for the form.
 */
function submission_error_message(error: { message?: string } | null): string {
  const message = error?.message ?? '';
  const marker = 'enquiry_rejected:';
  const marker_index = message.indexOf(marker);
  if (marker_index >= 0) {
    return message.slice(marker_index + marker.length).trim();
  }
  return 'The enquiry was not saved. Your entries are still on this form. Try again, or contact Alotym if this continues.';
}

/**
 * Builds the payload the database function validates again.
 *
 * @param draft - Completed form draft.
 * @returns JSON the remote function accepts.
 */
function enquiry_payload(draft: BespokeDraft): Record<string, unknown> {
  const measurements: Record<string, { value: string; unit: string }> = {};
  measurement_keys.forEach((key) => {
    const record = draft.measurements[key];
    if (!record.entered_value.trim() || !record.entered_unit) {
      return;
    }
    measurements[key] = {
      value: record.entered_value.trim(),
      unit: record.entered_unit,
    };
  });
  return {
    design_label: design_label(draft) || 'Not selected',
    own_inspiration: draft.own_inspiration,
    inspiration_notes: draft.inspiration_notes.trim(),
    occasion: draft.occasion === 'other' ? draft.occasion_other.trim() : draft.occasion,
    silhouette: draft.silhouette === 'other' ? draft.silhouette_other.trim() : draft.silhouette,
    dress_length: draft.length === 'other' ? draft.length_other.trim() : draft.length,
    sleeve: draft.sleeve === 'other' ? draft.sleeve_other.trim() : draft.sleeve,
    neckline: draft.neckline === 'other' ? draft.neckline_other.trim() : draft.neckline,
    colours: draft.colours.trim(),
    fabric: draft.fabric.trim(),
    fit: draft.fit === 'other' ? draft.fit_other.trim() : draft.fit,
    design_notes: draft.design_notes.trim(),
    measurement_unit: draft.unit,
    needs_measurement_help: draft.needs_measurement_help,
    measurements,
    fit_notes: draft.fit_notes.trim(),
    full_name: draft.full_name.trim(),
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    country: draft.country === 'other' ? draft.country_other.trim() : draft.country,
    city: draft.city.trim(),
    delivery_destination: draft.delivery_destination.trim(),
    contact_channel: draft.contact_channel,
    occasion_date: draft.occasion_date,
    customer_notes: draft.customer_notes.trim(),
  };
}

/**
 * Uploads selected images into the private bucket and links them to the enquiry.
 * A failure here does not mean the enquiry row was lost.
 *
 * @param reference - Reference returned by the database.
 * @param images - Files still held in the form.
 * @returns Whether every selected image was confirmed.
 */
async function upload_reference_images(reference: string, images: StagedReferenceImage[]): Promise<{ images_saved: boolean; image_note: string }> {
  if (images.length === 0) {
    return { images_saved: true, image_note: 'No reference image was included.' };
  }
  const client = get_supabase_client();
  if (!client) {
    return { images_saved: false, image_note: 'Reference images were not saved because storage is not configured.' };
  }
  const paths: string[] = [];
  for (const image of images) {
    if (!is_allowed_reference_image(image.file) || image.file.size > store.reference_images.max_bytes) {
      return {
        images_saved: false,
        image_note: 'A reference image was not accepted. The enquiry was saved. Share the photos in the conversation.',
      };
    }
    const safe_name = image.file.name.replace(/[^a-zA-Z0-9._-]/g, '').slice(-80) || 'image';
    const path = `${reference}/${crypto.randomUUID()}-${safe_name}`;
    const uploaded = await client.storage.from('bespoke-references').upload(path, image.file, {
      contentType: image.file.type || 'application/octet-stream',
      upsert: false,
    });
    if (uploaded.error) {
      return {
        images_saved: false,
        image_note: 'The enquiry was saved, but the reference images were not confirmed. Share the photos in the conversation.',
      };
    }
    paths.push(path);
  }
  const attached = await client.rpc('attach_reference_images', {
    reference_token: reference,
    image_paths: paths,
  });
  if (attached.error) {
    return {
      images_saved: false,
      image_note: 'The enquiry was saved, but the reference images were not confirmed. Share the photos in the conversation.',
    };
  }
  return { images_saved: true, image_note: 'Reference images were saved in private storage.' };
}

/**
 * Stores a bespoke enquiry when Supabase is configured.
 * Without credentials this returns demo mode and does not pretend the enquiry was stored.
 *
 * @param draft - Completed form draft.
 * @param images - Reference photos selected in this tab.
 * @returns A confirmed reference, a labelled demo reference, or an error that keeps the form.
 */
export async function submit_bespoke_order(draft: BespokeDraft, images: StagedReferenceImage[]): Promise<SubmitBespokeResult> {
  if (!is_order_storage_configured()) {
    return {
      ok: true,
      mode: 'demo',
      reference: create_enquiry_reference(),
    };
  }
  const client = get_supabase_client();
  if (!client) {
    return {
      ok: false,
      message: 'The enquiry was not saved. Your entries are still on this form.',
    };
  }
  const submitted = await client.rpc('submit_bespoke_enquiry', {
    payload: enquiry_payload(draft),
  });
  if (submitted.error || typeof submitted.data !== 'string' || !submitted.data.startsWith('ALY-')) {
    return { ok: false, message: submission_error_message(submitted.error) };
  }
  const images_result = await upload_reference_images(submitted.data, images);
  return {
    ok: true,
    mode: 'stored',
    reference: submitted.data,
    images_saved: images_result.images_saved,
    image_note: images_result.image_note,
  };
}

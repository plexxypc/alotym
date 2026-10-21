/**
 * Bespoke enquiry types.
 * A submitted enquiry is stored on the server only when Supabase confirms it.
 */

/** Unit the customer chose for a measurement. */
export type MeasurementUnit = 'cm' | 'in';

/**
 * One measurement as the customer typed it.
 * The display unit can change without replacing this value.
 */
export type MeasurementRecord = {
  entered_value: string;
  entered_unit: MeasurementUnit | '';
};

/** Channel used to continue the enquiry. The site does not send the message. */
export type ContactChannel = 'whatsapp' | 'instagram';

/** Measurement keys collected for a dress. Unused keys stay blank. */
export type MeasurementKey =
  | 'bust'
  | 'underbust'
  | 'waist'
  | 'hips'
  | 'shoulder_width'
  | 'shoulder_to_waist'
  | 'dress_length'
  | 'sleeve_length'
  | 'arm_circumference';

/** In-progress enquiry kept for this browser tab. */
export type BespokeDraft = {
  step: number;
  design_slug: string;
  own_inspiration: boolean;
  inspiration_notes: string;
  occasion: string;
  occasion_other: string;
  silhouette: string;
  silhouette_other: string;
  length: string;
  length_other: string;
  sleeve: string;
  sleeve_other: string;
  neckline: string;
  neckline_other: string;
  colours: string;
  fabric: string;
  fit: string;
  fit_other: string;
  design_notes: string;
  unit: MeasurementUnit;
  needs_measurement_help: boolean;
  measurements: Record<MeasurementKey, MeasurementRecord>;
  fit_notes: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  country_other: string;
  city: string;
  delivery_destination: string;
  contact_channel: ContactChannel | '';
  occasion_date: string;
  customer_notes: string;
  privacy_consent: boolean;
};

/** Fields the concierge may prefill. Measurements and phone numbers are never included. */
export type BespokePrefill = {
  design_slug?: string;
  own_inspiration?: boolean;
  occasion?: string;
  colours?: string;
  destination_country?: string;
  design_notes?: string;
  needs_measurement_help?: boolean;
};

/** Enquiry summary kept for this tab after a confirmed or demo submission. */
export type BespokeEnquiry = {
  reference: string;
  created_at: string;
  brief_summary: string;
  full_summary: string;
  channel: ContactChannel | '';
  reference_image_names: string[];
  saved_on_server: boolean;
  images_saved: boolean;
  storage_note: string;
};

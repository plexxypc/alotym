import type { MeasurementRecord, MeasurementUnit } from '../types/bespoke.ts';

/** Centimetres in one inch. Used only when the customer switches units. */
const cm_per_inch = 2.54;

/**
 * Converts a measurement and keeps one decimal place.
 * Blank and invalid values are left unchanged. The caller's selected unit is what gets stored.
 *
 * @param value - Raw measurement text.
 * @param from_unit - Unit the number is currently in.
 * @param to_unit - Unit the customer just selected.
 * @returns The converted text, or the original text when conversion does not apply.
 */
export function convert_measurement(value: string, from_unit: MeasurementUnit, to_unit: MeasurementUnit): string {
  if (from_unit === to_unit || value.trim() === '') {
    return value;
  }
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return value;
  }
  const converted = from_unit === 'cm' ? number / cm_per_inch : number * cm_per_inch;
  const rounded = Math.round(converted * 10) / 10;
  return String(rounded);
}

/**
 * Creates an empty measurement that has not been typed yet.
 *
 * @returns A blank measurement record.
 */
export function empty_measurement_record(): MeasurementRecord {
  return { entered_value: '', entered_unit: '' };
}

/**
 * Shows a measurement in the unit currently selected on the form.
 * Switching back to the unit it was typed in restores the original text.
 *
 * @param record - Value as the customer typed it.
 * @param display_unit - Unit selected on the form.
 * @returns Text for the input.
 */
export function display_measurement(record: MeasurementRecord, display_unit: MeasurementUnit): string {
  if (!record.entered_value.trim() || !record.entered_unit || record.entered_unit === display_unit) {
    return record.entered_value;
  }
  return convert_measurement(record.entered_value, record.entered_unit, display_unit);
}

/**
 * Stores a measurement in the unit the customer is currently viewing.
 *
 * @param display_unit - Unit selected while typing.
 * @param typed_value - Text from the input.
 * @returns The measurement to keep.
 */
export function write_measurement(display_unit: MeasurementUnit, typed_value: string): MeasurementRecord {
  return {
    entered_value: typed_value,
    entered_unit: typed_value.trim() ? display_unit : '',
  };
}

/**
 * Formats the typed measurement for review and storage.
 *
 * @param record - Value as the customer typed it.
 * @returns A label such as `90 cm`, or an empty string.
 */
export function measurement_text(record: MeasurementRecord): string {
  if (!record.entered_value.trim() || !record.entered_unit) {
    return '';
  }
  return `${record.entered_value.trim()} ${record.entered_unit}`;
}

/**
 * True when the customer has typed a measurement.
 *
 * @param record - Stored measurement.
 * @returns Whether a value is present.
 */
export function has_measurement(record: MeasurementRecord | undefined): boolean {
  return Boolean(record?.entered_value.trim());
}

/**
 * Validates an optional measurement. Empty is allowed.
 *
 * @param value - Raw measurement text.
 * @param unit - Unit the customer selected.
 * @returns An error message, or null when the value is usable.
 */
export function measurement_error(value: string, unit: MeasurementUnit): string | null {
  if (!value.trim()) {
    return null;
  }
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    return 'Enter a number greater than zero.';
  }
  const max = unit === 'cm' ? 400 : 160;
  if (number > max) {
    return `Enter a measurement up to ${max} ${unit}.`;
  }
  return null;
}

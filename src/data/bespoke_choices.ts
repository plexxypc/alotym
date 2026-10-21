/**
 * Choice lists for the bespoke form. "Other" keeps the form from being a closed set.
 */

/** One selectable option. */
export type Choice = {
  value: string;
  label: string;
};

/** Occasions a customer can start from. */
export const occasion_choices: Choice[] = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'reception', label: 'Reception' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'ceremony', label: 'Ceremony' },
  { value: 'evening', label: 'Evening' },
  { value: 'everyday', label: 'Everyday' },
  { value: 'other', label: 'Other' },
];

/** Silhouettes. */
export const silhouette_choices: Choice[] = [
  { value: 'fitted', label: 'Fitted' },
  { value: 'a-line', label: 'A-line' },
  { value: 'ball-gown', label: 'Full / ball gown' },
  { value: 'mermaid', label: 'Mermaid' },
  { value: 'column', label: 'Column' },
  { value: 'slip', label: 'Slip' },
  { value: 'not-sure', label: 'Not sure yet' },
  { value: 'other', label: 'Other' },
];

/** Hem lengths. */
export const length_choices: Choice[] = [
  { value: 'mini', label: 'Mini' },
  { value: 'knee', label: 'Knee' },
  { value: 'midi', label: 'Midi' },
  { value: 'tea', label: 'Tea' },
  { value: 'floor', label: 'Floor' },
  { value: 'not-sure', label: 'Not sure yet' },
  { value: 'other', label: 'Other' },
];

/** Sleeve styles. */
export const sleeve_choices: Choice[] = [
  { value: 'sleeveless', label: 'Sleeveless' },
  { value: 'cap', label: 'Cap' },
  { value: 'short', label: 'Short' },
  { value: 'three-quarter', label: 'Three-quarter' },
  { value: 'long', label: 'Long' },
  { value: 'off-shoulder', label: 'Off-shoulder' },
  { value: 'not-sure', label: 'Not sure yet' },
  { value: 'other', label: 'Other' },
];

/** Necklines. */
export const neckline_choices: Choice[] = [
  { value: 'sweetheart', label: 'Sweetheart' },
  { value: 'v', label: 'V-neck' },
  { value: 'square', label: 'Square' },
  { value: 'boat', label: 'Boat' },
  { value: 'high', label: 'High' },
  { value: 'halter', label: 'Halter' },
  { value: 'not-sure', label: 'Not sure yet' },
  { value: 'other', label: 'Other' },
];

/** Fit preferences. */
export const fit_choices: Choice[] = [
  { value: 'close', label: 'Close-fitting' },
  { value: 'tailored', label: 'Tailored' },
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'not-sure', label: 'Not sure yet' },
  { value: 'other', label: 'Other' },
];

/**
 * Label for a stored choice value.
 *
 * @param choices - Options for the field.
 * @param value - Stored value.
 * @param other_text - Free text when the value is `other`.
 * @returns Readable copy, or an empty string when unset.
 */
export function label_choice(choices: Choice[], value: string, other_text = ''): string {
  if (!value) {
    return '';
  }
  if (value === 'other') {
    return other_text.trim() ? `Other: ${other_text.trim()}` : 'Other';
  }
  return choices.find((choice) => choice.value === value)?.label ?? value;
}

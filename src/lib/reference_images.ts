import { store } from '../config/store.ts';

/** A reference photo staged in the browser until a confirmed private upload. */
export type StagedReferenceImage = {
  local_id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  preview_url: string;
  file: File;
  stored_on_server: false;
};

/** Result of staging one file. */
export type StageReferenceImageResult =
  | { ok: true; image: StagedReferenceImage }
  | { ok: false; message: string };

const accepted_types = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

/**
 * True when the file is a common image the form can preview.
 *
 * @param file - File chosen on the device.
 * @returns Whether the type or extension is allowed.
 */
export function is_allowed_reference_image(file: File): boolean {
  if (accepted_types.has(file.type)) {
    return true;
  }
  return /\.(jpe?g|png|webp|gif)$/i.test(file.name);
}

/**
 * Stages a reference image for preview only.
 * Replace this function when a private upload service exists. Do not write the file into `public`.
 *
 * @param file - File chosen on the device.
 * @returns A local preview, or a validation message.
 */
export function stage_reference_image(file: File): StageReferenceImageResult {
  if (!is_allowed_reference_image(file)) {
    return { ok: false, message: 'Use a JPEG, PNG, WEBP, or GIF image.' };
  }
  if (file.size <= 0) {
    return { ok: false, message: 'That file is empty. Choose a different image.' };
  }
  if (file.size > store.reference_images.max_bytes) {
    const mb = Math.round(store.reference_images.max_bytes / (1024 * 1024));
    return { ok: false, message: `Each image must be ${mb} MB or smaller.` };
  }
  return {
    ok: true,
    image: {
      local_id: typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `img-${Date.now()}-${file.name}`,
      file_name: file.name,
      mime_type: file.type || 'image',
      size_bytes: file.size,
      preview_url: URL.createObjectURL(file),
      file,
      stored_on_server: false,
    },
  };
}

/**
 * Releases a preview URL created for a staged image.
 *
 * @param image - Staged image to drop.
 */
export function release_reference_image(image: StagedReferenceImage): void {
  URL.revokeObjectURL(image.preview_url);
}

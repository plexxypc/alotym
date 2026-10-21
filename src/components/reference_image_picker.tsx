import type { ChangeEvent, ReactElement } from 'react';
import { store } from '../config/store.ts';
import { release_reference_image, stage_reference_image } from '../lib/reference_images.ts';
import type { StagedReferenceImage } from '../lib/reference_images.ts';

/** Props for the reference-image picker. */
export type ReferenceImagePickerProps = {
  images: StagedReferenceImage[];
  error: string;
  on_change: (images: StagedReferenceImage[], error: string) => void;
};

/**
 * Lets a customer preview reference photos from their device.
 * Previews are not uploads.
 *
 * @param props - Current previews and the change handler.
 * @returns The picker.
 */
export function ReferenceImagePicker(props: ReferenceImagePickerProps): ReactElement {
  function handle_files(event: ChangeEvent<HTMLInputElement>): void {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (selected.length === 0) {
      return;
    }
    const next = [...props.images];
    let message = '';
    selected.forEach((file) => {
      if (next.length >= store.reference_images.max_count) {
        message = `You can select up to ${store.reference_images.max_count} images.`;
        return;
      }
      const staged = stage_reference_image(file);
      if (!staged.ok) {
        message = staged.message;
        return;
      }
      next.push(staged.image);
    });
    props.on_change(next, message);
  }

  function remove_image(local_id: string): void {
    const image = props.images.find((item) => item.local_id === local_id);
    if (image) {
      release_reference_image(image);
    }
    props.on_change(props.images.filter((item) => item.local_id !== local_id), '');
  }

  return (
    <div className="al_uploads">
      <label className="vx_btn vx_btn_secondary" htmlFor="reference-images">
        Select reference images
      </label>
      <input
        id="reference-images"
        className="al_file_input"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
        multiple
        onChange={handle_files}
      />
      <p>{store.reference_images.storage_note}</p>
      {props.error ? <p className="vx_error" role="alert">{props.error}</p> : null}
      {props.images.length > 0 ? (
        <ul className="al_previews">
          {props.images.map((image) => (
            <li key={image.local_id}>
              <img src={image.preview_url} alt={`Preview of ${image.file_name}`} />
              <p>{image.file_name}</p>
              <button type="button" onClick={() => remove_image(image.local_id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reference image selected.</p>
      )}
    </div>
  );
}

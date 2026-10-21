import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Locks body scroll, focuses the close control, and closes on Escape.
 *
 * @param is_open - Whether the dialog is visible.
 * @param on_close - Callback that closes the dialog.
 * @param close_button_ref - Close button to focus when the dialog opens.
 */
export function use_dialog_effects(
  is_open: boolean,
  on_close: () => void,
  close_button_ref: RefObject<HTMLButtonElement | null>,
): void {
  useEffect(() => {
    if (!is_open) {
      return;
    }
    const previous_overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    close_button_ref.current?.focus();

    function on_key_down(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        on_close();
      }
    }

    window.addEventListener('keydown', on_key_down);
    return () => {
      document.body.style.overflow = previous_overflow;
      window.removeEventListener('keydown', on_key_down);
    };
  }, [is_open, on_close, close_button_ref]);
}

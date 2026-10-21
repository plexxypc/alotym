import type { ChangeEvent, ReactElement } from 'react';
import { Minus, Plus } from 'lucide-react';

/** Props for the quantity control. */
export type QuantitySelectorProps = {
  input_id: string;
  quantity: number;
  max: number;
  min?: number;
  on_change: (next_quantity: number) => void;
  label?: string;
};

/**
 * Plus and minus quantity control. Values outside the stock range are ignored.
 *
 * @param props - Current quantity, bounds, and change handler.
 * @returns The quantity field.
 */
export function QuantitySelector(props: QuantitySelectorProps): ReactElement {
  const min = props.min ?? 1;
  const label = props.label ?? 'Quantity';

  function commit(next_quantity: number): void {
    if (!Number.isInteger(next_quantity) || next_quantity < min || next_quantity > props.max) {
      return;
    }
    props.on_change(next_quantity);
  }

  function handle_input(event: ChangeEvent<HTMLInputElement>): void {
    const parsed = Number(event.target.value);
    commit(parsed);
  }

  return (
    <div className="vx_qty">
      <label htmlFor={props.input_id}>{label}</label>
      <div className="vx_qty_controls">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => commit(props.quantity - 1)}
          disabled={props.quantity <= min}
        >
          <Minus size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <input
          id={props.input_id}
          type="number"
          inputMode="numeric"
          min={min}
          max={props.max}
          value={props.quantity}
          onChange={handle_input}
        />
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => commit(props.quantity + 1)}
          disabled={props.quantity >= props.max}
        >
          <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

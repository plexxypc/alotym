import { store } from '../config/store.ts';
import type { CurrencyConfig } from '../config/types.ts';
import type { Product } from '../types/catalog.ts';
import { get_unit_price } from './catalog.ts';

/** Display price for a catalogue card or design page. */
export type ProductPriceDisplay = {
  label: string;
  note: string;
  is_demo: boolean;
};

/**
 * Formats a naira amount with `Intl.NumberFormat`.
 * Amounts are whole naira. The locale and currency come from the store config.
 *
 * @param amount - Whole currency amount.
 * @param currency - Locale and ISO currency code. Defaults to the store currency.
 * @returns A formatted currency string such as the local naira representation.
 */
export function format_money(amount: number, currency: CurrencyConfig = store.currency): string {
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a design price. Bespoke listings use the configured starting-price prefix.
 * This does not convert between currencies.
 *
 * @param product - Catalogue design.
 * @returns The visible price label and any explanatory note.
 */
export function format_product_price(product: Product): ProductPriceDisplay {
  const amount = format_money(get_unit_price(product));
  if (product.listing_mode === 'bespoke' && store.pricing.show_starting_prices) {
    return {
      label: `${store.pricing.prefix} ${amount}`.trim(),
      note: product.price_note.trim() || store.pricing.disclaimer,
      is_demo: product.is_demo_price,
    };
  }
  return {
    label: amount,
    note: product.price_note.trim(),
    is_demo: product.is_demo_price,
  };
}

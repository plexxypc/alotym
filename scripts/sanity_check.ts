import { products } from '../src/data/products.ts';
import { collections } from '../src/data/collections.ts';
import { filter_products, get_unit_price } from '../src/lib/catalog.ts';
import { add_cart_line, get_cart_subtotal } from '../src/lib/cart_math.ts';
import { get_order_total } from '../src/lib/delivery.ts';
import { build_order_whatsapp_message, build_whatsapp_url } from '../src/lib/whatsapp.ts';
import { is_valid_phone } from '../src/lib/validate_phone.ts';
import { get_paystack_client_status, start_paystack_checkout } from '../src/payments/paystack.ts';
import { resolve_store_config, store } from '../src/config/store.ts';
import type { CartLine } from '../src/types/cart.ts';
import type { DemoOrder } from '../src/types/order.ts';

/**
 * Runs local checks for catalogue, cart limits, phone numbers, totals, and WhatsApp links.
 */
function run_sanity_checks(): void {
  const failures: string[] = [];
  const expect = (condition: boolean, message: string): void => {
    if (!condition) {
      failures.push(message);
    }
  };

  const ids = new Set(products.map((product) => product.id));
  const slugs = new Set(products.map((product) => product.slug));
  expect(products.length >= 12, 'catalogue should include at least 12 products');
  expect(ids.size === products.length, 'product ids should be unique');
  expect(slugs.size === products.length, 'product slugs should be unique');
  const collection_slugs = new Set(collections.map((collection) => collection.slug));
  products.forEach((product) => {
    expect(collection_slugs.has(product.collection_slug), `${product.slug} collection exists`);
    expect(product.image_urls.length > 0, `${product.slug} has an image`);
  });

  const tops = filter_products(products, { category: 'tops', sort: 'featured' });
  expect(tops.length > 0 && tops.every((product) => product.category === 'tops'), 'category filter');
  const found = filter_products(products, { search: 'duffel' });
  expect(found.some((product) => product.slug === 'session-duffel'), 'search finds the duffel');
  const by_price = filter_products(products, { sort: 'price_asc' });
  const prices = by_price.map((product) => get_unit_price(product));
  const sorted_prices = [...prices].sort((left, right) => left - right);
  expect(prices.join(',') === sorted_prices.join(','), 'price sort is ascending');

  const tee = products.find((product) => product.slug === 'meridian-run-tee');
  const sold_out = products.find((product) => product.slug === 'form-studio-bra');
  if (!tee || !sold_out) {
    throw new Error('expected demo products are missing');
  }
  const missing_size = add_cart_line([], { product: tee, quantity: 1, size: '', colour: tee.colours[0]?.name ?? '' });
  expect(missing_size.ok === false, 'size is required');
  const added = add_cart_line([], {
    product: tee,
    quantity: 2,
    size: tee.sizes[0] ?? '',
    colour: tee.colours[0]?.name ?? '',
  });
  expect(added.ok, 'valid add succeeds');
  const over_stock = add_cart_line(added.lines, {
    product: tee,
    quantity: tee.stock_quantity,
    size: tee.sizes[0] ?? '',
    colour: tee.colours[0]?.name ?? '',
  });
  expect(over_stock.ok === false, 'stock limit blocks extra quantity');
  const blocked = add_cart_line([], {
    product: sold_out,
    quantity: 1,
    size: sold_out.sizes[0] ?? '',
    colour: sold_out.colours[0]?.name ?? '',
  });
  expect(blocked.ok === false, 'sold out cannot be purchased');

  expect(is_valid_phone('08031234567'), 'nigerian local number');
  expect(is_valid_phone('+234 803 123 4567'), 'nigerian international number');
  expect(is_valid_phone('+447911123456'), 'international number');
  expect(is_valid_phone('12345') === false, 'short number rejected');

  const line = added.lines[0];
  if (!line) {
    throw new Error('cart line missing');
  }
  const subtotal = get_cart_subtotal(added.lines);
  const lagos = store.delivery_options.find((option) => option.id === 'lagos');
  expect(Boolean(lagos), 'lagos delivery exists');
  const total = get_order_total(subtotal, lagos?.cost ?? 0);
  expect(total === subtotal + (lagos?.cost ?? 0), 'total adds delivery');

  const order: DemoOrder = {
    reference: 'VX-TEST',
    created_at: '2026-10-20T00:00:00.000Z',
    status: 'demo_request',
    customer_name: 'Ada Okonkwo',
    phone: '08031234567',
    email: 'ada@example.com',
    delivery_address: '14 Admiralty Way, Lagos',
    delivery_method_id: 'lagos',
    delivery_method_label: 'Lagos dispatch',
    delivery_cost: lagos?.cost ?? 0,
    fulfilment_method: 'whatsapp',
    lines: added.lines as CartLine[],
    subtotal,
    total,
    whatsapp_url: '',
  };
  const message = build_order_whatsapp_message(order, store.store_name);
  const url = build_whatsapp_url(store.contact.whatsapp_number, message);
  expect(message.includes('Ada Okonkwo') && message.includes('not a paid order'), 'whatsapp summary is readable');
  expect(url.startsWith('https://wa.me/') && url.includes('text='), 'whatsapp link is generated, not sent');

  const paystack = start_paystack_checkout();
  expect(paystack.ok === false, 'paystack cannot charge');
  expect(get_paystack_client_status(store).can_charge === false, 'status stays disabled');
  const blank = resolve_store_config({});
  expect(blank.currency.code === 'NGN', 'default currency is naira');
  expect(blank.delivery_options.length > 0, 'default delivery exists');

  if (failures.length > 0) {
    throw new Error(failures.join('\n'));
  }
}

run_sanity_checks();

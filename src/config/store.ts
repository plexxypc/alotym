import { brand_photos, stock_photo } from '../data/image.ts';
import type {
  BrandColours,
  CallToAction,
  CurrencyOption,
  DeepPartial,
  DeliveryOption,
  FaqItem,
  GalleryTile,
  MeasurementPoint,
  NavItem,
  ProcessStep,
  StoreConfig,
  TypographyConfig,
} from './types.ts';

/**
 * Alotym store configuration.
 * Edit `client_settings` to change brand details. Components read the resolved `store` export.
 * Leave unknown contact fields blank. Do not invent phone numbers, emails, or social accounts.
 */

const default_colours: BrandColours = {
  background: '#f6f1ea',
  surface: '#fffcf8',
  ink: '#1c1410',
  charcoal: '#3a2e28',
  muted: '#7a6a60',
  line: '#e6dcd2',
  accent: '#c4511a',
  accent_contrast: '#fff8f3',
  signal: '#f0d3bf',
  danger: '#8f3a2a',
};

const default_type: TypographyConfig = {
  display_font_family: '"Cormorant Garamond", Georgia, serif',
  body_font_family: '"Outfit", "Segoe UI", sans-serif',
  google_fonts_href:
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Outfit:wght@300;400;500;600&display=swap',
  headline_letter_spacing: '-0.03em',
  label_letter_spacing: '0.16em',
};

const default_navigation: NavItem[] = [
  { label: 'Shop Designs', path: '/shop' },
  { label: 'Bespoke Orders', path: '/bespoke' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'About', path: '/about' },
];

const default_currencies: CurrencyOption[] = [
  { code: 'NGN', locale: 'en-NG', label: 'Nigerian naira (NGN)' },
];

const price_disclaimer = 'Starting price only. Your final quote depends on your selected fabrics, design modifications, measurements, and other requirements. Alotym will confirm the final price before your order is accepted.';

const default_steps: ProcessStep[] = [
  {
    title: 'Choose a design or share your inspiration',
    text: 'Start from a design in the catalogue, or describe an idea of your own. A reference photo can be selected on your device.',
  },
  {
    title: 'Tell us your preferences and measurements',
    text: 'Share the occasion, silhouette, colours, fabric ideas, and the measurements you have. You can also ask for help measuring.',
  },
  {
    title: 'Discuss feasibility, pricing, and timing',
    text: 'Alotym confirms what can be made, the final price, and the timing for your destination. A request is not a guarantee.',
  },
  {
    title: 'Confirm the order through the official channel',
    text: 'Payment and acceptance happen in conversation with Alotym on the configured WhatsApp or Instagram account.',
  },
];

const default_faqs: FaqItem[] = [
  {
    id: 'pricing',
    question: 'How much does a custom dress cost?',
    answer: `Listed figures on this demonstration are sample starting prices in Nigerian naira. ${price_disclaimer}`,
    show_on_home: true,
  },
  {
    id: 'measurements',
    question: 'How do I take my measurements?',
    answer: 'You can enter measurements in centimetres or inches, or choose help from Alotym instead of filling every field. The measurement guide explains each point. These figures are for making a garment. They are not a health or body assessment.',
    show_on_home: true,
  },
  {
    id: 'international',
    question: 'Can I order from outside Nigeria?',
    answer: 'Customers outside Nigeria can enquire. International shipping arrangements are still being finalised, so this site does not promise worldwide delivery, a shipping cost, or a delivery date. Contact Alotym to confirm whether shipping is available and how it will be arranged.',
    show_on_home: true,
  },
  {
    id: 'timeline',
    question: 'How long does production take?',
    answer: 'Production is estimated at about 2–5 days, depending on how complex the customisation is. That is a production estimate, not a guaranteed delivery date. Alotym confirms the exact production timeline for each order. Delivery timing is separate and is not included in this estimate.',
    show_on_home: true,
  },
  {
    id: 'how_it_works',
    question: 'How does bespoke ordering work?',
    answer: 'Choose a design or share inspiration, describe the dress and your measurements, then review the enquiry. Submitting the form does not book or pay for a dress. Alotym confirms the order in the official messaging channel.',
    show_on_home: false,
  },
  {
    id: 'customization',
    question: 'Can every fabric or design change be made?',
    answer: 'You can describe fabric, colour, silhouette, length, sleeves, neckline, occasion, and other preferences. Alotym will say what is feasible. A request on the form does not guarantee that a fabric or modification is available.',
    show_on_home: false,
  },
  {
    id: 'privacy',
    question: 'What happens to my measurements and photos?',
    answer: 'The form collects the design, preferences, measurements or a request for measurement help, contact details, and optional reference photos so Alotym can reply. When secure storage is configured, that information is saved privately for the studio. When it is not configured, demo mode keeps the enquiry in this browser tab and does not store it on a server. Measurements and private photos are not placed in the WhatsApp message or the page address.',
    show_on_home: false,
  },
  {
    id: 'payment',
    question: 'How do I pay?',
    answer: 'Payment, deposit, cancellation, alteration, and refund terms have not been confirmed. Final pricing and payment terms are discussed and confirmed before an order is accepted. This website does not take payment.',
    show_on_home: false,
  },
];

const default_measurements: MeasurementPoint[] = [
  { id: 'bust', label: 'Bust', guidance: 'Measure around the fullest part of the bust. Keep the tape level and close, without compressing.' },
  { id: 'underbust', label: 'Underbust', guidance: 'Measure directly under the bust, around the ribcage. Useful for a fitted bodice. Leave it blank if it does not apply.' },
  { id: 'waist', label: 'Waist', guidance: 'Measure around the natural waist, where the torso bends.' },
  { id: 'hips', label: 'Hips', guidance: 'Measure around the fullest part of the hips and seat, with the tape level.' },
  { id: 'shoulder_width', label: 'Shoulder width', guidance: 'Measure across the back from the outer edge of one shoulder to the other.' },
  { id: 'shoulder_to_waist', label: 'Shoulder to waist', guidance: 'Measure from the shoulder point down to the natural waist.' },
  { id: 'dress_length', label: 'Dress length', guidance: 'Measure to the hem you want, and note where you started, such as the shoulder or the waist.' },
  { id: 'sleeve_length', label: 'Sleeve length', guidance: 'Measure from the shoulder seam to the sleeve length you want. Skip this for a sleeveless dress.' },
  { id: 'arm_circumference', label: 'Arm circumference', guidance: 'Measure around the fullest part of the upper arm when a sleeve needs to fit. Skip this if it does not apply.' },
];

const placeholder_policy = 'This text is a placeholder. It is not an owner-approved policy and must be replaced before launch.';

/**
 * Client-facing settings. Change names, colours, catalogue messaging, and contact details here.
 */
export const client_settings: DeepPartial<StoreConfig> = {
  store_name: 'Alotym',
  tagline: 'Custom-made dresses for customers in Nigeria and abroad.',
  logo: {
    text: 'Alotym',
    image_path: '/images/logo_alotym.png',
    alt: 'Alotym',
  },
  brand_colours: default_colours,
  typography: default_type,
  /* Width breakpoints live in src/styles/main.css as --vx-container-max. */
  layout: {
    content_max_width: '1680px',
  },
  currency: {
    code: 'NGN',
    locale: 'en-NG',
  },
  supported_currencies: default_currencies,
  customer_notes: {
    nigeria: 'Customers in Nigeria use the same bespoke enquiry. Delivery within Nigeria is confirmed with Alotym and is not quoted on this site.',
    international: 'International shipping arrangements are still being finalised. This site does not promise worldwide availability, a shipping cost, or a delivery date. Contact Alotym to confirm whether shipping is available and how it will be arranged. Customs, taxes, and duties are not estimated here.',
  },
  pricing: {
    show_starting_prices: true,
    prefix: 'From',
    disclaimer: price_disclaimer,
    demo_label: 'Sample starting price for this demonstration. Not an Alotym quote.',
  },
  production_timeframe: 'Approximately 2–5 days, depending on customisation complexity. This is a production estimate, not a guaranteed delivery date. Alotym confirms the exact production timeline for each order.',
  production_timeframe_fallback: 'A production timeline has not been set. Alotym will confirm timing for your design before an order is accepted. Delivery timing is confirmed separately.',
  primary_cta: {
    label: 'Create Your Custom Dress',
    path: '/bespoke',
  },
  contact: {
    email: '',
    phone_display: '+234 818 644 4424',
    phone_tel: '+2348186444424',
    whatsapp_number: '2348186444424',
    whatsapp_default_message: 'Hello Alotym, I would like to enquire about a custom dress.',
    instagram_handle: 'the_alotym',
    instagram_url: 'https://www.instagram.com/the_alotym/',
  },
  address: {
    line_1: '',
    line_2: '',
    city: '',
    country: '',
  },
  hours: '',
  social_links: [
    { label: 'Instagram', url: 'https://www.instagram.com/the_alotym/' },
  ],
  announcement: {
    text: 'Custom dresses are made to order. Send an enquiry and Alotym will confirm the design, price, and timing.',
    link_label: 'Start an enquiry',
    link_path: '/bespoke',
  },
  homepage: {
    hero: {
      kicker: 'Bespoke fashion',
      headline: 'Made for You.\nDesigned by You.',
      supporting_text: 'Discover a design you love, make it your own, and let us bring your vision to life.',
      cta_label: 'Explore Designs',
      cta_path: '/shop',
      secondary_cta_label: 'Create Your Custom Dress',
      secondary_cta_path: '/bespoke',
      image_url: brand_photos.shirt_dress,
      image_alt: 'Woman in a black shirt dress with gold and white motifs',
    },
    campaigns: [],
    promo: {
      kicker: 'Begin',
      title: 'Tell us the dress you have in mind',
      text: 'Choose a sample design or bring your own inspiration. Alotym confirms the details with you before anything is accepted.',
      cta_label: 'Create Your Custom Dress',
      cta_path: '/bespoke',
    },
    brand_story: {
      kicker: 'About',
      title: 'Custom-made fashion, discussed with you.',
      paragraphs: [
        'Alotym makes custom dresses for customers in Nigeria and for Nigerians and other clients abroad.',
        'This website presents sample designs and a way to prepare an enquiry. It does not publish a studio history, a street address, or guarantees that have not been supplied.',
        'When you are ready, describe the dress and share your measurements. The final design, price, and timing are confirmed directly with Alotym.',
      ],
      cta_label: 'Read about the studio',
      cta_path: '/about',
      image_url: brand_photos.blue_dress,
      image_alt: 'Woman in a royal blue midi dress with a gathered bodice and full skirt',
    },
    newsletter_title: 'Studio notes',
    newsletter_text: 'This signup stays on the page. It does not send email.',
  },
  atelier: {
    process_kicker: 'The process',
    process_title: 'How a bespoke enquiry moves forward',
    steps: default_steps,
    personalization_kicker: 'Make it yours',
    personalization_title: 'Tell us what you want to change',
    personalization_text: 'Describe the fabric, colours, silhouette, length, sleeve, neckline, occasion, and any other detail that matters. Alotym will say what is possible. Not every requested fabric or modification can be guaranteed.',
    personalization_points: [
      'Fabric and colour direction',
      'Silhouette, length, and sleeves',
      'Neckline and fit',
      'Occasion and reference images',
    ],
    gallery_kicker: 'Looks',
    gallery_title: 'A study in cloth, colour, and volume',
    gallery: [
      {
        image_url: brand_photos.leaf_dress,
        image_alt: 'Woman in a blue, gold, and white leaf-print shirt dress',
        caption: 'Botanical print',
      },
      {
        image_url: brand_photos.coral_dress,
        image_alt: 'Woman in a coral square-neck dress with short sleeves and an asymmetric hem',
        caption: 'Colour and cloth',
      },
      {
        image_url: brand_photos.shirt_dress,
        image_alt: 'Woman in a black shirt dress with gold and white motifs',
        caption: 'Motif shirt dress',
      },
      {
        image_url: brand_photos.orange_print_dress,
        image_alt: 'Woman in an orange and black halter dress with a full black-and-white printed skirt',
        caption: 'Halter print',
      },
    ],
    measure_kicker: 'Fit',
    measure_title: 'Measurements, in your unit',
    measure_text: 'Measure with a soft tape and record centimetres or inches. Switching units does not change the measurement you typed. Not every measurement is needed for every dress. These instructions are pending owner review and are not an approved Alotym fitting guide.',
    faq_kicker: 'Questions',
    faq_title: 'Before you enquire',
  },
  measurement_points: default_measurements,
  measurement_guide_approved: false,
  measurement_guide_review_note: 'Pending owner review. These measurement instructions are a draft for the website and have not been approved by Alotym.',
  faqs: default_faqs,
  navigation: [
    {
      label: 'Shop Designs',
      path: '/shop',
      children: [
        { label: 'All designs', path: '/shop' },
        { label: 'Signature prints', path: '/collections/signature-prints' },
        { label: 'Evening', path: '/collections/evening' },
        { label: 'Day dresses', path: '/collections/day-dresses' },
        { label: 'Ceremony', path: '/collections/ceremony' },
      ],
    },
    { label: 'Bespoke Orders', path: '/bespoke' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'About', path: '/about' },
  ],
  footer_navigation: [
    { label: 'Shop designs', path: '/shop' },
    { label: 'Start a bespoke order', path: '/bespoke' },
    { label: 'How it works', path: '/how-it-works' },
    { label: 'Measurement guide', path: '/measurements' },
    { label: 'About', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
    { label: 'Privacy', path: '/privacy' },
    { label: 'Custom-order policy', path: '/custom-order-policy' },
  ],
  delivery_options: [
    {
      id: 'confirm-with-alotym',
      label: 'Delivery to be confirmed',
      cost: 0,
      estimate: 'Confirmed with Alotym',
      description: 'This ready-to-wear checkout does not quote shipping. Availability and cost are confirmed with Alotym.',
    },
  ],
  policies: {
    approved: false,
    review_note: `${placeholder_policy} Do not treat the sections below as binding terms.`,
    returns: 'Draft only. A refund or returns rule has not been confirmed. Any applicable refund or return condition will be discussed and confirmed before an order is accepted.',
    alteration: 'Draft only. An alteration rule has not been confirmed. Any applicable alteration condition will be discussed and confirmed before an order is accepted.',
    cancellation: 'Draft only. A cancellation rule has not been confirmed. Any applicable cancellation condition will be discussed and confirmed before an order is accepted.',
    custom_order: 'Draft only. An enquiry is not an accepted order. Final pricing and payment terms are discussed and confirmed with Alotym before an order is accepted. The listed starting price is not the final price.',
    delivery: 'Draft only. Delivery arrangements have not been confirmed. They are separate from the 2–5 day production estimate. Delivery will be discussed and confirmed before an order is accepted. International shipping arrangements are still being finalised.',
    privacy: 'Draft only. The enquiry collects your design choices, measurements or a request for measurement help, name, optional email, phone number, country, city, delivery destination, and optional reference photos so Alotym can respond. When secure storage is configured, this is saved in a private database and a private image bucket for the owner to review. When it is not configured, demo mode does not store the enquiry on a server. Measurements, phone numbers, addresses, and private image links are not placed in public page addresses or the prefilled WhatsApp message. Replace this note after the owner approves a privacy policy.',
  },
  payment: {
    whatsapp_enabled: true,
    bank_transfer: {
      enabled: false,
      bank_name: '',
      account_name: '',
      account_number: '',
      instructions: '',
    },
    paystack: {
      enabled: false,
      public_key: '',
      disabled_message: 'Card payment is not enabled. This site does not collect card numbers. Payment is arranged with Alotym after an enquiry.',
    },
  },
  reference_images: {
    max_bytes: 5 * 1024 * 1024,
    max_count: 4,
    storage_note: 'Photos stay on this device until private storage confirms an upload. In demo mode they are not saved. Share them in the WhatsApp or Instagram conversation as well.',
  },
  seo: {
    title_suffix: 'Alotym',
    default_title: 'Alotym — Custom-made dresses',
    default_description: 'Alotym makes custom dresses for customers in Nigeria and abroad. Explore sample designs and prepare a bespoke enquiry. Orders are not confirmed or paid on this site.',
    og_image: brand_photos.lemon_dress,
  },
};

/**
 * Uses a trimmed string, or the fallback when the value is missing or blank.
 *
 * @param value - Candidate copy from the client config.
 * @param fallback - Sensible default.
 * @returns The usable string.
 */
function text_or(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : fallback;
}

/**
 * Keeps a configured string, including a deliberate blank.
 *
 * @param value - Candidate string.
 * @returns Trimmed text, or an empty string.
 */
function blankable(value: string | undefined): string {
  return value?.trim() ?? '';
}

/**
 * Keeps only navigation entries that have a label and a path.
 *
 * @param items - Partial navigation from config.
 * @param fallback - Navigation used when nothing valid is provided.
 * @returns Concrete navigation items.
 */
function resolve_navigation(items: DeepPartial<NavItem>[] | undefined, fallback: NavItem[]): NavItem[] {
  if (!items || items.length === 0) {
    return fallback;
  }
  const resolved = items.flatMap((item) => {
    if (!item.label || !item.path) {
      return [];
    }
    const children = item.children?.flatMap((child) => {
      if (!child?.label || !child.path) {
        return [];
      }
      return [{ label: child.label, path: child.path }];
    });
    return [{ label: item.label, path: item.path, children }];
  });
  return resolved.length > 0 ? resolved : fallback;
}

/**
 * Resolves process steps, dropping entries without a title.
 *
 * @param items - Partial steps.
 * @param fallback - Steps used when none are valid.
 * @returns Concrete steps.
 */
function resolve_steps(items: DeepPartial<ProcessStep>[] | undefined, fallback: ProcessStep[]): ProcessStep[] {
  const resolved = (items ?? []).flatMap((step) => {
    if (!step?.title) {
      return [];
    }
    return [{ title: step.title, text: step.text ?? '' }];
  });
  return resolved.length > 0 ? resolved : fallback;
}

/**
 * Resolves FAQ entries.
 *
 * @param items - Partial FAQ items.
 * @param fallback - FAQ used when none are valid.
 * @returns Concrete FAQ items.
 */
function resolve_faqs(items: DeepPartial<FaqItem>[] | undefined, fallback: FaqItem[]): FaqItem[] {
  const resolved = (items ?? []).flatMap((item) => {
    if (!item?.id || !item.question || !item.answer) {
      return [];
    }
    return [{
      id: item.id,
      question: item.question,
      answer: item.answer,
      show_on_home: item.show_on_home ?? false,
    }];
  });
  return resolved.length > 0 ? resolved : fallback;
}

/**
 * Resolves gallery tiles.
 *
 * @param items - Partial tiles.
 * @returns Tiles that have an image.
 */
function resolve_gallery(items: DeepPartial<GalleryTile>[] | undefined): GalleryTile[] {
  return (items ?? []).flatMap((item) => {
    if (!item?.image_url) {
      return [];
    }
    return [{
      image_url: item.image_url,
      image_alt: item.image_alt ?? '',
      caption: item.caption ?? '',
    }];
  });
}

/**
 * Resolves measurement guidance.
 *
 * @param items - Partial measurement points.
 * @param fallback - Guidance used when none are valid.
 * @returns Measurement points.
 */
function resolve_measurements(
  items: DeepPartial<MeasurementPoint>[] | undefined,
  fallback: MeasurementPoint[],
): MeasurementPoint[] {
  const resolved = (items ?? []).flatMap((item) => {
    if (!item?.id || !item.label) {
      return [];
    }
    return [{ id: item.id, label: item.label, guidance: item.guidance ?? '' }];
  });
  return resolved.length > 0 ? resolved : fallback;
}

/**
 * Resolves display currencies. No exchange rate is attached.
 *
 * @param items - Partial currency options.
 * @param fallback - Currencies used when none are valid.
 * @returns Currency options.
 */
function resolve_currencies(
  items: DeepPartial<CurrencyOption>[] | undefined,
  fallback: CurrencyOption[],
): CurrencyOption[] {
  const resolved = (items ?? []).flatMap((item) => {
    if (!item?.code || !item.locale || !item.label) {
      return [];
    }
    return [{ code: item.code, locale: item.locale, label: item.label }];
  });
  return resolved.length > 0 ? resolved : fallback;
}

/**
 * Merges client settings with built-in defaults so blank optional copy still launches.
 * Contact fields stay blank when they have not been supplied.
 *
 * @param input - Partial store settings, usually `client_settings`.
 * @returns A complete store configuration.
 */
export function resolve_store_config(input: DeepPartial<StoreConfig> = {}): StoreConfig {
  const colours: BrandColours = { ...default_colours, ...input.brand_colours };
  const typography: TypographyConfig = { ...default_type, ...input.typography };
  const contact = input.contact ?? {};
  const address = input.address ?? {};
  const announcement = input.announcement ?? {};
  const homepage = input.homepage ?? {};
  const hero = homepage.hero ?? {};
  const promo = homepage.promo ?? {};
  const story = homepage.brand_story ?? {};
  const atelier = input.atelier ?? {};
  const policies = input.policies ?? {};
  const payment = input.payment ?? {};
  const bank = payment.bank_transfer ?? {};
  const paystack = payment.paystack ?? {};
  const seo = input.seo ?? {};
  const logo = input.logo ?? {};
  const pricing = input.pricing ?? {};
  const notes = input.customer_notes ?? {};
  const images = input.reference_images ?? {};
  const cta = input.primary_cta ?? {};
  const store_name = text_or(input.store_name, 'Alotym');
  const fallback_cta: CallToAction = { label: 'Create Your Custom Dress', path: '/bespoke' };

  const fallback_hero = {
    kicker: 'Bespoke',
    headline: store_name,
    supporting_text: 'Replace the homepage hero in the store config.',
    cta_label: 'Explore Designs',
    cta_path: '/shop',
    secondary_cta_label: fallback_cta.label,
    secondary_cta_path: fallback_cta.path,
    image_url: stock_photo('photo-1572804013309-59a88b7e92f1', 2000),
    image_alt: `${store_name} campaign photograph`,
  };

  return {
    store_name,
    tagline: text_or(input.tagline, 'Custom-made dresses.'),
    logo: {
      text: text_or(logo.text, store_name),
      image_path: logo.image_path ?? '',
      alt: text_or(logo.alt, store_name),
    },
    brand_colours: colours,
    typography,
    layout: {
      content_max_width: text_or(input.layout?.content_max_width, '1680px'),
    },
    currency: {
      code: text_or(input.currency?.code, 'NGN'),
      locale: text_or(input.currency?.locale, 'en-NG'),
    },
    supported_currencies: resolve_currencies(input.supported_currencies, default_currencies),
    customer_notes: {
      nigeria: text_or(notes.nigeria, 'Nigerian enquiries are welcome. Delivery is confirmed with the studio.'),
      international: text_or(notes.international, 'International enquiries are welcome. Shipping must be confirmed with the studio.'),
    },
    pricing: {
      show_starting_prices: pricing.show_starting_prices ?? true,
      prefix: text_or(pricing.prefix, 'From'),
      disclaimer: text_or(pricing.disclaimer, price_disclaimer),
      demo_label: text_or(pricing.demo_label, 'Sample starting price. Not a confirmed quote.'),
    },
    production_timeframe: blankable(input.production_timeframe),
    production_timeframe_fallback: text_or(
      input.production_timeframe_fallback,
      'Timing must be confirmed for the design and destination.',
    ),
    primary_cta: {
      label: text_or(cta.label, fallback_cta.label),
      path: text_or(cta.path, fallback_cta.path),
    },
    contact: {
      email: blankable(contact.email),
      phone_display: blankable(contact.phone_display),
      phone_tel: blankable(contact.phone_tel),
      whatsapp_number: blankable(contact.whatsapp_number),
      whatsapp_default_message: text_or(contact.whatsapp_default_message, `Hello ${store_name}`),
      instagram_handle: blankable(contact.instagram_handle),
      instagram_url: blankable(contact.instagram_url),
    },
    address: {
      line_1: blankable(address.line_1),
      line_2: blankable(address.line_2),
      city: blankable(address.city),
      country: blankable(address.country),
    },
    hours: blankable(input.hours),
    social_links: (input.social_links ?? []).flatMap((link) => {
      if (!link?.label || !link.url) {
        return [];
      }
      return [{ label: link.label, url: link.url }];
    }),
    announcement: {
      text: announcement.text ?? '',
      link_label: announcement.link_label ?? '',
      link_path: announcement.link_path ?? '',
    },
    homepage: {
      hero: {
        kicker: text_or(hero.kicker, fallback_hero.kicker),
        headline: text_or(hero.headline, fallback_hero.headline),
        supporting_text: text_or(hero.supporting_text, fallback_hero.supporting_text),
        cta_label: text_or(hero.cta_label, fallback_hero.cta_label),
        cta_path: text_or(hero.cta_path, fallback_hero.cta_path),
        secondary_cta_label: text_or(hero.secondary_cta_label, fallback_hero.secondary_cta_label),
        secondary_cta_path: text_or(hero.secondary_cta_path, fallback_hero.secondary_cta_path),
        image_url: text_or(hero.image_url, fallback_hero.image_url),
        image_alt: text_or(hero.image_alt, fallback_hero.image_alt),
      },
      campaigns: (homepage.campaigns ?? []).flatMap((campaign) => {
        if (!campaign?.title || !campaign.image_url || !campaign.cta_path) {
          return [];
        }
        return [{
          kicker: campaign.kicker ?? '',
          title: campaign.title,
          text: campaign.text ?? '',
          cta_label: campaign.cta_label ?? 'View',
          cta_path: campaign.cta_path,
          image_url: campaign.image_url,
          image_alt: campaign.image_alt ?? campaign.title,
          layout: campaign.layout === 'image_end' ? 'image_end' as const : 'image_start' as const,
        }];
      }),
      promo: {
        kicker: text_or(promo.kicker, 'Begin'),
        title: text_or(promo.title, 'Start a bespoke enquiry'),
        text: promo.text ?? '',
        cta_label: text_or(promo.cta_label, fallback_cta.label),
        cta_path: text_or(promo.cta_path, fallback_cta.path),
      },
      brand_story: {
        kicker: text_or(story.kicker, 'About'),
        title: text_or(story.title, store_name),
        paragraphs: (story.paragraphs ?? []).filter((paragraph): paragraph is string => Boolean(paragraph)),
        cta_label: text_or(story.cta_label, 'About'),
        cta_path: text_or(story.cta_path, '/about'),
        image_url: text_or(story.image_url, stock_photo('photo-1595777457583-95e059d581b8', 1600)),
        image_alt: text_or(story.image_alt, `${store_name} studio`),
      },
      newsletter_title: text_or(homepage.newsletter_title, 'Notes'),
      newsletter_text: homepage.newsletter_text ?? 'This form does not send email.',
    },
    atelier: {
      process_kicker: text_or(atelier.process_kicker, 'The process'),
      process_title: text_or(atelier.process_title, 'How bespoke ordering works'),
      steps: resolve_steps(atelier.steps, default_steps),
      personalization_kicker: text_or(atelier.personalization_kicker, 'Preferences'),
      personalization_title: text_or(atelier.personalization_title, 'Tell us what you want to change'),
      personalization_text: text_or(atelier.personalization_text, 'Share fabric, colour, and silhouette preferences.'),
      personalization_points: (atelier.personalization_points ?? []).filter((point): point is string => Boolean(point)),
      gallery_kicker: text_or(atelier.gallery_kicker, 'Looks'),
      gallery_title: text_or(atelier.gallery_title, 'Selected looks'),
      gallery: resolve_gallery(atelier.gallery),
      measure_kicker: text_or(atelier.measure_kicker, 'Fit'),
      measure_title: text_or(atelier.measure_title, 'Measurements'),
      measure_text: text_or(atelier.measure_text, 'Measurements can be entered in centimetres or inches.'),
      faq_kicker: text_or(atelier.faq_kicker, 'Questions'),
      faq_title: text_or(atelier.faq_title, 'Common questions'),
    },
    measurement_points: resolve_measurements(input.measurement_points, default_measurements),
    measurement_guide_approved: input.measurement_guide_approved === true,
    measurement_guide_review_note: text_or(
      input.measurement_guide_review_note,
      'Pending owner review. These measurement instructions have not been approved.',
    ),
    faqs: resolve_faqs(input.faqs, default_faqs),
    navigation: resolve_navigation(input.navigation, default_navigation),
    footer_navigation: resolve_navigation(input.footer_navigation, default_navigation),
    delivery_options: (() => {
      const source = input.delivery_options ?? [];
      const resolved: DeliveryOption[] = source.flatMap((option) => {
        if (!option?.id || !option.label || option.cost === undefined || !Number.isFinite(option.cost) || option.cost < 0) {
          return [];
        }
        return [{
          id: option.id,
          label: option.label,
          cost: option.cost,
          estimate: option.estimate ?? '',
          description: option.description ?? '',
        }];
      });
      if (resolved.length > 0) {
        return resolved;
      }
      return [{
        id: 'confirm',
        label: 'Delivery to be confirmed',
        cost: 0,
        estimate: 'Confirmed with the studio',
        description: 'Shipping is not quoted on this site.',
      }];
    })(),
    policies: {
      approved: policies.approved ?? false,
      review_note: text_or(policies.review_note, placeholder_policy),
      returns: text_or(policies.returns, 'A returns policy has not been supplied.'),
      alteration: text_or(policies.alteration, 'An alteration policy has not been supplied.'),
      cancellation: text_or(policies.cancellation, 'A cancellation policy has not been supplied.'),
      custom_order: text_or(policies.custom_order, 'Submitting an enquiry does not accept an order.'),
      delivery: text_or(policies.delivery, 'Delivery must be confirmed with the studio.'),
      privacy: text_or(policies.privacy, 'Replace this privacy note before launch.'),
    },
    payment: {
      whatsapp_enabled: payment.whatsapp_enabled ?? true,
      bank_transfer: {
        enabled: bank.enabled ?? false,
        bank_name: blankable(bank.bank_name),
        account_name: blankable(bank.account_name),
        account_number: blankable(bank.account_number),
        instructions: blankable(bank.instructions),
      },
      paystack: {
        enabled: paystack.enabled ?? false,
        public_key: paystack.public_key ?? '',
        disabled_message: text_or(
          paystack.disabled_message,
          'Card payment is not enabled. This site does not collect card numbers.',
        ),
      },
    },
    reference_images: {
      max_bytes: images.max_bytes && images.max_bytes > 0 ? images.max_bytes : 5 * 1024 * 1024,
      max_count: images.max_count && images.max_count > 0 ? images.max_count : 4,
      storage_note: text_or(images.storage_note, 'Reference photos are previewed in the browser and are not uploaded.'),
    },
    seo: {
      title_suffix: text_or(seo.title_suffix, store_name),
      default_title: text_or(seo.default_title, store_name),
      default_description: text_or(seo.default_description, input.tagline ?? store_name),
      og_image: text_or(seo.og_image, stock_photo('photo-1572804013309-59a88b7e92f1', 1600)),
    },
  };
}

/** Resolved configuration. Import this from components and pages. */
export const store: StoreConfig = resolve_store_config(client_settings);

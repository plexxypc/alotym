/**
 * Store configuration types.
 * A client edits `client_settings` in `store.ts`; components read the resolved store.
 */

/** Wordmark or image logo. Leave `image_path` empty to use the text wordmark. */
export type LogoConfig = {
  text: string;
  image_path: string;
  alt: string;
};

/** Colours written to CSS variables at startup. */
export type BrandColours = {
  background: string;
  surface: string;
  ink: string;
  charcoal: string;
  muted: string;
  line: string;
  accent: string;
  accent_contrast: string;
  signal: string;
  danger: string;
};

/** Fonts and tracking. `google_fonts_href` is optional if you use system fonts. */
export type TypographyConfig = {
  display_font_family: string;
  body_font_family: string;
  google_fonts_href: string;
  headline_letter_spacing: string;
  label_letter_spacing: string;
};

/** Currency passed to `Intl.NumberFormat`. Amounts are not converted between codes. */
export type CurrencyConfig = {
  code: string;
  locale: string;
};

/** A currency the store can display. Conversion rates are not implied. */
export type CurrencyOption = {
  code: string;
  locale: string;
  label: string;
};

/** Header or footer link. Children render as a submenu. */
export type NavItem = {
  label: string;
  path: string;
  children?: NavItem[];
};

/** One configurable delivery method and its cost in the display currency. */
export type DeliveryOption = {
  id: string;
  label: string;
  cost: number;
  estimate: string;
  description: string;
};

/** Social profile. Use a full https URL. */
export type SocialLink = {
  label: string;
  url: string;
};

/** Display-only bank transfer details. Do not put secrets here. */
export type BankTransferConfig = {
  enabled: boolean;
  bank_name: string;
  account_name: string;
  account_number: string;
  instructions: string;
};

/**
 * Paystack placeholder.
 * `public_key` may be set later. Never put a secret key in this file.
 */
export type PaystackConfig = {
  enabled: boolean;
  public_key: string;
  disabled_message: string;
};

/** Payment choices exposed by the ready-to-wear checkout. */
export type PaymentConfig = {
  whatsapp_enabled: boolean;
  bank_transfer: BankTransferConfig;
  paystack: PaystackConfig;
};

/** Homepage hero copy and photograph. */
export type HeroContent = {
  kicker: string;
  headline: string;
  supporting_text: string;
  cta_label: string;
  cta_path: string;
  secondary_cta_label: string;
  secondary_cta_path: string;
  image_url: string;
  image_alt: string;
};

/** One asymmetric campaign block on the homepage. */
export type CampaignContent = {
  kicker: string;
  title: string;
  text: string;
  cta_label: string;
  cta_path: string;
  image_url: string;
  image_alt: string;
  layout: 'image_start' | 'image_end';
};

/** Dark promotional band. */
export type PromoContent = {
  kicker: string;
  title: string;
  text: string;
  cta_label: string;
  cta_path: string;
};

/** Brand story block. */
export type StoryContent = {
  kicker: string;
  title: string;
  paragraphs: string[];
  cta_label: string;
  cta_path: string;
  image_url: string;
  image_alt: string;
};

/** Policy copy. Treat `approved` as false until the owner replaces the placeholder text. */
export type PolicyContent = {
  approved: boolean;
  review_note: string;
  returns: string;
  alteration: string;
  cancellation: string;
  custom_order: string;
  delivery: string;
  privacy: string;
};

/** One step in the bespoke process. */
export type ProcessStep = {
  title: string;
  text: string;
};

/** Editorial gallery tile. */
export type GalleryTile = {
  image_url: string;
  image_alt: string;
  caption: string;
};

/** One measurement the guide explains. */
export type MeasurementPoint = {
  id: string;
  label: string;
  guidance: string;
};

/** Frequently asked question. Answers should come from owner-approved facts. */
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  show_on_home: boolean;
};

/** Primary header call to action. */
export type CallToAction = {
  label: string;
  path: string;
};

/** Full resolved configuration used by the UI. */
export type StoreConfig = {
  store_name: string;
  tagline: string;
  logo: LogoConfig;
  brand_colours: BrandColours;
  typography: TypographyConfig;
  layout: {
    content_max_width: string;
  };
  currency: CurrencyConfig;
  supported_currencies: CurrencyOption[];
  customer_notes: {
    nigeria: string;
    international: string;
  };
  pricing: {
    show_starting_prices: boolean;
    prefix: string;
    disclaimer: string;
    demo_label: string;
  };
  production_timeframe: string;
  production_timeframe_fallback: string;
  primary_cta: CallToAction;
  contact: {
    email: string;
    phone_display: string;
    phone_tel: string;
    whatsapp_number: string;
    whatsapp_default_message: string;
    instagram_handle: string;
    instagram_url: string;
  };
  address: {
    line_1: string;
    line_2: string;
    city: string;
    country: string;
  };
  hours: string;
  social_links: SocialLink[];
  announcement: {
    text: string;
    link_label: string;
    link_path: string;
  };
  homepage: {
    hero: HeroContent;
    campaigns: CampaignContent[];
    promo: PromoContent;
    brand_story: StoryContent;
    newsletter_title: string;
    newsletter_text: string;
  };
  atelier: {
    process_kicker: string;
    process_title: string;
    steps: ProcessStep[];
    personalization_kicker: string;
    personalization_title: string;
    personalization_text: string;
    personalization_points: string[];
    gallery_kicker: string;
    gallery_title: string;
    gallery: GalleryTile[];
    measure_kicker: string;
    measure_title: string;
    measure_text: string;
    faq_kicker: string;
    faq_title: string;
  };
  measurement_points: MeasurementPoint[];
  measurement_guide_approved: boolean;
  measurement_guide_review_note: string;
  faqs: FaqItem[];
  navigation: NavItem[];
  footer_navigation: NavItem[];
  delivery_options: DeliveryOption[];
  policies: PolicyContent;
  payment: PaymentConfig;
  reference_images: {
    max_bytes: number;
    max_count: number;
    storage_note: string;
  };
  seo: {
    title_suffix: string;
    default_title: string;
    default_description: string;
    og_image: string;
  };
};

/** Nested partial used when optional settings are omitted. */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

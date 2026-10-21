# Alotym

Custom-made fashion storefront for Alotym. It is a React + Vite + TypeScript app with Bootstrap 5 and custom CSS. Bespoke enquiries can be stored in Supabase when public credentials are configured. Without those credentials the form stays in labelled demo mode and does not pretend an enquiry was saved.

Sample prices, policies, and photographs are demonstrations. They are not Alotym quotes or approved terms. The measurement guide is pending owner review.

Secure order storage is not complete. The schema and policies are in the repository, but they have not been applied to a live Supabase project, and a successful stored submission has not been verified.

The lead sample design, Solenne Print Dress, follows this direction: a fitted orange printed bodice and a full black-and-white patterned skirt. The photographs are stable Unsplash placeholders. Put the real reference photograph at `public/images/reference-dress.jpg`, then point the Solenne `image_urls` in `src/data/products.ts` at `/images/reference-dress.jpg`.

## Run it

From this folder, in PowerShell:

```
npm install
npm run dev
```

Vite prints a local URL, usually `http://localhost:5173`.

Production build:

```
npm run build
npm run preview
```

The build output is the `dist` folder.

## Change the brand in `src/config/store.ts`

Edit `client_settings`. The app reads the resolved `store` export. Leave a contact field blank when you do not have it yet. Do not invent a phone number, email, Instagram account, or bank account.

Colours and fonts are copied onto CSS variables when the app loads (`src/config/apply_theme.ts`).

| Setting | What to change |
| --- | --- |
| `store_name`, `tagline`, `logo` | Brand name and wordmark. Leave `logo.image_path` empty to keep the text logo. |
| `brand_colours`, `typography` | Palette and fonts. |
| `currency` | Default display currency. Use `code: 'NGN'` and `locale: 'en-NG'` unless you have chosen another display currency. |
| `supported_currencies` | Labels only. The site does not convert currencies. |
| `contact.email` | Public email. Leave blank until you have one. |
| `contact.whatsapp_number` | Digits with country code, no `+`. The current number is `2348186444424`. |
| `contact.instagram_url` | Full `https://www.instagram.com/the_alotym/` URL. A handle alone does not open a profile. |
| `contact.instagram_handle` | `the_alotym`. |
| `address`, `hours` | Only fill these when you want them public. |
| `social_links` | Extra profiles. Each needs a full `https://` URL. |
| `announcement` | Bar above the header. Clear `text` to hide it. |
| `primary_cta` | Header button. |
| `homepage` | Hero, story, and final call to action. |
| `atelier` | Process, personalization, gallery, and measurement introduction. |
| `measurement_points` | Measurement guide. |
| `faqs` | FAQ page, homepage preview (`show_on_home`), and the guide widget. |
| `pricing` | Starting-price prefix and the quote disclaimer. |
| `production_timeframe` | Production estimate only. The current text is about 2–5 days, depending on customisation, and is not a delivery date. |
| `policies` | Privacy, custom orders, cancellation, alterations, returns, and delivery. Set `approved` to `true` only after the owner has signed off. |
| `customer_notes` | Nigeria and international messaging. |
| `navigation`, `footer_navigation` | Header and footer links. |
| `reference_images` | File count, size limit, and the note that previews are not uploads. |
| `seo` | Default title, description, and share image. |
| `payment` | Ready-to-wear checkout only. Keep bank transfer disabled until real account details exist. Paystack stays off until a server verifies payment. |

## Replace the demo designs

Designs live in `src/data/products.ts`. Collections live in `src/data/collections.ts`.

Each design needs a unique `id` and `slug`. For a bespoke design set `listing_mode` to `'bespoke'`. `price` is then a starting price. Set `is_demo_price` to `false` only when the figure is a real Alotym starting price.

Also set `full_description`, `price_note`, `fabrics`, `style_attributes`, `customization_options`, `seo_title`, and `seo_description`. Leave `production_timeframe` empty when timing is not confirmed.

`listing_mode: 'ready'` keeps the existing cart and demo checkout for a conventional product. Bespoke designs use **Customize This Design** instead of the cart.

## Routes

- `/` home
- `/shop` all designs
- `/collections/:slug` collection
- `/product/:slug` design
- `/bespoke` bespoke enquiry
- `/how-it-works` process
- `/measurements` measurement guide
- `/about` about
- `/faq` questions
- `/contact` contact
- `/privacy` privacy placeholder
- `/custom-order-policy` custom-order, cancellation, alteration, returns, and delivery placeholders
- `/cart`, `/checkout`, `/order-success` existing ready-to-wear demo checkout
- any other path: 404

## What works locally

- Browse, search, filter, and sort the sample catalogue.
- Open a design and continue into the bespoke form with that design selected.
- Move through the enquiry steps, including centimetres and inches, without losing entries in this tab.
- Preview, remove, and replace reference images on the device. In demo mode they are not uploaded.
- Review the enquiry, create a reference, and copy a short summary that leaves out measurements and addresses.
- Open a WhatsApp link with that summary when `contact.whatsapp_number` is set. The customer still has to press send.
- Open the configured Instagram profile and copy the summary into a DM. Instagram is not prefilled.
- Use the floating guide for the configured questions and to carry a few preferences into the form.
- Keep a ready-to-wear cart when a product uses `listing_mode: 'ready'`.

The guide is deterministic. It does not call an AI API.

## Order storage

Copy `.env.example` to `.env` only when you have a Supabase project. The only frontend-safe variables are:

- `VITE_SUPABASE_URL` — the project URL
- `VITE_SUPABASE_ANON_KEY` — the anon public key

Do not put the service-role key in `.env`, in source, or in any variable whose name starts with `VITE_`. That key bypasses access policies.

Apply `supabase/migrations/001_bespoke_enquiries.sql` in the Supabase SQL editor. Then, in Authentication, set the owner user’s raw app metadata to `{ "role": "owner" }`. The owner reviews enquiries in the Supabase table editor and reference photos in the private `bespoke-references` bucket. There is no public admin page.

Until both public variables are set, the form shows demo mode. A demo reference is not a stored order. After they are set, the page says an enquiry or image was saved only when Supabase confirms it. A failed submission leaves the form entries in place.

Secure order storage is not marked complete. The database, access policies, storage bucket, and a successful submission still need to be verified against a real Supabase project.

## What is not production-ready

- Secure storage has not been verified against a live database.
- The measurement guide is a draft and is not approved by Alotym.
- Payment, deposit, cancellation, alteration, refund, and delivery rules are unapproved drafts.
- International shipping arrangements are still being finalised. The site does not quote shipping.
- WhatsApp opens a draft. Instagram must be messaged manually. Neither action sends a message or accepts an order.
- There is no card payment and no bank-transfer confirmation.
- There is no currency conversion.
- SEO tags are set in the browser. A static host will not serve unique HTML per design until you add prerendering.
- Unsplash placeholders need a network connection. Replace them with owner photographs without changing shared components.

Deploy `dist` to a static host that serves `index.html` for unknown paths. `public/_redirects` covers Netlify. Do not fall back `/assets/*`.

## Owner-supplied details still required

- Official email, if one should be published
- Public location and hours, if they should appear
- Real design photographs, and confirmation of which starting prices are official
- The reference dress file at `public/images/reference-dress.jpg`
- Owner review of the measurement guide
- Approved privacy, payment, deposit, cancellation, alteration, refund, and delivery policies
- A live Supabase project, the SQL migration, an owner role, and a checked submission before treating storage as complete

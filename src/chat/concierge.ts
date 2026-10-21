import { store } from '../config/store.ts';
import type { FaqItem } from '../config/types.ts';
import { products } from '../data/products.ts';
import type { BespokePrefill } from '../types/bespoke.ts';
import { is_instagram_ready, is_whatsapp_ready } from '../lib/contact_channels.ts';
import { production_timing_text } from '../lib/page_meta.ts';

/** Guided intents the concierge understands. */
export type ConciergeIntent =
  | 'menu'
  | 'browse'
  | 'how_it_works'
  | 'pricing'
  | 'measurements'
  | 'international'
  | 'timeline'
  | 'customize'
  | 'policies'
  | 'human'
  | 'prepare'
  | 'restart';

/** A button under an assistant message. */
export type ConciergeReply = {
  id: string;
  label: string;
  intent: ConciergeIntent;
  prefill?: BespokePrefill;
};

/** One line in the current conversation. */
export type ConciergeTurn = {
  id: string;
  role: 'guide' | 'customer';
  text: string;
  replies: ConciergeReply[];
};

/** Progress collected inside the widget. It never includes measurements or contact details. */
export type ConciergePrep = {
  design_slug: string;
  occasion: string;
  colours: string;
  destination: string;
  needs_help: boolean;
};

const opening_replies: ConciergeReply[] = [
  { id: 'browse', label: 'Browse designs', intent: 'browse' },
  { id: 'how', label: 'How does bespoke ordering work?', intent: 'how_it_works' },
  { id: 'price', label: 'How much does a custom dress cost?', intent: 'pricing' },
  { id: 'measure', label: 'How do I take my measurements?', intent: 'measurements' },
  { id: 'abroad', label: 'Can I order from outside Nigeria?', intent: 'international' },
  { id: 'time', label: 'How long does production take?', intent: 'timeline' },
  { id: 'human', label: 'Speak to Alotym', intent: 'human' },
];

/**
 * Finds a configured FAQ answer.
 *
 * @param id - FAQ id.
 * @returns The FAQ, or undefined.
 */
function faq_by_id(id: string): FaqItem | undefined {
  return store.faqs.find((item) => item.id === id);
}

/**
 * Uses a configured FAQ answer, or says the team must confirm it.
 *
 * @param id - FAQ id.
 * @returns Answer text.
 */
function faq_text(id: string): string {
  return faq_by_id(id)?.answer ?? 'That answer has not been added yet. The Alotym team needs to confirm it.';
}

/**
 * Opening turn for a new conversation.
 *
 * @returns The greeting and quick replies.
 */
export function opening_turn(): ConciergeTurn {
  return {
    id: 'opening',
    role: 'guide',
    text: `Welcome to ${store.store_name}. Looking for a design, planning a custom dress, or wondering how bespoke ordering works? I can help you get started. I am an automated guide, not a person, and I cannot contact the studio for you.`,
    replies: opening_replies,
  };
}

/**
 * Replies that return to the main menu and offer to prepare an enquiry.
 *
 * @returns Quick replies.
 */
function follow_up_replies(): ConciergeReply[] {
  return [
    { id: 'prepare', label: 'Help me prepare an enquiry', intent: 'prepare' },
    { id: 'menu', label: 'More questions', intent: 'menu' },
    { id: 'human', label: 'Speak to Alotym', intent: 'human' },
  ];
}

/**
 * Answers one quick reply.
 *
 * @param intent - Selected intent.
 * @param prep - Details gathered so far.
 * @param reply_id - Optional reply id carrying a design, occasion, colour, or destination.
 * @returns The next guide turn and the updated prep.
 */
export function respond_to_intent(
  intent: ConciergeIntent,
  prep: ConciergePrep,
  reply_id = '',
): { turn: ConciergeTurn; prep: ConciergePrep } {
  const next = { ...prep };
  if (reply_id.startsWith('design:')) {
    next.design_slug = reply_id.slice('design:'.length);
  }
  if (reply_id.startsWith('occasion:')) {
    next.occasion = reply_id.slice('occasion:'.length);
  }
  if (reply_id.startsWith('colour:')) {
    next.colours = reply_id.slice('colour:'.length);
  }
  if (reply_id.startsWith('destination:')) {
    next.destination = reply_id.slice('destination:'.length);
  }

  if (intent === 'restart' || intent === 'menu') {
    return {
      prep: intent === 'restart'
        ? { design_slug: '', occasion: '', colours: '', destination: '', needs_help: false }
        : next,
      turn: {
        id: `menu-${reply_id || intent}`,
        role: 'guide',
        text: intent === 'restart'
          ? 'We can start again. What would you like to know?'
          : 'What else would you like to know?',
        replies: opening_replies,
      },
    };
  }

  if (intent === 'browse') {
    return {
      prep: next,
      turn: {
        id: 'browse',
        role: 'guide',
        text: 'The shop lists sample designs with starting prices. Open a design to customise it, or stay here and I can note one for your enquiry.',
        replies: [
          { id: 'shop-link', label: 'Open the shop', intent: 'browse', prefill: undefined },
          ...products.filter((product) => product.featured).slice(0, 4).map((product) => ({
            id: `design:${product.slug}`,
            label: product.name,
            intent: 'prepare' as const,
          })),
          { id: 'own', label: 'I have my own inspiration', intent: 'prepare' },
        ],
      },
    };
  }

  if (intent === 'how_it_works') {
    const steps = store.atelier.steps.map((step, index) => `${index + 1}. ${step.title}`).join(' ');
    return {
      prep: next,
      turn: {
        id: 'how',
        role: 'guide',
        text: `${faq_text('how_it_works')} ${steps}`,
        replies: [
          { id: 'how-page', label: 'Read how it works', intent: 'how_it_works' },
          ...follow_up_replies(),
        ],
      },
    };
  }

  if (intent === 'pricing') {
    return {
      prep: next,
      turn: {
        id: 'pricing',
        role: 'guide',
        text: faq_text('pricing'),
        replies: [
          { id: 'shop-price', label: 'Browse designs', intent: 'browse' },
          { id: 'start-price', label: 'Begin an enquiry', intent: 'prepare' },
        ],
      },
    };
  }

  if (intent === 'measurements') {
    return {
      prep: next,
      turn: {
        id: 'measurements',
        role: 'guide',
        text: `${faq_text('measurements')} ${store.measurement_guide_review_note} You can continue the order and ask Alotym for help.`,
        replies: [
          { id: 'guide', label: 'Open the measurement guide', intent: 'measurements' },
          { id: 'help', label: 'I need help measuring', intent: 'prepare' },
          { id: 'menu-m', label: 'More questions', intent: 'menu' },
        ],
      },
    };
  }

  if (intent === 'international') {
    return {
      prep: next,
      turn: {
        id: 'international',
        role: 'guide',
        text: `${store.customer_notes.international} ${store.customer_notes.nigeria}`,
        replies: follow_up_replies(),
      },
    };
  }

  if (intent === 'timeline') {
    return {
      prep: next,
      turn: {
        id: 'timeline',
        role: 'guide',
        text: `${faq_text('timeline')} ${production_timing_text()}`,
        replies: follow_up_replies(),
      },
    };
  }

  if (intent === 'customize') {
    return {
      prep: next,
      turn: {
        id: 'customize',
        role: 'guide',
        text: `${store.atelier.personalization_text} ${faq_text('customization')}`,
        replies: [
          { id: 'form', label: 'Open the bespoke form', intent: 'prepare' },
          { id: 'menu-c', label: 'More questions', intent: 'menu' },
        ],
      },
    };
  }

  if (intent === 'policies') {
    const text = store.policies.approved
      ? 'Policy pages are available from the footer. I can only repeat what Alotym has published there.'
      : `${store.policies.review_note} I cannot give a returns, alteration, cancellation, or delivery rule until Alotym approves one.`;
    return {
      prep: next,
      turn: {
        id: 'policies',
        role: 'guide',
        text,
        replies: [
          { id: 'policy-link', label: 'Read the policy placeholder', intent: 'policies' },
          { id: 'human-p', label: 'Speak to Alotym', intent: 'human' },
        ],
      },
    };
  }

  if (intent === 'human') {
    const whatsapp = is_whatsapp_ready()
      ? `WhatsApp is ${store.contact.phone_display}. Opening a chat does not send a message until you press send.`
      : 'The official WhatsApp number has not been added yet.';
    const instagram = is_instagram_ready()
      ? `Instagram is ${store.contact.instagram_url}. Send the direct message yourself and include your enquiry reference.`
      : 'The official Instagram profile has not been added yet.';
    return {
      prep: next,
      turn: {
        id: 'human',
        role: 'guide',
        text: `I cannot message the designer for you, and I cannot accept an order. ${whatsapp} ${instagram} I can also point you to the catalogue, the measurement guide, or the bespoke form.`,
        replies: [
          { id: 'shop-link', label: 'Browse designs', intent: 'browse' },
          { id: 'guide', label: 'Measurement guide', intent: 'measurements' },
          { id: 'prepare-h', label: 'Open the bespoke form', intent: 'prepare' },
          { id: 'contact', label: 'Open the contact page', intent: 'human' },
        ],
      },
    };
  }

  if (reply_id === 'help') {
    next.needs_help = true;
  }
  return {
    prep: next,
    turn: prepare_turn(next, reply_id),
  };
}

/**
 * Walks through design, occasion, colour, and destination without asking for body or contact details.
 *
 * @param prep - Details gathered so far.
 * @param reply_id - Reply that led here.
 * @returns The next preparation turn.
 */
function prepare_turn(prep: ConciergePrep, reply_id: string): ConciergeTurn {
  if (reply_id === 'own') {
    prep.design_slug = 'own';
  }
  if (!prep.design_slug) {
    return {
      id: 'prep-design',
      role: 'guide',
      text: 'Which design should I note? You can also bring your own inspiration. I will not ask for measurements here.',
      replies: [
        ...products.slice(0, 4).map((product) => ({
          id: `design:${product.slug}`,
          label: product.name,
          intent: 'prepare' as const,
        })),
        { id: 'own', label: 'I have my own inspiration', intent: 'prepare' },
      ],
    };
  }
  if (!prep.occasion) {
    return {
      id: 'prep-occasion',
      role: 'guide',
      text: 'What is the occasion? You can refine this on the form.',
      replies: [
        { id: 'occasion:wedding', label: 'Wedding', intent: 'prepare' },
        { id: 'occasion:ceremony', label: 'Ceremony', intent: 'prepare' },
        { id: 'occasion:evening', label: 'Evening', intent: 'prepare' },
        { id: 'occasion:birthday', label: 'Birthday', intent: 'prepare' },
        { id: 'occasion:other', label: 'Something else', intent: 'prepare' },
      ],
    };
  }
  if (!prep.colours) {
    return {
      id: 'prep-colour',
      role: 'guide',
      text: 'Do you already have a colour direction?',
      replies: [
        { id: 'colour:Orange, black, and white', label: 'Orange, black, and white', intent: 'prepare' },
        { id: 'colour:Ivory', label: 'Ivory', intent: 'prepare' },
        { id: 'colour:Black', label: 'Black', intent: 'prepare' },
        { id: 'colour:I will describe it on the form', label: 'I will describe it on the form', intent: 'prepare' },
      ],
    };
  }
  if (!prep.destination) {
    return {
      id: 'prep-destination',
      role: 'guide',
      text: 'Where should the dress be delivered? Shipping still has to be confirmed with Alotym.',
      replies: [
        { id: 'destination:Nigeria', label: 'Nigeria', intent: 'prepare' },
        { id: 'destination:Outside Nigeria', label: 'Outside Nigeria', intent: 'prepare' },
        { id: 'destination:I will add it on the form', label: 'I will add it on the form', intent: 'prepare' },
      ],
    };
  }
  const design_name = prep.design_slug === 'own'
    ? 'your own inspiration'
    : products.find((product) => product.slug === prep.design_slug)?.name ?? 'the design you noted';
  return {
    id: 'prep-ready',
    role: 'guide',
    text: `I can carry this into the form: ${design_name}, occasion ${prep.occasion.replaceAll('-', ' ')}, colours ${prep.colours}, destination ${prep.destination}. You can edit every answer before anything is submitted. Submitting the form still does not book the dress.`,
    replies: [
      {
        id: 'continue-form',
        label: 'Continue in the order form',
        intent: 'prepare',
        prefill: {
          design_slug: prep.design_slug === 'own' ? '' : prep.design_slug,
          own_inspiration: prep.design_slug === 'own',
          occasion: prep.occasion === 'other' ? '' : prep.occasion,
          colours: prep.colours.startsWith('I will') ? '' : prep.colours,
          destination_country: prep.destination === 'Nigeria' ? 'Nigeria' : '',
          design_notes: prep.destination.startsWith('Outside') ? 'Delivery destination: outside Nigeria.' : '',
          needs_measurement_help: prep.needs_help,
        },
      },
      { id: 'restart-prep', label: 'Start over', intent: 'restart' },
    ],
  };
}

/**
 * Customer-facing label for a reply, used as the customer turn.
 *
 * @param replies - Replies currently on screen.
 * @param reply_id - Selected reply.
 * @returns The button label, or a short fallback.
 */
export function label_for_reply(replies: ConciergeReply[], reply_id: string): string {
  return replies.find((reply) => reply.id === reply_id)?.label ?? 'Continue';
}

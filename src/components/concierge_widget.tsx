import { useEffect, useId, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  label_for_reply,
  opening_turn,
  respond_to_intent,
} from '../chat/concierge.ts';
import type { ConciergePrep, ConciergeReply, ConciergeTurn } from '../chat/concierge.ts';
import { publish_bespoke_prefill } from '../lib/bespoke_draft.ts';
import { store } from '../config/store.ts';

const empty_prep: ConciergePrep = {
  design_slug: '',
  occasion: '',
  colours: '',
  destination: '',
  needs_help: false,
};

const page_links: Record<string, string> = {
  'shop-link': '/shop',
  'shop-price': '/shop',
  'how-page': '/how-it-works',
  guide: '/measurements',
  'policy-link': '/custom-order-policy',
  contact: '/contact',
};

/**
 * Floating guide for FAQs and enquiry preparation.
 * Answers come from the store configuration. No AI API is used.
 *
 * @returns The launcher and the conversation panel.
 */
export function ConciergeWidget(): ReactElement {
  const navigate = useNavigate();
  const title_id = useId();
  const close_ref = useRef<HTMLButtonElement>(null);
  const log_ref = useRef<HTMLDivElement>(null);
  const [is_open, set_is_open] = useState(false);
  const [turns, set_turns] = useState<ConciergeTurn[]>([opening_turn()]);
  const [prep, set_prep] = useState<ConciergePrep>(empty_prep);
  const replies = turns[turns.length - 1]?.replies ?? [];

  useEffect(() => {
    if (!is_open) {
      return;
    }
    const previous_overflow = document.body.style.overflow;
    const lock_scroll = window.matchMedia('(max-width: 720px)').matches;
    if (lock_scroll) {
      document.body.style.overflow = 'hidden';
    }
    close_ref.current?.focus();
    function on_key_down(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        set_is_open(false);
      }
    }
    window.addEventListener('keydown', on_key_down);
    return () => {
      document.body.style.overflow = previous_overflow;
      window.removeEventListener('keydown', on_key_down);
    };
  }, [is_open]);

  useEffect(() => {
    log_ref.current?.scrollTo({ top: log_ref.current.scrollHeight });
  }, [turns, is_open]);

  function push_exchange(customer_text: string, guide: ConciergeTurn): void {
    set_turns((current) => [
      ...current,
      { id: `customer-${guide.id}`, role: 'customer', text: customer_text, replies: [] },
      guide,
    ]);
  }

  function choose_reply(reply: ConciergeReply): void {
    const customer_text = label_for_reply(replies, reply.id);
    const linked_path = page_links[reply.id];
    if (reply.prefill) {
      publish_bespoke_prefill(reply.prefill);
      navigate('/bespoke');
      push_exchange(customer_text, {
        id: `carried-${reply.id}`,
        role: 'guide',
        text: 'Those notes are in the bespoke form. Nothing has been sent, booked, or paid. Review the form and submit it when you are ready.',
        replies: [
          { id: 'menu-after', label: 'More questions', intent: 'menu' },
          { id: 'restart-after', label: 'Restart chat', intent: 'restart' },
        ],
      });
      return;
    }
    if (linked_path) {
      navigate(linked_path);
      push_exchange(customer_text, {
        id: `opened-${reply.id}`,
        role: 'guide',
        text: 'That page is open. I have not contacted Alotym.',
        replies: [
          { id: 'menu-link', label: 'More questions', intent: 'menu' },
          { id: 'human-link', label: 'Speak to Alotym', intent: 'human' },
        ],
      });
      return;
    }
    const result = respond_to_intent(reply.intent, prep, reply.id);
    set_prep(result.prep);
    push_exchange(customer_text, { ...result.turn, id: `${result.turn.id}-${turns.length}` });
  }

  function restart(): void {
    set_prep(empty_prep);
    set_turns([opening_turn()]);
  }

  return (
    <>
      <button
        className="al_chat_launch"
        type="button"
        hidden={is_open}
        aria-expanded={is_open}
        aria-controls="alotym-guide"
        onClick={() => set_is_open(true)}
      >
        <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />
        Guide
      </button>
      {is_open ? (
        <section
          className="al_chat_panel"
          id="alotym-guide"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title_id}
        >
          <header className="al_chat_head">
            <div>
              <p id={title_id}>{store.store_name} guide</p>
              <p>Automated answers from the site. Not a person.</p>
            </div>
            <button ref={close_ref} className="vx_icon_button" type="button" aria-label="Close guide" onClick={() => set_is_open(false)}>
              <X size={18} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </header>
          <div className="al_chat_log" ref={log_ref} aria-live="polite">
            {turns.map((turn) => (
              <p key={turn.id} className={turn.role === 'guide' ? 'al_chat_guide' : 'al_chat_customer'}>
                {turn.text}
              </p>
            ))}
          </div>
          <div className="al_chat_replies" role="group" aria-label="Suggested replies">
            {replies.map((reply) => (
              <button key={reply.id} type="button" onClick={() => choose_reply(reply)}>
                {reply.label}
              </button>
            ))}
          </div>
          <footer className="al_chat_foot">
            <button type="button" onClick={restart}>Restart</button>
            <button type="button" onClick={() => set_is_open(false)}>Close</button>
          </footer>
        </section>
      ) : null}
    </>
  );
}

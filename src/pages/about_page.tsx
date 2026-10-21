import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/seo.tsx';
import { store } from '../config/store.ts';
import { format_store_address, page_title } from '../lib/page_meta.ts';

/**
 * About Alotym. Copy stays within what the configuration actually states.
 *
 * @returns The about page.
 */
export function AboutPage(): ReactElement {
  const story = store.homepage.brand_story;
  return (
    <>
      <Seo
        title={page_title('About')}
        description={story.paragraphs[0] ?? store.seo.default_description}
        path="/about"
        image_url={story.image_url}
      />
      <article className="vx_about">
        <header className="vx_page_header vx_shell">
          <p className="vx_kicker">{story.kicker}</p>
          <h1>{story.title}</h1>
        </header>
        <div className="vx_story vx_shell">
          <div>
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>{format_store_address()}</p>
            {store.hours ? <p>{store.hours}</p> : <p>Opening hours have not been added yet.</p>}
            <p>
              <Link to="/how-it-works">How bespoke ordering works</Link>
            </p>
          </div>
          <img src={story.image_url} alt={story.image_alt} width={1200} height={1500} />
        </div>
        <div className="vx_shell vx_policies">
          <section id="delivery">
            <h2>Delivery</h2>
            <p>{store.policies.delivery}</p>
            <p><Link to="/custom-order-policy#delivery">Delivery note</Link></p>
          </section>
          <section id="returns">
            <h2>Returns and alterations</h2>
            <p>{store.policies.returns}</p>
            <p>{store.policies.alteration}</p>
          </section>
          <section id="privacy">
            <h2>Privacy</h2>
            <p>{store.policies.privacy}</p>
            <p><Link to="/privacy">Privacy note</Link></p>
          </section>
        </div>
      </article>
    </>
  );
}

import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/hero_section.tsx';
import { ProductGrid } from '../components/product_grid.tsx';
import { Seo } from '../components/seo.tsx';
import { store } from '../config/store.ts';
import { collections } from '../data/collections.ts';
import { get_featured_products } from '../lib/catalog.ts';
import { build_store_json_ld } from '../lib/structured_data.ts';

/**
 * Editorial homepage for Alotym: hero, designs, process, gallery, and enquiry.
 *
 * @returns The homepage.
 */
export function HomePage(): ReactElement {
  const featured = get_featured_products(4);
  const home_faqs = store.faqs.filter((item) => item.show_on_home);
  const story = store.homepage.brand_story;

  return (
    <>
      <Seo
        title={store.seo.default_title}
        description={store.seo.default_description}
        path="/"
        image_url={store.homepage.hero.image_url}
        json_ld={build_store_json_ld()}
      />
      <HeroSection hero={store.homepage.hero} />
      <section className="vx_section vx_shell" aria-labelledby="featured-title">
        <div className="vx_section_head">
          <p className="vx_kicker">Designs</p>
          <h2 id="featured-title">Featured designs</h2>
          <Link className="vx_text_link" to="/shop">Shop all designs</Link>
        </div>
        <ProductGrid products={featured} empty_title="No featured designs" empty_text="Browse the full catalogue." />
        <ul className="al_collection_row">
          {collections.map((collection) => (
            <li key={collection.slug}>
              <Link to={`/collections/${collection.slug}`}>{collection.name}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="vx_section vx_shell" aria-labelledby="process-title">
        <div className="vx_section_head">
          <p className="vx_kicker">{store.atelier.process_kicker}</p>
          <h2 id="process-title">{store.atelier.process_title}</h2>
        </div>
        <ol className="al_process">
          {store.atelier.steps.map((step, index) => (
            <li key={step.title}>
              <span>0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <Link className="vx_text_link" to="/how-it-works">Read the full process</Link>
      </section>
      <section className="vx_story vx_shell" aria-labelledby="personal-title">
        <div>
          <p className="vx_kicker">{store.atelier.personalization_kicker}</p>
          <h2 id="personal-title">{store.atelier.personalization_title}</h2>
          <p>{store.atelier.personalization_text}</p>
          <ul className="al_points">
            {store.atelier.personalization_points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <Link className="vx_text_link" to="/bespoke">{store.primary_cta.label}</Link>
        </div>
        <img src={story.image_url} alt={story.image_alt} width={1200} height={1500} loading="lazy" />
      </section>
      <section className="vx_section vx_shell" aria-labelledby="gallery-title">
        <div className="vx_section_head">
          <p className="vx_kicker">{store.atelier.gallery_kicker}</p>
          <h2 id="gallery-title">{store.atelier.gallery_title}</h2>
        </div>
        <div className="al_gallery">
          {store.atelier.gallery.map((tile) => (
            <figure key={tile.image_url}>
              <img src={tile.image_url} alt={tile.image_alt} width={900} height={1200} loading="lazy" />
              {tile.caption ? <figcaption>{tile.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </section>
      <section className="vx_section vx_shell al_measure_band" aria-labelledby="measure-title">
        <div>
          <p className="vx_kicker">{store.atelier.measure_kicker}</p>
          <h2 id="measure-title">{store.atelier.measure_title}</h2>
          <p>{store.atelier.measure_text}</p>
          <Link className="vx_btn" to="/measurements">Open the measurement guide</Link>
        </div>
      </section>
      <section className="vx_section vx_shell" aria-labelledby="faq-title">
        <div className="vx_section_head">
          <p className="vx_kicker">{store.atelier.faq_kicker}</p>
          <h2 id="faq-title">{store.atelier.faq_title}</h2>
          <Link className="vx_text_link" to="/faq">All questions</Link>
        </div>
        <div className="al_faq">
          {home_faqs.map((item) => (
            <details key={item.id}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="vx_promo" aria-labelledby="final-cta-title">
        <div className="vx_shell">
          <p className="vx_kicker">{store.homepage.promo.kicker}</p>
          <h2 id="final-cta-title">{store.homepage.promo.title}</h2>
          <p>{store.homepage.promo.text}</p>
          <Link className="vx_btn" to={store.homepage.promo.cta_path}>{store.homepage.promo.cta_label}</Link>
        </div>
      </section>
    </>
  );
}

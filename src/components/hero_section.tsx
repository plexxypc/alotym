import { useLayoutEffect } from 'react';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import type { HeroContent } from '../config/types.ts';

/** Props for the homepage hero. */
export type HeroSectionProps = {
  hero: HeroContent;
};

/**
 * Records the sticky header height so the hero fits in the first screen.
 */
function sync_hero_chrome_height(): void {
  const chrome = document.querySelector('.vx_header_wrap');
  if (!(chrome instanceof HTMLElement)) {
    return;
  }
  const height = Math.ceil(chrome.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--vx-chrome-height', `${height}px`);
}

/**
 * Large editorial hero with headline, supporting copy, and calls to action.
 * The section is sized to the space under the header so the text and buttons are visible on load.
 *
 * @param props - Hero content from the store config.
 * @returns The hero section.
 */
export function HeroSection(props: HeroSectionProps): ReactElement {
  const hero = props.hero;

  useLayoutEffect(() => {
    sync_hero_chrome_height();
    const chrome = document.querySelector('.vx_header_wrap');
    if (!(chrome instanceof HTMLElement)) {
      return;
    }
    const observer = new ResizeObserver(() => {
      sync_hero_chrome_height();
    });
    observer.observe(chrome);
    window.addEventListener('resize', sync_hero_chrome_height);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', sync_hero_chrome_height);
    };
  }, []);

  return (
    <section className="vx_hero" aria-labelledby="hero-title">
      <div className="vx_hero_panel">
        <p className="vx_kicker">{hero.kicker}</p>
        <h1 id="hero-title">{hero.headline}</h1>
        <p className="vx_lede">{hero.supporting_text}</p>
        <div className="vx_hero_actions">
          <Link className="vx_btn" to={hero.cta_path}>{hero.cta_label}</Link>
          <Link className="vx_btn vx_btn_secondary" to={hero.secondary_cta_path}>{hero.secondary_cta_label}</Link>
        </div>
      </div>
      <div className="vx_hero_media">
        <img
          src={hero.image_url}
          alt={hero.image_alt}
          width={1600}
          height={2000}
          fetchPriority="high"
        />
      </div>
    </section>
  );
}

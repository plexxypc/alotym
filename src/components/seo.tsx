import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { store } from '../config/store.ts';
import { absolute_url } from '../lib/page_meta.ts';

/** Head metadata for one route. */
export type SeoProps = {
  title: string;
  description: string;
  path: string;
  image_url?: string;
  og_type?: string;
  json_ld?: Record<string, unknown> | Array<Record<string, unknown>>;
};

/**
 * Sets the document title, description, Open Graph tags, and optional JSON-LD.
 *
 * @param props - Page metadata. Image falls back to the store Open Graph image.
 * @returns An empty element. Metadata is applied on the document head.
 */
export function Seo(props: SeoProps): ReactElement {
  const image_url = props.image_url || store.seo.og_image;
  const json_key = JSON.stringify(props.json_ld ?? null);

  useEffect(() => {
    document.title = props.title;
    upsert_meta('name', 'description', props.description);
    upsert_meta('property', 'og:title', props.title);
    upsert_meta('property', 'og:description', props.description);
    upsert_meta('property', 'og:type', props.og_type ?? 'website');
    upsert_meta('property', 'og:url', absolute_url(props.path));
    upsert_meta('property', 'og:image', image_url);
    upsert_meta('property', 'og:site_name', store.store_name);
    upsert_meta('name', 'twitter:card', 'summary_large_image');
    upsert_meta('name', 'twitter:title', props.title);
    upsert_meta('name', 'twitter:description', props.description);
    upsert_meta('name', 'twitter:image', image_url);

    let canonical = document.querySelector<HTMLLinkElement>('link[data-vx-seo="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.setAttribute('data-vx-seo', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.href = absolute_url(props.path);

    const existing = document.getElementById('vx-json-ld');
    if (!props.json_ld) {
      existing?.remove();
      return;
    }
    const script = existing ?? document.createElement('script');
    script.id = 'vx-json-ld';
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(props.json_ld);
    if (!existing) {
      document.head.appendChild(script);
    }
  }, [props.title, props.description, props.path, props.og_type, image_url, json_key, props.json_ld]);

  return <></>;
}

/**
 * Creates or updates a meta tag owned by the SEO component.
 *
 * @param attribute - Either `name` or `property`.
 * @param key - Meta key.
 * @param content - Meta content.
 */
function upsert_meta(attribute: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${attribute}="${key}"][data-vx-seo="true"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    element.setAttribute('data-vx-seo', 'true');
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

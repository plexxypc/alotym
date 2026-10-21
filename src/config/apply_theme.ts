import type { StoreConfig } from './types.ts';

/**
 * Writes brand colours and type from config onto the document.
 * Page width stays in CSS (`--vx-container-max`) so breakpoints are not pinned
 * by a single inline length.
 *
 * @param config - Resolved store configuration.
 */
export function apply_store_theme(config: StoreConfig): void {
  const root = document.documentElement;
  const colours = config.brand_colours;
  const tokens: Record<string, string> = {
    '--vx-bg': colours.background,
    '--vx-surface': colours.surface,
    '--vx-ink': colours.ink,
    '--vx-charcoal': colours.charcoal,
    '--vx-muted': colours.muted,
    '--vx-line': colours.line,
    '--vx-accent': colours.accent,
    '--vx-accent-contrast': colours.accent_contrast,
    '--vx-signal': colours.signal,
    '--vx-danger': colours.danger,
    '--vx-font-display': config.typography.display_font_family,
    '--vx-font-body': config.typography.body_font_family,
    '--vx-headline-tracking': config.typography.headline_letter_spacing,
    '--vx-label-tracking': config.typography.label_letter_spacing,
    '--bs-body-bg': colours.background,
    '--bs-body-color': colours.ink,
    '--bs-body-font-family': config.typography.body_font_family,
    '--bs-primary': colours.accent,
    '--bs-border-color': colours.line,
  };

  Object.entries(tokens).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });

  const font_href = config.typography.google_fonts_href.trim();
  const existing = document.getElementById('vx-font-link');
  if (!font_href) {
    existing?.remove();
    return;
  }
  if (existing instanceof HTMLLinkElement) {
    existing.href = font_href;
    return;
  }
  const link = document.createElement('link');
  link.id = 'vx-font-link';
  link.rel = 'stylesheet';
  link.href = font_href;
  document.head.appendChild(link);
}

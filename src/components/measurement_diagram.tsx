import type { ReactElement } from 'react';

/** Props for one labelled measurement diagram. */
export type MeasurementDiagramProps = {
  title: string;
  caption: string;
};

/**
 * Draws a simple front-view figure with labelled measurement lines.
 * The drawing is a guide, not an approved fitting chart.
 *
 * @param props - Title and caption for the diagram.
 * @returns An accessible SVG diagram.
 */
export function MeasurementDiagram(props: MeasurementDiagramProps): ReactElement {
  const title_id = `diagram-${props.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <figure className="al_diagram">
      <svg viewBox="0 0 280 360" role="img" aria-labelledby={title_id}>
        <title id={title_id}>{props.title}</title>
        <desc>{props.caption}</desc>
        <path d="M140 28c16 0 26 12 26 26s-10 24-26 24-26-10-26-24 10-26 26-26z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M104 78h72l18 28-22 8-8 78 16 120h-22l-10-108h-16l-10 108h-22l16-120-8-78-22-8z" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="78" y1="118" x2="202" y2="118" stroke="currentColor" strokeDasharray="4 3" />
        <text x="206" y="122" fontSize="11">Bust</text>
        <line x1="96" y1="168" x2="184" y2="168" stroke="currentColor" strokeDasharray="4 3" />
        <text x="188" y="172" fontSize="11">Waist</text>
        <line x1="86" y1="214" x2="194" y2="214" stroke="currentColor" strokeDasharray="4 3" />
        <text x="198" y="218" fontSize="11">Hips</text>
        <line x1="108" y1="96" x2="172" y2="96" stroke="currentColor" />
        <text x="176" y="92" fontSize="11">Shoulders</text>
        <line x1="108" y1="96" x2="108" y2="168" stroke="currentColor" />
        <text x="40" y="136" fontSize="11">Shoulder to waist</text>
        <line x1="140" y1="78" x2="140" y2="320" stroke="currentColor" strokeDasharray="2 3" />
        <text x="146" y="300" fontSize="11">Length</text>
        <line x1="172" y1="108" x2="214" y2="150" stroke="currentColor" />
        <text x="214" y="154" fontSize="11">Sleeve</text>
      </svg>
      <figcaption>
        <strong>{props.title}</strong>
        <span>{props.caption}</span>
      </figcaption>
    </figure>
  );
}

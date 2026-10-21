import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import type { CampaignContent } from '../config/types.ts';

/** Props for one campaign image block. */
export type EditorialImageSectionProps = {
  campaign: CampaignContent;
};

/**
 * Asymmetric campaign block with photograph, copy, and a link.
 *
 * @param props - Campaign content from the store config.
 * @returns The campaign section.
 */
export function EditorialImageSection(props: EditorialImageSectionProps): ReactElement {
  const campaign = props.campaign;
  const layout_class = campaign.layout === 'image_end' ? 'vx_campaign is_flipped' : 'vx_campaign';
  return (
    <section className={layout_class}>
      <figure className="vx_campaign_figure">
        <img
          src={campaign.image_url}
          alt={campaign.image_alt}
          width={1400}
          height={1750}
          loading="lazy"
        />
      </figure>
      <div className="vx_campaign_copy">
        <p className="vx_kicker">{campaign.kicker}</p>
        <h2>{campaign.title}</h2>
        <p>{campaign.text}</p>
        <Link className="vx_text_link" to={campaign.cta_path}>{campaign.cta_label}</Link>
      </div>
    </section>
  );
}

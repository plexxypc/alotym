import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../config/store.ts';

/**
 * Thin announcement above the header. Renders nothing when the text is empty.
 *
 * @returns The announcement bar, or null.
 */
export function AnnouncementBar(): ReactElement | null {
  const announcement = store.announcement;
  if (!announcement.text.trim()) {
    return null;
  }
  const has_link = Boolean(announcement.link_label && announcement.link_path);
  return (
    <div className="vx_announce">
      <div className="vx_shell vx_announce_inner">
        <p>{announcement.text}</p>
        {has_link ? <Link to={announcement.link_path}>{announcement.link_label}</Link> : null}
      </div>
    </div>
  );
}

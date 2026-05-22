import type { ActivityEvent } from '@/lib/types/property';
import { BandPill } from './BandPill';

function renderWhat(ev: ActivityEvent): React.ReactNode {
  switch (ev.kind) {
    case 'verification-refreshed':
      return <>Verification refreshed · <em>{ev.property}</em><span className="vpid">{ev.vpid}</span></>;
    case 'band-upgraded':
      return <>Band upgraded · <em>{ev.property}</em><span className="vpid">{ev.vpid}</span>{ev.extra ? ` — ${ev.extra}` : ''}</>;
    case 'certificate-issued':
      return <>Certificate issued · <em>{ev.property}</em><span className="vpid">{ev.vpid}</span></>;
    case 'verification-submitted':
      return <>Verification submitted · <em>{ev.property}</em><span className="vpid">{ev.vpid}</span></>;
    case 'verification-expired':
      return <>Verification expired · <em>{ev.property}</em><span className="vpid">{ev.vpid}</span>{ev.extra ? ` — ${ev.extra}` : ''}</>;
    case 'team-member-added':
      return <>Team member added · <em>{ev.person}</em> — role: {ev.role}</>;
  }
}

function renderRight(ev: ActivityEvent): React.ReactNode {
  if (ev.kind === 'team-member-added') {
    return (
      <span style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.14em' }}>
        + MEMBER
      </span>
    );
  }
  return <BandPill band={ev.band} />;
}

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="dv-feed">
      {events.map((ev) => (
        <div key={ev.id} className="dv-feed-item">
          <span className="when">{ev.when}</span>
          <span className="what">{renderWhat(ev)}</span>
          {renderRight(ev)}
        </div>
      ))}
    </div>
  );
}

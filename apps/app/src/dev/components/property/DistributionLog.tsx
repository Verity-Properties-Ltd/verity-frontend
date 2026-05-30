import type { DistributionEvent } from '@dev/lib/types/property';

const CHANNEL_LABEL: Record<DistributionEvent['channel'], string> = {
  web: 'WEB · LAGOS',
  email: 'EMAIL',
  embed: 'EMBED',
  qr: 'QR · GPS',
  direct: 'DIRECT',
};

export function DistributionLog({ events }: { events: DistributionEvent[] }) {
  return (
    <div className="dv-feed" style={{ marginTop: 14 }}>
      {events.map((ev) => (
        <div key={ev.id} className="dv-feed-item">
          <span className="when">{ev.when}</span>
          <span className="what">
            {ev.what} <em>{ev.source}</em>
          </span>
          <span style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.14em' }}>
            {CHANNEL_LABEL[ev.channel]}
          </span>
        </div>
      ))}
    </div>
  );
}

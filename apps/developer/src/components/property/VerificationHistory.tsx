import type { VerificationEvent } from '@/lib/types/property';

export function VerificationHistory({ events }: { events: VerificationEvent[] }) {
  return (
    <div className="dv-history" style={{ marginTop: 14 }}>
      {events.map((ev) => (
        <div key={ev.id} className="dv-history-item">
          <span className="marker" />
          <div>
            <div className="when">{ev.when}</div>
            <div className="h">{ev.title}</div>
            <div className="sub">{ev.detail}</div>
            {ev.change && <div className="change">{ev.change}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

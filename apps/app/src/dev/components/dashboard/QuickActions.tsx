import Link from 'next/link';

type QuickAction = {
  label: string;
  title: React.ReactNode;
  sub: string;
  href: string;
  primary?: boolean;
};

const ACTIONS: QuickAction[] = [
  {
    label: 'Primary action',
    title: <>Add a <em>property</em></>,
    sub: 'Submit one or up to 25 in a batch.',
    href: '/developer/portfolio/add/type',
    primary: true,
  },
  {
    label: 'Distribute',
    title: <>Get <em>certificate</em> URLs &amp; embeds</>,
    sub: 'For your website, sales decks, on-site signage.',
    href: '/developer/distribute',
  },
  {
    label: 'Portfolio',
    title: <>View <em>full</em> portfolio</>,
    sub: 'Filter, sort, and bulk-manage your properties.',
    href: '/developer/portfolio',
  },
];

export function QuickActions() {
  return (
    <div className="dv-quick">
      {ACTIONS.map((a) => (
        <Link key={a.href} href={a.href} className={`dv-quick-card${a.primary ? ' primary' : ''}`} style={{ textDecoration: 'none' }}>
          <span className="label">{a.label}</span>
          <div className="h">{a.title}</div>
          <div className="sub">{a.sub}</div>
          <span className="arrow">→</span>
        </Link>
      ))}
    </div>
  );
}

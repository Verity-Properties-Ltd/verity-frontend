import Link from 'next/link';

/** Shell for an internal admin route that exists as a navigable scaffold but
 *  doesn't yet implement its concrete workflow. Surfaces the build-backlog
 *  story id, a one-line ux description, and pointers back to the spec. */
export function InProgressShell({
  storyId,
  title,
  description,
  spec,
  acceptanceCriteria,
}: {
  storyId: string;
  title: string;
  description: string;
  spec: string;
  acceptanceCriteria: string[];
}) {
  return (
    <div className="int-page">
      <div className="int-eyebrow">{storyId} · in build</div>
      <h1 className="int-h1">{title}</h1>
      <p className="int-lede">{description}</p>

      <div className="int-spec">
        <div className="int-spec-head">Spec reference</div>
        <p className="int-spec-body">{spec}</p>
      </div>

      <div className="int-acceptance">
        <div className="int-acceptance-head">Acceptance criteria · summary</div>
        <ol className="int-acceptance-list">
          {acceptanceCriteria.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ol>
      </div>

      <Link href="/internal" className="int-back" style={{ textDecoration: 'none' }}>
        ← Internal home
      </Link>
    </div>
  );
}

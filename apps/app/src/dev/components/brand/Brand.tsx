import { VerityMark } from '@verity/brand/jsx';

export function Brand({ meta }: { meta?: string }) {
  return (
    <div className="dv-brand">
      <div className="mark">
        <VerityMark size={20} />
        <span className="word">VERITY</span>
      </div>
      {meta && <span className="meta">{meta}</span>}
    </div>
  );
}

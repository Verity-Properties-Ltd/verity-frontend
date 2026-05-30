import { Brand } from '@/components/brand/Brand';
import { VerityMark } from '@/components/brand/VerityMark';

export function BuyerAuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-shell">
      <div className="auth-mobile-brand">
        <Brand meta="VERITY · BUYER" />
      </div>
      <aside className="auth-marketing">
        <div className="auth-mast">
          <VerityMark size={36} />
          <span className="word">VERITY</span>
        </div>
        <div className="auth-pull">
          <div className="bf-eyebrow" style={{ marginBottom: 24 }}>
            — Property verification, done properly
          </div>
          <h1 className="auth-h1">
            A buyer&apos;s <em className="bf-italic">peace of mind</em>, before the wire goes out.
          </h1>
          <p className="auth-sub">
            Eight-stage verification by licensed Lagos surveyors. Your report arrives in three to five days, signed and share-safe.
          </p>
        </div>
        <div className="auth-foot">
          <div className="bf-row" style={{ gap: 32 }}>
            <div>
              <div className="bf-mono mono-stat">2,800+</div>
              <div className="bf-mono mono-cap">VERIFICATIONS</div>
            </div>
            <div>
              <div className="bf-mono mono-stat">97.2%</div>
              <div className="bf-mono mono-cap">CONFIDENCE</div>
            </div>
            <div>
              <div className="bf-mono mono-stat">£2.4B</div>
              <div className="bf-mono mono-cap">PROTECTED</div>
            </div>
          </div>
        </div>
      </aside>
      <main className="auth-form">
        <div className="auth-card">{children}</div>
      </main>
    </div>
  );
}

import { Brand } from '@dev/components/brand/Brand';
import { VerityMarkCream } from '@dev/components/brand/VerityMarkCream';

export function DevAuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="dv-auth">
      <div className="dv-auth-mobile-brand">
        <Brand meta="VERITY · DEVELOPER" />
      </div>

      <aside className="dv-auth-brand">
        <div className="head">
          <VerityMarkCream size={32} />
          <div>
            <div className="word">VERITY</div>
            <div className="meta">Founding 50 · Cohort 014</div>
          </div>
        </div>

        <div className="quote">
          Verity verifies every developer through Mono before a property is added — a deliberate gate.
        </div>

        <div className="cohort">
          <div className="label">Welcome · invitation accepted</div>
          <h2>You&rsquo;ve been <em>invited</em> to join the Founding 50.</h2>
          <p>
            Fifty Lagos developers, hand-selected by Verity&rsquo;s founders, with free verification through Q3 2027 and a Founding Partner badge for your property listings.
          </p>

          <div className="credits">
            <div className="it">Advisor<span className="v">Sheun Badmus</span></div>
            <div className="it">Admitted<span className="v">28 Apr 2026</span></div>
            <div className="it">Cohort<span className="v">014 · 09 May</span></div>
            <div className="it">Cohort size<span className="v">12 of 50 · open</span></div>
          </div>
        </div>
      </aside>

      <main className="dv-auth-form">{children}</main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHead } from '@/components/chrome/PageHead';
import { KvRow } from '@/components/account/KvRow';
import { TeamMemberRow } from '@/components/account/TeamMemberRow';
import { FoundingCard } from '@/components/account/FoundingCard';
import { accountService, authService, teamService } from '@/lib/services';
import type { CompanyProfile, ComplianceDoc, FoundingStatus, Invoice, Subscription, TeamMember } from '@/lib/types/account';

type State = {
  profile: CompanyProfile;
  team: TeamMember[];
  subscription: Subscription;
  invoices: Invoice[];
  compliance: ComplianceDoc[];
  founding: FoundingStatus;
} | null;

export function AccountClient() {
  const router = useRouter();
  const [state, setState] = useState<State>(null);
  const session = typeof window !== 'undefined' ? authService.getSession() : null;
  const eyebrow = session ? `Account · admin · ${session.fullName}` : 'Account';

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      accountService.getProfile(),
      teamService.list(),
      accountService.getSubscription(),
      accountService.listInvoices(),
      accountService.listCompliance(),
      accountService.getFoundingStatus(),
    ]).then(([profile, team, subscription, invoices, compliance, founding]) => {
      if (!cancelled) setState({ profile, team, subscription, invoices, compliance, founding });
    });
    return () => { cancelled = true; };
  }, []);

  function onSignOut() {
    authService.signOut();
    router.replace('/signin');
  }

  if (!state) return <p style={{ color: 'var(--slate)' }}>Loading account…</p>;
  const { profile, team, subscription, invoices, compliance, founding } = state;

  return (
    <>
      <PageHead
        eyebrow={eyebrow}
        title={<><em>Account</em> &amp; billing</>}
        lede="Company profile, team access, subscription, and your Founding 50 partnership terms."
        actions={
          <button type="button" className="dv-btn outline" onClick={onSignOut}>
            Sign out
          </button>
        }
      />

      <div className="dv-acct-grid">
        <div>
          <section className="dv-acct-section">
            <h3>Company profile</h3>
            <KvRow k="Registered name" v={profile.registeredName} editLabel="Edit" />
            <KvRow k="RC Number" v={profile.rcNumber} mono />
            <KvRow k="LASRERA registration" v={profile.lasreraReg} mono />
            <KvRow k="Registered address" v={profile.registeredAddress} editLabel="Edit" />
            <KvRow k="Primary contact" v={`${profile.primaryContact.name} · ${profile.primaryContact.email}`} editLabel="Edit" />
          </section>

          <section className="dv-acct-section">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ margin: 0 }}>Team members</h3>
              <button type="button" className="dv-btn outline sm">+ Invite member</button>
            </div>
            {team.map((m) => <TeamMemberRow key={m.id} member={m} />)}
          </section>

          <section className="dv-acct-section">
            <h3>Subscription</h3>
            <KvRow
              k="Tier"
              v={<><strong style={{ color: 'var(--gold-deep)' }}>{subscription.tier}</strong> · all features included</>}
            />
            <KvRow
              k="Verifications · used"
              v={<>{subscription.used} of {subscription.unlimited ? 'unlimited' : '—'} <span style={{ color: 'var(--slate)' }}>(through Q3 2027)</span></>}
            />
            <KvRow k="Next billing date" v={subscription.nextBillingDate} />
            <KvRow k="Payment method" v={subscription.paymentMethod} mono editLabel="Replace" />
          </section>

          <section className="dv-acct-section">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ margin: 0 }}>Invoices</h3>
              <span style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.18em' }}>
                {invoices.length} of {invoices.length} · all paid
              </span>
            </div>
            <div className="dv-table-wrap">
              <table className="dv-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Period</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="vpid">{inv.id}</td>
                      <td className="date">{inv.period}</td>
                      <td className="vpid">{inv.amount}</td>
                      <td>
                        <span className="dv-status-pill active">
                          <span className="dot" />Paid · {inv.note}
                        </span>
                      </td>
                      <td className="act"><span className="more" title="Download">⤓</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="dv-acct-section">
            <h3>Compliance documents</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }} className="dv-compliance-grid">
              {compliance.map((d) => (
                <div key={d.name} style={{ background: 'var(--cream)', border: '1px solid var(--line)', padding: '14px 16px', borderRadius: 4 }}>
                  <div style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--gold-deep)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>{d.abbr}</div>
                  <div style={{ fontSize: 13, color: 'var(--navy)', fontWeight: 500, marginTop: 6 }}>{d.name}</div>
                  <div style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.12em', marginTop: 6 }}>{d.signedAt}</div>
                  <div style={{ marginTop: 10, fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    <span style={{ borderBottom: '1px solid var(--line)', paddingBottom: 1, cursor: 'pointer' }}>Download PDF</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside>
          <FoundingCard status={founding} />
          <div style={{ marginTop: 18, padding: 18, background: 'var(--cream)', border: '1px solid var(--line)' }}>
            <div style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--gold-deep)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
              Cohort benefit
            </div>
            <div style={{ fontFamily: 'var(--f-body)', fontStyle: 'italic', fontSize: 18, color: 'var(--navy)', lineHeight: 1.3 }}>
              Free verification for all properties added through Q3 2027.
            </div>
            <div style={{ fontSize: 13, color: 'var(--slate)', marginTop: 10, lineHeight: 1.5 }}>
              No per-property cost. No tier limits. Refreshes included.
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

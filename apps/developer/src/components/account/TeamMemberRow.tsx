import type { TeamMember } from '@/lib/types/account';

export function TeamMemberRow({ member }: { member: TeamMember }) {
  return (
    <div className="dv-team-row">
      <span className="ava">{member.initials}</span>
      <div className="who">
        <div className="name">{member.name}</div>
        <div className="email">{member.email}</div>
      </div>
      <span className="role">{member.role}</span>
      <span style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.18em', cursor: 'pointer' }}>Manage</span>
    </div>
  );
}

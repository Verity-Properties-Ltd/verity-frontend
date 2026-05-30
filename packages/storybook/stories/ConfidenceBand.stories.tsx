import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfidenceBand, BandDisplay } from '@verity/brand/jsx';

const meta: Meta<typeof ConfidenceBand> = {
  title: 'Domain primitives/ConfidenceBand',
  component: ConfidenceBand,
  parameters: {
    docs: {
      description: {
        component:
          'Trust-critical domain primitive (PRD §11.2). Six-band ladder per §4.4 plus two state overlays (revoked, expired). Any band naming, colour or layout change requires founder review.',
      },
    },
  },
  argTypes: {
    band: {
      control: 'select',
      options: ['platinum', 'gold', 'silver', 'bronze', 'provisional', 'unconfirmed', 'revoked', 'expired'],
    },
    score: { control: { type: 'number', min: 0, max: 100, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof ConfidenceBand>;

export const Platinum: Story = { args: { band: 'platinum', score: 94 } };
export const Gold: Story = { args: { band: 'gold', score: 82 } };
export const Silver: Story = { args: { band: 'silver', score: 71 } };
export const Bronze: Story = { args: { band: 'bronze', score: 58 } };
export const Provisional: Story = { args: { band: 'provisional', score: 28 } };
export const Unconfirmed: Story = { args: { band: 'unconfirmed' } };

export const Revoked: Story = {
  args: { band: 'revoked', score: 82 },
  parameters: {
    docs: {
      description: {
        story:
          'State overlay — a band can be Revoked after dispute outcome. Original confidence score is preserved for audit.',
      },
    },
  },
};

export const Expired: Story = {
  args: { band: 'expired', score: 71 },
  parameters: {
    docs: {
      description: {
        story:
          'State overlay — time-based. Verification has aged past its validity window. Buyer or developer can commission a fresh verification.',
      },
    },
  },
};

export const FullDisplay: StoryObj = {
  render: () => (
    <BandDisplay
      band="gold"
      score={82}
      statement={<>Verified to <em>Gold</em>.</>}
      caption="Issued · 12 May 2026 · VPR-2026-005847"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Large certificate declaration — band pill + serif statement + mono caption. Used on the public verification page and the buyer-facing certificate.',
      },
    },
  },
};

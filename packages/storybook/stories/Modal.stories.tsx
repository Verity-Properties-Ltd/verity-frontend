import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal, Button } from '@verity/brand/jsx';

const meta: Meta<typeof Modal> = {
  title: 'Overlays/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The only flat-UI element permitted a shadow per PRD §11.3 (modals are true overlays). Centered card with eyebrow, title, body, optional footer. Backdrop click + close button call onClose.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    eyebrow: 'KYC verification',
    title: 'Verify your business with Mono',
    children: (
      <>
        <p style={{ fontFamily: 'var(--f-serif)', fontSize: 16, lineHeight: 1.6, color: 'var(--navy)' }}>
          We&rsquo;ll run a two-stage verification: a corporate check (Lookup) and an identity check
          (Prove). Each takes about a minute.
        </p>
        <p style={{ marginTop: 12, fontSize: 14, color: 'var(--slate)' }}>
          Required to unlock property uploads. Founding 50 cohort terms apply.
        </p>
      </>
    ),
    footer: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button variant="gold">Start verification</Button>
      </>
    ),
  },
};

export const ConfirmationOnly: Story = {
  args: {
    title: 'Request a refund',
    children: (
      <p style={{ fontFamily: 'var(--f-serif)', fontSize: 15, lineHeight: 1.6, color: 'var(--navy)' }}>
        Refunds are processed within 5 business days. The original verification stays on the public
        record for audit.
      </p>
    ),
    footer: (
      <>
        <Button variant="secondary">Keep verification</Button>
        <Button variant="danger">Request refund</Button>
      </>
    ),
  },
};

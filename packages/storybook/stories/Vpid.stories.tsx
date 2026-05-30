import type { Meta, StoryObj } from '@storybook/react-vite';
import { Vpid, Vpr } from '@verity/brand/jsx';

const meta: Meta<typeof Vpid> = {
  title: 'Domain primitives/Vpid',
  component: Vpid,
  parameters: {
    docs: {
      description: {
        component:
          'Trust-critical domain primitive (PRD §11.2). VPID format VRT-XXXXXXXXX per §4.2 — always DM Mono. Any change to formatting, font, or copy-on-click behaviour requires founder review.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Vpid>;

export const Default: Story = {
  args: { id: 'VRT-7K2M9PXQR8' },
};

export const Copyable: Story = {
  args: { id: 'VRT-7K2M9PXQR8', copyable: true },
};

export const WithLabel: Story = {
  args: { id: 'VRT-7K2M9PXQR8', label: 'Persistent identifier' },
};

export const VprDisplay: StoryObj = {
  render: () => <Vpr>VPR-2026-005847</Vpr>,
  parameters: {
    docs: {
      description: {
        story: 'VPR reference per §4.3 — year + 6-digit sequence within that year.',
      },
    },
  },
};

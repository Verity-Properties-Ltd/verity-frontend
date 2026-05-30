import type { Meta, StoryObj } from '@storybook/react-vite';
import { VerityMark, VerityWordmark, VerityLogo } from '@verity/brand/jsx';

const meta: Meta<typeof VerityLogo> = {
  title: 'Brand/Logo',
  component: VerityLogo,
  parameters: {
    docs: {
      description: {
        component:
          'Trust-critical primitive — the gold T in the wordmark is brand-level. Changes require founder approval, not routine design review (PRD §11.2). Tenor Sans is reserved for the wordmark.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof VerityLogo>;

export const Horizontal: Story = { args: { variant: 'horizontal', size: 28 } };
export const HorizontalWithTagline: Story = { args: { variant: 'horizontal', size: 28, tagline: true } };
export const Mark: Story = { args: { variant: 'mark', size: 40 } };
export const Wordmark: Story = { args: { variant: 'wordmark', size: 32 } };
export const Stacked: Story = { args: { variant: 'stacked', size: 28 } };

export const DarkSurface: Story = {
  args: { variant: 'horizontal', size: 28, dark: true },
  parameters: { backgrounds: { default: 'navy' } },
};

export const MarkOnly: StoryObj = {
  render: () => <VerityMark size={64} />,
};

export const WordmarkOnly: StoryObj = {
  render: () => <VerityWordmark size={36} />,
};

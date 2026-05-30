import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@verity/brand/jsx';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Five variants — primary (navy), secondary (navy outline), tertiary (gold underline link), gold (signal — one per surface only), danger (red outline). Three sizes (sm/md/lg). dark prop flips for navy backgrounds.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'gold', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    dark: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary', children: 'Start a verification' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Learn more' } };
export const Tertiary: Story = { args: { variant: 'tertiary', children: 'Read the methodology' } };

export const Gold: Story = {
  args: { variant: 'gold', children: 'Apply for Founding 50' },
  parameters: {
    docs: {
      description: {
        story:
          'Signal variant — one gold per surface only (PRD §11.3). If a frame already has a gold CTA, neither should be gold.',
      },
    },
  },
};

export const Danger: Story = { args: { variant: 'danger', children: 'Suspend account' } };
export const Disabled: Story = { args: { variant: 'primary', children: 'Submit', disabled: true } };
export const Small: Story = { args: { variant: 'primary', size: 'sm', children: 'Copy URL' } };
export const Large: Story = { args: { variant: 'primary', size: 'lg', children: 'Pay ₦150,000' } };

export const OnDarkSurface: Story = {
  args: { variant: 'primary', children: 'Sign in', dark: true },
  parameters: { backgrounds: { default: 'navy' } },
};

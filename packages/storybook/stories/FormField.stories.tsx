import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField, Input, Textarea, Select, Checkbox, Radio } from '@verity/brand/jsx';

const meta: Meta<typeof FormField> = {
  title: 'Atoms/FormField',
  component: FormField,
  parameters: {
    docs: {
      description: {
        component:
          'Field wrapper that owns the label, the REQUIRED chip, the error message, and the help text. Wraps Input / Textarea / Select / Checkbox / Radio atoms.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const TextInput: Story = {
  args: { label: 'Property address', required: true },
  render: (args) => (
    <FormField {...args}>
      <Input placeholder="15 Admiralty Way, Lekki Phase 1" />
    </FormField>
  ),
};

export const WithHelp: Story = {
  args: { label: 'Plot number', help: 'Optional — improves matching against registry records.' },
  render: (args) => (
    <FormField {...args}>
      <Input placeholder="Plot 12" />
    </FormField>
  ),
};

export const WithError: Story = {
  args: { label: 'Email', required: true, error: 'Enter a valid email address.' },
  render: (args) => (
    <FormField {...args}>
      <Input type="email" defaultValue="adaeze@" />
    </FormField>
  ),
};

export const TextareaField: Story = {
  args: { label: 'What you’re building', help: 'Optional · a few lines.' },
  render: (args) => (
    <FormField {...args}>
      <Textarea rows={4} placeholder="Active portfolio in Lekki Phase 1 + Ikoyi…" />
    </FormField>
  ),
};

export const SelectField: Story = {
  args: { label: 'Where you’re based', required: true },
  render: (args) => (
    <FormField {...args}>
      <Select defaultValue="">
        <option value="" disabled>Select country</option>
        <option>United Kingdom</option>
        <option>United States</option>
        <option>Nigeria</option>
        <option>Other</option>
      </Select>
    </FormField>
  ),
};

export const Checkboxes: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox checked={true} label="I have the title document." />
      <Checkbox checked={false} label="I have a survey plan." />
    </div>
  ),
};

export const Radios: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Radio checked={true} label="Standard tier · ₦50,000 · 7 business days" />
      <Radio checked={false} label="Premium tier · ₦150,000 · 3 business days" />
    </div>
  ),
};

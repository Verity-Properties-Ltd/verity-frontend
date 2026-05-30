import type { Preview } from '@storybook/react-vite';
import '@verity/brand/tokens/index.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'cream',
      values: [
        { name: 'cream', value: '#F5F2ED' },
        { name: 'white', value: '#FFFFFF' },
        { name: 'navy', value: '#1E2260' },
        { name: 'navy-deep', value: '#171A4A' },
      ],
    },
    controls: { expanded: true },
  },
};

export default preview;

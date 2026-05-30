import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx|mdx)'],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: { check: false, reactDocgen: 'react-docgen' },
  core: { disableTelemetry: true },
  viteFinal: async (cfg) => {
    cfg.resolve = cfg.resolve ?? {};
    // Prefer the .tsx ports over the Drive-sync .jsx sources when
    // @verity/brand/jsx/X resolves with no extension. The .jsx files use
    // Object.assign(window, ...) and don't expose ES module exports;
    // the .tsx siblings do.
    cfg.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', '.css', '.json'];
    return cfg;
  },
};

export default config;

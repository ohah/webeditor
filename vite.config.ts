import eslint from '@rollup/plugin-eslint';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: '.',
  publicDir: '/src/css',
  plugins: [
    {
      ...eslint({
        include: 'src/**/*.+(ts|tsx)',
      }),
      enforce: 'pre',
    },
    tsconfigPaths(),
  ],
});

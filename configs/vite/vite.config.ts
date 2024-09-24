import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import pkg from '../../package.json';

export default defineConfig({
  plugins: [dts({ tsconfigPath: path.resolve(process.cwd(), 'tsconfig.json'), rollupTypes: true })],
  resolve: { alias: [{ find: /^\$(.+)/, replacement: path.resolve(process.cwd(), 'src/$1') }] },
  build: {
    outDir: path.resolve(process.cwd(), 'lib'),
    lib: {
      entry: path.resolve(process.cwd(), 'src/index.ts'),
      name: 'rhf-rapid',
      fileName: 'index',
      formats: ['cjs', 'es', 'umd'],
    },
    rollupOptions: {
      external: Array.from(Object.keys(pkg.peerDependencies)),
    },
    sourcemap: true,
  },
});

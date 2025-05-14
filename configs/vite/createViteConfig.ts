import path from 'path';
import { AliasOptions, defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

interface CreateBuildConfigProps {
  packageName: string;
  externalPackages: Record<string, string>;
  alias?: AliasOptions | undefined;
  rootDir: string;
}

export const createBuildConfig = ({ externalPackages, packageName, alias, rootDir }: CreateBuildConfigProps) =>
  defineConfig({
    plugins: [dts({ tsconfigPath: path.resolve(rootDir, './tsconfig.json'), rollupTypes: true })],
    resolve: { alias },
    build: {
      outDir: path.resolve(rootDir, 'lib'),
      lib: {
        entry: path.resolve(rootDir, 'src/index.ts'),
        name: packageName,
        fileName: 'index',
        formats: ['cjs', 'es', 'umd'],
      },
      rollupOptions: {
        external: Array.from([...Object.keys(externalPackages), 'react/jsx-runtime']),
      },
      sourcemap: true,
    },
  });

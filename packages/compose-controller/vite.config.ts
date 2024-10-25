import { resolve } from 'path';

import { createBuildConfig } from '../../configs/vite/createViteConfig';

import pkg from './package.json';

export default createBuildConfig({
  rootDir: __dirname,
  packageName: pkg.name,
  externalPackages: pkg.peerDependencies,
  alias: [{ find: /^\$(.+)/, replacement: resolve(__dirname, './src/$1') }],
});

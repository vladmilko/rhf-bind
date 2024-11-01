import { Config } from '@jest/types';
import { resolve } from 'path';

import { createJestConfig } from '../../configs/jest/createJestConfig';

const config: Config.InitialOptions = createJestConfig({
  pathToModule: __dirname,
  moduleNameMapper: {
    '^\\$(.*)$': resolve(__dirname, './src/$1'),
  },
});

export default config;

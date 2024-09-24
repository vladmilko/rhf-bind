import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testEnvironment: 'jsdom',
  clearMocks: true,
  rootDir: '../../',
  moduleDirectories: ['node_modules'],
  coveragePathIgnorePatterns: ['\\\\node_modules\\\\', '__fixtures__', 'consts', 'consts.ts'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  testMatch: ['<rootDir>src/**/__tests__/*(*.)@(spec).[tj]s?(x)'],
  modulePaths: ['<rootDir>src'],
  setupFilesAfterEnv: ['<rootDir>configs/jest/setupTests.ts'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  moduleNameMapper: {
    '.+\\.(png|jpg|css)$': 'identity-obj-proxy',
    '^\\$(.*)$': '<rootDir>/src/$1',
  },
};

export default config;

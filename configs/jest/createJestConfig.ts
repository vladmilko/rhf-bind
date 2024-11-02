import { Config } from '@jest/types';
import { resolve } from 'path';
type CreateJestConfigProps = Pick<Config.InitialOptions, 'moduleNameMapper'> & {
  pathToModule: string;
};

export const createJestConfig = ({ moduleNameMapper, pathToModule }: CreateJestConfigProps): Config.InitialOptions => ({
  rootDir: resolve(__dirname, '../../'),
  testEnvironment: 'jsdom',
  clearMocks: true,
  moduleDirectories: ['node_modules'],
  coveragePathIgnorePatterns: ['\\\\node_modules\\\\', '__fixtures__', 'consts', 'consts.ts'],
  coverageDirectory: resolve(pathToModule, 'coverage'),
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  testMatch: [`${pathToModule}/src/**/__tests__/*(*.)@(spec).[tj]s?(x)`],
  modulePaths: [`${pathToModule}/src`],
  setupFilesAfterEnv: ['<rootDir>/configs/jest/setupTests.ts'],
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
    ...moduleNameMapper,
  },
});

import type { Config } from 'jest';

import { compilerOptions } from './tsconfig.json';

export default async (): Promise<Config> => {
  return {
    roots: ['<rootDir>'],
    rootDir: './',
    testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
    // preset: 'ts-jest/presets/default-esm',
    preset: 'ts-jest',
    extensionsToTreatAsEsm: ['.ts'],
    modulePaths: [compilerOptions.baseUrl],
    transform: {
      '^.+\\.(ts|tsx)$': [
        'ts-jest',
        {
          isolatedModules: false,
          // supportsStaticESM: true,
          diagnostics: {
            warnOnly: true,
          },
        },
      ],
      '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
  };
};

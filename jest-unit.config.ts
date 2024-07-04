import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: {
    name: 'nest',
    color: 'blue',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  moduleNameMapper: {
    '@modules/(.*)': '<rootDir>/src/modules/$1',
    '@shared/(.*)': '<rootDir>/src/shared/$1',
    '@config/(.*)': '<rootDir>/src/config/$1',
    '@/tests/(.*)': '<rootDir>/tests/$1',
  },
  testRegex: '.*\\..*spec\\.ts$',
  collectCoverageFrom: ['src/**/*.(t)s'],
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  clearMocks: true,
  coverageProvider: 'v8',
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  // Remove as configurações de globalSetup e globalTeardown
};

export default config;

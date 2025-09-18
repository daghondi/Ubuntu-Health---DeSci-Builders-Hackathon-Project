// Jest configuration for unit tests
// Ubuntu Health Testing Framework - Unit Test Configuration

module.exports = {
  displayName: 'Unit Tests',
  testMatch: [
    '<rootDir>/unit/**/*.test.{js,ts,jsx,tsx}',
    '<rootDir>/unit/**/*.spec.{js,ts,jsx,tsx}'
  ],
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    '<rootDir>/config/setup/unit-setup.js'
  ],
  moduleNameMapping: {
    '^@ubuntu-health/(.*)$': '<rootDir>/../$1',
    '^@tests/(.*)$': '<rootDir>/$1',
    '^@fixtures/(.*)$': '<rootDir>/fixtures/$1'
  },
  collectCoverageFrom: [
    '../contracts/**/*.{js,ts}',
    '../frontend/src/**/*.{js,ts,jsx,tsx}',
    '../backend/src/**/*.{js,ts}',
    '../mobile/src/**/*.{js,ts,jsx,tsx}',
    '../zkproofs/**/*.{js,ts}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/dist/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],
  testTimeout: 30000,
  verbose: true,
  bail: false,
  maxWorkers: '50%',
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', {
      useESM: true
    }]
  },
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
    '/coverage/'
  ],
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  // Ubuntu Philosophy Testing Configuration
  globalSetup: '<rootDir>/config/setup/ubuntu-global-setup.js',
  globalTeardown: '<rootDir>/config/setup/ubuntu-global-teardown.js',
  reporters: [
    'default',
    ['<rootDir>/config/reporters/ubuntu-philosophy-reporter.js', {
      outputPath: './test-results/ubuntu-philosophy-report.json'
    }],
    ['jest-html-reporters', {
      publicPath: './test-results',
      filename: 'unit-test-report.html',
      pageTitle: 'Ubuntu Health Unit Tests'
    }]
  ]
};

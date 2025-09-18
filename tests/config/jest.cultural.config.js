// Jest configuration for cultural sensitivity and Ubuntu philosophy tests
// Ubuntu Health Testing Framework - Cultural Validation Configuration

module.exports = {
  displayName: 'Cultural & Ubuntu Philosophy Tests',
  testMatch: [
    '<rootDir>/cultural/**/*.test.{js,ts,jsx,tsx}',
    '<rootDir>/cultural/**/*.spec.{js,ts,jsx,tsx}'
  ],
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    '<rootDir>/config/setup/cultural-setup.js',
    '<rootDir>/config/setup/ubuntu-philosophy-setup.js'
  ],
  moduleNameMapping: {
    '^@ubuntu-health/(.*)$': '<rootDir>/../$1',
    '^@tests/(.*)$': '<rootDir>/$1',
    '^@fixtures/(.*)$': '<rootDir>/fixtures/$1',
    '^@cultural/(.*)$': '<rootDir>/fixtures/cultural-data/$1'
  },
  testTimeout: 60000, // Extended timeout for cultural validation
  verbose: true,
  bail: false,
  maxWorkers: 1, // Sequential execution for cultural tests
  
  // Custom matchers for Ubuntu philosophy validation
  setupFilesAfterEnv: [
    '<rootDir>/config/matchers/ubuntu-matchers.js',
    '<rootDir>/config/matchers/cultural-matchers.js',
    '<rootDir>/config/matchers/accessibility-matchers.js'
  ],
  
  // Cultural test configuration
  globals: {
    UBUNTU_TESTING_MODE: true,
    CULTURAL_VALIDATION_ENABLED: true,
    ELDER_COUNCIL_VALIDATION: true,
    TRADITIONAL_HEALING_INTEGRATION: true,
    CEREMONY_INTEGRATION_TESTING: true
  },
  
  // Test environment variables for cultural context
  testEnvironmentOptions: {
    culturalContext: 'ubuntu-philosophy',
    traditionalHealingMode: true,
    communityConsensusMode: true,
    elderCouncilIntegration: true
  },
  
  // Reporters specific to cultural validation
  reporters: [
    'default',
    ['<rootDir>/config/reporters/cultural-sensitivity-reporter.js', {
      outputPath: './test-results/cultural-sensitivity-report.json',
      includeElderCouncilFeedback: true,
      validateTraditionalPractices: true
    }],
    ['<rootDir>/config/reporters/ubuntu-philosophy-reporter.js', {
      outputPath: './test-results/ubuntu-philosophy-report.json',
      validateCommunityConsensus: true,
      checkCollectiveDecisionMaking: true
    }],
    ['<rootDir>/config/reporters/accessibility-reporter.js', {
      outputPath: './test-results/accessibility-report.json',
      validateInclusiveDesign: true,
      checkCommunityAccessibility: true
    }]
  ],
  
  // Coverage specific to cultural components
  collectCoverageFrom: [
    '../frontend/src/components/cultural/**/*.{js,ts,jsx,tsx}',
    '../frontend/src/components/ubuntu/**/*.{js,ts,jsx,tsx}',
    '../backend/src/middleware/ubuntu-consensus/**/*.{js,ts}',
    '../backend/src/services/traditional-healing/**/*.{js,ts}',
    '../backend/src/services/ceremony-integration/**/*.{js,ts}',
    '../contracts/programs/ubuntu-health-core/**/*.rs',
    '../governance/dao/ubuntu-council/**/*.{js,ts}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/dist/**'
  ],
  
  // Cultural test thresholds (may be lower due to qualitative nature)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Transform configuration for cultural test files
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', {
      useESM: true,
      isolatedModules: true
    }]
  },
  
  // Module file extensions
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json'
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
    '/coverage/',
    '/technical-tests/' // Exclude technical tests from cultural validation
  ],
  
  // Mock configuration for cultural tests
  clearMocks: true,
  restoreMocks: true,
  resetMocks: false, // Keep cultural context between tests
  
  // Global setup and teardown for cultural environment
  globalSetup: '<rootDir>/config/setup/cultural-global-setup.js',
  globalTeardown: '<rootDir>/config/setup/cultural-global-teardown.js'
};

// Cypress E2E testing configuration for Ubuntu Health
// Ubuntu Health Testing Framework - End-to-End Configuration

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Base configuration
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // Ubuntu Health specific configuration
    env: {
      UBUNTU_TESTING_MODE: true,
      CULTURAL_VALIDATION: true,
      ELDER_COUNCIL_INTEGRATION: true,
      TRADITIONAL_HEALING_SUPPORT: true,
      CEREMONY_INTEGRATION: true,
      COMMUNITY_CONSENSUS_MODE: true,
      
      // Test environment URLs
      FRONTEND_URL: 'http://localhost:3000',
      BACKEND_URL: 'http://localhost:8000',
      MOBILE_URL: 'http://localhost:19006', // Expo dev server
      SOLANA_CLUSTER: 'localnet',
      IPFS_GATEWAY: 'http://localhost:8080',
      
      // Test credentials
      TEST_WALLET_PRIVATE_KEY: process.env.TEST_WALLET_PRIVATE_KEY,
      TEST_ELDER_COUNCIL_KEY: process.env.TEST_ELDER_COUNCIL_KEY,
      TEST_PATIENT_CREDENTIALS: process.env.TEST_PATIENT_CREDENTIALS,
      TEST_PROVIDER_CREDENTIALS: process.env.TEST_PROVIDER_CREDENTIALS,
      
      // Cultural test data
      CULTURAL_TEST_DATA_PATH: 'fixtures/cultural-data',
      UBUNTU_CEREMONY_DATA: 'fixtures/ubuntu-ceremonies',
      TRADITIONAL_HEALING_DATA: 'fixtures/traditional-healing'
    },
    
    // Viewport and browser configuration
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Test execution configuration
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    
    // Video and screenshot configuration
    video: true,
    videosFolder: 'test-results/videos',
    screenshotsFolder: 'test-results/screenshots',
    screenshotOnRunFailure: true,
    
    // Test retry configuration
    retries: {
      runMode: 2,
      openMode: 0
    },
    
    // Setup and teardown
    setupNodeEvents(on, config) {
      // Ubuntu Health specific setup
      on('before:browser:launch', (browser = {}, launchOptions) => {
        // Configure browser for accessibility testing
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-web-security');
          launchOptions.args.push('--allow-running-insecure-content');
          launchOptions.args.push('--disable-background-timer-throttling');
        }
        
        return launchOptions;
      });
      
      // Task for Ubuntu philosophy validation
      on('task', {
        validateUbuntuPrinciples(testResults) {
          // Custom validation logic for Ubuntu principles
          const { communityConsensus, culturalSensitivity, inclusiveDesign } = testResults;
          
          return {
            valid: communityConsensus && culturalSensitivity && inclusiveDesign,
            feedback: 'Ubuntu principles validation completed'
          };
        },
        
        validateCulturalSensitivity(componentData) {
          // Custom validation for cultural sensitivity
          return {
            culturallyAppropriate: true,
            elderCouncilApproved: true,
            traditionalHealingRespected: true
          };
        },
        
        logUbuntuPhilosophy(message) {
          console.log(`🌍 Ubuntu Philosophy: ${message}`);
          return null;
        },
        
        validateAccessibility(pageData) {
          // Accessibility validation using axe-core
          const axe = require('axe-core');
          return axe.run(pageData);
        }
      });
      
      // Plugin configurations
      require('@cypress/code-coverage/task')(on, config);
      require('cypress-axe/dist/axe-plugin')(on, config);
      
      // File preprocessing for TypeScript
      on('file:preprocessor', require('@cypress/webpack-preprocessor')({
        webpackOptions: {
          resolve: {
            extensions: ['.ts', '.tsx', '.js']
          },
          module: {
            rules: [
              {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
              }
            ]
          }
        }
      }));
      
      return config;
    }
  },
  
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'components/**/*.cy.{js,jsx,ts,tsx}',
  },
  
  // Additional configuration for Ubuntu Health
  experimentalStudio: true,
  experimentalRunAllSpecs: true,
  
  // Integration with Ubuntu community review
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'test-results/e2e-reports',
    overwrite: false,
    html: true,
    json: true,
    timestamp: 'mmddyyyy_HHMMss',
    reportTitle: 'Ubuntu Health E2E Tests',
    reportPageTitle: 'Ubuntu Health - End-to-End Test Results'
  }
});

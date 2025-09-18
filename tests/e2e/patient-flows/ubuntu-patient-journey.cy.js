/**
 * End-to-End Patient Journey Tests
 * Ubuntu Health Platform - Patient Experience Validation
 * 
 * Tests complete patient journeys from registration through healing,
 * validating Ubuntu philosophy integration and cultural sensitivity throughout.
 */

describe('Ubuntu Health Patient Journey', () => {
  beforeEach(() => {
    // Setup test environment with Ubuntu context
    cy.task('logUbuntuPhilosophy', 'Beginning patient journey with Ubuntu principles');
    cy.visit('/');
    
    // Validate Ubuntu philosophy banner is present
    cy.get('[data-testid="ubuntu-philosophy-banner"]').should('be.visible');
    cy.get('[data-testid="ubuntu-philosophy-banner"]').should('contain', 'I am because we are');
  });

  describe('Patient Registration with Ubuntu Identity', () => {
    it('should complete culturally-sensitive patient registration', () => {
      // Navigate to registration
      cy.get('[data-testid="register-patient-button"]').click();
      cy.url().should('include', '/register/patient');
      
      // Validate Ubuntu-centered registration form
      cy.get('[data-testid="registration-form"]').should('be.visible');
      cy.get('[data-testid="ubuntu-welcome-message"]').should('contain', 'Welcome to our healing community');
      
      // Fill basic information with community context
      cy.get('[data-testid="patient-name-input"]').type('Nomsa Ubuntu');
      cy.get('[data-testid="patient-email-input"]').type('nomsa@ubuntuhealth.community');
      
      // Cultural background section
      cy.get('[data-testid="cultural-background-section"]').should('be.visible');
      cy.get('[data-testid="primary-language-select"]').select('isiZulu');
      cy.get('[data-testid="traditional-practices-input"]').check(['ancestral-communion', 'herbal-medicine']);
      cy.get('[data-testid="community-elder-input"]').type('Elder Thabo Mthembu');
      
      // Community participation preferences
      cy.get('[data-testid="community-participation-section"]').should('be.visible');
      cy.get('[data-testid="healing-circles-checkbox"]').check();
      cy.get('[data-testid="knowledge-sharing-checkbox"]').check();
      cy.get('[data-testid="elder-guidance-checkbox"]').check();
      
      // Traditional healing consent
      cy.get('[data-testid="traditional-healing-consent"]').should('be.visible');
      cy.get('[data-testid="traditional-healing-consent"]').check();
      cy.get('[data-testid="ceremony-participation-consent"]').check();
      
      // Privacy and data sharing with Ubuntu values
      cy.get('[data-testid="privacy-section"]').should('be.visible');
      cy.get('[data-testid="community-sharing-consent"]').check();
      cy.get('[data-testid="elder-council-access-consent"]').check();
      cy.get('[data-testid="anonymous-research-consent"]').check();
      
      // Submit registration
      cy.get('[data-testid="submit-registration-button"]').click();
      
      // Validate Ubuntu welcome process
      cy.get('[data-testid="welcome-ceremony-invitation"]').should('be.visible');
      cy.get('[data-testid="community-introduction-offer"]').should('be.visible');
      cy.get('[data-testid="elder-meeting-scheduler"]').should('be.visible');
      
      // Validate registration success with Ubuntu messaging
      cy.get('[data-testid="registration-success"]').should('contain', 'Welcome to our Ubuntu healing community');
      cy.get('[data-testid="community-connection-message"]').should('be.visible');
    });

    it('should validate accessibility for diverse community members', () => {
      // Test with different accessibility needs
      cy.visit('/register/patient');
      
      // Test keyboard navigation (for elders with limited mouse use)
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'patient-name-input');
      
      // Test screen reader compatibility
      cy.get('[data-testid="registration-form"]').should('have.attr', 'role', 'form');
      cy.get('[data-testid="patient-name-input"]').should('have.attr', 'aria-label');
      
      // Test high contrast mode compatibility
      cy.get('body').should('have.css', 'background-color').and('not.equal', 'rgba(0, 0, 0, 0)');
      
      // Test multilingual interface
      cy.get('[data-testid="language-selector"]').select('isiZulu');
      cy.get('[data-testid="ubuntu-welcome-message"]').should('contain', 'Siyakwamukela');
      
      // Validate cultural accessibility
      cy.task('validateAccessibility', { page: 'registration' }).then((result) => {
        expect(result.violations).to.have.length(0);
      });
    });
  });

  describe('Health Assessment with Ubuntu Community Context', () => {
    beforeEach(() => {
      // Login as registered patient
      cy.loginAsPatient('nomsa@ubuntuhealth.community');
    });

    it('should conduct holistic health assessment with Ubuntu lens', () => {
      // Navigate to health assessment
      cy.get('[data-testid="health-assessment-link"]').click();
      cy.url().should('include', '/assessment');
      
      // Validate Ubuntu-centered assessment introduction
      cy.get('[data-testid="assessment-introduction"]').should('contain', 'healing together as a community');
      cy.get('[data-testid="holistic-approach-message"]').should('be.visible');
      
      // Physical health section
      cy.get('[data-testid="physical-health-section"]').should('be.visible');
      cy.get('[data-testid="symptoms-input"]').type('Occasional headaches and fatigue');
      cy.get('[data-testid="traditional-remedies-tried"]').type('Herbal teas from community garden');
      
      // Mental and emotional health with community context
      cy.get('[data-testid="mental-health-section"]').should('be.visible');
      cy.get('[data-testid="community-support-level"]').select('Strong - Very connected to community');
      cy.get('[data-testid="elder-guidance-access"]').select('Regular - Weekly conversations');
      cy.get('[data-testid="ceremonial-participation"]').select('Active - Participate in healing circles');
      
      // Spiritual and cultural wellness
      cy.get('[data-testid="spiritual-health-section"]').should('be.visible');
      cy.get('[data-testid="ancestral-connection"]').select('Strong');
      cy.get('[data-testid="cultural-practices"]').check(['morning-prayers', 'ancestor-communion']);
      cy.get('[data-testid="community-ceremony-frequency"]').select('Monthly');
      
      // Social and community health
      cy.get('[data-testid="community-health-section"]').should('be.visible');
      cy.get('[data-testid="social-connections"]').select('Very connected');
      cy.get('[data-testid="family-support"]').select('Strong');
      cy.get('[data-testid="community-role"]').type('Help care for community children');
      
      // Submit assessment
      cy.get('[data-testid="submit-assessment-button"]').click();
      
      // Validate Ubuntu-based recommendations
      cy.get('[data-testid="assessment-results"]').should('be.visible');
      cy.get('[data-testid="community-healing-recommendations"]').should('be.visible');
      cy.get('[data-testid="elder-consultation-suggestion"]').should('be.visible');
      cy.get('[data-testid="traditional-healing-options"]').should('be.visible');
      
      // Validate cultural sensitivity in recommendations
      cy.task('validateCulturalSensitivity', { 
        recommendations: 'assessment-results' 
      }).then((result) => {
        expect(result.culturallyAppropriate).to.be.true;
        expect(result.elderCouncilApproved).to.be.true;
      });
    });
  });

  describe('Treatment Planning with Community Integration', () => {
    beforeEach(() => {
      cy.loginAsPatient('nomsa@ubuntuhealth.community');
      cy.visit('/treatment/plan');
    });

    it('should create integrated treatment plan with Ubuntu healing approaches', () => {
      // Validate treatment planning interface
      cy.get('[data-testid="treatment-planning-interface"]').should('be.visible');
      cy.get('[data-testid="ubuntu-healing-message"]').should('contain', 'healing happens in community');
      
      // Traditional healing integration section
      cy.get('[data-testid="traditional-healing-section"]').should('be.visible');
      cy.get('[data-testid="elder-healer-consultation"]').check();
      cy.get('[data-testid="herbal-medicine-option"]').check();
      cy.get('[data-testid="healing-ceremony-option"]').check();
      
      // Modern medical integration
      cy.get('[data-testid="modern-medicine-section"]').should('be.visible');
      cy.get('[data-testid="healthcare-provider-consultation"]').check();
      cy.get('[data-testid="diagnostic-tests-option"]').check();
      
      // Community support integration
      cy.get('[data-testid="community-support-section"]').should('be.visible');
      cy.get('[data-testid="healing-circle-participation"]').check();
      cy.get('[data-testid="peer-support-group"]').check();
      cy.get('[data-testid="family-involvement"]').check();
      
      // Elder council guidance
      cy.get('[data-testid="elder-council-section"]').should('be.visible');
      cy.get('[data-testid="elder-council-review"]').check();
      cy.get('[data-testid="cultural-guidance-request"]').check();
      
      // Submit treatment plan request
      cy.get('[data-testid="submit-treatment-plan"]').click();
      
      // Validate Ubuntu consensus process
      cy.get('[data-testid="consensus-process-message"]').should('be.visible');
      cy.get('[data-testid="elder-review-notification"]').should('be.visible');
      cy.get('[data-testid="community-input-period"]').should('be.visible');
      
      // Validate treatment plan incorporates Ubuntu principles
      cy.get('[data-testid="treatment-plan-summary"]').should('contain', 'community healing');
      cy.get('[data-testid="elder-guidance-component"]').should('be.visible');
      cy.get('[data-testid="traditional-modern-integration"]').should('be.visible');
    });

    it('should facilitate healing circle scheduling and participation', () => {
      // Navigate to healing circles
      cy.get('[data-testid="healing-circles-tab"]').click();
      
      // View available healing circles
      cy.get('[data-testid="healing-circles-list"]').should('be.visible');
      cy.get('[data-testid="healing-circle-card"]').should('have.length.greaterThan', 0);
      
      // Join a healing circle
      cy.get('[data-testid="healing-circle-card"]').first().within(() => {
        cy.get('[data-testid="circle-name"]').should('be.visible');
        cy.get('[data-testid="elder-facilitator"]').should('be.visible');
        cy.get('[data-testid="meeting-time"]').should('be.visible');
        cy.get('[data-testid="join-circle-button"]').click();
      });
      
      // Validate joining process
      cy.get('[data-testid="circle-joining-modal"]').should('be.visible');
      cy.get('[data-testid="ubuntu-commitment-statement"]').should('be.visible');
      cy.get('[data-testid="community-support-agreement"]').check();
      cy.get('[data-testid="confidentiality-agreement"]').check();
      cy.get('[data-testid="confirm-join-circle"]').click();
      
      // Validate successful joining
      cy.get('[data-testid="circle-join-success"]').should('be.visible');
      cy.get('[data-testid="circle-schedule-notification"]').should('be.visible');
      cy.get('[data-testid="preparation-guidance"]').should('be.visible');
    });
  });

  describe('Healing Progress Tracking with Ubuntu Metrics', () => {
    beforeEach(() => {
      cy.loginAsPatient('nomsa@ubuntuhealth.community');
      cy.visit('/progress');
    });

    it('should track healing progress with Ubuntu-centered metrics', () => {
      // Validate progress dashboard
      cy.get('[data-testid="progress-dashboard"]').should('be.visible');
      cy.get('[data-testid="ubuntu-wellness-meter"]').should('be.visible');
      
      // Community connection metrics
      cy.get('[data-testid="community-connection-score"]').should('be.visible');
      cy.get('[data-testid="healing-circle-participation"]').should('be.visible');
      cy.get('[data-testid="elder-interaction-frequency"]').should('be.visible');
      
      // Traditional healing integration tracking
      cy.get('[data-testid="traditional-healing-progress"]').should('be.visible');
      cy.get('[data-testid="ceremony-participation-log"]').should('be.visible');
      cy.get('[data-testid="herbal-medicine-effectiveness"]').should('be.visible');
      
      // Community support received and given
      cy.get('[data-testid="community-support-metrics"]').should('be.visible');
      cy.get('[data-testid="support-received-score"]').should('be.visible');
      cy.get('[data-testid="support-given-score"]').should('be.visible');
      
      // Holistic wellness indicators
      cy.get('[data-testid="physical-wellness-indicator"]').should('be.visible');
      cy.get('[data-testid="mental-wellness-indicator"]').should('be.visible');
      cy.get('[data-testid="spiritual-wellness-indicator"]').should('be.visible');
      cy.get('[data-testid="social-wellness-indicator"]').should('be.visible');
      
      // Log progress update
      cy.get('[data-testid="update-progress-button"]').click();
      cy.get('[data-testid="progress-update-form"]').should('be.visible');
      
      // Community healing reflection
      cy.get('[data-testid="community-healing-reflection"]').type(
        'Feeling more connected to my community through the healing circles. Elder guidance has been invaluable.'
      );
      
      // Traditional healing effectiveness
      cy.get('[data-testid="traditional-healing-effectiveness"]').select('Very helpful');
      cy.get('[data-testid="ceremony-impact"]').select('Transformative');
      
      // Community support rating
      cy.get('[data-testid="community-support-rating"]').select('Excellent');
      
      // Submit progress update
      cy.get('[data-testid="submit-progress-update"]').click();
      
      // Validate Ubuntu-centered feedback
      cy.get('[data-testid="progress-update-success"]').should('be.visible');
      cy.get('[data-testid="community-celebration-message"]').should('be.visible');
      cy.get('[data-testid="elder-acknowledgment"]').should('be.visible');
    });
  });

  describe('Knowledge Sharing and Community Contribution', () => {
    beforeEach(() => {
      cy.loginAsPatient('nomsa@ubuntuhealth.community');
      cy.visit('/community/knowledge');
    });

    it('should facilitate intergenerational knowledge sharing', () => {
      // Validate knowledge sharing platform
      cy.get('[data-testid="knowledge-sharing-platform"]').should('be.visible');
      cy.get('[data-testid="ubuntu-knowledge-message"]').should('contain', 'wisdom is shared for community healing');
      
      // Share healing experience
      cy.get('[data-testid="share-experience-button"]').click();
      cy.get('[data-testid="experience-sharing-form"]').should('be.visible');
      
      // Experience details
      cy.get('[data-testid="healing-experience-title"]').type('Community Support During Recovery');
      cy.get('[data-testid="experience-description"]').type(
        'The healing circle provided incredible support during my recovery. The combination of traditional herbs and community prayers accelerated my healing.'
      );
      
      // Traditional knowledge component
      cy.get('[data-testid="traditional-knowledge-checkbox"]').check();
      cy.get('[data-testid="elder-guidance-involved"]').check();
      cy.get('[data-testid="ceremony-healing-involved"]').check();
      
      // Community impact
      cy.get('[data-testid="community-impact-description"]').type(
        'This experience strengthened our community bonds and demonstrated the power of Ubuntu healing.'
      );
      
      // Elder council review request
      cy.get('[data-testid="elder-council-review-request"]').check();
      
      // Submit experience
      cy.get('[data-testid="submit-experience"]').click();
      
      // Validate submission and Ubuntu process
      cy.get('[data-testid="experience-submission-success"]').should('be.visible');
      cy.get('[data-testid="elder-review-process-notification"]').should('be.visible');
      cy.get('[data-testid="community-blessing-message"]').should('be.visible');
    });
  });

  afterEach(() => {
    // Validate Ubuntu principles maintained throughout journey
    cy.task('validateUbuntuPrinciples', {
      communityIntegration: true,
      elderRespect: true,
      collectiveHealing: true,
      culturalSensitivity: true
    }).then((validation) => {
      expect(validation.valid).to.be.true;
    });
    
    cy.task('logUbuntuPhilosophy', 'Patient journey completed with Ubuntu principles honored');
  });
});

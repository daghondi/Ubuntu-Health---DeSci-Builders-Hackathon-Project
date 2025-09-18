/**
 * Ubuntu Health Core Contract Unit Tests
 * 
 * Tests the core smart contract functionality while validating Ubuntu philosophy integration
 * Focus: Community consensus mechanisms, elder council governance, and cultural sensitivity
 */

const anchor = require('@coral-xyz/anchor');
const { expect } = require('chai');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');

describe('Ubuntu Health Core Contract', () => {
  let program;
  let provider;
  let connection;
  let elderCouncilKeypair;
  let patientKeypair;
  let providerKeypair;
  let communityKeypair;

  before(async () => {
    // Setup test environment with Ubuntu philosophy context
    provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    connection = provider.connection;
    
    // Load the Ubuntu Health Core program
    program = anchor.workspace.UbuntuHealthCore;
    
    // Generate test keypairs representing different community roles
    elderCouncilKeypair = Keypair.generate();
    patientKeypair = Keypair.generate();
    providerKeypair = Keypair.generate();
    communityKeypair = Keypair.generate();
    
    // Airdrop SOL for testing
    await connection.requestAirdrop(elderCouncilKeypair.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await connection.requestAirdrop(patientKeypair.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);
    await connection.requestAirdrop(providerKeypair.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);
    await connection.requestAirdrop(communityKeypair.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);
    
    // Wait for airdrops to confirm
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  describe('Ubuntu Philosophy Integration', () => {
    it('should initialize with Ubuntu principles', async () => {
      const [ubuntuHealthPDA] = await PublicKey.findProgramAddress(
        [Buffer.from('ubuntu-health')],
        program.programId
      );

      const tx = await program.methods
        .initialize('I am because we are', true, true)
        .accounts({
          ubuntuHealth: ubuntuHealthPDA,
          elderCouncil: elderCouncilKeypair.publicKey,
          payer: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([elderCouncilKeypair])
        .rpc();

      const ubuntuHealthAccount = await program.account.ubuntuHealth.fetch(ubuntuHealthPDA);
      
      expect(ubuntuHealthAccount.ubuntuPhilosophy).to.equal('I am because we are');
      expect(ubuntuHealthAccount.communityConsensusEnabled).to.be.true;
      expect(ubuntuHealthAccount.traditionalHealingSupported).to.be.true;
      expect(ubuntuHealthAccount.elderCouncil.toString()).to.equal(elderCouncilKeypair.publicKey.toString());
    });

    it('should validate community consensus mechanism', async () => {
      const [ubuntuHealthPDA] = await PublicKey.findProgramAddress(
        [Buffer.from('ubuntu-health')],
        program.programId
      );

      // Simulate community decision-making process
      const proposalId = 'health-policy-001';
      const tx = await program.methods
        .createCommunityProposal(proposalId, 'Traditional healing integration policy', 7) // 7 days voting period
        .accounts({
          ubuntuHealth: ubuntuHealthPDA,
          proposer: patientKeypair.publicKey,
          elderCouncil: elderCouncilKeypair.publicKey,
        })
        .signers([patientKeypair])
        .rpc();

      const ubuntuHealthAccount = await program.account.ubuntuHealth.fetch(ubuntuHealthPDA);
      const proposal = ubuntuHealthAccount.activeProposals.find(p => p.id === proposalId);
      
      expect(proposal).to.not.be.undefined;
      expect(proposal.description).to.equal('Traditional healing integration policy');
      expect(proposal.votingPeriodDays).to.equal(7);
      expect(proposal.status).to.equal('Active');
    });

    it('should respect elder council governance', async () => {
      const [ubuntuHealthPDA] = await PublicKey.findProgramAddress(
        [Buffer.from('ubuntu-health')],
        program.programId
      );

      // Test elder council override capability (for community protection)
      const emergencyDecision = 'emergency-halt-001';
      const tx = await program.methods
        .elderCouncilDecision(emergencyDecision, 'Emergency halt of problematic feature', true)
        .accounts({
          ubuntuHealth: ubuntuHealthPDA,
          elderCouncil: elderCouncilKeypair.publicKey,
        })
        .signers([elderCouncilKeypair])
        .rpc();

      const ubuntuHealthAccount = await program.account.ubuntuHealth.fetch(ubuntuHealthPDA);
      const decision = ubuntuHealthAccount.elderCouncilDecisions.find(d => d.id === emergencyDecision);
      
      expect(decision).to.not.be.undefined;
      expect(decision.isEmergencyAction).to.be.true;
      expect(decision.elderCouncil.toString()).to.equal(elderCouncilKeypair.publicKey.toString());
    });
  });

  describe('Patient-Centered Care', () => {
    it('should register patient with Ubuntu identity', async () => {
      const [patientPDA] = await PublicKey.findProgramAddress(
        [Buffer.from('patient'), patientKeypair.publicKey.toBuffer()],
        program.programId
      );

      const culturalBackground = {
        primaryLanguage: 'isiZulu',
        traditionalPractions: ['ancestral-communion', 'herbal-medicine'],
        communityElders: [elderCouncilKeypair.publicKey],
        ceremonialPreferences: ['healing-circle', 'ubuntu-ceremony']
      };

      const tx = await program.methods
        .registerPatient(culturalBackground, true, true)
        .accounts({
          patient: patientPDA,
          patientWallet: patientKeypair.publicKey,
          elderCouncil: elderCouncilKeypair.publicKey,
          payer: patientKeypair.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([patientKeypair])
        .rpc();

      const patientAccount = await program.account.patient.fetch(patientPDA);
      
      expect(patientAccount.culturalBackground.primaryLanguage).to.equal('isiZulu');
      expect(patientAccount.consentToTraditionalHealing).to.be.true;
      expect(patientAccount.participateInCommunityHealth).to.be.true;
      expect(patientAccount.communityElders).to.have.lengthOf(1);
    });

    it('should create treatment plan with Ubuntu community support', async () => {
      const [patientPDA] = await PublicKey.findProgramAddress(
        [Buffer.from('patient'), patientKeypair.publicKey.toBuffer()],
        program.programId
      );

      const treatmentPlan = {
        condition: 'Community healing support needed',
        traditionalElements: ['herbal-treatment', 'community-ceremony'],
        modernMedicine: ['counseling', 'group-therapy'],
        communitySupport: true,
        elderGuidance: true
      };

      const tx = await program.methods
        .createTreatmentPlan(treatmentPlan)
        .accounts({
          patient: patientPDA,
          provider: providerKeypair.publicKey,
          elderCouncil: elderCouncilKeypair.publicKey,
        })
        .signers([providerKeypair])
        .rpc();

      const patientAccount = await program.account.patient.fetch(patientPDA);
      const activePlan = patientAccount.activeTreatmentPlan;
      
      expect(activePlan.communitySupport).to.be.true;
      expect(activePlan.elderGuidance).to.be.true;
      expect(activePlan.traditionalElements).to.include('community-ceremony');
    });
  });

  describe('Community Health Integration', () => {
    it('should track community health metrics with Ubuntu lens', async () => {
      const [communityHealthPDA] = await PublicKey.findProgramAddress(
        [Buffer.from('community-health')],
        program.programId
      );

      const communityMetrics = {
        totalMembers: 150,
        activeHealingCircles: 8,
        elderCouncilParticipation: 95, // percentage
        traditionalHealingIntegration: 87, // percentage
        communityWellnessScore: 82, // Ubuntu-based wellness metric
        intergenerationalKnowledgeTransfer: 91 // percentage
      };

      const tx = await program.methods
        .updateCommunityHealth(communityMetrics)
        .accounts({
          communityHealth: communityHealthPDA,
          elderCouncil: elderCouncilKeypair.publicKey,
          reporter: communityKeypair.publicKey,
          payer: communityKeypair.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([communityKeypair, elderCouncilKeypair])
        .rpc();

      const communityAccount = await program.account.communityHealth.fetch(communityHealthPDA);
      
      expect(communityAccount.metrics.communityWellnessScore).to.equal(82);
      expect(communityAccount.metrics.activeHealingCircles).to.equal(8);
      expect(communityAccount.metrics.intergenerationalKnowledgeTransfer).to.equal(91);
    });

    it('should facilitate knowledge sharing between generations', async () => {
      const [knowledgePDA] = await PublicKey.findProgramAddress(
        [Buffer.from('traditional-knowledge')],
        program.programId
      );

      const traditionalKnowledge = {
        practice: 'Herbal medicine preparation',
        elder: elderCouncilKeypair.publicKey,
        apprentices: [patientKeypair.publicKey, providerKeypair.publicKey],
        ceremony: 'Knowledge-passing ceremony',
        validated: true,
        communityApproved: true
      };

      const tx = await program.methods
        .recordTraditionalKnowledge(traditionalKnowledge)
        .accounts({
          traditionalKnowledge: knowledgePDA,
          elder: elderCouncilKeypair.publicKey,
          community: communityKeypair.publicKey,
          payer: elderCouncilKeypair.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([elderCouncilKeypair])
        .rpc();

      const knowledgeAccount = await program.account.traditionalKnowledge.fetch(knowledgePDA);
      
      expect(knowledgeAccount.practice).to.equal('Herbal medicine preparation');
      expect(knowledgeAccount.validated).to.be.true;
      expect(knowledgeAccount.communityApproved).to.be.true;
      expect(knowledgeAccount.apprentices).to.have.lengthOf(2);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should prevent unauthorized elder council actions', async () => {
      const [ubuntuHealthPDA] = await PublicKey.findProgramAddress(
        [Buffer.from('ubuntu-health')],
        program.programId
      );

      const unauthorizedKeypair = Keypair.generate();
      await connection.requestAirdrop(unauthorizedKeypair.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);
      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        await program.methods
          .elderCouncilDecision('unauthorized-001', 'Unauthorized decision', false)
          .accounts({
            ubuntuHealth: ubuntuHealthPDA,
            elderCouncil: unauthorizedKeypair.publicKey, // Wrong elder council
          })
          .signers([unauthorizedKeypair])
          .rpc();
        
        expect.fail('Should have thrown error for unauthorized elder council action');
      } catch (error) {
        expect(error.message).to.include('Unauthorized elder council member');
      }
    });

    it('should validate cultural appropriateness of treatment plans', async () => {
      const [patientPDA] = await PublicKey.findProgramAddress(
        [Buffer.from('patient'), patientKeypair.publicKey.toBuffer()],
        program.programId
      );

      const inappropriateTreatment = {
        condition: 'Test condition',
        traditionalElements: ['inappropriate-practice'], // This should be rejected
        modernMedicine: ['standard-treatment'],
        communitySupport: false,
        elderGuidance: false
      };

      try {
        await program.methods
          .createTreatmentPlan(inappropriateTreatment)
          .accounts({
            patient: patientPDA,
            provider: providerKeypair.publicKey,
            elderCouncil: elderCouncilKeypair.publicKey,
          })
          .signers([providerKeypair])
          .rpc();
        
        expect.fail('Should have thrown error for culturally inappropriate treatment');
      } catch (error) {
        expect(error.message).to.include('Cultural validation failed');
      }
    });
  });

  after(async () => {
    // Cleanup test environment
    console.log('🌍 Ubuntu Health Core Contract tests completed with Ubuntu philosophy validation');
  });
});

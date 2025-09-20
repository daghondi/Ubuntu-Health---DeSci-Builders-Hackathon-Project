// Ubuntu Health - Research Data Contribution Rewards Contract
// Privacy-Preserving Clinical Data Sharing with Zero-Knowledge Proofs
// Built on Solana using Anchor Framework

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, Mint};

declare_id!("UbuntuHealthDataContribution11111111111111");

#[program]
pub mod data_contribution_rewards {
    use super::*;

    /// Submit anonymized treatment outcome data for research
    pub fn submit_research_data(
        ctx: Context<SubmitResearchData>,
        data_hash: String, // IPFS hash of anonymized clinical data
        research_category: ResearchCategory,
        quality_score: u8, // 1-10 data quality assessment
        zero_knowledge_proof: String, // ZK proof of data validity without revealing patient info
    ) -> Result<()> {
        let data_submission = &mut ctx.accounts.data_submission;
        let patient = &ctx.accounts.patient;
        
        require!(quality_score >= 1 && quality_score <= 10, DataError::InvalidQualityScore);
        
        data_submission.patient = patient.key();
        data_submission.data_hash = data_hash;
        data_submission.research_category = research_category;
        data_submission.quality_score = quality_score;
        data_submission.zero_knowledge_proof = zero_knowledge_proof;
        data_submission.submission_timestamp = Clock::get()?.unix_timestamp;
        data_submission.reward_claimed = false;
        
        // Calculate reward based on data quality and rarity
        let base_reward = 1000 * 10_u64.pow(6); // 1000 $LIVES base
        let quality_multiplier = quality_score as u64;
        let category_multiplier = match research_category {
            ResearchCategory::CarTTherapy => 3, // High value for CAR-T data
            ResearchCategory::GeneTherapy => 3,
            ResearchCategory::LongevityTreatment => 2,
            ResearchCategory::RareDiseases => 4, // Highest value for rare disease data
            ResearchCategory::ClinicalTrials => 2,
        };
        
        let reward_amount = base_reward * quality_multiplier * category_multiplier;
        data_submission.reward_amount = reward_amount;
        
        msg!("Research data submitted. Eligible for {} $LIVES reward", reward_amount);
        Ok(())
    }

    /// Research institutions access anonymized data
    pub fn access_research_data(
        ctx: Context<AccessResearchData>,
        access_fee: u64,
        research_proposal_hash: String, // IPFS hash of research proposal
    ) -> Result<()> {
        let data_access = &mut ctx.accounts.data_access;
        let research_institution = &ctx.accounts.research_institution;
        let data_submission = &ctx.accounts.data_submission;
        
        require!(
            ctx.accounts.institution_credentials.is_verified,
            DataError::UnverifiedInstitution
        );
        
        // Transfer access fee to protocol treasury
        let cpi_accounts = Transfer {
            from: ctx.accounts.institution_token_account.to_account_info(),
            to: ctx.accounts.protocol_treasury.to_account_info(),
            authority: research_institution.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, access_fee)?;
        
        data_access.institution = research_institution.key();
        data_access.data_submission = data_submission.key();
        data_access.access_fee = access_fee;
        data_access.research_proposal_hash = research_proposal_hash;
        data_access.access_timestamp = Clock::get()?.unix_timestamp;
        
        // 70% of access fee goes to data contributor (patient)
        let contributor_share = (access_fee * 70) / 100;
        
        // Transfer contributor share to patient
        let treasury_seeds = &[
            b"treasury",
            &[ctx.bumps.protocol_treasury],
        ];
        let signer = &[&treasury_seeds[..]];
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.protocol_treasury.to_account_info(),
            to: ctx.accounts.patient_token_account.to_account_info(),
            authority: ctx.accounts.protocol_treasury.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, contributor_share)?;
        
        msg!("Research data access granted. Patient receives {} $LIVES", contributor_share);
        Ok(())
    }

    /// Claim rewards for data contribution
    pub fn claim_data_reward(
        ctx: Context<ClaimDataReward>,
    ) -> Result<()> {
        let data_submission = &mut ctx.accounts.data_submission;
        let patient = &ctx.accounts.patient;
        
        require!(
            data_submission.patient == patient.key(),
            DataError::UnauthorizedClaim
        );
        require!(
            !data_submission.reward_claimed,
            DataError::RewardAlreadyClaimed
        );
        
        // Transfer reward tokens to patient
        let reward_seeds = &[
            b"reward_pool",
            &[ctx.bumps.reward_token_account],
        ];
        let signer = &[&reward_seeds[..]];
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.reward_token_account.to_account_info(),
            to: ctx.accounts.patient_token_account.to_account_info(),
            authority: ctx.accounts.reward_token_account.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, data_submission.reward_amount)?;
        
        data_submission.reward_claimed = true;
        data_submission.claim_timestamp = Clock::get()?.unix_timestamp;
        
        msg!("Data contribution reward of {} $LIVES claimed", data_submission.reward_amount);
        Ok(())
    }

    /// Verify research institution credentials
    pub fn verify_institution(
        ctx: Context<VerifyInstitution>,
        institution_name: String,
        credentials_hash: String, // IPFS hash of verification documents
    ) -> Result<()> {
        let institution_credentials = &mut ctx.accounts.institution_credentials;
        let verifier = &ctx.accounts.verifier;
        
        require!(
            ctx.accounts.protocol_authority.authority == verifier.key(),
            DataError::UnauthorizedVerifier
        );
        
        institution_credentials.institution = ctx.accounts.research_institution.key();
        institution_credentials.institution_name = institution_name;
        institution_credentials.credentials_hash = credentials_hash;
        institution_credentials.is_verified = true;
        institution_credentials.verification_timestamp = Clock::get()?.unix_timestamp;
        institution_credentials.verified_by = verifier.key();
        
        msg!("Research institution credentials verified");
        Ok(())
    }

    /// Submit research findings back to the community
    pub fn submit_research_findings(
        ctx: Context<SubmitResearchFindings>,
        findings_hash: String, // IPFS hash of research results
        publication_reference: String,
        impact_score: u8, // 1-10 research impact assessment
    ) -> Result<()> {
        let research_findings = &mut ctx.accounts.research_findings;
        let research_institution = &ctx.accounts.research_institution;
        
        research_findings.institution = research_institution.key();
        research_findings.data_access = ctx.accounts.data_access.key();
        research_findings.findings_hash = findings_hash;
        research_findings.publication_reference = publication_reference;
        research_findings.impact_score = impact_score;
        research_findings.submission_timestamp = Clock::get()?.unix_timestamp;
        
        // Reward institution with reputation tokens for sharing findings
        let reputation_reward = (impact_score as u64) * 500 * 10_u64.pow(6); // 500-5000 $LIVES based on impact
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.reward_token_account.to_account_info(),
            to: ctx.accounts.institution_token_account.to_account_info(),
            authority: ctx.accounts.reward_token_account.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, reputation_reward)?;
        
        msg!("Research findings submitted. Institution receives {} $LIVES reputation reward", reputation_reward);
        Ok(())
    }
}

// Account Contexts
#[derive(Accounts)]
pub struct SubmitResearchData<'info> {
    #[account(
        init,
        payer = patient,
        space = 8 + DataSubmission::INIT_SPACE,
        seeds = [b"data_submission", patient.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub data_submission: Account<'info, DataSubmission>,
    
    #[account(mut)]
    pub patient: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AccessResearchData<'info> {
    #[account(
        init,
        payer = research_institution,
        space = 8 + DataAccess::INIT_SPACE,
        seeds = [b"data_access", data_submission.key().as_ref(), research_institution.key().as_ref()],
        bump
    )]
    pub data_access: Account<'info, DataAccess>,
    
    pub data_submission: Account<'info, DataSubmission>,
    
    #[account(mut)]
    pub research_institution: Signer<'info>,
    
    pub institution_credentials: Account<'info, InstitutionCredentials>,
    
    #[account(mut)]
    pub institution_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub patient_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"treasury"],
        bump
    )]
    pub protocol_treasury: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimDataReward<'info> {
    #[account(mut)]
    pub data_submission: Account<'info, DataSubmission>,
    
    #[account(mut)]
    pub patient: Signer<'info>,
    
    #[account(mut)]
    pub patient_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"reward_pool"],
        bump
    )]
    pub reward_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct VerifyInstitution<'info> {
    #[account(
        init,
        payer = verifier,
        space = 8 + InstitutionCredentials::INIT_SPACE,
        seeds = [b"institution_credentials", research_institution.key().as_ref()],
        bump
    )]
    pub institution_credentials: Account<'info, InstitutionCredentials>,
    
    pub research_institution: AccountInfo<'info>,
    
    #[account(mut)]
    pub verifier: Signer<'info>,
    
    pub protocol_authority: Account<'info, ProtocolAuthority>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitResearchFindings<'info> {
    #[account(
        init,
        payer = research_institution,
        space = 8 + ResearchFindings::INIT_SPACE,
        seeds = [b"research_findings", data_access.key().as_ref()],
        bump
    )]
    pub research_findings: Account<'info, ResearchFindings>,
    
    pub data_access: Account<'info, DataAccess>,
    
    #[account(mut)]
    pub research_institution: Signer<'info>,
    
    #[account(mut)]
    pub institution_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub reward_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

// Data Structures
#[account]
pub struct DataSubmission {
    pub patient: Pubkey,
    pub data_hash: String,
    pub research_category: ResearchCategory,
    pub quality_score: u8,
    pub zero_knowledge_proof: String,
    pub submission_timestamp: i64,
    pub reward_amount: u64,
    pub reward_claimed: bool,
    pub claim_timestamp: i64,
}

#[account]
pub struct DataAccess {
    pub institution: Pubkey,
    pub data_submission: Pubkey,
    pub access_fee: u64,
    pub research_proposal_hash: String,
    pub access_timestamp: i64,
}

#[account]
pub struct InstitutionCredentials {
    pub institution: Pubkey,
    pub institution_name: String,
    pub credentials_hash: String,
    pub is_verified: bool,
    pub verification_timestamp: i64,
    pub verified_by: Pubkey,
}

#[account]
pub struct ResearchFindings {
    pub institution: Pubkey,
    pub data_access: Pubkey,
    pub findings_hash: String,
    pub publication_reference: String,
    pub impact_score: u8,
    pub submission_timestamp: i64,
}

#[account]
pub struct ProtocolAuthority {
    pub authority: Pubkey,
}

// Enums
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ResearchCategory {
    CarTTherapy,
    GeneTherapy,
    LongevityTreatment,
    RareDiseases,
    ClinicalTrials,
}

// Implementation for space calculation
impl DataSubmission {
    const INIT_SPACE: usize = 32 + 64 + 32 + 1 + 128 + 8 + 8 + 1 + 8;
}

impl DataAccess {
    const INIT_SPACE: usize = 32 + 32 + 8 + 64 + 8;
}

impl InstitutionCredentials {
    const INIT_SPACE: usize = 32 + 64 + 64 + 1 + 8 + 32;
}

impl ResearchFindings {
    const INIT_SPACE: usize = 32 + 32 + 64 + 64 + 1 + 8;
}

// Error Codes
#[error_code]
pub enum DataError {
    #[msg("Invalid quality score. Must be between 1-10")]
    InvalidQualityScore,
    #[msg("Unverified research institution")]
    UnverifiedInstitution,
    #[msg("Unauthorized reward claim")]
    UnauthorizedClaim,
    #[msg("Reward already claimed")]
    RewardAlreadyClaimed,
    #[msg("Unauthorized verifier")]
    UnauthorizedVerifier,
}
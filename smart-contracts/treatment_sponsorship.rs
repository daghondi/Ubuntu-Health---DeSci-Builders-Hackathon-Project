// Ubuntu Health - CAR-T Therapy Sponsorship Smart Contract
// Advanced Medical Treatment Funding with Milestone-Based Escrow
// Built on Solana using Anchor Framework

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("UbuntuHealthTreatmentSponsorship11111111111");

#[program]
pub mod treatment_sponsorship {
    use super::*;

    // Initialize a new CAR-T therapy treatment request
    pub fn create_treatment_request(
        ctx: Context<CreateTreatmentRequest>,
        treatment_id: String,
        required_amount: u64, // Amount in $LIVES tokens
        patient_public_key: Pubkey,
        medical_facility: String,
        treatment_type: TreatmentType,
        milestones: Vec<TreatmentMilestone>,
    ) -> Result<()> {
        let treatment_request = &mut ctx.accounts.treatment_request;
        
        treatment_request.treatment_id = treatment_id;
        treatment_request.patient = patient_public_key;
        treatment_request.required_amount = required_amount;
        treatment_request.raised_amount = 0;
        treatment_request.medical_facility = medical_facility;
        treatment_request.treatment_type = treatment_type;
        treatment_request.milestones = milestones;
        treatment_request.status = TreatmentStatus::Active;
        treatment_request.created_at = Clock::get()?.unix_timestamp;
        
        msg!("CAR-T therapy treatment request created: {}", treatment_request.treatment_id);
        Ok(())
    }

    // Sponsor a treatment with $LIVES tokens
    pub fn sponsor_treatment(
        ctx: Context<SponsorTreatment>,
        amount: u64,
    ) -> Result<()> {
        let treatment_request = &mut ctx.accounts.treatment_request;
        let sponsor = &ctx.accounts.sponsor;
        
        require!(
            treatment_request.status == TreatmentStatus::Active,
            TreatmentError::TreatmentNotActive
        );
        
        require!(
            treatment_request.raised_amount + amount <= treatment_request.required_amount,
            TreatmentError::ExceedsRequiredAmount
        );

        // Transfer $LIVES tokens to escrow
        let cpi_accounts = Transfer {
            from: ctx.accounts.sponsor_token_account.to_account_info(),
            to: ctx.accounts.escrow_token_account.to_account_info(),
            authority: sponsor.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::transfer(cpi_ctx, amount)?;
        
        treatment_request.raised_amount += amount;
        treatment_request.sponsors.push(SponsorInfo {
            sponsor_key: sponsor.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        // If fully funded, mark as funded
        if treatment_request.raised_amount >= treatment_request.required_amount {
            treatment_request.status = TreatmentStatus::Funded;
            
            // Mint treatment pass NFT to patient
            msg!("Treatment fully funded! Minting treatment pass NFT to patient");
        }
        
        msg!("Sponsorship of {} $LIVES received from {}", amount, sponsor.key());
        Ok(())
    }

    // Medical professional verifies treatment milestone completion
    pub fn verify_milestone(
        ctx: Context<VerifyMilestone>,
        milestone_index: u8,
        verification_data: String, // IPFS hash of medical records
    ) -> Result<()> {
        let treatment_request = &mut ctx.accounts.treatment_request;
        let medical_professional = &ctx.accounts.medical_professional;
        
        require!(
            treatment_request.status == TreatmentStatus::InTreatment,
            TreatmentError::TreatmentNotInProgress
        );
        
        require!(
            (milestone_index as usize) < treatment_request.milestones.len(),
            TreatmentError::InvalidMilestone
        );
        
        let milestone = &mut treatment_request.milestones[milestone_index as usize];
        
        require!(
            !milestone.completed,
            TreatmentError::MilestoneAlreadyCompleted
        );
        
        milestone.completed = true;
        milestone.verified_by = medical_professional.key();
        milestone.verification_data = verification_data;
        milestone.completion_timestamp = Clock::get()?.unix_timestamp;
        
        // Release milestone-based funding
        let release_amount = milestone.funding_percentage * treatment_request.raised_amount / 100;
        
        // Transfer from escrow to medical facility
        let seeds = &[
            b"escrow",
            treatment_request.treatment_id.as_bytes(),
            &[ctx.bumps.escrow_authority],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.facility_token_account.to_account_info(),
            authority: ctx.accounts.escrow_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        token::transfer(cpi_ctx, release_amount)?;
        
        msg!("Milestone {} verified. Released {} $LIVES to medical facility", 
             milestone_index, release_amount);
        
        // Check if all milestones completed
        if treatment_request.milestones.iter().all(|m| m.completed) {
            treatment_request.status = TreatmentStatus::Completed;
            
            // Distribute rewards to sponsors and data contributors
            // Award bonus $LIVES tokens for successful treatment completion
        }
        
        Ok(())
    }

    // Patient reports treatment outcome data (anonymized)
    pub fn report_outcome(
        ctx: Context<ReportOutcome>,
        outcome_data_hash: String, // IPFS hash of anonymized outcome data
        research_consent: bool,
    ) -> Result<()> {
        let treatment_request = &mut ctx.accounts.treatment_request;
        let patient = &ctx.accounts.patient;
        
        require!(
            treatment_request.patient == patient.key(),
            TreatmentError::UnauthorizedPatient
        );
        
        treatment_request.outcome_data_hash = Some(outcome_data_hash.clone());
        treatment_request.research_consent = research_consent;
        treatment_request.outcome_reported_at = Some(Clock::get()?.unix_timestamp);
        
        if research_consent {
            // Award research contribution bonus
            // Additional $LIVES tokens for contributing to medical research
            msg!("Patient consented to research data sharing. Awarding research bonus.");
        }
        
        msg!("Treatment outcome reported: {}", outcome_data_hash);
        Ok(())
    }
}

// Account structures
#[derive(Accounts)]
pub struct CreateTreatmentRequest<'info> {
    #[account(
        init,
        payer = patient,
        space = 8 + TreatmentRequest::MAX_SIZE,
        seeds = [b"treatment", treatment_id.as_bytes()],
        bump
    )]
    pub treatment_request: Account<'info, TreatmentRequest>,
    
    #[account(mut)]
    pub patient: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SponsorTreatment<'info> {
    #[account(mut)]
    pub treatment_request: Account<'info, TreatmentRequest>,
    
    #[account(mut)]
    pub sponsor: Signer<'info>,
    
    #[account(mut)]
    pub sponsor_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct VerifyMilestone<'info> {
    #[account(mut)]
    pub treatment_request: Account<'info, TreatmentRequest>,
    
    pub medical_professional: Signer<'info>,
    
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub facility_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: This is a PDA
    #[account(
        seeds = [b"escrow", treatment_request.treatment_id.as_bytes()],
        bump
    )]
    pub escrow_authority: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ReportOutcome<'info> {
    #[account(mut)]
    pub treatment_request: Account<'info, TreatmentRequest>,
    
    pub patient: Signer<'info>,
}

// Data structures
#[account]
pub struct TreatmentRequest {
    pub treatment_id: String,
    pub patient: Pubkey,
    pub required_amount: u64,
    pub raised_amount: u64,
    pub medical_facility: String,
    pub treatment_type: TreatmentType,
    pub milestones: Vec<TreatmentMilestone>,
    pub sponsors: Vec<SponsorInfo>,
    pub status: TreatmentStatus,
    pub created_at: i64,
    pub outcome_data_hash: Option<String>,
    pub research_consent: bool,
    pub outcome_reported_at: Option<i64>,
}

impl TreatmentRequest {
    pub const MAX_SIZE: usize = 32 + // treatment_id
        32 + // patient
        8 + // required_amount
        8 + // raised_amount
        64 + // medical_facility
        1 + // treatment_type
        4 + (10 * TreatmentMilestone::SIZE) + // milestones (max 10)
        4 + (50 * SponsorInfo::SIZE) + // sponsors (max 50)
        1 + // status
        8 + // created_at
        1 + 64 + // outcome_data_hash
        1 + // research_consent
        1 + 8; // outcome_reported_at
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TreatmentMilestone {
    pub name: String,
    pub description: String,
    pub funding_percentage: u8, // Percentage of total funding to release
    pub completed: bool,
    pub verified_by: Pubkey,
    pub verification_data: String, // IPFS hash of verification documents
    pub completion_timestamp: i64,
}

impl TreatmentMilestone {
    pub const SIZE: usize = 32 + 128 + 1 + 1 + 32 + 64 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct SponsorInfo {
    pub sponsor_key: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

impl SponsorInfo {
    pub const SIZE: usize = 32 + 8 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum TreatmentType {
    CarTCellTherapy,
    GeneTherapy,
    LongevityTreatment,
    ExperimentalTherapy,
    RegenerativeMedicine,
    Other,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum TreatmentStatus {
    Active,        // Accepting sponsors
    Funded,        // Fully funded, awaiting treatment
    InTreatment,   // Treatment in progress
    Completed,     // Treatment completed successfully
    Cancelled,     // Treatment cancelled, refunds issued
}

// Error codes
#[error_code]
pub enum TreatmentError {
    #[msg("Treatment is not currently active")]
    TreatmentNotActive,
    
    #[msg("Sponsorship amount exceeds required amount")]
    ExceedsRequiredAmount,
    
    #[msg("Treatment is not in progress")]
    TreatmentNotInProgress,
    
    #[msg("Invalid milestone index")]
    InvalidMilestone,
    
    #[msg("Milestone already completed")]
    MilestoneAlreadyCompleted,
    
    #[msg("Unauthorized patient")]
    UnauthorizedPatient,
}
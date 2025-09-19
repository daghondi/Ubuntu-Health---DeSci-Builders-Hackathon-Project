use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub struct TreatmentPass {
    /// Unique identifier for this treatment pass
    pub pass_id: u64,
    /// Patient's public key
    pub patient: Pubkey,
    /// Title of the treatment request
    pub treatment_title: String,
    /// Detailed description of the treatment needed
    pub treatment_description: String,
    /// Medical category (e.g., "Cancer Treatment", "Heart Surgery")
    pub treatment_category: String,
    /// Total funding target in lamports
    pub funding_target: u64,
    /// Current amount funded
    pub current_funding: u64,
    /// Percentage funded (0-100)
    pub funding_percentage: u8,
    /// List of treatment milestones
    pub milestones: Vec<TreatmentMilestone>,
    /// List of sponsors
    pub sponsors: Vec<Sponsor>,
    /// Timestamp when treatment pass was created
    pub created_at: i64,
    /// Expected treatment duration in days
    pub treatment_duration_days: u16,
    /// Current status of the treatment pass
    pub status: TreatmentPassStatus,
    
    // Ubuntu Health Integration
    /// Ubuntu Health verification status
    pub ubuntu_health_verified: bool,
    /// Verification timestamp
    pub verification_timestamp: Option<i64>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub struct TreatmentMilestone {
    /// Milestone ID within the treatment pass
    pub milestone_id: u8,
    /// Description of what needs to be achieved
    pub description: String,
    /// Amount of funding released upon completion
    pub funding_amount: u64,
    /// Type of verification required
    pub verification_required: VerificationType,
    /// Current completion status
    pub completion_status: MilestoneStatus,
    /// Expected completion date
    pub expected_completion: i64,
    /// Actual completion timestamp
    pub completion_timestamp: Option<i64>,
    /// Healthcare provider who verified completion
    pub verifying_provider: Option<Pubkey>,
    /// Verification evidence (IPFS hash)
    pub verification_evidence: Option<String>,
    
    // Verification Details
    /// Cryptographic proof of milestone completion
    pub cryptographic_proof: Option<String>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub struct Sponsor {
    /// Sponsor's wallet public key
    pub wallet: Pubkey,
    /// Total amount contributed by this sponsor
    pub amount_contributed: u64,
    /// Specific milestones sponsored by this sponsor
    pub sponsored_milestones: Vec<u8>,
    /// Timestamp of first sponsorship
    pub first_sponsored_at: i64,
    /// Timestamp of most recent sponsorship
    pub last_sponsored_at: i64,
    /// Sponsor's message to the patient
    pub sponsor_message: Option<String>,
    /// Whether sponsor wants to remain anonymous
    pub anonymous: bool,
    
    // Ubuntu Health Integration
    /// Whether sponsor is an Ubuntu Health member
    pub ubuntu_health_member: bool,
}

// Removed complex Ubuntu governance structures to focus on core healthcare functionality

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum TreatmentPassStatus {
    /// Treatment pass created, awaiting funding
    FundingRequired,
    /// Partially funded, accepting more sponsors
    PartiallyFunded,
    /// Fully funded, treatment can begin
    FullyFunded,
    /// Treatment in progress
    TreatmentInProgress,
    /// Treatment completed successfully
    TreatmentCompleted,
    /// Treatment paused for medical reasons
    TreatmentPaused,
    /// Treatment cancelled
    TreatmentCancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum VerificationType {
    /// Healthcare provider verification required
    MedicalProvider,
    /// Patient self-reported milestone
    PatientReported,
    /// Third-party verification (imaging, lab results)
    ThirdPartyEvidence,
    /// Community witness verification
    CommunityWitness,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum MilestoneStatus {
    /// Milestone not yet started
    NotStarted,
    /// Milestone in progress
    InProgress,
    /// Milestone completed, awaiting verification
    AwaitingVerification,
    /// Milestone verified and completed
    Verified,
    /// Milestone failed or cancelled
    Failed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ElderDecision {
    /// Elder approves the milestone/treatment
    Approved,
    /// Elder suggests modifications
    ApprovedWithGuidance,
    /// Elder requests more information
    RequiresMoreInformation,
    /// Elder disapproves
    Disapproved,
    /// Elder defers to community consensus
    DeferToCommunity,
}

// Events for tracking treatment pass lifecycle
#[event]
pub struct TreatmentPassCreated {
    pub pass_id: u64,
    pub patient: Pubkey,
    pub funding_target: u64,
    pub treatment_category: String,
    pub ubuntu_community_endorsement: Option<Pubkey>,
}

#[event]
pub struct TreatmentPassSponsored {
    pub pass_id: u64,
    pub sponsor: Pubkey,
    pub amount: u64,
    pub total_funded: u64,
    pub funding_percentage: u8,
}

#[event]
pub struct MilestoneCompleted {
    pub pass_id: u64,
    pub milestone_id: u8,
    pub verifying_provider: Option<Pubkey>,
    pub funding_released: u64,
    pub ubuntu_community_validated: bool,
}

#[event]
pub struct ElderCouncilReview {
    pub pass_id: u64,
    pub reviewing_elder: Pubkey,
    pub decision: ElderDecision,
    pub traditional_wisdom_shared: bool,
}

#[event]
pub struct TreatmentCompleted {
    pub pass_id: u64,
    pub patient: Pubkey,
    pub total_funded: u64,
    pub total_milestones: u8,
    pub completion_timestamp: i64,
    pub ubuntu_community_celebration: bool,
}

// Account structure for storing treatment passes
#[account]
pub struct TreatmentPassAccount {
    pub treatment_pass: TreatmentPass,
    pub bump: u8,
}

impl TreatmentPassAccount {
    pub const LEN: usize = 8 + // discriminator
        std::mem::size_of::<TreatmentPass>() + 
        1; // bump
}

// Ubuntu Health Treatment Pass Program Instructions
#[derive(Accounts)]
#[instruction(pass_id: u64)]
pub struct CreateTreatmentPass<'info> {
    #[account(
        init,
        payer = patient,
        space = TreatmentPassAccount::LEN,
        seeds = [b"treatment_pass", patient.key().as_ref(), pass_id.to_le_bytes().as_ref()],
        bump
    )]
    pub treatment_pass_account: Account<'info, TreatmentPassAccount>,
    
    #[account(mut)]
    pub patient: Signer<'info>,
    
    /// Ubuntu community member who endorses this treatment
    /// CHECK: Optional endorsement, validated by Ubuntu community logic
    pub ubuntu_endorser: Option<AccountInfo<'info>>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SponsorTreatment<'info> {
    #[account(
        mut,
        seeds = [b"treatment_pass", treatment_pass_account.treatment_pass.patient.as_ref(), treatment_pass_account.treatment_pass.pass_id.to_le_bytes().as_ref()],
        bump = treatment_pass_account.bump
    )]
    pub treatment_pass_account: Account<'info, TreatmentPassAccount>,
    
    #[account(mut)]
    pub sponsor: Signer<'info>,
    
    /// Escrow account to hold sponsored funds
    #[account(mut)]
    pub escrow_account: Account<'info, TokenAccount>,
    
    /// Sponsor's token account
    #[account(mut)]
    pub sponsor_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct VerifyMilestone<'info> {
    #[account(
        mut,
        seeds = [b"treatment_pass", treatment_pass_account.treatment_pass.patient.as_ref(), treatment_pass_account.treatment_pass.pass_id.to_le_bytes().as_ref()],
        bump = treatment_pass_account.bump
    )]
    pub treatment_pass_account: Account<'info, TreatmentPassAccount>,
    
    /// Healthcare provider or Ubuntu elder verifying the milestone
    pub verifier: Signer<'info>,
    
    /// Patient account (for releasing funds to)
    /// CHECK: Validated against treatment pass patient
    pub patient: AccountInfo<'info>,
    
    /// Escrow account holding the funds
    #[account(mut)]
    pub escrow_account: Account<'info, TokenAccount>,
    
    /// Patient's token account to receive released funds
    #[account(mut)]
    pub patient_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

// Treatment Pass Program Implementation
pub fn create_treatment_pass(
    ctx: Context<CreateTreatmentPass>,
    pass_id: u64,
    treatment_title: String,
    treatment_description: String,
    treatment_category: String,
    funding_target: u64,
    milestones: Vec<TreatmentMilestone>,
    traditional_healing_component: Option<TraditionalHealing>,
) -> Result<()> {
    let treatment_pass_account = &mut ctx.accounts.treatment_pass_account;
    let clock = Clock::get()?;
    
    // Validate Ubuntu community endorsement if provided
    let ubuntu_community_endorsement = if let Some(endorser) = &ctx.accounts.ubuntu_endorser {
        // TODO: Validate endorser is a valid Ubuntu community member
        Some(endorser.key())
    } else {
        None
    };
    
    treatment_pass_account.treatment_pass = TreatmentPass {
        pass_id,
        patient: ctx.accounts.patient.key(),
        treatment_title,
        treatment_description,
        treatment_category,
        funding_target,
        current_funding: 0,
        funding_percentage: 0,
        milestones,
        sponsors: Vec::new(),
        created_at: clock.unix_timestamp,
        treatment_duration_days: 0, // To be set based on treatment type
        status: TreatmentPassStatus::FundingRequired,
        ubuntu_community_endorsement,
        elder_council_approval: false,
        approving_elder: None,
        traditional_healing_component,
        diaspora_connection: None,
        ubuntu_alignment_score: 0, // To be calculated by Ubuntu community
    };
    
    treatment_pass_account.bump = ctx.bumps.treatment_pass_account;
    
    // Emit event
    emit!(TreatmentPassCreated {
        pass_id,
        patient: ctx.accounts.patient.key(),
        funding_target,
        treatment_category,
        ubuntu_community_endorsement,
    });
    
    Ok(())
}

pub fn sponsor_treatment(
    ctx: Context<SponsorTreatment>,
    amount: u64,
    sponsor_message: Option<String>,
    sponsored_milestones: Vec<u8>,
) -> Result<()> {
    let treatment_pass_account = &mut ctx.accounts.treatment_pass_account;
    let treatment_pass = &mut treatment_pass_account.treatment_pass;
    let clock = Clock::get()?;
    
    // Transfer tokens from sponsor to escrow
    let cpi_accounts = token::Transfer {
        from: ctx.accounts.sponsor_token_account.to_account_info(),
        to: ctx.accounts.escrow_account.to_account_info(),
        authority: ctx.accounts.sponsor.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, amount)?;
    
    // Update treatment pass funding
    treatment_pass.current_funding = treatment_pass.current_funding.checked_add(amount)
        .ok_or(ErrorCode::Overflow)?;
    
    treatment_pass.funding_percentage = ((treatment_pass.current_funding as u128 * 100) / treatment_pass.funding_target as u128) as u8;
    
    // Add or update sponsor
    if let Some(existing_sponsor) = treatment_pass.sponsors.iter_mut()
        .find(|s| s.wallet == ctx.accounts.sponsor.key()) {
        existing_sponsor.amount_contributed = existing_sponsor.amount_contributed.checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;
        existing_sponsor.last_sponsored_at = clock.unix_timestamp;
        existing_sponsor.sponsored_milestones.extend(sponsored_milestones);
    } else {
        treatment_pass.sponsors.push(Sponsor {
            wallet: ctx.accounts.sponsor.key(),
            amount_contributed: amount,
            sponsored_milestones,
            first_sponsored_at: clock.unix_timestamp,
            last_sponsored_at: clock.unix_timestamp,
            sponsor_message,
            anonymous: false, // Can be configurable
            ubuntu_community_member: false, // TODO: Validate community membership
            community_reputation: 0, // TODO: Calculate from community data
            diaspora_connection: None, // TODO: Check for diaspora connections
            traditional_healing_knowledge: None,
        });
    }
    
    // Update status based on funding level
    if treatment_pass.current_funding >= treatment_pass.funding_target {
        treatment_pass.status = TreatmentPassStatus::FullyFunded;
    } else {
        treatment_pass.status = TreatmentPassStatus::PartiallyFunded;
    }
    
    // Emit event
    emit!(TreatmentPassSponsored {
        pass_id: treatment_pass.pass_id,
        sponsor: ctx.accounts.sponsor.key(),
        amount,
        total_funded: treatment_pass.current_funding,
        funding_percentage: treatment_pass.funding_percentage,
    });
    
    Ok(())
}

pub fn verify_milestone(
    ctx: Context<VerifyMilestone>,
    milestone_id: u8,
    verification_evidence: Option<String>,
    ubuntu_community_validation: bool,
) -> Result<()> {
    let treatment_pass_account = &mut ctx.accounts.treatment_pass_account;
    let treatment_pass = &mut treatment_pass_account.treatment_pass;
    let clock = Clock::get()?;
    
    // Find and update the milestone
    let milestone = treatment_pass.milestones.iter_mut()
        .find(|m| m.milestone_id == milestone_id)
        .ok_or(ErrorCode::MilestoneNotFound)?;
    
    // Verify the milestone
    milestone.completion_status = MilestoneStatus::Verified;
    milestone.completion_timestamp = Some(clock.unix_timestamp);
    milestone.verifying_provider = Some(ctx.accounts.verifier.key());
    milestone.verification_evidence = verification_evidence;
    milestone.ubuntu_community_validation = ubuntu_community_validation;
    
    // Release funds to patient
    let funding_to_release = milestone.funding_amount;
    
    let cpi_accounts = token::Transfer {
        from: ctx.accounts.escrow_account.to_account_info(),
        to: ctx.accounts.patient_token_account.to_account_info(),
        authority: ctx.accounts.escrow_account.to_account_info(), // Escrow authority
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, funding_to_release)?;
    
    // Check if all milestones are completed
    let all_completed = treatment_pass.milestones.iter()
        .all(|m| m.completion_status == MilestoneStatus::Verified);
    
    if all_completed {
        treatment_pass.status = TreatmentPassStatus::TreatmentCompleted;
        
        emit!(TreatmentCompleted {
            pass_id: treatment_pass.pass_id,
            patient: treatment_pass.patient,
            total_funded: treatment_pass.current_funding,
            total_milestones: treatment_pass.milestones.len() as u8,
            completion_timestamp: clock.unix_timestamp,
            ubuntu_community_celebration: true,
        });
    }
    
    // Emit milestone completion event
    emit!(MilestoneCompleted {
        pass_id: treatment_pass.pass_id,
        milestone_id,
        verifying_provider: Some(ctx.accounts.verifier.key()),
        funding_released: funding_to_release,
        ubuntu_community_validated: ubuntu_community_validation,
    });
    
    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Overflow occurred")]
    Overflow,
    #[msg("Milestone not found")]
    MilestoneNotFound,
    #[msg("Insufficient funding")]
    InsufficientFunding,
    #[msg("Invalid milestone status")]
    InvalidMilestoneStatus,
    #[msg("Unauthorized verifier")]
    UnauthorizedVerifier,
    #[msg("Treatment pass already completed")]
    TreatmentPassCompleted,
}

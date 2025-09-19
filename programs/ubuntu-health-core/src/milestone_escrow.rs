use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};

/// Milestone-based escrow system for treatment pass funding
/// Implements secure fund holding with milestone-triggered releases
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct MilestoneEscrow {
    /// Treatment pass this escrow is associated with
    pub treatment_pass_id: u64,
    /// Total amount held in escrow
    pub total_amount: u64,
    /// Amount already released
    pub released_amount: u64,
    /// Escrow creation timestamp
    pub created_at: i64,
    /// Whether escrow is active
    pub is_active: bool,
    /// Milestone release schedules
    pub milestone_releases: Vec<MilestoneRelease>,
    /// Emergency release conditions
    pub emergency_conditions: EmergencyReleaseConditions,
    /// Ubuntu Health verification required for releases
    pub ubuntu_health_verification_required: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct MilestoneRelease {
    /// Milestone ID this release is tied to
    pub milestone_id: u8,
    /// Amount to release upon milestone completion
    pub release_amount: u64,
    /// Whether this release has been executed
    pub is_released: bool,
    /// Timestamp when release was executed
    pub release_timestamp: Option<i64>,
    /// Verification signatures required for release
    pub required_verifications: Vec<VerificationRequirement>,
    /// Actual verifications received
    pub received_verifications: Vec<ReceivedVerification>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct VerificationRequirement {
    /// Type of verification required
    pub verification_type: EscrowVerificationType,
    /// Required verifier (healthcare provider, Ubuntu Health admin, etc.)
    pub required_verifier: Option<Pubkey>,
    /// Whether this verification is mandatory or optional
    pub is_mandatory: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ReceivedVerification {
    /// Verifier's public key
    pub verifier: Pubkey,
    /// Type of verification provided
    pub verification_type: EscrowVerificationType,
    /// Verification timestamp
    pub verified_at: i64,
    /// Verification evidence (IPFS hash, medical records hash, etc.)
    pub evidence_hash: Option<String>,
    /// Digital signature of verification
    pub verification_signature: [u8; 64],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum EscrowVerificationType {
    /// Medical provider verification
    HealthcareProvider,
    /// Patient self-verification
    PatientSelfReport,
    /// Ubuntu Health community verification
    UbuntuHealthCommunity,
    /// Automated milestone verification (IoT devices, etc.)
    AutomatedVerification,
    /// Third-party medical evidence
    ThirdPartyMedical,
    /// Emergency override verification
    EmergencyOverride,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct EmergencyReleaseConditions {
    /// Whether emergency release is enabled
    pub emergency_release_enabled: bool,
    /// Authorized emergency releasers
    pub emergency_releasers: Vec<Pubkey>,
    /// Minimum delay before emergency release (in seconds)
    pub emergency_delay_seconds: i64,
    /// Emergency release initiated timestamp
    pub emergency_initiated: Option<i64>,
    /// Emergency release reason
    pub emergency_reason: Option<String>,
}

/// Instructions for milestone escrow operations
#[derive(Accounts)]
#[instruction(treatment_pass_id: u64)]
pub struct CreateMilestoneEscrow<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + std::mem::size_of::<MilestoneEscrowAccount>(),
        seeds = [b"milestone_escrow", treatment_pass_id.to_le_bytes().as_ref()],
        bump
    )]
    pub escrow_account: Account<'info, MilestoneEscrowAccount>,
    
    #[account(
        init,
        payer = payer,
        token::mint = funding_mint,
        token::authority = escrow_account,
        seeds = [b"escrow_vault", treatment_pass_id.to_le_bytes().as_ref()],
        bump
    )]
    pub escrow_vault: Account<'info, TokenAccount>,
    
    pub funding_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(treatment_pass_id: u64, amount: u64)]
pub struct FundEscrow<'info> {
    #[account(
        mut,
        seeds = [b"milestone_escrow", treatment_pass_id.to_le_bytes().as_ref()],
        bump = escrow_account.bump
    )]
    pub escrow_account: Account<'info, MilestoneEscrowAccount>,
    
    #[account(
        mut,
        seeds = [b"escrow_vault", treatment_pass_id.to_le_bytes().as_ref()],
        bump
    )]
    pub escrow_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub sponsor_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub sponsor: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(treatment_pass_id: u64, milestone_id: u8)]
pub struct ReleaseMilestoneFunds<'info> {
    #[account(
        mut,
        seeds = [b"milestone_escrow", treatment_pass_id.to_le_bytes().as_ref()],
        bump = escrow_account.bump
    )]
    pub escrow_account: Account<'info, MilestoneEscrowAccount>,
    
    #[account(
        mut,
        seeds = [b"escrow_vault", treatment_pass_id.to_le_bytes().as_ref()],
        bump
    )]
    pub escrow_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub patient_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub healthcare_provider: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct MilestoneEscrowAccount {
    pub escrow: MilestoneEscrow,
    pub bump: u8,
}

impl MilestoneEscrowAccount {
    pub const MAXIMUM_SIZE: usize = 8 + // discriminator
        8 + // treatment_pass_id
        8 + // total_amount
        8 + // released_amount
        8 + // created_at
        1 + // is_active
        4 + (32 * 10) + // milestone_releases (assuming max 10 milestones)
        4 + 8 + 4 + (32 * 5) + 8 + 4 + 100 + // emergency_conditions
        1 + // ubuntu_health_verification_required
        1; // bump
}

/// Core escrow functionality implementations
impl MilestoneEscrowAccount {
    pub fn create_escrow(
        &mut self,
        treatment_pass_id: u64,
        milestone_releases: Vec<MilestoneRelease>,
        ubuntu_health_verification_required: bool,
    ) -> Result<()> {
        self.escrow = MilestoneEscrow {
            treatment_pass_id,
            total_amount: 0,
            released_amount: 0,
            created_at: Clock::get()?.unix_timestamp,
            is_active: true,
            milestone_releases,
            emergency_conditions: EmergencyReleaseConditions {
                emergency_release_enabled: false,
                emergency_releasers: vec![],
                emergency_delay_seconds: 86400, // 24 hours default
                emergency_initiated: None,
                emergency_reason: None,
            },
            ubuntu_health_verification_required,
        };
        Ok(())
    }

    pub fn add_funds(&mut self, amount: u64) -> Result<()> {
        self.escrow.total_amount = self.escrow.total_amount
            .checked_add(amount)
            .ok_or(ProgramError::ArithmeticOverflow)?;
        Ok(())
    }

    pub fn can_release_milestone(&self, milestone_id: u8) -> Result<bool> {
        let milestone_release = self.escrow.milestone_releases
            .iter()
            .find(|mr| mr.milestone_id == milestone_id)
            .ok_or(ErrorCode::MilestoneNotFound)?;

        if milestone_release.is_released {
            return Ok(false);
        }

        // Check if all required verifications are received
        let mandatory_verifications: Vec<_> = milestone_release.required_verifications
            .iter()
            .filter(|rv| rv.is_mandatory)
            .collect();

        for required_verification in mandatory_verifications {
            let verification_received = milestone_release.received_verifications
                .iter()
                .any(|rv| rv.verification_type == required_verification.verification_type);
            
            if !verification_received {
                return Ok(false);
            }
        }

        Ok(true)
    }

    pub fn release_milestone_funds(&mut self, milestone_id: u8) -> Result<u64> {
        if !self.can_release_milestone(milestone_id)? {
            return Err(ErrorCode::MilestoneVerificationIncomplete.into());
        }

        let milestone_release = self.escrow.milestone_releases
            .iter_mut()
            .find(|mr| mr.milestone_id == milestone_id)
            .ok_or(ErrorCode::MilestoneNotFound)?;

        if milestone_release.is_released {
            return Err(ErrorCode::MilestoneAlreadyReleased.into());
        }

        milestone_release.is_released = true;
        milestone_release.release_timestamp = Some(Clock::get()?.unix_timestamp);

        self.escrow.released_amount = self.escrow.released_amount
            .checked_add(milestone_release.release_amount)
            .ok_or(ProgramError::ArithmeticOverflow)?;

        Ok(milestone_release.release_amount)
    }

    pub fn add_verification(
        &mut self,
        milestone_id: u8,
        verification: ReceivedVerification,
    ) -> Result<()> {
        let milestone_release = self.escrow.milestone_releases
            .iter_mut()
            .find(|mr| mr.milestone_id == milestone_id)
            .ok_or(ErrorCode::MilestoneNotFound)?;

        milestone_release.received_verifications.push(verification);
        Ok(())
    }
}

/// Escrow instruction implementations
pub fn create_milestone_escrow(
    ctx: Context<CreateMilestoneEscrow>,
    treatment_pass_id: u64,
    milestone_releases: Vec<MilestoneRelease>,
    ubuntu_health_verification_required: bool,
) -> Result<()> {
    let escrow_account = &mut ctx.accounts.escrow_account;
    escrow_account.bump = *ctx.bumps.get("escrow_account").unwrap();
    
    escrow_account.create_escrow(
        treatment_pass_id,
        milestone_releases,
        ubuntu_health_verification_required,
    )?;

    emit!(MilestoneEscrowCreated {
        treatment_pass_id,
        total_milestones: escrow_account.escrow.milestone_releases.len() as u8,
        ubuntu_health_verification_required,
    });

    Ok(())
}

pub fn fund_escrow(
    ctx: Context<FundEscrow>,
    treatment_pass_id: u64,
    amount: u64,
) -> Result<()> {
    let escrow_account = &mut ctx.accounts.escrow_account;
    
    // Transfer tokens from sponsor to escrow vault
    let cpi_accounts = Transfer {
        from: ctx.accounts.sponsor_token_account.to_account_info(),
        to: ctx.accounts.escrow_vault.to_account_info(),
        authority: ctx.accounts.sponsor.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, amount)?;

    // Update escrow account
    escrow_account.add_funds(amount)?;

    emit!(EscrowFunded {
        treatment_pass_id,
        sponsor: ctx.accounts.sponsor.key(),
        amount,
        total_escrow_amount: escrow_account.escrow.total_amount,
    });

    Ok(())
}

pub fn release_milestone_funds(
    ctx: Context<ReleaseMilestoneFunds>,
    treatment_pass_id: u64,
    milestone_id: u8,
) -> Result<()> {
    let escrow_account = &mut ctx.accounts.escrow_account;
    
    let release_amount = escrow_account.release_milestone_funds(milestone_id)?;

    // Create PDA seeds for escrow vault authority
    let treatment_pass_id_bytes = treatment_pass_id.to_le_bytes();
    let seeds = &[
        b"milestone_escrow",
        treatment_pass_id_bytes.as_ref(),
        &[escrow_account.bump],
    ];
    let signer = &[&seeds[..]];

    // Transfer tokens from escrow vault to patient
    let cpi_accounts = Transfer {
        from: ctx.accounts.escrow_vault.to_account_info(),
        to: ctx.accounts.patient_token_account.to_account_info(),
        authority: escrow_account.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    token::transfer(cpi_ctx, release_amount)?;

    emit!(MilestoneFundsReleased {
        treatment_pass_id,
        milestone_id,
        release_amount,
        verifying_provider: ctx.accounts.healthcare_provider.key(),
        total_released: escrow_account.escrow.released_amount,
    });

    Ok(())
}

/// Events for escrow operations
#[event]
pub struct MilestoneEscrowCreated {
    pub treatment_pass_id: u64,
    pub total_milestones: u8,
    pub ubuntu_health_verification_required: bool,
}

#[event]
pub struct EscrowFunded {
    pub treatment_pass_id: u64,
    pub sponsor: Pubkey,
    pub amount: u64,
    pub total_escrow_amount: u64,
}

#[event]
pub struct MilestoneFundsReleased {
    pub treatment_pass_id: u64,
    pub milestone_id: u8,
    pub release_amount: u64,
    pub verifying_provider: Pubkey,
    pub total_released: u64,
}

/// Custom error codes for escrow operations
#[error_code]
pub enum ErrorCode {
    #[msg("Milestone not found")]
    MilestoneNotFound,
    #[msg("Milestone verification incomplete")]
    MilestoneVerificationIncomplete,
    #[msg("Milestone already released")]
    MilestoneAlreadyReleased,
    #[msg("Insufficient escrow funds")]
    InsufficientEscrowFunds,
    #[msg("Emergency release not authorized")]
    EmergencyReleaseNotAuthorized,
    #[msg("Invalid verification signature")]
    InvalidVerificationSignature,
}

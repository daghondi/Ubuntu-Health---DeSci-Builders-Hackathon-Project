use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, MintTo},
    metadata::{
        create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3,
        Metadata as Metaplex,
    },
};

declare_id!("11111111111111111111111111111113");

#[program]
pub mod treatment_passes {
    use super::*;

    /// Mint a new Ubuntu Treatment Pass NFT for community-sponsored healthcare
    pub fn mint_treatment_pass(
        ctx: Context<MintTreatmentPass>,
        patient: Pubkey,
        treatment_type: String,
        sponsor_community: String,
        treatment_plan_ipfs: String,
        funding_amount: u64,
        milestone_count: u8,
        cultural_healing_included: bool,
    ) -> Result<()> {
        let treatment_pass = &mut ctx.accounts.treatment_pass;
        
        treatment_pass.patient = patient;
        treatment_pass.sponsor = ctx.accounts.sponsor.key();
        treatment_pass.treatment_type = treatment_type.clone();
        treatment_pass.sponsor_community = sponsor_community.clone();
        treatment_pass.treatment_plan_ipfs = treatment_plan_ipfs.clone();
        treatment_pass.funding_amount = funding_amount;
        treatment_pass.milestone_count = milestone_count;
        treatment_pass.completed_milestones = 0;
        treatment_pass.cultural_healing_included = cultural_healing_included;
        treatment_pass.is_active = true;
        treatment_pass.ubuntu_validated = false;
        treatment_pass.elder_approved = false;
        treatment_pass.mint = ctx.accounts.mint.key();
        treatment_pass.created_at = Clock::get()?.unix_timestamp;

        // Create NFT metadata reflecting Ubuntu healing philosophy
        let title = format!("Ubuntu Healing Pass - {}", treatment_type);
        let symbol = "UHP".to_string();
        let uri = format!("https://ipfs.io/ipfs/{}", treatment_plan_ipfs);
        
        let data_v2 = DataV2 {
            name: title,
            symbol,
            uri,
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        };

        let seeds = &[
            "treatment_pass".as_bytes(),
            patient.as_ref(),
            ctx.accounts.sponsor.key().as_ref(),
            &[ctx.bumps.treatment_pass],
        ];
        let signer = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                mint_authority: treatment_pass.to_account_info(),
                update_authority: treatment_pass.to_account_info(),
                payer: ctx.accounts.sponsor.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
            signer,
        );

        create_metadata_accounts_v3(cpi_ctx, data_v2, false, true, None)?;

        // Mint the NFT to patient's associated token account
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.patient_token_account.to_account_info(),
            authority: treatment_pass.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

        token::mint_to(cpi_ctx, 1)?;

        emit!(TreatmentPassMinted {
            patient,
            sponsor: ctx.accounts.sponsor.key(),
            sponsor_community,
            treatment_type,
            funding_amount,
            cultural_healing: cultural_healing_included,
            mint: ctx.accounts.mint.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Ubuntu community validates treatment pass according to Ubuntu principles
    pub fn ubuntu_validate_pass(
        ctx: Context<UbuntuValidatePass>,
        validation_notes: String,
        traditional_healing_integration: bool,
    ) -> Result<()> {
        let treatment_pass = &mut ctx.accounts.treatment_pass;
        
        treatment_pass.ubuntu_validated = true;
        
        if traditional_healing_integration {
            treatment_pass.cultural_healing_included = true;
        }

        emit!(TreatmentPassUbuntuValidated {
            patient: treatment_pass.patient,
            validator: ctx.accounts.ubuntu_validator.key(),
            validation_notes,
            traditional_healing: traditional_healing_integration,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Elder council approves treatment pass with ancestral wisdom
    pub fn elder_approve_pass(
        ctx: Context<ElderApprovePass>,
        ancestral_guidance_ipfs: String,
        traditional_remedies: Vec<String>,
    ) -> Result<()> {
        let treatment_pass = &mut ctx.accounts.treatment_pass;
        
        treatment_pass.elder_approved = true;
        treatment_pass.ancestral_guidance_ipfs = Some(ancestral_guidance_ipfs.clone());
        treatment_pass.traditional_remedies = traditional_remedies.clone();

        emit!(TreatmentPassElderApproved {
            patient: treatment_pass.patient,
            elder_council: ctx.accounts.elder_council.key(),
            ancestral_guidance: ancestral_guidance_ipfs,
            traditional_remedies,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Mark treatment milestone as completed with Ubuntu community verification
    pub fn complete_milestone(
        ctx: Context<CompleteMilestone>,
        milestone_number: u8,
        progress_notes: String,
        cultural_practices_used: Vec<String>,
        community_witnesses: Vec<Pubkey>,
    ) -> Result<()> {
        let treatment_pass = &mut ctx.accounts.treatment_pass;
        
        require!(
            milestone_number <= treatment_pass.milestone_count,
            TreatmentPassError::InvalidMilestone
        );
        
        require!(
            treatment_pass.ubuntu_validated && treatment_pass.elder_approved,
            TreatmentPassError::NotValidated
        );

        treatment_pass.completed_milestones += 1;
        
        // If all milestones completed, mark treatment as successful
        if treatment_pass.completed_milestones >= treatment_pass.milestone_count {
            treatment_pass.is_active = false;
            treatment_pass.treatment_completed = true;
            treatment_pass.completion_date = Some(Clock::get()?.unix_timestamp);
        }

        emit!(TreatmentMilestoneCompleted {
            patient: treatment_pass.patient,
            milestone_number,
            completed_count: treatment_pass.completed_milestones,
            total_milestones: treatment_pass.milestone_count,
            progress_notes,
            cultural_practices: cultural_practices_used,
            community_witnesses,
            treatment_completed: treatment_pass.treatment_completed,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Transfer treatment pass to another patient (for family/emergency cases)
    pub fn transfer_pass(
        ctx: Context<TransferPass>,
        new_patient: Pubkey,
        transfer_reason: String,
        ubuntu_community_approval: bool,
    ) -> Result<()> {
        require!(ubuntu_community_approval, TreatmentPassError::NoUbuntuConsent);
        
        let treatment_pass = &mut ctx.accounts.treatment_pass;
        let old_patient = treatment_pass.patient;
        
        treatment_pass.patient = new_patient;
        treatment_pass.transfer_history.push(TreatmentPassTransfer {
            from: old_patient,
            to: new_patient,
            reason: transfer_reason.clone(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        emit!(TreatmentPassTransferred {
            from_patient: old_patient,
            to_patient: new_patient,
            reason: transfer_reason,
            ubuntu_approved: ubuntu_community_approval,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(patient: Pubkey)]
pub struct MintTreatmentPass<'info> {
    #[account(mut)]
    pub sponsor: Signer<'info>,
    
    #[account(
        init,
        payer = sponsor,
        space = 8 + TreatmentPass::INIT_SPACE,
        seeds = [b"treatment_pass", patient.as_ref(), sponsor.key().as_ref()],
        bump
    )]
    pub treatment_pass: Account<'info, TreatmentPass>,
    
    #[account(
        init,
        payer = sponsor,
        mint::decimals = 0,
        mint::authority = treatment_pass,
        mint::freeze_authority = treatment_pass,
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        init_if_needed,
        payer = sponsor,
        associated_token::mint = mint,
        associated_token::authority = patient,
    )]
    pub patient_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_metadata_program: Program<'info, Metaplex>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct UbuntuValidatePass<'info> {
    pub ubuntu_validator: Signer<'info>,
    
    #[account(mut)]
    pub treatment_pass: Account<'info, TreatmentPass>,
}

#[derive(Accounts)]
pub struct ElderApprovePass<'info> {
    pub elder_council: Signer<'info>,
    
    #[account(mut)]
    pub treatment_pass: Account<'info, TreatmentPass>,
}

#[derive(Accounts)]
pub struct CompleteMilestone<'info> {
    pub patient_or_caregiver: Signer<'info>,
    
    #[account(mut)]
    pub treatment_pass: Account<'info, TreatmentPass>,
}

#[derive(Accounts)]
pub struct TransferPass<'info> {
    pub current_patient: Signer<'info>,
    
    #[account(mut)]
    pub treatment_pass: Account<'info, TreatmentPass>,
}

#[account]
pub struct TreatmentPass {
    pub patient: Pubkey,
    pub sponsor: Pubkey,
    pub treatment_type: String,
    pub sponsor_community: String,
    pub treatment_plan_ipfs: String,
    pub funding_amount: u64,
    pub milestone_count: u8,
    pub completed_milestones: u8,
    pub cultural_healing_included: bool,
    pub is_active: bool,
    pub ubuntu_validated: bool,
    pub elder_approved: bool,
    pub treatment_completed: bool,
    pub mint: Pubkey,
    pub ancestral_guidance_ipfs: Option<String>,
    pub traditional_remedies: Vec<String>,
    pub transfer_history: Vec<TreatmentPassTransfer>,
    pub created_at: i64,
    pub completion_date: Option<i64>,
}

impl TreatmentPass {
    pub const INIT_SPACE: usize = 32 + 32 + 100 + 100 + 200 + 8 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 32 + 4 + 200 + 4 + 10 * 50 + 4 + 5 * TreatmentPassTransfer::SPACE + 8 + 9;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TreatmentPassTransfer {
    pub from: Pubkey,
    pub to: Pubkey,
    pub reason: String,
    pub timestamp: i64,
}

impl TreatmentPassTransfer {
    pub const SPACE: usize = 32 + 32 + 100 + 8;
}

#[event]
pub struct TreatmentPassMinted {
    pub patient: Pubkey,
    pub sponsor: Pubkey,
    pub sponsor_community: String,
    pub treatment_type: String,
    pub funding_amount: u64,
    pub cultural_healing: bool,
    pub mint: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct TreatmentPassUbuntuValidated {
    pub patient: Pubkey,
    pub validator: Pubkey,
    pub validation_notes: String,
    pub traditional_healing: bool,
    pub timestamp: i64,
}

#[event]
pub struct TreatmentPassElderApproved {
    pub patient: Pubkey,
    pub elder_council: Pubkey,
    pub ancestral_guidance: String,
    pub traditional_remedies: Vec<String>,
    pub timestamp: i64,
}

#[event]
pub struct TreatmentMilestoneCompleted {
    pub patient: Pubkey,
    pub milestone_number: u8,
    pub completed_count: u8,
    pub total_milestones: u8,
    pub progress_notes: String,
    pub cultural_practices: Vec<String>,
    pub community_witnesses: Vec<Pubkey>,
    pub treatment_completed: bool,
    pub timestamp: i64,
}

#[event]
pub struct TreatmentPassTransferred {
    pub from_patient: Pubkey,
    pub to_patient: Pubkey,
    pub reason: String,
    pub ubuntu_approved: bool,
    pub timestamp: i64,
}

#[error_code]
pub enum TreatmentPassError {
    #[msg("Invalid milestone number")]
    InvalidMilestone,
    #[msg("Treatment pass not validated by Ubuntu community")]
    NotValidated,
    #[msg("Ubuntu community consent required for transfer")]
    NoUbuntuConsent,
    #[msg("Treatment already completed")]
    TreatmentCompleted,
    #[msg("Elder approval required")]
    ElderApprovalRequired,
}

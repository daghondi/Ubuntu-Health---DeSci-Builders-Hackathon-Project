use anchor_lang::prelude::*;

// Import modules
pub mod treatment_pass_nft;
pub mod milestone_escrow;
pub mod lives_token;

use treatment_pass_nft::*;
use milestone_escrow::*;
use lives_token::*;

declare_id!("UbuntuHea1thPassNFT111111111111111111111111");

#[program]
pub mod ubuntu_health_core {
    use super::*;

    /// Creates a new treatment pass NFT for a patient
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
        treatment_pass_nft::create_treatment_pass(
            ctx,
            pass_id,
            treatment_title,
            treatment_description,
            treatment_category,
            funding_target,
            milestones,
            traditional_healing_component,
        )
    }

    /// Sponsors a treatment pass by funding specific milestones
    pub fn sponsor_treatment(
        ctx: Context<SponsorTreatment>,
        amount: u64,
        sponsor_message: Option<String>,
        sponsored_milestones: Vec<u8>,
    ) -> Result<()> {
        treatment_pass_nft::sponsor_treatment(
            ctx,
            amount,
            sponsor_message,
            sponsored_milestones,
        )
    }

    /// Verifies milestone completion and releases escrowed funds
    pub fn verify_milestone(
        ctx: Context<VerifyMilestone>,
        milestone_id: u8,
        verification_evidence: Option<String>,
        ubuntu_community_validation: bool,
    ) -> Result<()> {
        treatment_pass_nft::verify_milestone(
            ctx,
            milestone_id,
            verification_evidence,
            ubuntu_community_validation,
        )
    }

    /// Updates treatment pass with elder council review
    pub fn elder_council_review(
        ctx: Context<ElderCouncilReviewContext>,
        pass_id: u64,
        decision: ElderDecision,
        elder_guidance: String,
        traditional_wisdom: Option<String>,
        community_support_recommendations: Vec<String>,
    ) -> Result<()> {
        let treatment_pass_account = &mut ctx.accounts.treatment_pass_account;
        let treatment_pass = &mut treatment_pass_account.treatment_pass;
        let clock = Clock::get()?;

        // Create elder review
        let elder_review = ElderReview {
            reviewing_elder: ctx.accounts.elder.key(),
            review_timestamp: clock.unix_timestamp,
            decision: decision.clone(),
            elder_guidance,
            traditional_wisdom: traditional_wisdom.clone(),
            community_support_recommendations,
        };

        // Update treatment pass based on elder decision
        match decision {
            ElderDecision::Approved => {
                treatment_pass.elder_council_approval = true;
                treatment_pass.approving_elder = Some(ctx.accounts.elder.key());
                if treatment_pass.status == TreatmentPassStatus::ElderCouncilReview {
                    treatment_pass.status = TreatmentPassStatus::FundingRequired;
                }
            }
            ElderDecision::ApprovedWithGuidance => {
                treatment_pass.elder_council_approval = true;
                treatment_pass.approving_elder = Some(ctx.accounts.elder.key());
                if treatment_pass.status == TreatmentPassStatus::ElderCouncilReview {
                    treatment_pass.status = TreatmentPassStatus::FundingRequired;
                }
            }
            ElderDecision::RequiresMoreInformation => {
                treatment_pass.status = TreatmentPassStatus::CommunityReview;
            }
            ElderDecision::Disapproved => {
                treatment_pass.status = TreatmentPassStatus::TreatmentCancelled;
            }
            ElderDecision::DeferToCommunity => {
                treatment_pass.status = TreatmentPassStatus::CommunityReview;
            }
        }

        // Add elder review to relevant milestones if applicable
        for milestone in &mut treatment_pass.milestones {
            if milestone.verification_required == VerificationType::ElderCouncilVerification ||
               milestone.verification_required == VerificationType::IntegratedVerification {
                milestone.elder_council_review = Some(elder_review.clone());
            }
        }

        // Emit event
        emit!(ElderCouncilReview {
            pass_id,
            reviewing_elder: ctx.accounts.elder.key(),
            decision,
            traditional_wisdom_shared: traditional_wisdom.is_some(),
        });

        Ok(())
    }

    /// Updates diaspora connection information for treatment pass
    pub fn update_diaspora_connection(
        ctx: Context<UpdateDiasporaConnection>,
        origin_community: String,
        current_location: String,
        connection_strength: u8,
        network_contacts: Vec<Pubkey>,
        remittance_capability: bool,
    ) -> Result<()> {
        let treatment_pass_account = &mut ctx.accounts.treatment_pass_account;
        let treatment_pass = &mut treatment_pass_account.treatment_pass;

        treatment_pass.diaspora_connection = Some(DiasporaInfo {
            origin_community,
            current_location,
            connection_strength,
            network_contacts,
            remittance_capability,
        });

        Ok(())
    }

    /// Adds traditional healing knowledge to sponsor profile
    pub fn add_traditional_healing_knowledge(
        ctx: Context<AddTraditionalHealingKnowledge>,
        sponsor_wallet: Pubkey,
        healing_knowledge: String,
    ) -> Result<()> {
        let treatment_pass_account = &mut ctx.accounts.treatment_pass_account;
        let treatment_pass = &mut treatment_pass_account.treatment_pass;

        // Find and update sponsor with traditional healing knowledge
        if let Some(sponsor) = treatment_pass.sponsors.iter_mut()
            .find(|s| s.wallet == sponsor_wallet) {
            sponsor.traditional_healing_knowledge = Some(healing_knowledge);
        }

        Ok(())
    }

    // Milestone Escrow Instructions
    /// Creates a milestone-based escrow for treatment funding
    pub fn create_milestone_escrow(
        ctx: Context<CreateMilestoneEscrow>,
        treatment_pass_id: u64,
        milestone_releases: Vec<MilestoneRelease>,
        ubuntu_health_verification_required: bool,
    ) -> Result<()> {
        milestone_escrow::create_milestone_escrow(
            ctx,
            treatment_pass_id,
            milestone_releases,
            ubuntu_health_verification_required,
        )
    }

    /// Funds the milestone escrow with sponsor contributions
    pub fn fund_escrow(
        ctx: Context<FundEscrow>,
        treatment_pass_id: u64,
        amount: u64,
    ) -> Result<()> {
        milestone_escrow::fund_escrow(ctx, treatment_pass_id, amount)
    }

    /// Releases milestone funds upon verification
    pub fn release_milestone_funds(
        ctx: Context<ReleaseMilestoneFunds>,
        treatment_pass_id: u64,
        milestone_id: u8,
    ) -> Result<()> {
        milestone_escrow::release_milestone_funds(ctx, treatment_pass_id, milestone_id)
    }

    // $LIVES Token Instructions
    /// Initializes the $LIVES token economics system
    pub fn initialize_lives_token(
        ctx: Context<InitializeLivesToken>,
        max_supply: u64,
    ) -> Result<()> {
        lives_token::initialize_lives_token(ctx, max_supply)
    }

    /// Initializes user token account for rewards
    pub fn initialize_user_token_account(
        ctx: Context<InitializeUserTokenAccount>,
        user: Pubkey,
        ubuntu_health_member: bool,
    ) -> Result<()> {
        lives_token::initialize_user_token_account(ctx, user, ubuntu_health_member)
    }

    /// Distributes $LIVES token rewards for various activities
    pub fn distribute_reward(
        ctx: Context<DistributeReward>,
        reward_type: RewardType,
        base_amount: u64,
    ) -> Result<()> {
        lives_token::distribute_reward(ctx, reward_type, base_amount)
    }

    /// Claims pending $LIVES token rewards
    pub fn claim_pending_rewards(
        ctx: Context<ClaimPendingRewards>,
    ) -> Result<()> {
        lives_token::claim_pending_rewards(ctx)
    }
}

// Additional context structs for new instructions
#[derive(Accounts)]
#[instruction(pass_id: u64)]
pub struct ElderCouncilReviewContext<'info> {
    #[account(
        mut,
        seeds = [b"treatment_pass", treatment_pass_account.treatment_pass.patient.as_ref(), pass_id.to_le_bytes().as_ref()],
        bump = treatment_pass_account.bump
    )]
    pub treatment_pass_account: Account<'info, TreatmentPassAccount>,
    
    /// Elder council member performing the review
    pub elder: Signer<'info>,
    
    /// System program
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateDiasporaConnection<'info> {
    #[account(
        mut,
        seeds = [b"treatment_pass", treatment_pass_account.treatment_pass.patient.as_ref(), treatment_pass_account.treatment_pass.pass_id.to_le_bytes().as_ref()],
        bump = treatment_pass_account.bump
    )]
    pub treatment_pass_account: Account<'info, TreatmentPassAccount>,
    
    /// Patient or authorized representative
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct AddTraditionalHealingKnowledge<'info> {
    #[account(
        mut,
        seeds = [b"treatment_pass", treatment_pass_account.treatment_pass.patient.as_ref(), treatment_pass_account.treatment_pass.pass_id.to_le_bytes().as_ref()],
        bump = treatment_pass_account.bump
    )]
    pub treatment_pass_account: Account<'info, TreatmentPassAccount>,
    
    /// Sponsor adding traditional healing knowledge
    pub sponsor: Signer<'info>,
}

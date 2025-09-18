use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};

declare_id!("11111111111111111111111111111112");

#[program]
pub mod ubuntu_health_core {
    use super::*;

    /// Initialize the Ubuntu Health platform with Ubuntu philosophy principles
    pub fn initialize(
        ctx: Context<Initialize>,
        ubuntu_philosophy_ipfs: String,
        elder_council_authority: Pubkey,
        community_treasury: Pubkey,
    ) -> Result<()> {
        let platform_state = &mut ctx.accounts.platform_state;
        
        platform_state.authority = ctx.accounts.authority.key();
        platform_state.ubuntu_philosophy_ipfs = ubuntu_philosophy_ipfs;
        platform_state.elder_council_authority = elder_council_authority;
        platform_state.community_treasury = community_treasury;
        platform_state.total_patients = 0;
        platform_state.total_sponsors = 0;
        platform_state.total_healing_journeys = 0;
        platform_state.lives_token_vault = ctx.accounts.lives_token_vault.key();
        platform_state.is_initialized = true;
        platform_state.ubuntu_principles_active = true;
        platform_state.created_at = Clock::get()?.unix_timestamp;

        emit!(PlatformInitialized {
            authority: ctx.accounts.authority.key(),
            elder_council: elder_council_authority,
            community_treasury,
            ubuntu_philosophy: ubuntu_philosophy_ipfs,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Register a new Ubuntu community member (patient, sponsor, healer, etc.)
    pub fn register_community_member(
        ctx: Context<RegisterCommunityMember>,
        member_type: UbuntuMemberType,
        profile_ipfs: String,
        cultural_background: String,
        ubuntu_community_id: String,
    ) -> Result<()> {
        let member_profile = &mut ctx.accounts.member_profile;
        let platform_state = &mut ctx.accounts.platform_state;

        member_profile.wallet = ctx.accounts.member.key();
        member_profile.member_type = member_type;
        member_profile.profile_ipfs = profile_ipfs;
        member_profile.cultural_background = cultural_background;
        member_profile.ubuntu_community_id = ubuntu_community_id;
        member_profile.reputation_score = 0;
        member_profile.ubuntu_contributions = 0;
        member_profile.healing_journeys_count = 0;
        member_profile.is_active = true;
        member_profile.elder_verified = false;
        member_profile.registered_at = Clock::get()?.unix_timestamp;

        // Update global counters based on member type
        match member_type {
            UbuntuMemberType::Patient => platform_state.total_patients += 1,
            UbuntuMemberType::Sponsor => platform_state.total_sponsors += 1,
            _ => {}
        }

        emit!(CommunityMemberRegistered {
            member: ctx.accounts.member.key(),
            member_type,
            ubuntu_community: ubuntu_community_id,
            cultural_background,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Elder council validates a community member according to Ubuntu principles
    pub fn elder_validate_member(
        ctx: Context<ElderValidateMember>,
        validation_notes: String,
    ) -> Result<()> {
        require!(
            ctx.accounts.elder_council.key() == ctx.accounts.platform_state.elder_council_authority,
            UbuntuHealthError::UnauthorizedElderCouncil
        );

        let member_profile = &mut ctx.accounts.member_profile;
        member_profile.elder_verified = true;
        member_profile.reputation_score += 100; // Ubuntu elder validation bonus

        emit!(ElderValidationCompleted {
            member: member_profile.wallet,
            elder_council: ctx.accounts.elder_council.key(),
            validation_notes,
            new_reputation: member_profile.reputation_score,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Record Ubuntu community consensus decision
    pub fn record_ubuntu_consensus(
        ctx: Context<RecordUbuntuConsensus>,
        decision_type: UbuntuDecisionType,
        decision_ipfs: String,
        consensus_threshold: u64,
        votes_for: u64,
        votes_against: u64,
    ) -> Result<()> {
        require!(
            votes_for >= consensus_threshold,
            UbuntuHealthError::InsufficientConsensus
        );

        let consensus_record = &mut ctx.accounts.consensus_record;
        consensus_record.decision_type = decision_type;
        consensus_record.decision_ipfs = decision_ipfs;
        consensus_record.votes_for = votes_for;
        consensus_record.votes_against = votes_against;
        consensus_record.consensus_threshold = consensus_threshold;
        consensus_record.is_approved = true;
        consensus_record.recorded_by = ctx.accounts.recorder.key();
        consensus_record.timestamp = Clock::get()?.unix_timestamp;

        emit!(UbuntuConsensusAchieved {
            decision_type,
            votes_for,
            votes_against,
            threshold: consensus_threshold,
            decision_ipfs,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + PlatformState::INIT_SPACE,
        seeds = [b"platform_state"],
        bump
    )]
    pub platform_state: Account<'info, PlatformState>,
    
    #[account(
        init,
        payer = authority,
        token::mint = lives_token_mint,
        token::authority = platform_state,
    )]
    pub lives_token_vault: Account<'info, TokenAccount>,
    
    pub lives_token_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct RegisterCommunityMember<'info> {
    #[account(mut)]
    pub member: Signer<'info>,
    
    #[account(
        init,
        payer = member,
        space = 8 + UbuntuMemberProfile::INIT_SPACE,
        seeds = [b"member_profile", member.key().as_ref()],
        bump
    )]
    pub member_profile: Account<'info, UbuntuMemberProfile>,
    
    #[account(mut)]
    pub platform_state: Account<'info, PlatformState>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ElderValidateMember<'info> {
    pub elder_council: Signer<'info>,
    
    #[account(mut)]
    pub member_profile: Account<'info, UbuntuMemberProfile>,
    
    pub platform_state: Account<'info, PlatformState>,
}

#[derive(Accounts)]
pub struct RecordUbuntuConsensus<'info> {
    #[account(mut)]
    pub recorder: Signer<'info>,
    
    #[account(
        init,
        payer = recorder,
        space = 8 + UbuntuConsensusRecord::INIT_SPACE,
    )]
    pub consensus_record: Account<'info, UbuntuConsensusRecord>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct PlatformState {
    pub authority: Pubkey,
    pub ubuntu_philosophy_ipfs: String,
    pub elder_council_authority: Pubkey,
    pub community_treasury: Pubkey,
    pub lives_token_vault: Pubkey,
    pub total_patients: u64,
    pub total_sponsors: u64,
    pub total_healing_journeys: u64,
    pub is_initialized: bool,
    pub ubuntu_principles_active: bool,
    pub created_at: i64,
}

impl PlatformState {
    pub const INIT_SPACE: usize = 32 + 200 + 32 + 32 + 32 + 8 + 8 + 8 + 1 + 1 + 8;
}

#[account]
pub struct UbuntuMemberProfile {
    pub wallet: Pubkey,
    pub member_type: UbuntuMemberType,
    pub profile_ipfs: String,
    pub cultural_background: String,
    pub ubuntu_community_id: String,
    pub reputation_score: u64,
    pub ubuntu_contributions: u64,
    pub healing_journeys_count: u64,
    pub is_active: bool,
    pub elder_verified: bool,
    pub registered_at: i64,
}

impl UbuntuMemberProfile {
    pub const INIT_SPACE: usize = 32 + 1 + 200 + 100 + 100 + 8 + 8 + 8 + 1 + 1 + 8;
}

#[account]
pub struct UbuntuConsensusRecord {
    pub decision_type: UbuntuDecisionType,
    pub decision_ipfs: String,
    pub votes_for: u64,
    pub votes_against: u64,
    pub consensus_threshold: u64,
    pub is_approved: bool,
    pub recorded_by: Pubkey,
    pub timestamp: i64,
}

impl UbuntuConsensusRecord {
    pub const INIT_SPACE: usize = 1 + 200 + 8 + 8 + 8 + 1 + 32 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum UbuntuMemberType {
    Patient,
    Sponsor,
    TraditionalHealer,
    ModernMedicalProfessional,
    CommunityElder,
    Researcher,
    UbuntuAdvocate,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum UbuntuDecisionType {
    TreatmentProtocolApproval,
    CommunityFundingDecision,
    ElderCouncilAppointment,
    TraditionalHealingIntegration,
    ResearchEthicsApproval,
    CulturalPreservationInitiative,
}

#[event]
pub struct PlatformInitialized {
    pub authority: Pubkey,
    pub elder_council: Pubkey,
    pub community_treasury: Pubkey,
    pub ubuntu_philosophy: String,
    pub timestamp: i64,
}

#[event]
pub struct CommunityMemberRegistered {
    pub member: Pubkey,
    pub member_type: UbuntuMemberType,
    pub ubuntu_community: String,
    pub cultural_background: String,
    pub timestamp: i64,
}

#[event]
pub struct ElderValidationCompleted {
    pub member: Pubkey,
    pub elder_council: Pubkey,
    pub validation_notes: String,
    pub new_reputation: u64,
    pub timestamp: i64,
}

#[event]
pub struct UbuntuConsensusAchieved {
    pub decision_type: UbuntuDecisionType,
    pub votes_for: u64,
    pub votes_against: u64,
    pub threshold: u64,
    pub decision_ipfs: String,
    pub timestamp: i64,
}

#[error_code]
pub enum UbuntuHealthError {
    #[msg("Unauthorized elder council access")]
    UnauthorizedElderCouncil,
    #[msg("Insufficient community consensus")]
    InsufficientConsensus,
    #[msg("Platform not initialized")]
    PlatformNotInitialized,
    #[msg("Member not verified by elder council")]
    MemberNotElderVerified,
    #[msg("Ubuntu principles not active")]
    UbuntuPrinciplesInactive,
}

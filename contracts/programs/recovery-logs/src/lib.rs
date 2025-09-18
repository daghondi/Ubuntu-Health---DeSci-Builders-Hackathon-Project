use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111114");

#[program]
pub mod recovery_logs {
    use super::*;

    /// Create a new recovery log entry with Ubuntu community verification
    pub fn log_recovery_entry(
        ctx: Context<LogRecoveryEntry>,
        treatment_pass: Pubkey,
        log_type: RecoveryLogType,
        content_ipfs: String,
        vitals_data: Option<VitalsData>,
        traditional_healing_notes: Option<String>,
        community_witnesses: Vec<Pubkey>,
        privacy_level: PrivacyLevel,
    ) -> Result<()> {
        let recovery_log = &mut ctx.accounts.recovery_log;
        
        recovery_log.patient = ctx.accounts.patient.key();
        recovery_log.treatment_pass = treatment_pass;
        recovery_log.log_type = log_type;
        recovery_log.content_ipfs = content_ipfs.clone();
        recovery_log.vitals_data = vitals_data.clone();
        recovery_log.traditional_healing_notes = traditional_healing_notes.clone();
        recovery_log.community_witnesses = community_witnesses.clone();
        recovery_log.privacy_level = privacy_level;
        recovery_log.ubuntu_verified = false;
        recovery_log.elder_blessed = false;
        recovery_log.data_contributed_to_research = false;
        recovery_log.timestamp = Clock::get()?.unix_timestamp;
        recovery_log.entry_hash = calculate_entry_hash(&content_ipfs, Clock::get()?.unix_timestamp);

        emit!(RecoveryEntryLogged {
            patient: ctx.accounts.patient.key(),
            treatment_pass,
            log_type,
            content_ipfs,
            vitals_included: vitals_data.is_some(),
            traditional_healing: traditional_healing_notes.is_some(),
            community_witnesses: community_witnesses.len() as u8,
            privacy_level,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Ubuntu community verifies recovery log entry
    pub fn ubuntu_verify_log(
        ctx: Context<UbuntuVerifyLog>,
        verification_notes: String,
        accuracy_score: u8,
        cultural_context_appropriate: bool,
    ) -> Result<()> {
        require!(accuracy_score <= 100, RecoveryLogError::InvalidAccuracyScore);
        
        let recovery_log = &mut ctx.accounts.recovery_log;
        recovery_log.ubuntu_verified = true;
        recovery_log.verification_notes = Some(verification_notes.clone());
        recovery_log.accuracy_score = Some(accuracy_score);
        recovery_log.cultural_context_appropriate = cultural_context_appropriate;
        recovery_log.verified_by = Some(ctx.accounts.ubuntu_verifier.key());

        emit!(RecoveryLogUbuntuVerified {
            patient: recovery_log.patient,
            verifier: ctx.accounts.ubuntu_verifier.key(),
            verification_notes,
            accuracy_score,
            cultural_appropriate: cultural_context_appropriate,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Elder council blesses recovery log with ancestral wisdom
    pub fn elder_bless_log(
        ctx: Context<ElderBlessLog>,
        blessing_notes: String,
        ancestral_wisdom_ipfs: String,
        healing_ceremony_performed: bool,
    ) -> Result<()> {
        let recovery_log = &mut ctx.accounts.recovery_log;
        recovery_log.elder_blessed = true;
        recovery_log.blessing_notes = Some(blessing_notes.clone());
        recovery_log.ancestral_wisdom_ipfs = Some(ancestral_wisdom_ipfs.clone());
        recovery_log.healing_ceremony_performed = healing_ceremony_performed;
        recovery_log.blessed_by_elder = Some(ctx.accounts.elder.key());

        emit!(RecoveryLogElderBlessed {
            patient: recovery_log.patient,
            elder: ctx.accounts.elder.key(),
            blessing_notes,
            ancestral_wisdom: ancestral_wisdom_ipfs,
            ceremony_performed: healing_ceremony_performed,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Contribute recovery data to research with privacy preservation
    pub fn contribute_to_research(
        ctx: Context<ContributeToResearch>,
        research_study_id: String,
        anonymization_level: AnonymizationLevel,
        data_fields_contributed: Vec<String>,
        zk_proof_ipfs: String,
    ) -> Result<()> {
        let recovery_log = &mut ctx.accounts.recovery_log;
        
        require!(
            recovery_log.ubuntu_verified,
            RecoveryLogError::NotUbuntuVerified
        );

        recovery_log.data_contributed_to_research = true;
        recovery_log.research_contributions.push(ResearchContribution {
            study_id: research_study_id.clone(),
            anonymization_level,
            data_fields: data_fields_contributed.clone(),
            zk_proof_ipfs: zk_proof_ipfs.clone(),
            contributed_at: Clock::get()?.unix_timestamp,
            reward_earned: 0, // Will be updated by reward system
        });

        emit!(RecoveryDataContributedToResearch {
            patient: recovery_log.patient,
            study_id: research_study_id,
            anonymization_level,
            data_fields: data_fields_contributed,
            zk_proof: zk_proof_ipfs,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Create a milestone-based recovery summary
    pub fn create_milestone_summary(
        ctx: Context<CreateMilestoneSummary>,
        treatment_pass: Pubkey,
        milestone_number: u8,
        summary_ipfs: String,
        overall_progress: u8,
        traditional_healing_effectiveness: Option<u8>,
        ubuntu_community_feedback: String,
    ) -> Result<()> {
        let milestone_summary = &mut ctx.accounts.milestone_summary;
        
        milestone_summary.patient = ctx.accounts.patient.key();
        milestone_summary.treatment_pass = treatment_pass;
        milestone_summary.milestone_number = milestone_number;
        milestone_summary.summary_ipfs = summary_ipfs.clone();
        milestone_summary.overall_progress = overall_progress;
        milestone_summary.traditional_healing_effectiveness = traditional_healing_effectiveness;
        milestone_summary.ubuntu_community_feedback = ubuntu_community_feedback.clone();
        milestone_summary.created_at = Clock::get()?.unix_timestamp;
        milestone_summary.ubuntu_validated = false;
        milestone_summary.elder_approved = false;

        emit!(MilestoneSummaryCreated {
            patient: ctx.accounts.patient.key(),
            treatment_pass,
            milestone_number,
            overall_progress,
            traditional_healing_score: traditional_healing_effectiveness,
            ubuntu_feedback: ubuntu_community_feedback,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Update healing story narrative with Ubuntu storytelling traditions
    pub fn update_healing_story(
        ctx: Context<UpdateHealingStory>,
        story_chapter_ipfs: String,
        cultural_elements: Vec<String>,
        ubuntu_lessons_learned: String,
        community_impact_notes: String,
    ) -> Result<()> {
        let healing_story = &mut ctx.accounts.healing_story;
        
        healing_story.story_chapters.push(StoryChapter {
            ipfs_hash: story_chapter_ipfs.clone(),
            cultural_elements: cultural_elements.clone(),
            ubuntu_lessons: ubuntu_lessons_learned.clone(),
            community_impact: community_impact_notes.clone(),
            created_at: Clock::get()?.unix_timestamp,
        });

        emit!(HealingStoryUpdated {
            patient: healing_story.patient,
            chapter_ipfs: story_chapter_ipfs,
            cultural_elements,
            ubuntu_lessons: ubuntu_lessons_learned,
            community_impact: community_impact_notes,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct LogRecoveryEntry<'info> {
    #[account(mut)]
    pub patient: Signer<'info>,
    
    #[account(
        init,
        payer = patient,
        space = 8 + RecoveryLog::INIT_SPACE,
    )]
    pub recovery_log: Account<'info, RecoveryLog>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UbuntuVerifyLog<'info> {
    pub ubuntu_verifier: Signer<'info>,
    
    #[account(mut)]
    pub recovery_log: Account<'info, RecoveryLog>,
}

#[derive(Accounts)]
pub struct ElderBlessLog<'info> {
    pub elder: Signer<'info>,
    
    #[account(mut)]
    pub recovery_log: Account<'info, RecoveryLog>,
}

#[derive(Accounts)]
pub struct ContributeToResearch<'info> {
    pub patient: Signer<'info>,
    
    #[account(mut)]
    pub recovery_log: Account<'info, RecoveryLog>,
}

#[derive(Accounts)]
pub struct CreateMilestoneSummary<'info> {
    #[account(mut)]
    pub patient: Signer<'info>,
    
    #[account(
        init,
        payer = patient,
        space = 8 + MilestoneSummary::INIT_SPACE,
    )]
    pub milestone_summary: Account<'info, MilestoneSummary>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateHealingStory<'info> {
    #[account(mut)]
    pub patient: Signer<'info>,
    
    #[account(
        init_if_needed,
        payer = patient,
        space = 8 + HealingStory::INIT_SPACE,
        seeds = [b"healing_story", patient.key().as_ref()],
        bump
    )]
    pub healing_story: Account<'info, HealingStory>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct RecoveryLog {
    pub patient: Pubkey,
    pub treatment_pass: Pubkey,
    pub log_type: RecoveryLogType,
    pub content_ipfs: String,
    pub vitals_data: Option<VitalsData>,
    pub traditional_healing_notes: Option<String>,
    pub community_witnesses: Vec<Pubkey>,
    pub privacy_level: PrivacyLevel,
    pub ubuntu_verified: bool,
    pub elder_blessed: bool,
    pub data_contributed_to_research: bool,
    pub verification_notes: Option<String>,
    pub accuracy_score: Option<u8>,
    pub cultural_context_appropriate: bool,
    pub verified_by: Option<Pubkey>,
    pub blessing_notes: Option<String>,
    pub ancestral_wisdom_ipfs: Option<String>,
    pub healing_ceremony_performed: bool,
    pub blessed_by_elder: Option<Pubkey>,
    pub research_contributions: Vec<ResearchContribution>,
    pub timestamp: i64,
    pub entry_hash: [u8; 32],
}

impl RecoveryLog {
    pub const INIT_SPACE: usize = 32 + 32 + 1 + 200 + 4 + VitalsData::SPACE + 4 + 200 + 4 + 10 * 32 + 1 + 1 + 1 + 1 + 4 + 200 + 4 + 1 + 1 + 32 + 4 + 200 + 4 + 200 + 1 + 32 + 4 + 5 * ResearchContribution::SPACE + 8 + 32;
}

#[account]
pub struct MilestoneSummary {
    pub patient: Pubkey,
    pub treatment_pass: Pubkey,
    pub milestone_number: u8,
    pub summary_ipfs: String,
    pub overall_progress: u8,
    pub traditional_healing_effectiveness: Option<u8>,
    pub ubuntu_community_feedback: String,
    pub created_at: i64,
    pub ubuntu_validated: bool,
    pub elder_approved: bool,
}

impl MilestoneSummary {
    pub const INIT_SPACE: usize = 32 + 32 + 1 + 200 + 1 + 4 + 1 + 300 + 8 + 1 + 1;
}

#[account]
pub struct HealingStory {
    pub patient: Pubkey,
    pub story_chapters: Vec<StoryChapter>,
    pub ubuntu_philosophy_integration: String,
    pub cultural_preservation_elements: Vec<String>,
    pub community_impact_narrative: String,
    pub created_at: i64,
    pub last_updated: i64,
}

impl HealingStory {
    pub const INIT_SPACE: usize = 32 + 4 + 20 * StoryChapter::SPACE + 300 + 4 + 10 * 100 + 500 + 8 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct VitalsData {
    pub blood_pressure_systolic: Option<u16>,
    pub blood_pressure_diastolic: Option<u16>,
    pub heart_rate: Option<u16>,
    pub temperature: Option<u16>, // In Celsius * 100
    pub weight: Option<u32>, // In grams
    pub height: Option<u16>, // In centimeters
    pub additional_metrics: Vec<String>,
}

impl VitalsData {
    pub const SPACE: usize = 4 + 2 + 4 + 2 + 4 + 2 + 4 + 4 + 4 + 2 + 4 + 5 * 50;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ResearchContribution {
    pub study_id: String,
    pub anonymization_level: AnonymizationLevel,
    pub data_fields: Vec<String>,
    pub zk_proof_ipfs: String,
    pub contributed_at: i64,
    pub reward_earned: u64,
}

impl ResearchContribution {
    pub const SPACE: usize = 100 + 1 + 4 + 10 * 50 + 200 + 8 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct StoryChapter {
    pub ipfs_hash: String,
    pub cultural_elements: Vec<String>,
    pub ubuntu_lessons: String,
    pub community_impact: String,
    pub created_at: i64,
}

impl StoryChapter {
    pub const SPACE: usize = 200 + 4 + 10 * 50 + 200 + 200 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum RecoveryLogType {
    DailyProgress,
    MedicalTest,
    TreatmentResponse,
    TraditionalHealingSession,
    CommunitySupport,
    ElderWisdom,
    CulturalCeremony,
    MilestoneAchievement,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PrivacyLevel {
    Public,
    UbuntuCommunityOnly,
    HealthcareProvidersOnly,
    ResearchAnonymized,
    PrivatePatientOnly,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum AnonymizationLevel {
    FullyAnonymous,
    PseudoAnonymous,
    DemographicOnly,
    OutcomeDataOnly,
    ZKProofOnly,
}

// Helper function to calculate entry hash
fn calculate_entry_hash(content_ipfs: &str, timestamp: i64) -> [u8; 32] {
    use anchor_lang::solana_program::keccak;
    let mut data = content_ipfs.as_bytes().to_vec();
    data.extend_from_slice(&timestamp.to_le_bytes());
    keccak::hash(&data).to_bytes()
}

#[event]
pub struct RecoveryEntryLogged {
    pub patient: Pubkey,
    pub treatment_pass: Pubkey,
    pub log_type: RecoveryLogType,
    pub content_ipfs: String,
    pub vitals_included: bool,
    pub traditional_healing: bool,
    pub community_witnesses: u8,
    pub privacy_level: PrivacyLevel,
    pub timestamp: i64,
}

#[event]
pub struct RecoveryLogUbuntuVerified {
    pub patient: Pubkey,
    pub verifier: Pubkey,
    pub verification_notes: String,
    pub accuracy_score: u8,
    pub cultural_appropriate: bool,
    pub timestamp: i64,
}

#[event]
pub struct RecoveryLogElderBlessed {
    pub patient: Pubkey,
    pub elder: Pubkey,
    pub blessing_notes: String,
    pub ancestral_wisdom: String,
    pub ceremony_performed: bool,
    pub timestamp: i64,
}

#[event]
pub struct RecoveryDataContributedToResearch {
    pub patient: Pubkey,
    pub study_id: String,
    pub anonymization_level: AnonymizationLevel,
    pub data_fields: Vec<String>,
    pub zk_proof: String,
    pub timestamp: i64,
}

#[event]
pub struct MilestoneSummaryCreated {
    pub patient: Pubkey,
    pub treatment_pass: Pubkey,
    pub milestone_number: u8,
    pub overall_progress: u8,
    pub traditional_healing_score: Option<u8>,
    pub ubuntu_feedback: String,
    pub timestamp: i64,
}

#[event]
pub struct HealingStoryUpdated {
    pub patient: Pubkey,
    pub chapter_ipfs: String,
    pub cultural_elements: Vec<String>,
    pub ubuntu_lessons: String,
    pub community_impact: String,
    pub timestamp: i64,
}

#[error_code]
pub enum RecoveryLogError {
    #[msg("Invalid accuracy score - must be between 0 and 100")]
    InvalidAccuracyScore,
    #[msg("Recovery log not verified by Ubuntu community")]
    NotUbuntuVerified,
    #[msg("Insufficient privacy level for research contribution")]
    InsufficientPrivacyLevel,
    #[msg("Traditional healing notes required for cultural ceremony log")]
    TraditionalHealingNotesRequired,
    #[msg("Elder blessing required for sacred healing data")]
    ElderBlessingRequired,
}

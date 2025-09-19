use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer, MintTo};

/// $LIVES Token Economics for Ubuntu Health Platform
/// Implements token rewards for sponsorship, recovery logging, and community participation
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct LivesTokenConfig {
    /// $LIVES token mint address
    pub token_mint: Pubkey,
    /// Treasury account for token distribution
    pub treasury_account: Pubkey,
    /// Token distribution authority
    pub mint_authority: Pubkey,
    /// Current circulating supply
    pub circulating_supply: u64,
    /// Maximum supply cap
    pub max_supply: u64,
    /// Reward rates for different activities
    pub reward_rates: RewardRates,
    /// Ubuntu Health member bonus multipliers
    pub ubuntu_member_bonuses: UbuntuMemberBonuses,
    /// Token economics configuration
    pub economics_config: TokenEconomicsConfig,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct RewardRates {
    /// Base reward for sponsoring treatments (per $1 sponsored)
    pub sponsorship_base_reward: u64,
    /// Milestone completion bonus for patients
    pub milestone_completion_bonus: u64,
    /// Recovery logging reward (daily)
    pub recovery_logging_reward: u64,
    /// Healthcare provider verification reward
    pub provider_verification_reward: u64,
    /// Research data contribution reward
    pub research_contribution_reward: u64,
    /// Community engagement reward (voting, etc.)
    pub community_engagement_reward: u64,
    /// Referral bonus for bringing new users
    pub referral_bonus: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UbuntuMemberBonuses {
    /// Sponsorship bonus multiplier for Ubuntu Health members
    pub sponsorship_bonus_multiplier: u8, // e.g., 150 = 1.5x
    /// Recovery logging bonus for Ubuntu members
    pub recovery_logging_bonus_multiplier: u8,
    /// Provider verification bonus for Ubuntu members
    pub provider_verification_bonus_multiplier: u8,
    /// Community participation bonus
    pub community_participation_bonus_multiplier: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TokenEconomicsConfig {
    /// Inflation rate (annual percentage)
    pub annual_inflation_rate: u8,
    /// Burn rate for certain activities (percentage)
    pub burn_rate: u8,
    /// Staking rewards APY
    pub staking_apy: u8,
    /// Treasury allocation percentage
    pub treasury_allocation_percentage: u8,
    /// Community fund allocation percentage
    pub community_fund_percentage: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UserTokenAccount {
    /// User's wallet address
    pub user: Pubkey,
    /// Total $LIVES earned
    pub total_earned: u64,
    /// Total $LIVES spent
    pub total_spent: u64,
    /// Current $LIVES balance
    pub current_balance: u64,
    /// Staked $LIVES amount
    pub staked_amount: u64,
    /// Pending rewards to be claimed
    pub pending_rewards: u64,
    /// Last reward claim timestamp
    pub last_claim_timestamp: i64,
    /// User's Ubuntu Health membership status
    pub ubuntu_health_member: bool,
    /// Member since timestamp
    pub member_since: Option<i64>,
    /// Activity tracking for rewards
    pub activity_tracking: ActivityTracking,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ActivityTracking {
    /// Total treatments sponsored
    pub treatments_sponsored: u32,
    /// Total amount sponsored in USD
    pub total_sponsored_usd: u64,
    /// Recovery log entries made
    pub recovery_log_entries: u32,
    /// Milestones completed
    pub milestones_completed: u32,
    /// Verifications performed (for providers)
    pub verifications_performed: u32,
    /// Research contributions made
    pub research_contributions: u32,
    /// Community actions taken
    pub community_actions: u32,
    /// Referrals made
    pub referrals_made: u32,
}

/// Instructions for $LIVES token operations
#[derive(Accounts)]
pub struct InitializeLivesToken<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + std::mem::size_of::<LivesTokenConfigAccount>(),
        seeds = [b"lives_token_config"],
        bump
    )]
    pub config_account: Account<'info, LivesTokenConfigAccount>,
    
    pub token_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = payer,
        token::mint = token_mint,
        token::authority = config_account,
        seeds = [b"lives_treasury"],
        bump
    )]
    pub treasury_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(mut)]
    pub mint_authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(user: Pubkey)]
pub struct InitializeUserTokenAccount<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + std::mem::size_of::<UserTokenAccountData>(),
        seeds = [b"user_token_account", user.as_ref()],
        bump
    )]
    pub user_token_account: Account<'info, UserTokenAccountData>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(reward_type: RewardType, amount: u64)]
pub struct DistributeReward<'info> {
    #[account(
        seeds = [b"lives_token_config"],
        bump = config_account.bump
    )]
    pub config_account: Account<'info, LivesTokenConfigAccount>,
    
    #[account(
        mut,
        seeds = [b"lives_treasury"],
        bump
    )]
    pub treasury_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"user_token_account", recipient.key().as_ref()],
        bump = user_account.bump
    )]
    pub user_account: Account<'info, UserTokenAccountData>,
    
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
    
    /// The user receiving the reward
    pub recipient: AccountInfo<'info>,
    
    /// Authority that can distribute rewards (usually the program)
    pub reward_authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimPendingRewards<'info> {
    #[account(
        seeds = [b"lives_token_config"],
        bump = config_account.bump
    )]
    pub config_account: Account<'info, LivesTokenConfigAccount>,
    
    #[account(
        mut,
        seeds = [b"lives_treasury"],
        bump
    )]
    pub treasury_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"user_token_account", user.key().as_ref()],
        bump = user_account.bump
    )]
    pub user_account: Account<'info, UserTokenAccountData>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct LivesTokenConfigAccount {
    pub config: LivesTokenConfig,
    pub bump: u8,
}

#[account]
pub struct UserTokenAccountData {
    pub account: UserTokenAccount,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum RewardType {
    /// Reward for sponsoring a treatment
    Sponsorship,
    /// Reward for completing a milestone
    MilestoneCompletion,
    /// Daily reward for recovery logging
    RecoveryLogging,
    /// Reward for healthcare provider verification
    ProviderVerification,
    /// Reward for contributing research data
    ResearchContribution,
    /// Reward for community engagement
    CommunityEngagement,
    /// Bonus for referring new users
    ReferralBonus,
    /// Ubuntu Health membership bonus
    UbuntuMembershipBonus,
}

/// Core token economics implementations
impl LivesTokenConfigAccount {
    pub fn initialize(
        &mut self,
        token_mint: Pubkey,
        treasury_account: Pubkey,
        mint_authority: Pubkey,
        max_supply: u64,
    ) -> Result<()> {
        self.config = LivesTokenConfig {
            token_mint,
            treasury_account,
            mint_authority,
            circulating_supply: 0,
            max_supply,
            reward_rates: RewardRates {
                sponsorship_base_reward: 10, // 10 $LIVES per $1 sponsored
                milestone_completion_bonus: 100, // 100 $LIVES per milestone
                recovery_logging_reward: 5, // 5 $LIVES per daily log
                provider_verification_reward: 50, // 50 $LIVES per verification
                research_contribution_reward: 25, // 25 $LIVES per contribution
                community_engagement_reward: 10, // 10 $LIVES per community action
                referral_bonus: 500, // 500 $LIVES per referral
            },
            ubuntu_member_bonuses: UbuntuMemberBonuses {
                sponsorship_bonus_multiplier: 150, // 1.5x for Ubuntu members
                recovery_logging_bonus_multiplier: 120, // 1.2x for Ubuntu members
                provider_verification_bonus_multiplier: 130, // 1.3x for Ubuntu members
                community_participation_bonus_multiplier: 140, // 1.4x for Ubuntu members
            },
            economics_config: TokenEconomicsConfig {
                annual_inflation_rate: 5, // 5% annual inflation
                burn_rate: 2, // 2% burn on certain activities
                staking_apy: 8, // 8% APY for staking
                treasury_allocation_percentage: 20, // 20% to treasury
                community_fund_percentage: 10, // 10% to community fund
            },
        };
        Ok(())
    }

    pub fn calculate_reward(
        &self,
        reward_type: RewardType,
        base_amount: u64,
        is_ubuntu_member: bool,
    ) -> Result<u64> {
        let base_reward = match reward_type {
            RewardType::Sponsorship => {
                self.config.reward_rates.sponsorship_base_reward
                    .checked_mul(base_amount)
                    .ok_or(ProgramError::ArithmeticOverflow)?
            },
            RewardType::MilestoneCompletion => self.config.reward_rates.milestone_completion_bonus,
            RewardType::RecoveryLogging => self.config.reward_rates.recovery_logging_reward,
            RewardType::ProviderVerification => self.config.reward_rates.provider_verification_reward,
            RewardType::ResearchContribution => self.config.reward_rates.research_contribution_reward,
            RewardType::CommunityEngagement => self.config.reward_rates.community_engagement_reward,
            RewardType::ReferralBonus => self.config.reward_rates.referral_bonus,
            RewardType::UbuntuMembershipBonus => base_amount, // Direct amount for membership bonuses
        };

        if is_ubuntu_member {
            let multiplier = match reward_type {
                RewardType::Sponsorship => self.config.ubuntu_member_bonuses.sponsorship_bonus_multiplier,
                RewardType::RecoveryLogging => self.config.ubuntu_member_bonuses.recovery_logging_bonus_multiplier,
                RewardType::ProviderVerification => self.config.ubuntu_member_bonuses.provider_verification_bonus_multiplier,
                RewardType::CommunityEngagement => self.config.ubuntu_member_bonuses.community_participation_bonus_multiplier,
                _ => 100, // No bonus for other types
            };

            let bonus_reward = base_reward
                .checked_mul(multiplier as u64)
                .ok_or(ProgramError::ArithmeticOverflow)?
                .checked_div(100)
                .ok_or(ProgramError::ArithmeticOverflow)?;

            return Ok(bonus_reward);
        }

        Ok(base_reward)
    }
}

impl UserTokenAccountData {
    pub fn initialize(&mut self, user: Pubkey, ubuntu_health_member: bool) -> Result<()> {
        self.account = UserTokenAccount {
            user,
            total_earned: 0,
            total_spent: 0,
            current_balance: 0,
            staked_amount: 0,
            pending_rewards: 0,
            last_claim_timestamp: Clock::get()?.unix_timestamp,
            ubuntu_health_member,
            member_since: if ubuntu_health_member { Some(Clock::get()?.unix_timestamp) } else { None },
            activity_tracking: ActivityTracking {
                treatments_sponsored: 0,
                total_sponsored_usd: 0,
                recovery_log_entries: 0,
                milestones_completed: 0,
                verifications_performed: 0,
                research_contributions: 0,
                community_actions: 0,
                referrals_made: 0,
            },
        };
        Ok(())
    }

    pub fn add_pending_reward(&mut self, amount: u64) -> Result<()> {
        self.account.pending_rewards = self.account.pending_rewards
            .checked_add(amount)
            .ok_or(ProgramError::ArithmeticOverflow)?;
        Ok(())
    }

    pub fn claim_rewards(&mut self) -> Result<u64> {
        let reward_amount = self.account.pending_rewards;
        self.account.pending_rewards = 0;
        self.account.current_balance = self.account.current_balance
            .checked_add(reward_amount)
            .ok_or(ProgramError::ArithmeticOverflow)?;
        self.account.total_earned = self.account.total_earned
            .checked_add(reward_amount)
            .ok_or(ProgramError::ArithmeticOverflow)?;
        self.account.last_claim_timestamp = Clock::get()?.unix_timestamp;
        
        Ok(reward_amount)
    }

    pub fn update_activity(&mut self, reward_type: RewardType, amount: u64) -> Result<()> {
        match reward_type {
            RewardType::Sponsorship => {
                self.account.activity_tracking.treatments_sponsored += 1;
                self.account.activity_tracking.total_sponsored_usd = self.account.activity_tracking.total_sponsored_usd
                    .checked_add(amount)
                    .ok_or(ProgramError::ArithmeticOverflow)?;
            },
            RewardType::MilestoneCompletion => {
                self.account.activity_tracking.milestones_completed += 1;
            },
            RewardType::RecoveryLogging => {
                self.account.activity_tracking.recovery_log_entries += 1;
            },
            RewardType::ProviderVerification => {
                self.account.activity_tracking.verifications_performed += 1;
            },
            RewardType::ResearchContribution => {
                self.account.activity_tracking.research_contributions += 1;
            },
            RewardType::CommunityEngagement => {
                self.account.activity_tracking.community_actions += 1;
            },
            RewardType::ReferralBonus => {
                self.account.activity_tracking.referrals_made += 1;
            },
            _ => {} // No activity tracking for other types
        }
        Ok(())
    }
}

/// Instruction implementations
pub fn initialize_lives_token(
    ctx: Context<InitializeLivesToken>,
    max_supply: u64,
) -> Result<()> {
    let config_account = &mut ctx.accounts.config_account;
    config_account.bump = *ctx.bumps.get("config_account").unwrap();
    
    config_account.initialize(
        ctx.accounts.token_mint.key(),
        ctx.accounts.treasury_account.key(),
        ctx.accounts.mint_authority.key(),
        max_supply,
    )?;

    emit!(LivesTokenInitialized {
        token_mint: ctx.accounts.token_mint.key(),
        treasury_account: ctx.accounts.treasury_account.key(),
        max_supply,
    });

    Ok(())
}

pub fn initialize_user_token_account(
    ctx: Context<InitializeUserTokenAccount>,
    user: Pubkey,
    ubuntu_health_member: bool,
) -> Result<()> {
    let user_account = &mut ctx.accounts.user_token_account;
    user_account.bump = *ctx.bumps.get("user_token_account").unwrap();
    
    user_account.initialize(user, ubuntu_health_member)?;

    emit!(UserTokenAccountInitialized {
        user,
        ubuntu_health_member,
    });

    Ok(())
}

pub fn distribute_reward(
    ctx: Context<DistributeReward>,
    reward_type: RewardType,
    base_amount: u64,
) -> Result<()> {
    let config_account = &ctx.accounts.config_account;
    let user_account = &mut ctx.accounts.user_account;
    
    // Calculate reward amount including Ubuntu Health member bonuses
    let reward_amount = config_account.calculate_reward(
        reward_type.clone(),
        base_amount,
        user_account.account.ubuntu_health_member,
    )?;

    // Add to pending rewards
    user_account.add_pending_reward(reward_amount)?;
    
    // Update activity tracking
    user_account.update_activity(reward_type.clone(), base_amount)?;

    emit!(RewardDistributed {
        recipient: ctx.accounts.recipient.key(),
        reward_type,
        base_amount,
        reward_amount,
        ubuntu_member_bonus: user_account.account.ubuntu_health_member,
    });

    Ok(())
}

pub fn claim_pending_rewards(ctx: Context<ClaimPendingRewards>) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;
    let reward_amount = user_account.claim_rewards()?;

    if reward_amount > 0 {
        // Create PDA seeds for treasury authority
        let seeds = &[
            b"lives_token_config",
            &[ctx.accounts.config_account.bump],
        ];
        let signer = &[&seeds[..]];

        // Transfer tokens from treasury to user
        let cpi_accounts = Transfer {
            from: ctx.accounts.treasury_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.config_account.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, reward_amount)?;
    }

    emit!(RewardsClaimed {
        user: ctx.accounts.user.key(),
        reward_amount,
    });

    Ok(())
}

/// Events for token economics
#[event]
pub struct LivesTokenInitialized {
    pub token_mint: Pubkey,
    pub treasury_account: Pubkey,
    pub max_supply: u64,
}

#[event]
pub struct UserTokenAccountInitialized {
    pub user: Pubkey,
    pub ubuntu_health_member: bool,
}

#[event]
pub struct RewardDistributed {
    pub recipient: Pubkey,
    pub reward_type: RewardType,
    pub base_amount: u64,
    pub reward_amount: u64,
    pub ubuntu_member_bonus: bool,
}

#[event]
pub struct RewardsClaimed {
    pub user: Pubkey,
    pub reward_amount: u64,
}

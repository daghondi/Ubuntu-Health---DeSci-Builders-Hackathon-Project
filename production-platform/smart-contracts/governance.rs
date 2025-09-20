// Ubuntu Health - Decentralized Governance Contract
// Community Governance for Treatment Protocols and Platform Decisions
// Built on Solana using Anchor Framework

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("UbuntuHealthGovernance1111111111111111111");

#[program]
pub mod ubuntu_health_governance {
    use super::*;

    /// Create a new governance proposal
    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        proposal_id: String,
        title: String,
        description: String,
        proposal_type: ProposalType,
        voting_period_days: u8,
        required_quorum: u64, // Minimum $LIVES tokens needed to vote
        execution_data: Option<String>, // IPFS hash of execution instructions
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let proposer = &ctx.accounts.proposer;
        
        require!(voting_period_days >= 3 && voting_period_days <= 30, GovernanceError::InvalidVotingPeriod);
        require!(required_quorum >= 10000 * 10_u64.pow(6), GovernanceError::QuorumTooLow); // Minimum 10,000 $LIVES
        
        // Require minimum stake to create proposal
        let min_proposal_stake = match proposal_type {
            ProposalType::TreatmentProtocol => 50000 * 10_u64.pow(6), // 50,000 $LIVES
            ProposalType::PlatformUpgrade => 100000 * 10_u64.pow(6), // 100,000 $LIVES
            ProposalType::TreasuryAllocation => 25000 * 10_u64.pow(6), // 25,000 $LIVES
            ProposalType::ProviderVerification => 10000 * 10_u64.pow(6), // 10,000 $LIVES
            ProposalType::ResearchPartnership => 30000 * 10_u64.pow(6), // 30,000 $LIVES
        };
        
        // Lock proposer's stake
        let cpi_accounts = Transfer {
            from: ctx.accounts.proposer_token_account.to_account_info(),
            to: ctx.accounts.governance_treasury.to_account_info(),
            authority: proposer.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, min_proposal_stake)?;
        
        proposal.proposal_id = proposal_id;
        proposal.title = title;
        proposal.description = description;
        proposal.proposal_type = proposal_type;
        proposal.proposer = proposer.key();
        proposal.creation_timestamp = Clock::get()?.unix_timestamp;
        proposal.voting_end_timestamp = Clock::get()?.unix_timestamp + (voting_period_days as i64 * 24 * 60 * 60);
        proposal.required_quorum = required_quorum;
        proposal.execution_data = execution_data;
        proposal.status = ProposalStatus::Active;
        proposal.proposer_stake = min_proposal_stake;
        proposal.votes_for = 0;
        proposal.votes_against = 0;
        proposal.total_votes = 0;
        
        msg!("Governance proposal created: {} with {} $LIVES stake", proposal.title, min_proposal_stake);
        Ok(())
    }

    /// Cast a vote on a proposal
    pub fn cast_vote(
        ctx: Context<CastVote>,
        vote_choice: VoteChoice,
        voting_power: u64, // Amount of $LIVES tokens to use for voting
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let vote_record = &mut ctx.accounts.vote_record;
        let voter = &ctx.accounts.voter;
        
        require!(proposal.status == ProposalStatus::Active, GovernanceError::ProposalNotActive);
        require!(
            Clock::get()?.unix_timestamp <= proposal.voting_end_timestamp,
            GovernanceError::VotingPeriodEnded
        );
        require!(voting_power > 0, GovernanceError::InvalidVotingPower);
        
        // Lock voting tokens during voting period
        let cpi_accounts = Transfer {
            from: ctx.accounts.voter_token_account.to_account_info(),
            to: ctx.accounts.voting_escrow.to_account_info(),
            authority: voter.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, voting_power)?;
        
        // Record vote
        vote_record.proposal = proposal.key();
        vote_record.voter = voter.key();
        vote_record.vote_choice = vote_choice;
        vote_record.voting_power = voting_power;
        vote_record.vote_timestamp = Clock::get()?.unix_timestamp;
        
        // Update proposal vote counts
        match vote_choice {
            VoteChoice::For => proposal.votes_for += voting_power,
            VoteChoice::Against => proposal.votes_against += voting_power,
        }
        proposal.total_votes += voting_power;
        
        msg!("Vote cast: {} with {} $LIVES voting power", 
             match vote_choice { VoteChoice::For => "FOR", VoteChoice::Against => "AGAINST" },
             voting_power);
        Ok(())
    }

    /// Execute a passed proposal
    pub fn execute_proposal(
        ctx: Context<ExecuteProposal>,
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        
        require!(proposal.status == ProposalStatus::Active, GovernanceError::ProposalNotActive);
        require!(
            Clock::get()?.unix_timestamp > proposal.voting_end_timestamp,
            GovernanceError::VotingPeriodNotEnded
        );
        require!(proposal.total_votes >= proposal.required_quorum, GovernanceError::QuorumNotMet);
        
        // Check if proposal passed (simple majority)
        if proposal.votes_for > proposal.votes_against {
            proposal.status = ProposalStatus::Passed;
            
            // Execute based on proposal type
            match proposal.proposal_type {
                ProposalType::TreatmentProtocol => {
                    // Update treatment protocol registry
                    msg!("Treatment protocol proposal passed - updating registry");
                },
                ProposalType::PlatformUpgrade => {
                    // Schedule platform upgrade
                    msg!("Platform upgrade proposal passed - scheduling upgrade");
                },
                ProposalType::TreasuryAllocation => {
                    // Allocate treasury funds
                    msg!("Treasury allocation proposal passed - executing allocation");
                },
                ProposalType::ProviderVerification => {
                    // Update provider verification criteria
                    msg!("Provider verification proposal passed - updating criteria");
                },
                ProposalType::ResearchPartnership => {
                    // Establish research partnership
                    msg!("Research partnership proposal passed - establishing partnership");
                },
            }
            
            // Return proposer stake + bonus for successful proposal
            let return_amount = proposal.proposer_stake + (proposal.proposer_stake * 10 / 100); // 10% bonus
            
            let treasury_seeds = &[
                b"governance_treasury",
                &[ctx.bumps.governance_treasury],
            ];
            let signer = &[&treasury_seeds[..]];
            
            let cpi_accounts = Transfer {
                from: ctx.accounts.governance_treasury.to_account_info(),
                to: ctx.accounts.proposer_token_account.to_account_info(),
                authority: ctx.accounts.governance_treasury.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
            token::transfer(cpi_ctx, return_amount)?;
            
        } else {
            proposal.status = ProposalStatus::Rejected;
            
            // Slash proposer stake for rejected proposal
            let slash_amount = proposal.proposer_stake * 50 / 100; // 50% slash
            let return_amount = proposal.proposer_stake - slash_amount;
            
            // Return remaining stake to proposer
            let treasury_seeds = &[
                b"governance_treasury",
                &[ctx.bumps.governance_treasury],
            ];
            let signer = &[&treasury_seeds[..]];
            
            let cpi_accounts = Transfer {
                from: ctx.accounts.governance_treasury.to_account_info(),
                to: ctx.accounts.proposer_token_account.to_account_info(),
                authority: ctx.accounts.governance_treasury.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
            token::transfer(cpi_ctx, return_amount)?;
            
            msg!("Proposal rejected - {} $LIVES slashed from proposer stake", slash_amount);
        }
        
        proposal.execution_timestamp = Clock::get()?.unix_timestamp;
        Ok(())
    }

    /// Claim voting rewards for participation
    pub fn claim_voting_rewards(
        ctx: Context<ClaimVotingRewards>,
    ) -> Result<()> {
        let vote_record = &mut ctx.accounts.vote_record;
        let proposal = &ctx.accounts.proposal;
        let voter = &ctx.accounts.voter;
        
        require!(
            proposal.status == ProposalStatus::Passed || proposal.status == ProposalStatus::Rejected,
            GovernanceError::ProposalNotFinalized
        );
        require!(vote_record.voter == voter.key(), GovernanceError::UnauthorizedClaim);
        require!(!vote_record.rewards_claimed, GovernanceError::RewardsAlreadyClaimed);
        
        // Return locked voting tokens
        let escrow_seeds = &[
            b"voting_escrow",
            proposal.key().as_ref(),
            voter.key().as_ref(),
            &[ctx.bumps.voting_escrow],
        ];
        let signer = &[&escrow_seeds[..]];
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.voting_escrow.to_account_info(),
            to: ctx.accounts.voter_token_account.to_account_info(),
            authority: ctx.accounts.voting_escrow.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, vote_record.voting_power)?;
        
        // Calculate participation reward (1% of voting power)
        let participation_reward = vote_record.voting_power * 1 / 100;
        
        // Additional reward for voting on the winning side
        let winning_side_bonus = if 
            (proposal.status == ProposalStatus::Passed && vote_record.vote_choice == VoteChoice::For) ||
            (proposal.status == ProposalStatus::Rejected && vote_record.vote_choice == VoteChoice::Against)
        {
            vote_record.voting_power * 2 / 100 // 2% bonus
        } else {
            0
        };
        
        let total_reward = participation_reward + winning_side_bonus;
        
        if total_reward > 0 {
            let treasury_seeds = &[
                b"governance_treasury",
                &[ctx.bumps.governance_treasury],
            ];
            let signer = &[&treasury_seeds[..]];
            
            let cpi_accounts = Transfer {
                from: ctx.accounts.governance_treasury.to_account_info(),
                to: ctx.accounts.voter_token_account.to_account_info(),
                authority: ctx.accounts.governance_treasury.to_account_info(),
            };
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
            token::transfer(cpi_ctx, total_reward)?;
        }
        
        vote_record.rewards_claimed = true;
        vote_record.reward_amount = total_reward;
        
        msg!("Voting rewards claimed: {} $LIVES", total_reward);
        Ok(())
    }
}

// Account Contexts
#[derive(Accounts)]
#[instruction(proposal_id: String)]
pub struct CreateProposal<'info> {
    #[account(
        init,
        payer = proposer,
        space = 8 + Proposal::INIT_SPACE,
        seeds = [b"proposal", proposal_id.as_bytes()],
        bump
    )]
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub proposer: Signer<'info>,
    
    #[account(mut)]
    pub proposer_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"governance_treasury"],
        bump
    )]
    pub governance_treasury: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    
    #[account(
        init,
        payer = voter,
        space = 8 + VoteRecord::INIT_SPACE,
        seeds = [b"vote", proposal.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub vote_record: Account<'info, VoteRecord>,
    
    #[account(mut)]
    pub voter: Signer<'info>,
    
    #[account(mut)]
    pub voter_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = voter,
        token::mint = lives_mint,
        token::authority = voting_escrow,
        seeds = [b"voting_escrow", proposal.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub voting_escrow: Account<'info, TokenAccount>,
    
    pub lives_mint: Account<'info, anchor_spl::token::Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub proposer_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"governance_treasury"],
        bump
    )]
    pub governance_treasury: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimVotingRewards<'info> {
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub vote_record: Account<'info, VoteRecord>,
    
    #[account(mut)]
    pub voter: Signer<'info>,
    
    #[account(mut)]
    pub voter_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"voting_escrow", proposal.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub voting_escrow: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"governance_treasury"],
        bump
    )]
    pub governance_treasury: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

// Data Structures
#[account]
pub struct Proposal {
    pub proposal_id: String,
    pub title: String,
    pub description: String,
    pub proposal_type: ProposalType,
    pub proposer: Pubkey,
    pub creation_timestamp: i64,
    pub voting_end_timestamp: i64,
    pub execution_timestamp: i64,
    pub required_quorum: u64,
    pub execution_data: Option<String>,
    pub status: ProposalStatus,
    pub proposer_stake: u64,
    pub votes_for: u64,
    pub votes_against: u64,
    pub total_votes: u64,
}

#[account]
pub struct VoteRecord {
    pub proposal: Pubkey,
    pub voter: Pubkey,
    pub vote_choice: VoteChoice,
    pub voting_power: u64,
    pub vote_timestamp: i64,
    pub rewards_claimed: bool,
    pub reward_amount: u64,
}

// Enums
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProposalType {
    TreatmentProtocol,      // Add/modify treatment protocols
    PlatformUpgrade,        // Platform code upgrades
    TreasuryAllocation,     // Treasury fund allocation
    ProviderVerification,   // Medical provider verification criteria
    ResearchPartnership,    // New research partnerships
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProposalStatus {
    Active,
    Passed,
    Rejected,
    Executed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum VoteChoice {
    For,
    Against,
}

// Space calculations
impl Proposal {
    const INIT_SPACE: usize = 64 + 128 + 512 + 32 + 32 + 8 + 8 + 8 + 8 + 128 + 32 + 8 + 8 + 8 + 8;
}

impl VoteRecord {
    const INIT_SPACE: usize = 32 + 32 + 32 + 8 + 8 + 1 + 8;
}

// Error Codes
#[error_code]
pub enum GovernanceError {
    #[msg("Invalid voting period. Must be between 3-30 days")]
    InvalidVotingPeriod,
    #[msg("Quorum too low. Minimum 10,000 $LIVES required")]
    QuorumTooLow,
    #[msg("Proposal is not active")]
    ProposalNotActive,
    #[msg("Voting period has ended")]
    VotingPeriodEnded,
    #[msg("Invalid voting power")]
    InvalidVotingPower,
    #[msg("Voting period has not ended")]
    VotingPeriodNotEnded,
    #[msg("Quorum not met")]
    QuorumNotMet,
    #[msg("Proposal not finalized")]
    ProposalNotFinalized,
    #[msg("Unauthorized reward claim")]
    UnauthorizedClaim,
    #[msg("Rewards already claimed")]
    RewardsAlreadyClaimed,
}
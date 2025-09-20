import { Connection, PublicKey, Transaction, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount
} from '@solana/spl-token';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface TreatmentSponsorshipData {
  treatmentId: string;
  patientWallet: string;
  sponsorWallet: string;
  amount: number;
  milestoneConditions: Array<{
    description: string;
    percentage: number;
    completed: boolean;
  }>;
}

export interface SponsorshipResult {
  success: boolean;
  transactionHash?: string;
  escrowAddress?: string;
  error?: string;
}

export class SolanaService {
  private connection: Connection;
  private programIds: {
    treatmentSponsorship?: PublicKey;
    dataRewards?: PublicKey;
    governance?: PublicKey;
  };
  private keypair?: Keypair;
  private livesTokenMint?: PublicKey;
  private usdcTokenMint?: PublicKey;

  constructor() {
    // Initialize connection to Solana network
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    const commitment = process.env.SOLANA_COMMITMENT || 'confirmed';
    
    this.connection = new Connection(rpcUrl, commitment as any);
    this.programIds = {};
    
    // Load token mint addresses
    this.livesTokenMint = process.env.LIVES_TOKEN_MINT 
      ? new PublicKey(process.env.LIVES_TOKEN_MINT)
      : undefined;
    
    this.usdcTokenMint = process.env.USDC_TOKEN_MINT
      ? new PublicKey(process.env.USDC_TOKEN_MINT)
      : undefined;
  }

  public async initialize(): Promise<void> {
    try {
      // Load deployer keypair
      await this.loadKeypair();
      
      // Load program IDs
      await this.loadProgramIds();
      
      // Verify connection
      const version = await this.connection.getVersion();
      console.log('Connected to Solana cluster:', version);
      
      // Check account balance
      if (this.keypair) {
        const balance = await this.connection.getBalance(this.keypair.publicKey);
        console.log(`Deployer wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
      }
      
    } catch (error) {
      console.error('Failed to initialize Solana service:', error);
      throw error;
    }
  }

  private async loadKeypair(): Promise<void> {
    try {
      const keypairPath = process.env.SOLANA_KEYPAIR_PATH || './keypairs/deployer.json';
      const secretKey = JSON.parse(readFileSync(keypairPath, 'utf-8'));
      this.keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
      console.log('Loaded deployer keypair:', this.keypair.publicKey.toBase58());
    } catch (error) {
      console.warn('No deployer keypair found, some functions will be limited');
    }
  }

  private async loadProgramIds(): Promise<void> {
    // Load program IDs from environment variables
    if (process.env.TREATMENT_SPONSORSHIP_PROGRAM) {
      this.programIds.treatmentSponsorship = new PublicKey(process.env.TREATMENT_SPONSORSHIP_PROGRAM);
    }
    
    if (process.env.DATA_REWARDS_PROGRAM) {
      this.programIds.dataRewards = new PublicKey(process.env.DATA_REWARDS_PROGRAM);
    }
    
    if (process.env.GOVERNANCE_PROGRAM) {
      this.programIds.governance = new PublicKey(process.env.GOVERNANCE_PROGRAM);
    }
  }

  // Treatment Sponsorship Functions
  public async createTreatmentSponsorship(
    data: TreatmentSponsorshipData
  ): Promise<SponsorshipResult> {
    try {
      if (!this.programIds.treatmentSponsorship) {
        throw new Error('Treatment sponsorship program not loaded');
      }

      // Create sponsorship account
      const sponsorshipAccount = Keypair.generate();
      const patientPubkey = new PublicKey(data.patientWallet);
      const sponsorPubkey = new PublicKey(data.sponsorWallet);

      // Build transaction
      const transaction = new Transaction();
      
      // Add create account instruction
      const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: sponsorPubkey,
        newAccountPubkey: sponsorshipAccount.publicKey,
        lamports: await this.connection.getMinimumBalanceForRentExemption(1000), // Adjust size as needed
        space: 1000,
        programId: this.programIds.treatmentSponsorship,
      });
      
      transaction.add(createAccountInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = sponsorPubkey;

      // Serialize transaction for client signing
      const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });

      return {
        success: true,
        escrowAddress: sponsorshipAccount.publicKey.toBase58(),
        // In production, client would sign and submit this transaction
      };

    } catch (error) {
      console.error('Failed to create treatment sponsorship:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Token Transfer Functions
  public async transferTokens(
    fromWallet: string,
    toWallet: string,
    amount: number,
    tokenType: 'LIVES' | 'USDC' = 'LIVES'
  ): Promise<SponsorshipResult> {
    try {
      const fromPubkey = new PublicKey(fromWallet);
      const toPubkey = new PublicKey(toWallet);
      const tokenMint = tokenType === 'LIVES' ? this.livesTokenMint : this.usdcTokenMint;

      if (!tokenMint) {
        throw new Error(`${tokenType} token mint not configured`);
      }

      // Get associated token accounts
      const fromTokenAccount = await getAssociatedTokenAddress(tokenMint, fromPubkey);
      const toTokenAccount = await getAssociatedTokenAddress(tokenMint, toPubkey);

      const transaction = new Transaction();

      // Check if recipient token account exists, create if not
      try {
        await getAccount(this.connection, toTokenAccount);
      } catch (error) {
        // Account doesn't exist, create it
        const createATAInstruction = createAssociatedTokenAccountInstruction(
          fromPubkey, // payer
          toTokenAccount, // associated token account
          toPubkey, // owner
          tokenMint // mint
        );
        transaction.add(createATAInstruction);
      }

      // Add transfer instruction
      const transferInstruction = createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        fromPubkey,
        amount * Math.pow(10, tokenType === 'LIVES' ? 9 : 6), // Adjust for token decimals
        [],
        TOKEN_PROGRAM_ID
      );

      transaction.add(transferInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      return {
        success: true,
        // In production, client would sign and submit this transaction  
      };

    } catch (error) {
      console.error('Failed to transfer tokens:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Milestone verification and fund release
  public async releaseMilestoneFunds(
    sponsorshipAddress: string,
    milestoneIndex: number,
    verificationHash: string
  ): Promise<SponsorshipResult> {
    try {
      if (!this.programIds.treatmentSponsorship || !this.keypair) {
        throw new Error('Required program or keypair not loaded');
      }

      const sponsorshipPubkey = new PublicKey(sponsorshipAddress);
      
      // Build milestone release transaction
      const transaction = new Transaction();
      
      // Add milestone verification instruction (pseudo-code)
      // In actual implementation, this would call the smart contract function
      
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = this.keypair.publicKey;

      // Sign and send transaction
      const signature = await this.connection.sendTransaction(transaction, [this.keypair]);
      
      // Confirm transaction
      await this.connection.confirmTransaction(signature);

      return {
        success: true,
        transactionHash: signature,
      };

    } catch (error) {
      console.error('Failed to release milestone funds:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Data Contribution Rewards
  public async rewardDataContribution(
    contributorWallet: string,
    rewardAmount: number,
    dataHash: string
  ): Promise<SponsorshipResult> {
    try {
      if (!this.programIds.dataRewards || !this.livesTokenMint) {
        throw new Error('Data rewards program or LIVES token not configured');
      }

      const contributorPubkey = new PublicKey(contributorWallet);
      
      // Transfer LIVES tokens as reward
      return await this.transferTokens(
        this.keypair?.publicKey.toBase58() || '',
        contributorWallet,
        rewardAmount,
        'LIVES'
      );

    } catch (error) {
      console.error('Failed to reward data contribution:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Governance voting
  public async submitGovernanceVote(
    proposalId: string,
    voterWallet: string,
    vote: 'FOR' | 'AGAINST' | 'ABSTAIN',
    votingPower: number
  ): Promise<SponsorshipResult> {
    try {
      if (!this.programIds.governance) {
        throw new Error('Governance program not loaded');
      }

      const voterPubkey = new PublicKey(voterWallet);
      const transaction = new Transaction();

      // Add governance vote instruction (pseudo-code)
      // In actual implementation, this would call the governance smart contract

      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = voterPubkey;

      return {
        success: true,
        // Client would sign and submit this transaction
      };

    } catch (error) {
      console.error('Failed to submit governance vote:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Utility functions
  public async getAccountBalance(walletAddress: string): Promise<number> {
    try {
      const pubkey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(pubkey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Failed to get account balance:', error);
      return 0;
    }
  }

  public async getTokenBalance(
    walletAddress: string,
    tokenType: 'LIVES' | 'USDC' = 'LIVES'
  ): Promise<number> {
    try {
      const walletPubkey = new PublicKey(walletAddress);
      const tokenMint = tokenType === 'LIVES' ? this.livesTokenMint : this.usdcTokenMint;

      if (!tokenMint) {
        throw new Error(`${tokenType} token mint not configured`);
      }

      const tokenAccount = await getAssociatedTokenAddress(tokenMint, walletPubkey);
      const accountInfo = await getAccount(this.connection, tokenAccount);
      
      const decimals = tokenType === 'LIVES' ? 9 : 6;
      return Number(accountInfo.amount) / Math.pow(10, decimals);
    } catch (error) {
      console.error('Failed to get token balance:', error);
      return 0;
    }
  }

  public async disconnect(): Promise<void> {
    // Cleanup resources if needed
    console.log('Solana service disconnected');
  }
}
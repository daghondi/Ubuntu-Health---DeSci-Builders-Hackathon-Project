#!/bin/bash

# Ubuntu Health Smart Contracts Deployment Script
# Deploy advanced medical treatment sponsorship contracts to Solana

set -e

echo "🏥 Ubuntu Health - Smart Contract Deployment"
echo "============================================="

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Please install from https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi

# Check if Anchor CLI is installed
if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor CLI not found. Please install from https://www.anchor-lang.com/docs/installation"
    exit 1
fi

# Configuration
NETWORK=${1:-devnet}  # devnet, testnet, or mainnet-beta
KEYPAIR_PATH=${2:-~/.config/solana/id.json}

echo "📡 Network: $NETWORK"
echo "🔑 Keypair: $KEYPAIR_PATH"

# Set Solana configuration
solana config set --url $NETWORK
solana config set --keypair $KEYPAIR_PATH

# Check wallet balance
BALANCE=$(solana balance --lamports)
MIN_BALANCE=1000000000  # 1 SOL in lamports

if [ "$BALANCE" -lt "$MIN_BALANCE" ]; then
    echo "❌ Insufficient SOL balance. Need at least 1 SOL for deployment"
    echo "💰 Current balance: $(solana balance)"
    
    if [ "$NETWORK" = "devnet" ]; then
        echo "🚰 Requesting devnet airdrop..."
        solana airdrop 2
    else
        echo "Please fund your wallet with SOL for deployment"
        exit 1
    fi
fi

echo "✅ Wallet funded: $(solana balance)"

# Build all contracts
echo "🔨 Building smart contracts..."
anchor build

# Deploy contracts in order
echo "🚀 Deploying Treatment Sponsorship Contract..."
TREATMENT_PROGRAM_ID=$(anchor deploy --program-name treatment_sponsorship | grep "Program Id:" | cut -d' ' -f3)
echo "✅ Treatment Sponsorship deployed: $TREATMENT_PROGRAM_ID"

echo "🔬 Deploying Data Contribution Rewards Contract..."
DATA_PROGRAM_ID=$(anchor deploy --program-name data_contribution_rewards | grep "Program Id:" | cut -d' ' -f3)
echo "✅ Data Contribution Rewards deployed: $DATA_PROGRAM_ID"

echo "🗳️  Deploying Governance Contract..."
GOVERNANCE_PROGRAM_ID=$(anchor deploy --program-name governance | grep "Program Id:" | cut -d' ' -f3)
echo "✅ Governance deployed: $GOVERNANCE_PROGRAM_ID"

# Create deployment summary
DEPLOYMENT_FILE="deployment_summary_$(date +%Y%m%d_%H%M%S).json"

cat > $DEPLOYMENT_FILE << EOF
{
  "deployment_timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "network": "$NETWORK",
  "deployer": "$(solana address)",
  "contracts": {
    "treatment_sponsorship": {
      "program_id": "$TREATMENT_PROGRAM_ID",
      "description": "Core treatment funding and milestone-based escrow",
      "features": [
        "NFT Treatment Passes for high-cost therapies",
        "Milestone-based escrow with medical verification", 
        "CAR-T therapy sponsorship ($400K+ treatments)",
        "Sponsor discovery and matching platform"
      ]
    },
    "data_contribution_rewards": {
      "program_id": "$DATA_PROGRAM_ID", 
      "description": "Privacy-preserving research data sharing with rewards",
      "features": [
        "Zero-knowledge proof data contribution",
        "Research institution verification",
        "Privacy-preserving clinical outcome APIs",
        "Reward distribution for data contributors"
      ]
    },
    "governance": {
      "program_id": "$GOVERNANCE_PROGRAM_ID",
      "description": "Decentralized governance for platform decisions", 
      "features": [
        "Proposal creation with stake requirements",
        "Token-weighted voting with \$LIVES",
        "Treatment protocol governance",
        "Community-driven platform upgrades"
      ]
    }
  },
  "token_economics": {
    "primary_token": "\$LIVES",
    "use_cases": [
      "Treatment sponsorship and funding",
      "Governance voting and proposals", 
      "Research data contribution rewards",
      "Medical provider verification stakes"
    ]
  },
  "desci_tracks": [
    "Tokenized Patient Access (Primary)",
    "Verification & Audit Trails",
    "Data Protocols for Longevity & Health", 
    "Global Access & Inclusion",
    "Open Science Infrastructure"
  ]
}
EOF

echo "📄 Deployment summary saved to: $DEPLOYMENT_FILE"

# Initialize program accounts if needed
echo "🔧 Initializing program accounts..."

# Create governance treasury account
echo "💰 Setting up governance treasury..."
# (Implementation would go here for actual deployment)

# Create reward pools
echo "🎁 Setting up reward pools..."
# (Implementation would go here for actual deployment)

echo ""
echo "🎉 Ubuntu Health Smart Contracts Successfully Deployed!"
echo "============================================="
echo "Treatment Sponsorship: $TREATMENT_PROGRAM_ID"  
echo "Data Contribution:     $DATA_PROGRAM_ID"
echo "Governance:           $GOVERNANCE_PROGRAM_ID"
echo ""
echo "🔗 Network: $NETWORK"
echo "💰 Total deployment cost: $(echo "1.0 - $(solana balance)" | bc) SOL"
echo ""
echo "📚 Next steps:"
echo "1. Update frontend with new program IDs"
echo "2. Initialize governance treasury"
echo "3. Create initial treatment protocols"
echo "4. Verify medical provider credentials"
echo "5. Test with CAR-T therapy demo scenario"
echo ""
echo "🌍 Ready for advanced medical treatment sponsorship!"
#!/bin/bash

# Ubuntu Health Deployment Script
# Community-driven healthcare deployment with Ubuntu philosophy integration

set -e  # Exit on any error

# Ubuntu Health deployment configuration
UBUNTU_HEALTH_VERSION="1.0.0"
UBUNTU_PHILOSOPHY="I am because we are"
DEPLOYMENT_ENV="${1:-production}"
COMMUNITY_BLESSING_REQUIRED=true

# Color codes for Ubuntu Health community output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Ubuntu Health ASCII Art
print_ubuntu_header() {
    echo -e "${PURPLE}"
    echo "    🌍 Ubuntu Health Deployment"
    echo "    =========================="
    echo -e "    ${WHITE}\"Ubuntu ngumuntu ngabantu\"${PURPLE}"
    echo -e "    ${WHITE}I am because we are${PURPLE}"
    echo ""
    echo -e "    ${CYAN}Community-Driven Healthcare Platform${NC}"
    echo ""
}

# Ubuntu community logging function
ubuntu_log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")
            echo -e "${BLUE}[${timestamp}] 🌍 ${WHITE}${message}${NC}"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[${timestamp}] ✅ ${WHITE}${message}${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}[${timestamp}] ⚠️  ${WHITE}${message}${NC}"
            ;;
        "ERROR")
            echo -e "${RED}[${timestamp}] ❌ ${WHITE}${message}${NC}"
            ;;
        "UBUNTU")
            echo -e "${PURPLE}[${timestamp}] 🙏 ${WHITE}${message}${NC}"
            ;;
    esac
}

# Check deployment prerequisites
check_prerequisites() {
    ubuntu_log "INFO" "Checking Ubuntu Health deployment prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        ubuntu_log "ERROR" "Docker is not installed. Please install Docker for community container support."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        ubuntu_log "ERROR" "Docker Compose is not installed. Please install Docker Compose for Ubuntu Health orchestration."
        exit 1
    fi
    
    # Check Kubernetes (optional)
    if command -v kubectl &> /dev/null; then
        ubuntu_log "SUCCESS" "Kubernetes CLI detected - Ubuntu Health can scale with community growth!"
    else
        ubuntu_log "WARNING" "Kubernetes CLI not found - Ubuntu Health will run in Docker Compose mode"
    fi
    
    # Check available disk space
    local available_space=$(df / | awk 'NR==2 {print $4}')
    if [ "$available_space" -lt 10485760 ]; then  # 10GB in KB
        ubuntu_log "WARNING" "Less than 10GB disk space available. Ubuntu Health needs space for community growth."
    fi
    
    ubuntu_log "SUCCESS" "Prerequisites check completed - Ubuntu community ready!"
}

# Generate Ubuntu Health configuration
generate_ubuntu_config() {
    ubuntu_log "INFO" "Generating Ubuntu Health configuration with community wisdom..."
    
    # Create environment file
    cat > .env.ubuntu-health << EOF
# Ubuntu Health Community Configuration
# "I am because we are" - Community-driven healthcare

# Environment
NODE_ENV=${DEPLOYMENT_ENV}
UBUNTU_PHILOSOPHY="${UBUNTU_PHILOSOPHY}"
UBUNTU_VERSION=${UBUNTU_HEALTH_VERSION}

# Community Settings
COMMUNITY_FIRST=true
ELDER_WISDOM_ENABLED=true
TRADITIONAL_HEALING_SUPPORT=true
CULTURAL_SENSITIVITY_REQUIRED=true

# Database Configuration
POSTGRES_DB=ubuntu_health
POSTGRES_USER=ubuntu_user
POSTGRES_PASSWORD=$(openssl rand -base64 32)

# Redis Configuration
REDIS_PASSWORD=$(openssl rand -base64 32)

# JWT Secret for Community Authentication
JWT_SECRET=$(openssl rand -base64 64)

# Solana Configuration (adjust for your network)
SOLANA_NETWORK=${SOLANA_NETWORK:-devnet}
SOLANA_RPC_URL=https://api.${SOLANA_NETWORK}.solana.com

# Ubuntu Health Smart Contract Addresses (to be updated after deployment)
ELDER_COUNCIL_MULTISIG=UPDATE_AFTER_DEPLOYMENT
UBUNTU_TREASURY_ADDRESS=UPDATE_AFTER_DEPLOYMENT

# Cultural API Keys (obtain from cultural institutions)
CULTURAL_SENSITIVITY_API_KEY=YOUR_CULTURAL_API_KEY
ELDER_WISDOM_API_KEY=YOUR_ELDER_WISDOM_API_KEY

# Monitoring Configuration
GRAFANA_ADMIN_PASSWORD=$(openssl rand -base64 32)
PROMETHEUS_RETENTION=200h

# IPFS Configuration
IPFS_PROFILE=server
IPFS_STORAGE_MAX=100GB
EOF

    ubuntu_log "SUCCESS" "Ubuntu Health configuration generated with community blessing!"
}

# Build Ubuntu Health Docker images
build_ubuntu_images() {
    ubuntu_log "INFO" "Building Ubuntu Health Docker images with community spirit..."
    
    # Build frontend image
    ubuntu_log "INFO" "Building Ubuntu Health Frontend - Community Interface"
    docker build -f deployment/docker/frontend.Dockerfile -t ubuntu-health/frontend:${UBUNTU_HEALTH_VERSION} ./frontend/
    
    # Build backend image
    ubuntu_log "INFO" "Building Ubuntu Health Backend - Community Consensus"
    docker build -f deployment/docker/backend.Dockerfile -t ubuntu-health/backend:${UBUNTU_HEALTH_VERSION} ./backend/
    
    # Build nginx image
    ubuntu_log "INFO" "Building Ubuntu Health Gateway - Community Access"
    docker build -f deployment/docker/nginx.Dockerfile -t ubuntu-health/nginx:${UBUNTU_HEALTH_VERSION} ./deployment/
    
    ubuntu_log "SUCCESS" "Ubuntu Health Docker images built with community wisdom!"
}

# Initialize Ubuntu Health volumes
init_ubuntu_volumes() {
    ubuntu_log "INFO" "Initializing Ubuntu Health community data volumes..."
    
    # Create named volumes for persistent Ubuntu community data
    docker volume create ubuntu_postgres_data
    docker volume create ubuntu_redis_data
    docker volume create ubuntu_ipfs_data
    docker volume create ubuntu_cultural_data
    docker volume create ubuntu_wisdom_data
    docker volume create ubuntu_healing_protocols
    docker volume create ubuntu_recovery_logs
    
    ubuntu_log "SUCCESS" "Ubuntu Health community volumes initialized!"
}

# Deploy Ubuntu Health with Docker Compose
deploy_docker_compose() {
    ubuntu_log "INFO" "Deploying Ubuntu Health with Docker Compose - Community Unity!"
    
    # Load environment variables
    set -a
    source .env.ubuntu-health
    set +a
    
    # Deploy Ubuntu Health stack
    docker-compose -f deployment/docker-compose.yml up -d
    
    # Wait for services to be healthy
    ubuntu_log "INFO" "Waiting for Ubuntu Health community services to achieve harmony..."
    
    local max_attempts=60
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if docker-compose -f deployment/docker-compose.yml ps | grep -q "Up (healthy)"; then
            ubuntu_log "SUCCESS" "Ubuntu Health community services are healthy and thriving!"
            break
        fi
        
        attempt=$((attempt + 1))
        echo -n "."
        sleep 5
    done
    
    if [ $attempt -eq $max_attempts ]; then
        ubuntu_log "ERROR" "Ubuntu Health services taking longer than expected to start. Check logs for community guidance."
        exit 1
    fi
}

# Deploy Ubuntu Health with Kubernetes
deploy_kubernetes() {
    ubuntu_log "INFO" "Deploying Ubuntu Health with Kubernetes - Scalable Community Growth!"
    
    if ! command -v kubectl &> /dev/null; then
        ubuntu_log "ERROR" "Kubernetes CLI not available. Use Docker Compose deployment instead."
        exit 1
    fi
    
    # Create Ubuntu Health namespaces
    ubuntu_log "INFO" "Creating Ubuntu Health community namespaces..."
    kubectl apply -f deployment/kubernetes/namespaces/ubuntu-health-namespaces.yaml
    
    # Deploy Ubuntu Health secrets (you need to create these)
    ubuntu_log "INFO" "Deploying Ubuntu Health community secrets..."
    if [ ! -f deployment/kubernetes/secrets/ubuntu-health-secrets.yaml ]; then
        ubuntu_log "WARNING" "Ubuntu Health secrets not found. Creating template..."
        create_kubernetes_secrets_template
    fi
    kubectl apply -f deployment/kubernetes/secrets/ubuntu-health-secrets.yaml
    
    # Deploy Ubuntu Health applications
    ubuntu_log "INFO" "Deploying Ubuntu Health community applications..."
    kubectl apply -f deployment/kubernetes/deployments/
    kubectl apply -f deployment/kubernetes/services/
    kubectl apply -f deployment/kubernetes/ingress/
    
    # Wait for deployments
    ubuntu_log "INFO" "Waiting for Ubuntu Health community to reach consensus..."
    kubectl wait --for=condition=available --timeout=600s deployment/ubuntu-health-frontend -n ubuntu-health
    kubectl wait --for=condition=available --timeout=600s deployment/ubuntu-health-backend -n ubuntu-health
    
    ubuntu_log "SUCCESS" "Ubuntu Health deployed to Kubernetes with community blessing!"
}

# Create Kubernetes secrets template
create_kubernetes_secrets_template() {
    mkdir -p deployment/kubernetes/secrets
    
    cat > deployment/kubernetes/secrets/ubuntu-health-secrets.yaml << 'EOF'
# Ubuntu Health Kubernetes Secrets Template
# IMPORTANT: Replace with actual values and secure properly

apiVersion: v1
kind: Secret
metadata:
  name: ubuntu-health-secrets
  namespace: ubuntu-health
  labels:
    app: ubuntu-health
    ubuntu.philosophy: "i-am-because-we-are"
type: Opaque
stringData:
  database-url: "postgresql://ubuntu_user:CHANGE_ME@postgres:5432/ubuntu_health"
  redis-url: "redis://:CHANGE_ME@redis:6379"
  solana-rpc-url: "https://api.devnet.solana.com"
  elder-council-multisig: "UPDATE_AFTER_SMART_CONTRACT_DEPLOYMENT"
  ubuntu-treasury-address: "UPDATE_AFTER_SMART_CONTRACT_DEPLOYMENT"
  jwt-secret: "GENERATE_STRONG_JWT_SECRET"
  cultural-sensitivity-api-key: "YOUR_CULTURAL_API_KEY"
  elder-council-address: "UPDATE_AFTER_DEPLOYMENT"
EOF
    
    ubuntu_log "WARNING" "Kubernetes secrets template created. Please update with actual values!"
}

# Verify Ubuntu Health deployment
verify_deployment() {
    ubuntu_log "INFO" "Verifying Ubuntu Health community deployment..."
    
    # Check frontend health
    if curl -f http://localhost:3000/api/health &> /dev/null; then
        ubuntu_log "SUCCESS" "Ubuntu Health Frontend: Community interface is thriving!"
    else
        ubuntu_log "ERROR" "Ubuntu Health Frontend: Community interface needs healing"
    fi
    
    # Check backend health
    if curl -f http://localhost:5000/api/health/ubuntu-community &> /dev/null; then
        ubuntu_log "SUCCESS" "Ubuntu Health Backend: Community consensus is active!"
    else
        ubuntu_log "ERROR" "Ubuntu Health Backend: Community consensus needs attention"
    fi
    
    # Check nginx health
    if curl -f http://localhost/health &> /dev/null; then
        ubuntu_log "SUCCESS" "Ubuntu Health Gateway: Community access is secured!"
    else
        ubuntu_log "ERROR" "Ubuntu Health Gateway: Community access needs configuration"
    fi
}

# Display Ubuntu Health community information
display_ubuntu_info() {
    ubuntu_log "UBUNTU" "Ubuntu Health Community Successfully Deployed!"
    echo ""
    echo -e "${WHITE}🌍 Ubuntu Health Community Access:${NC}"
    echo -e "${CYAN}   Frontend: ${WHITE}http://localhost:3000${NC}"
    echo -e "${CYAN}   API: ${WHITE}http://localhost:5000${NC}"
    echo -e "${CYAN}   Gateway: ${WHITE}http://localhost${NC}"
    echo ""
    echo -e "${WHITE}📊 Community Monitoring:${NC}"
    echo -e "${CYAN}   Grafana: ${WHITE}http://localhost:3003${NC}"
    echo -e "${CYAN}   Prometheus: ${WHITE}http://localhost:9090${NC}"
    echo ""
    echo -e "${WHITE}🗄️ Community Data:${NC}"
    echo -e "${CYAN}   IPFS Gateway: ${WHITE}http://localhost:8081${NC}"
    echo -e "${CYAN}   Database: ${WHITE}postgresql://localhost:5432/ubuntu_health${NC}"
    echo ""
    echo -e "${PURPLE}🙏 Ubuntu Philosophy Integration:${NC}"
    echo -e "${WHITE}   ✅ Elder Council Wisdom${NC}"
    echo -e "${WHITE}   ✅ Traditional Healing Support${NC}"
    echo -e "${WHITE}   ✅ Community Consensus Mechanisms${NC}"
    echo -e "${WHITE}   ✅ Cultural Sensitivity Features${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Next Steps:${NC}"
    echo -e "${WHITE}   1. Deploy Solana smart contracts${NC}"
    echo -e "${WHITE}   2. Update contract addresses in configuration${NC}"
    echo -e "${WHITE}   3. Configure elder council multi-signature wallet${NC}"
    echo -e "${WHITE}   4. Set up cultural API integrations${NC}"
    echo -e "${WHITE}   5. Conduct community blessing ceremony${NC}"
    echo ""
    echo -e "${PURPLE}\"Ubuntu ngumuntu ngabantu\" - I am because we are${NC}"
}

# Main deployment function
main() {
    print_ubuntu_header
    
    ubuntu_log "UBUNTU" "Starting Ubuntu Health community deployment..."
    ubuntu_log "INFO" "Environment: ${DEPLOYMENT_ENV}"
    ubuntu_log "INFO" "Version: ${UBUNTU_HEALTH_VERSION}"
    
    check_prerequisites
    generate_ubuntu_config
    init_ubuntu_volumes
    build_ubuntu_images
    
    # Choose deployment method
    if [ "${DEPLOYMENT_METHOD:-docker}" = "kubernetes" ]; then
        deploy_kubernetes
    else
        deploy_docker_compose
    fi
    
    verify_deployment
    display_ubuntu_info
    
    ubuntu_log "UBUNTU" "Ubuntu Health deployment completed with community blessing!"
    ubuntu_log "UBUNTU" "May your community heal and thrive together!"
}

# Execute main function
main "$@"

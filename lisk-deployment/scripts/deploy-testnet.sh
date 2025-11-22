#!/bin/bash

# FarmConnect Lisk Testnet Deployment Script
# This script automates the deployment process to Lisk testnet

set -e

echo "🚀 Starting FarmConnect deployment to Lisk testnet..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ is required. Current version: $(node --version)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not running. Please start PostgreSQL first.${NC}"
    echo "   On Ubuntu/Debian: sudo systemctl start postgresql"
    echo "   On macOS: brew services start postgresql"
    echo "   On Windows: Start PostgreSQL service"
    exit 1
fi

echo -e "${GREEN}✅ PostgreSQL is running${NC}"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Create database if it doesn't exist
echo "🗄️  Setting up database..."
createdb lisk_farmconnect 2>/dev/null || echo "Database already exists"

# Update configuration for testnet
echo "⚙️  Updating configuration for testnet..."

# Backup original config
cp lisk.config.json lisk.config.json.backup

# Update with testnet settings
cat > lisk.config.json << EOF
{
  "app": {
    "label": "FarmConnect",
    "version": "1.0.0",
    "buildNumber": "1",
    "protocolVersion": "3.0"
  },
  "components": {
    "storage": {
      "database": {
        "host": "localhost",
        "port": 5432,
        "database": "lisk_farmconnect",
        "user": "lisk",
        "password": "password"
      }
    },
    "logger": {
      "fileLogLevel": "info",
      "consoleLogLevel": "info"
    },
    "network": {
      "seedPeers": [
        {
          "ip": "testnet.lisk.com",
          "port": 5001
        },
        {
          "ip": "testnet2.lisk.com",
          "port": 5001
        }
      ],
      "port": 5000
    }
  },
  "modules": {
    "greenPoints": {
      "moduleID": 1000,
      "moduleName": "greenPoints"
    },
    "cropNFT": {
      "moduleID": 1001,
      "moduleName": "cropNFT"
    },
    "agriBounties": {
      "moduleID": 1002,
      "moduleName": "agriBounties"
    }
  }
}
EOF

# Deploy to testnet
echo "🚀 Deploying to Lisk testnet..."
npm run deploy

# Wait for deployment to complete
echo "⏳ Waiting for deployment to complete..."
sleep 10

# Verify deployment
echo "🔍 Verifying deployment..."

# Check if modules are running
if curl -s http://localhost:5000/api/modules > /dev/null; then
    echo -e "${GREEN}✅ Modules are running${NC}"
else
    echo -e "${RED}❌ Failed to verify modules${NC}"
    exit 1
fi

# Check blockchain status
if curl -s http://localhost:5000/api/blockchain > /dev/null; then
    echo -e "${GREEN}✅ Blockchain is running${NC}"
else
    echo -e "${RED}❌ Failed to verify blockchain${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 FarmConnect successfully deployed to Lisk testnet!${NC}"
echo ""
echo "📱 Deployment Summary:"
echo "   🌐 Network: Lisk Testnet"
echo "   🔗 Port: 5000"
echo "   🗄️  Database: lisk_farmconnect"
echo "   📱 Modules deployed:"
echo "      - GreenPoints (ID: 1000)"
echo "      - CropNFT (ID: 1001)"
echo "      - AgriBounties (ID: 1002)"
echo ""
echo "🔗 Access your application:"
echo "   - API: http://localhost:5000/api"
echo "   - Health: http://localhost:5000/health"
echo ""
echo "📚 Next steps:"
echo "   1. Test the API endpoints"
echo "   2. Create test transactions"
echo "   3. Monitor logs and performance"
echo "   4. Update frontend to use new endpoints"
echo ""
echo "⚠️  Remember: This is a testnet deployment!"
echo "   For production, additional security measures are required."
echo ""

# Restore original config
mv lisk.config.json.backup lisk.config.json

echo "✅ Deployment script completed successfully!"


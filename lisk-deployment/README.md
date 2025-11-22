# FarmConnect Lisk Deployment

This repository contains the Lisk blockchain implementation of FarmConnect smart contracts, converted from Solidity to Lisk's JavaScript/TypeScript framework.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Lisk SDK 6.0+
- PostgreSQL database

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup database:**
   ```bash
   # Create PostgreSQL database
   createdb lisk_farmconnect
   
   # Update database credentials in lisk.config.json
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

### Deployment to Lisk Testnet

1. **Configure testnet settings:**
   ```bash
   # Update lisk.config.json with testnet nodes
   # Update deploy.ts with testnet configuration
   ```

2. **Deploy to testnet:**
   ```bash
   npm run deploy
   ```

3. **Verify deployment:**
   ```bash
   # Check module status
   curl http://localhost:5000/api/modules
   
   # Check blockchain status
   curl http://localhost:5000/api/blockchain
   ```

## 📱 Modules Deployed

### 1. GreenPoints Module (ID: 1000)
- **Purpose**: Reward token system for consumer engagement
- **Features**: 
  - Point distribution for scans, ratings, shares
  - ERC20-like token functionality
  - Activity tracking and statistics

### 2. CropNFT Module (ID: 1001)
- **Purpose**: NFT-based crop traceability system
- **Features**:
  - Crop batch creation and management
  - QR code scanning and engagement
  - Farmer reputation system
  - Image and certification management

### 3. AgriBounties Module (ID: 1002)
- **Purpose**: Decentralized agricultural innovation platform
- **Features**:
  - Bounty creation and management
  - Solution submission and voting
  - Reward distribution
  - Expert verification system

## 🔧 Configuration

### Network Settings
- **Port**: 5000 (configurable)
- **Protocol**: Lisk Protocol 3.0
- **Consensus**: Delegated Proof of Stake (DPoS)

### Database
- **Type**: PostgreSQL
- **Schema**: Auto-generated from module definitions
- **Backup**: Recommended for production

## 📊 API Endpoints

### GreenPoints
- `GET /api/greenPoints/balance/:address` - Get user balance
- `GET /api/greenPoints/stats/:address` - Get user statistics
- `POST /api/greenPoints/award` - Award points to user

### CropNFT
- `GET /api/cropNFT/crop/:tokenId` - Get crop details
- `GET /api/cropNFT/farmer/:address` - Get farmer crops
- `POST /api/cropNFT/create` - Create new crop batch

### AgriBounties
- `GET /api/agriBounties/bounty/:id` - Get bounty details
- `GET /api/agriBounties/submissions/:bountyId` - Get submissions
- `POST /api/agriBounties/create` - Create new bounty

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage
```

## 🔍 Monitoring

### Health Checks
- Module status monitoring
- Database connection health
- Network peer status
- Transaction processing metrics

### Logs
- Application logs: `logs/app.log`
- Error logs: `logs/error.log`
- Access logs: `logs/access.log`

## 🚨 Troubleshooting

### Common Issues

1. **Module not found**
   - Check module registration in app.ts
   - Verify module IDs are unique

2. **Database connection failed**
   - Verify PostgreSQL is running
   - Check credentials in lisk.config.json

3. **Port already in use**
   - Change port in configuration
   - Kill existing process

### Support
- Check Lisk SDK documentation
- Review module logs for errors
- Verify network connectivity

## 📈 Performance

### Optimization Tips
- Use connection pooling for database
- Implement caching for frequently accessed data
- Monitor memory usage and optimize
- Use batch operations for bulk transactions

## 🔐 Security

### Best Practices
- Secure database credentials
- Implement rate limiting
- Validate all inputs
- Use HTTPS in production
- Regular security audits

## 📚 Resources

- [Lisk SDK Documentation](https://lisk.com/documentation)
- [Lisk Testnet Information](https://testnet.lisk.com)
- [Blockchain Development Guide](https://lisk.com/developers)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Note**: This is a testnet deployment. For mainnet deployment, additional security measures and testing are required.


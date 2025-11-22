import { getApplication } from './src/app';
import { GenesisConfig } from 'lisk-sdk';

const genesisConfig: GenesisConfig = {
  app: {
    label: 'FarmConnect',
    version: '1.0.0',
    buildNumber: '1',
    protocolVersion: '3.0',
  },
  modules: {
    greenPoints: {
      moduleID: 1000,
      moduleName: 'greenPoints',
    },
    cropNFT: {
      moduleID: 1001,
      moduleName: 'cropNFT',
    },
    agriBounties: {
      moduleID: 1002,
      moduleName: 'agriBounties',
    },
  },
  network: {
    port: 5000,
    address: '127.0.0.1',
    seedPeers: [
      {
        ip: '127.0.0.1',
        port: 5001,
      },
    ],
  },
};

async function deploy() {
  try {
    console.log('🚀 Deploying FarmConnect to Lisk testnet...');
    
    const app = getApplication(genesisConfig);
    
    // Start the application
    await app.run();
    
    console.log('✅ FarmConnect successfully deployed to Lisk testnet!');
    console.log('🌐 Network: Lisk Testnet');
    console.log('🔗 Port: 5000');
    console.log('📱 Modules deployed:');
    console.log('   - GreenPoints (ID: 1000)');
    console.log('   - CropNFT (ID: 1001)');
    console.log('   - AgriBounties (ID: 1002)');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deploy();


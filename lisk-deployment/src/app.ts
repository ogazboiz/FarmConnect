import { Application, ApplicationConfig } from 'lisk-sdk';
import { GreenPointsModule } from './modules/greenPoints/greenPoints';
import { CropNFTModule } from './modules/cropNFT/cropNFT';
import { AgriBountiesModule } from './modules/agriBounties/agriBounties';

export const getApplication = (genesisBlock: Record<string, unknown>): Application => {
  const config = new ApplicationConfig(genesisBlock);
  
  const app = Application.defaultApplication(config);
  
  // Register all modules
  app.registerModule(GreenPointsModule);
  app.registerModule(CropNFTModule);
  app.registerModule(AgriBountiesModule);
  
  return app;
};


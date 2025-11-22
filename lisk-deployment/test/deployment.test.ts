import { getApplication } from '../src/app';

describe('FarmConnect Lisk Deployment', () => {
  test('should create application with all modules', () => {
    const genesisBlock = {
      header: {
        version: 1,
        timestamp: Math.floor(Date.now() / 1000),
        height: 0,
      },
      assets: [],
    };

    const app = getApplication(genesisBlock);
    
    expect(app).toBeDefined();
    expect(app.modules).toBeDefined();
    
    // Check if all modules are registered
    const moduleNames = Object.keys(app.modules);
    expect(moduleNames).toContain('greenPoints');
    expect(moduleNames).toContain('cropNFT');
    expect(moduleNames).toContain('agriBounties');
  });

  test('should have correct module IDs', () => {
    const genesisBlock = {
      header: {
        version: 1,
        timestamp: Math.floor(Date.now() / 1000),
        height: 0,
      },
      assets: [],
    };

    const app = getApplication(genesisBlock);
    
    // Check module IDs
    expect(app.modules.greenPoints.id).toBe(1000);
    expect(app.modules.cropNFT.id).toBe(1001);
    expect(app.modules.agriBounties.id).toBe(1002);
  });

  test('should have endpoints configured', () => {
    const genesisBlock = {
      header: {
        version: 1,
        timestamp: Math.floor(Date.now() / 1000),
        height: 0,
      },
      assets: [],
    };

    const app = getApplication(genesisBlock);
    
    // Check if endpoints are configured
    expect(app.modules.greenPoints.endpoint).toBeDefined();
    expect(app.modules.cropNFT.endpoint).toBeDefined();
    expect(app.modules.agriBounties.endpoint).toBeDefined();
  });

  test('should have methods configured', () => {
    const genesisBlock = {
      header: {
        version: 1,
        timestamp: Math.floor(Date.now() / 1000),
        height: 0,
      },
      assets: [],
    };

    const app = getApplication(genesisBlock);
    
    // Check if methods are configured
    expect(app.modules.greenPoints.method).toBeDefined();
    expect(app.modules.cropNFT.method).toBeDefined();
    expect(app.modules.agriBounties.method).toBeDefined();
  });
});


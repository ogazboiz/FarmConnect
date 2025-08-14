// config/contracts.ts

// Helper function to get contract addresses based on environment
export const getContractAddresses = () => {
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'testnet';
  
  if (environment === 'mainnet') {
    return {
      FARM_TOKEN: process.env.NEXT_PUBLIC_MANTLE_FARM_TOKEN_ADDRESS as `0x${string}`,
      GREEN_POINTS: process.env.NEXT_PUBLIC_MANTLE_GREEN_POINTS_ADDRESS as `0x${string}`,
      CROP_NFT: process.env.NEXT_PUBLIC_MANTLE_CROP_NFT_ADDRESS as `0x${string}`,
      FARMER_DAO: process.env.NEXT_PUBLIC_MANTLE_FARMER_DAO_ADDRESS as `0x${string}`,
      AGRI_BOUNTIES: process.env.NEXT_PUBLIC_MANTLE_AGRI_BOUNTIES_ADDRESS as `0x${string}`,
    };
  } else {
    // Testnet addresses
    return {
      FARM_TOKEN: process.env.NEXT_PUBLIC_CORE_TESTNET_FARM_TOKEN_ADDRESS as `0x${string}`,
      GREEN_POINTS: process.env.NEXT_PUBLIC_CORE_TESTNET_GREEN_POINTS_ADDRESS as `0x${string}`,
      CROP_NFT: process.env.NEXT_PUBLIC_CORE_TESTNET_CROP_NFT_ADDRESS as `0x${string}`,
      FARMER_DAO: process.env.NEXT_PUBLIC_CORE_TESTNET_FARMER_DAO_ADDRESS as `0x${string}`,
      AGRI_BOUNTIES: process.env.NEXT_PUBLIC_CORE_TESTNET_AGRI_BOUNTIES_ADDRESS as `0x${string}`,
    };
  }
};

// Re-export ABIs from separate files
export * from './abis';
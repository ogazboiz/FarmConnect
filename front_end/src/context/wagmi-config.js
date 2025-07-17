import { createConfig, http } from 'wagmi';
import { mantle, mantaSepoliaTestnet, sepolia } from 'wagmi/chains';



// AgriDAO Contract Addresses on Mantle
export const AGRIDAO_CONTRACT_ADDRESSES = {
  // Mantle Mainnet addresses (deploy here for production)
  MANTLE_FARM_TOKEN: process.env.NEXT_PUBLIC_MANTLE_FARM_TOKEN_ADDRESS as `0x${string}`,
  MANTLE_GREEN_POINTS: process.env.NEXT_PUBLIC_MANTLE_GREEN_POINTS_ADDRESS as `0x${string}`,
  MANTLE_CROP_NFT: process.env.NEXT_PUBLIC_MANTLE_CROP_NFT_ADDRESS as `0x${string}`,
  MANTLE_FARMER_DAO: process.env.NEXT_PUBLIC_MANTLE_FARMER_DAO_ADDRESS as `0x${string}`,
  MANTLE_AGRI_BOUNTIES: process.env.NEXT_PUBLIC_MANTLE_AGRI_BOUNTIES_ADDRESS as `0x${string}`,
  
  // Mantle Sepolia Testnet addresses (for testing)
  MANTLE_TESTNET_FARM_TOKEN: process.env.NEXT_PUBLIC_MANTLE_TESTNET_FARM_TOKEN_ADDRESS as `0x${string}`,
  MANTLE_TESTNET_GREEN_POINTS: process.env.NEXT_PUBLIC_MANTLE_TESTNET_GREEN_POINTS_ADDRESS as `0x${string}`,
  MANTLE_TESTNET_CROP_NFT: process.env.NEXT_PUBLIC_MANTLE_TESTNET_CROP_NFT_ADDRESS as `0x${string}`,
  MANTLE_TESTNET_FARMER_DAO: process.env.NEXT_PUBLIC_MANTLE_TESTNET_FARMER_DAO_ADDRESS as `0x${string}`,
  MANTLE_TESTNET_AGRI_BOUNTIES: process.env.NEXT_PUBLIC_MANTLE_TESTNET_AGRI_BOUNTIES_ADDRESS as `0x${string}`,
  
  // Legacy contracts (keep for reference)
  SEPOLIA_USDT: process.env.NEXT_PUBLIC_SEPOLIA_USDT_ADDRESS as `0x${string}`,
  SEPOLIA_USDC: process.env.NEXT_PUBLIC_SEPOLIA_USDC_ADDRESS as `0x${string}`,
};

// Environment-based contract selection
export const getContractAddresses = () => {
  const isMainnet = process.env.NEXT_PUBLIC_ENVIRONMENT === 'mainnet';
  
  if (isMainnet) {
    return {
      FARM_TOKEN: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_FARM_TOKEN,
      GREEN_POINTS: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_GREEN_POINTS,
      CROP_NFT: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_CROP_NFT,
      FARMER_DAO: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_FARMER_DAO,
      AGRI_BOUNTIES: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_AGRI_BOUNTIES,
    };
  } else {
    return {
      FARM_TOKEN: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_TESTNET_FARM_TOKEN,
      GREEN_POINTS: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_TESTNET_GREEN_POINTS,
      CROP_NFT: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_TESTNET_CROP_NFT,
      FARMER_DAO: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_TESTNET_FARMER_DAO,
      AGRI_BOUNTIES: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_TESTNET_AGRI_BOUNTIES,
    };
  }
};

export const WAGMI_CHAINS = {
  mantle,
  mantaSepoliaTestnet,
  sepolia, // Keep for fallback testing
};

export const wagmiConfig = createConfig({
  chains: [mantleMainnet, mantleSepolia, sepolia],
  transports: {
    [mantle.id]: http(),
    [mantaSepoliaTestnet.id]: http(),
    [sepolia.id]: http(), // Default Sepolia RPC
  },
});
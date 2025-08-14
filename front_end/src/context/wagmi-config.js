import { createConfig, http } from 'wagmi';
import { coreTestnet2 } from 'wagmi/chains';

// AgriDAO Contract Addresses - Multi-chain Support
export const AGRIDAO_CONTRACT_ADDRESSES = {
  // Core Mainnet addresses (deploy here for production)
  CORE_FARM_TOKEN: process.env.NEXT_PUBLIC_CORE_FARM_TOKEN_ADDRESS as `0x${string}`,
  CORE_GREEN_POINTS: process.env.NEXT_PUBLIC_CORE_GREEN_POINTS_ADDRESS as `0x${string}`,
  CORE_CROP_NFT: process.env.NEXT_PUBLIC_CORE_CROP_NFT_ADDRESS as `0x${string}`,
  CORE_FARMER_DAO: process.env.NEXT_PUBLIC_CORE_FARMER_DAO_ADDRESS as `0x${string}`,
  CORE_AGRI_BOUNTIES: process.env.NEXT_PUBLIC_CORE_AGRI_BOUNTIES_ADDRESS as `0x${string}`,
  
  // Core Testnet2 addresses (LIVE - Chain ID 1114)
  CORE_TESTNET_FARM_TOKEN: process.env.NEXT_PUBLIC_CORE_TESTNET_FARM_TOKEN_ADDRESS as `0x${string}`,
  CORE_TESTNET_GREEN_POINTS: process.env.NEXT_PUBLIC_CORE_TESTNET_GREEN_POINTS_ADDRESS as `0x${string}`,
  CORE_TESTNET_CROP_NFT: process.env.NEXT_PUBLIC_CORE_TESTNET_CROP_NFT_ADDRESS as `0x${string}`,
  CORE_TESTNET_FARMER_DAO: process.env.NEXT_PUBLIC_CORE_TESTNET_FARMER_DAO_ADDRESS as `0x${string}`,
  CORE_TESTNET_AGRI_BOUNTIES: process.env.NEXT_PUBLIC_CORE_TESTNET_AGRI_BOUNTIES_ADDRESS as `0x${string}`,

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

// Multi-chain contract selection based on chain ID
export const getContractAddresses = (chainId?: number) => {
  // If no chainId provided, use environment-based selection
  if (!chainId) {
    const isMainnet = process.env.NEXT_PUBLIC_ENVIRONMENT === 'mainnet';
    
    if (isMainnet) {
      // Default to Core mainnet in production
      return {
        FARM_TOKEN: AGRIDAO_CONTRACT_ADDRESSES.CORE_FARM_TOKEN,
        GREEN_POINTS: AGRIDAO_CONTRACT_ADDRESSES.CORE_GREEN_POINTS,
        CROP_NFT: AGRIDAO_CONTRACT_ADDRESSES.CORE_CROP_NFT,
        FARMER_DAO: AGRIDAO_CONTRACT_ADDRESSES.CORE_FARMER_DAO,
        AGRI_BOUNTIES: AGRIDAO_CONTRACT_ADDRESSES.CORE_AGRI_BOUNTIES,
      };
    } else {
      // Default to Core testnet in development
      return {
        FARM_TOKEN: AGRIDAO_CONTRACT_ADDRESSES.CORE_TESTNET_FARM_TOKEN,
        GREEN_POINTS: AGRIDAO_CONTRACT_ADDRESSES.CORE_TESTNET_GREEN_POINTS,
        CROP_NFT: AGRIDAO_CONTRACT_ADDRESSES.CORE_TESTNET_CROP_NFT,
        FARMER_DAO: AGRIDAO_CONTRACT_ADDRESSES.CORE_TESTNET_FARMER_DAO,
        AGRI_BOUNTIES: AGRIDAO_CONTRACT_ADDRESSES.CORE_TESTNET_AGRI_BOUNTIES,
      };
    }
  }

  // Chain-specific contract selection
  switch (chainId) {
    case 1116: // Core Mainnet
      return {
        FARM_TOKEN: AGRIDAO_CONTRACT_ADDRESSES.CORE_FARM_TOKEN,
        GREEN_POINTS: AGRIDAO_CONTRACT_ADDRESSES.CORE_GREEN_POINTS,
        CROP_NFT: AGRIDAO_CONTRACT_ADDRESSES.CORE_CROP_NFT,
        FARMER_DAO: AGRIDAO_CONTRACT_ADDRESSES.CORE_FARMER_DAO,
        AGRI_BOUNTIES: AGRIDAO_CONTRACT_ADDRESSES.CORE_AGRI_BOUNTIES,
      };
    
    case 1114: // Core Testnet2 (LIVE DEPLOYMENT)
      return {
        FARM_TOKEN: AGRIDAO_CONTRACT_ADDRESSES.CORE_TESTNET_FARM_TOKEN,
        GREEN_POINTS: AGRIDAO_CONTRACT_ADDRESSES.CORE_TESTNET_GREEN_POINTS,
        CROP_NFT: AGRIDAO_CONTRACT_ADDRESSES.CORE_TESTNET_CROP_NFT,
        FARMER_DAO: AGRIDAO_CONTRACT_ADDRESSES.CORE_TESTNET_FARMER_DAO,
        AGRI_BOUNTIES: AGRIDAO_CONTRACT_ADDRESSES.CORE_TESTNET_AGRI_BOUNTIES,
      };
    
    case 5000: // Mantle Mainnet
      return {
        FARM_TOKEN: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_FARM_TOKEN,
        GREEN_POINTS: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_GREEN_POINTS,
        CROP_NFT: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_CROP_NFT,
        FARMER_DAO: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_FARMER_DAO,
        AGRI_BOUNTIES: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_AGRI_BOUNTIES,
      };
    
    case 5003: // Mantle Sepolia Testnet
      return {
        FARM_TOKEN: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_TESTNET_FARM_TOKEN,
        GREEN_POINTS: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_TESTNET_GREEN_POINTS,
        CROP_NFT: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_TESTNET_CROP_NFT,
        FARMER_DAO: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_TESTNET_FARMER_DAO,
        AGRI_BOUNTIES: AGRIDAO_CONTRACT_ADDRESSES.MANTLE_TESTNET_AGRI_BOUNTIES,
      };
    
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
};

// Custom Core Testnet2 chain definition (if not in wagmi/chains)
// export const coreTestnet2 = {
//   id: 1114,
//   name: 'Core Testnet2',
//   network: 'core-testnet2',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'tCORE2',
//     symbol: 'tCORE2',
//   },
//   rpcUrls: {
//     public: { http: ['https://rpc.test2.btcs.network'] },
//     default: { http: ['https://rpc.test2.btcs.network'] },
//   },
//   blockExplorers: {
//     etherscan: { 
//       name: 'CoreScan', 
//       url: 'https://scan.test2.btcs.network' 
//     },
//     default: { 
//       name: 'CoreScan', 
//       url: 'https://scan.test2.btcs.network' 
//     },
//   },
//   testnet: true,
// } as const;

// Custom Core Mainnet chain definition (if not in wagmi/chains)
export const coreMainnet = {
  id: 1116,
  name: 'Core',
  network: 'core',
  nativeCurrency: {
    decimals: 18,
    name: 'CORE',
    symbol: 'CORE',
  },
  rpcUrls: {
    public: { http: ['https://rpc.coredao.org'] },
    default: { http: ['https://rpc.coredao.org'] },
  },
  blockExplorers: {
    etherscan: { 
      name: 'CoreScan', 
      url: 'https://scan.coredao.org' 
    },
    default: { 
      name: 'CoreScan', 
      url: 'https://scan.coredao.org' 
    },
  },
} as const;

export const WAGMI_CHAINS = {
  coreMainnet,
  coreTestnet2,
  mantle,
  mantleSepoliaTestnet,
  sepolia, // Keep for fallback testing
};

export const wagmiConfig = createConfig({
  chains: [coreMainnet, coreTestnet2, mantle, mantleSepoliaTestnet, sepolia],
  transports: {
    [coreMainnet.id]: http('https://rpc.coredao.org'),
    [coreTestnet2.id]: http('https://rpc.test2.btcs.network'),
    [mantle.id]: http(),
    [mantleSepoliaTestnet.id]: http(),
    [sepolia.id]: http(), // Default Sepolia RPC
  },
});
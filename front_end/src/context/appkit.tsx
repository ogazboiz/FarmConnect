"use client";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { sepolia, mantle, mantleSepoliaTestnet, coreTestnet2} from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { ReactNode } from "react";

// Custom Core Network definitions
const coreMainnet: AppKitNetwork = {
  id: 1116,
  name: 'Core',
  nativeCurrency: {
    decimals: 18,
    name: 'CORE',
    symbol: 'CORE',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.coredao.org'],
    },
    public: {
      http: ['https://rpc.coredao.org'],
    },
  },
  blockExplorers: {
    default: { name: 'CoreScan', url: 'https://scan.coredao.org' },
  },
  testnet: false,
};

// const coreTestnet2: AppKitNetwork = {
//   id: 1114,
//   name: 'Core Testnet2',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'tCORE2',
//     symbol: 'tCORE2',
//   },
//   rpcUrls: {
//     default: {
//       http: ['https://rpc.test2.btcs.network'],
//     },
//     public: {
//       http: ['https://rpc.test2.btcs.network'],
//     },
//   },
//   blockExplorers: {
//     default: { name: 'CoreScan Testnet', url: 'https://scan.test2.btcs.network' },
//   },
//   testnet: true,
// };

// Environment detection
const isMainnet = process.env.NEXT_PUBLIC_ENVIRONMENT === 'mainnet';

// Network configurations for AgriDAO - Multi-chain support
const mainnetNetworks: [AppKitNetwork, ...AppKitNetwork[]] = [
  coreMainnet,  // Primary: Core Mainnet
  mantle,       // Secondary: Mantle Mainnet
];

const testnetNetworks: [AppKitNetwork, ...AppKitNetwork[]] = [
  coreTestnet2,         // Primary: Core Testnet2 (LIVE DEPLOYMENT)
  mantleSepoliaTestnet, // Secondary: Mantle Sepolia Testnet  
  sepolia,              // Fallback: Ethereum Sepolia
];

// Use appropriate networks based on environment
const supportedNetworks = isMainnet ? mainnetNetworks : testnetNetworks;

// 1. Get projectId at https://cloud.reown.com
const projectId = "8387f0bbb57a265cd4dd96c3e658ac55";

// 2. Create metadata for AgriDAO
const metadata = {
  name: "AgriDAO",
  description: "Decentralized agricultural platform connecting farmers with consumers through blockchain transparency",
  url: "https://agridao.com", // Your actual domain
  icons: ["https://agridao.com/logo.png"], // Your AgriDAO logo
};

// Get primary network info for logging
const primaryNetwork = supportedNetworks[0];
const networkType = isMainnet ? 'Mainnet' : 'Testnet';

// Log environment info for debugging
console.log(`🌾 AgriDAO Environment: ${primaryNetwork.name} ${networkType}`);
console.log(`📡 Supported Networks:`, supportedNetworks.map(n => `${n.name} (${n.id})`));
console.log(`🚀 Primary Network: ${primaryNetwork.name} - Chain ID ${primaryNetwork.id}`);

if (!isMainnet && primaryNetwork.id === 1114) {
  console.log(`✅ Core Testnet2 LIVE contracts ready!`);
  console.log(`🔗 Explorer: https://scan.test2.btcs.network`);
  console.log(`💧 Faucet: https://scan.test2.btcs.network/faucet`);
}

// 3. Create the AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: supportedNetworks,
  projectId,
  features: {
    analytics: true,
    email: true,      // Enable email login
    socials: ['google', 'x', 'github'], // Social logins
  },
  // Environment-specific configurations
  ...(isMainnet ? {
    // Mainnet specific configurations
    enableExplorer: true,
    enableOnramp: true, // Enable for real token purchases
    defaultNetwork: coreMainnet,
  } : {
    // Testnet specific configurations  
    enableExplorer: true,
    enableOnramp: false, // Disable on-ramp for testnets
    defaultNetwork: coreTestnet2, // Default to Core Testnet2 (where contracts are live)
  })
});

interface AppKitProps {
  children: ReactNode;
}

export function AppKit({ children }: AppKitProps) {
  return <>{children}</>;
}

// Export network info for use in other components
export const NETWORK_INFO = {
  isMainnet,
  primaryNetwork,
  supportedNetworks,
  coreTestnet2,
  coreMainnet,
};
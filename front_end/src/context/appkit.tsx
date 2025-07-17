"use client";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { sepolia, mantle, mantleSepoliaTestnet } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { ReactNode } from "react";

// Custom Mantle Network definitions (if not available in @reown/appkit/networks)
// const mantleMainnet: AppKitNetwork = {
//   id: 5000,
//   name: 'Mantle',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'Mantle',
//     symbol: 'MNT',
//   },
//   rpcUrls: {
//     default: {
//       http: ['https://rpc.mantle.xyz'],
//     },
//     public: {
//       http: ['https://rpc.mantle.xyz'],
//     },
//   },
//   blockExplorers: {
//     default: { name: 'Mantle Explorer', url: 'https://explorer.mantle.xyz' },
//   },
//   testnet: false,
// };

// const mantleSepoliaTestnet: AppKitNetwork = {
//   id: 5003,
//   name: 'Mantle Sepolia',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'Mantle',
//     symbol: 'MNT',
//   },
//   rpcUrls: {
//     default: {
//       http: ['https://rpc.sepolia.mantle.xyz'],
//     },
//     public: {
//       http: ['https://rpc.sepolia.mantle.xyz'],
//     },
//   },
//   blockExplorers: {
//     default: { name: 'Mantle Sepolia Explorer', url: 'https://explorer.sepolia.mantle.xyz' },
//   },
//   testnet: true,
// };

// Environment detection
const isMainnet = process.env.NEXT_PUBLIC_ENVIRONMENT === 'mainnet';

// Network configurations for AgriDAO
const mainnetNetworks: [AppKitNetwork, ...AppKitNetwork[]] = [
  mantle,
  // Add other mainnet networks if needed
];

const testnetNetworks: [AppKitNetwork, ...AppKitNetwork[]] = [
  mantleSepoliaTestnet,
  sepolia, // Keep Sepolia for testing fallback
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

// Log environment info for debugging
console.log(`🌍 AgriDAO Environment: ${isMainnet ? 'Mantle Mainnet' : 'Mantle Testnet'}`);
console.log(`📡 Supported Networks:`, supportedNetworks.map(n => n.name));
console.log(`🌾 AgriDAO on Mantle Network ready!`);

// 3. Create the AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: supportedNetworks,
  projectId,
  features: {
    analytics: true,
  },
  // Mantle-specific configurations
  ...(isMainnet ? {
    // Mainnet specific configurations
    enableExplorer: true,
    enableOnramp: true, // Enable for real MNT purchases
  } : {
    // Testnet specific configurations  
    enableExplorer: true,
    enableOnramp: false, // Disable on-ramp for testnets
  })
});

interface AppKitProps {
  children: ReactNode;
}

export function AppKit({ children }: AppKitProps) {
  return <>{children}</>;
}

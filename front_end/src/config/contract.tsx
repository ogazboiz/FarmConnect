import abi from './abi.json'

type Environment = 'mainnet' | 'testnet'
const ENVIRONMENT = (process.env.NEXT_PUBLIC_ENVIRONMENT as Environment) || 'testnet'

// Corrected map of chainId to network key
const NETWORKS: Record<number, keyof typeof contracts> = {
  // Mainnet Chain IDs
  1: 'ethereum',        // Ethereum Mainnet
  56: 'bsc',           // BSC Mainnet
  42161: 'arbitrum',   // Arbitrum One
  1135: 'lisk',        // Lisk Mainnet (corrected)
  8453: 'base',        // Base Mainnet (added)
  
  // Testnet Chain IDs
  11155111: 'ethereum', // Sepolia
  97: 'bsc',           // BSC Testnet
  421614: 'arbitrum',  // Arbitrum Sepolia
  4202: 'lisk',        // Lisk Sepolia (corrected)
  84532: 'base',       // Base Sepolia (added)
}

const contracts = {
  ethereum: {
    mainnet: {
      core: process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_USDT as `0x${string}`
    },
    testnet: {
      core: process.env.NEXT_PUBLIC_ETHEREUM_TESTNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_ETHEREUM_TESTNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_ETHEREUM_TESTNET_USDT as `0x${string}`,
    },
  },
  bsc: {
    mainnet: {
      core: process.env.NEXT_PUBLIC_BSC_MAINNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_BSC_MAINNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_BSC_MAINNET_USDT as `0x${string}`,
    },
    testnet: {
      core: process.env.NEXT_PUBLIC_BSC_TESTNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_BSC_TESTNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_BSC_TESTNET_USDT as `0x${string}`,
    },
  },
  arbitrum: {
    mainnet: {
      core: process.env.NEXT_PUBLIC_ARBITRUM_MAINNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_ARBITRUM_MAINNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_ARBITRUM_MAINNET_USDT as `0x${string}`,
    },
    testnet: {
      core: process.env.NEXT_PUBLIC_ARBITRUM_TESTNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_ARBITRUM_TESTNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_ARBITRUM_TESTNET_USDT as `0x${string}`,
    },
  },
  lisk: {
    mainnet: {
      core: process.env.NEXT_PUBLIC_LISK_MAINNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_LISK_MAINNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_LISK_MAINNET_USDT as `0x${string}`,
    },
    testnet: {
      core: process.env.NEXT_PUBLIC_LISK_TESTNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_LISK_TESTNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_LISK_TESTNET_USDT as `0x${string}`,
    },
  },
  // Added Base network support
  base: {
    mainnet: {
      core: process.env.NEXT_PUBLIC_BASE_MAINNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_BASE_MAINNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_BASE_MAINNET_USDT as `0x${string}`,
    },
    testnet: {
      core: process.env.NEXT_PUBLIC_BASE_TESTNET_CORE as `0x${string}`,
      usdc: process.env.NEXT_PUBLIC_BASE_TESTNET_USDC as `0x${string}`,
      usdt: process.env.NEXT_PUBLIC_BASE_TESTNET_USDT as `0x${string}`,
    },
  },
}

// Enhanced export with debugging
export function getContractConfig(chainId: number) {
  console.log(`🔍 Getting contract config for chainId: ${chainId}, environment: ${ENVIRONMENT}`)
  
  const networkKey = NETWORKS[chainId]
  if (!networkKey) {
    console.error(`❌ No network mapping found for chainId: ${chainId}`)
    console.log('Available chain IDs:', Object.keys(NETWORKS))
    throw new Error(`Unsupported chainId: ${chainId}`)
  }
  
  console.log(`📡 Network key: ${networkKey}`)
  
  const currentContracts = contracts[networkKey]?.[ENVIRONMENT]
  if (!currentContracts) {
    console.error(`❌ No contracts found for network: ${networkKey}, environment: ${ENVIRONMENT}`)
    throw new Error(`Unsupported network: ${networkKey} or environment: ${ENVIRONMENT}`)
  }

  console.log(`✅ Contract config found:`, {
    network: networkKey,
    environment: ENVIRONMENT,
    core: currentContracts.core,
    usdc: currentContracts.usdc,
    usdt: currentContracts.usdt,
  })

  return {
    address: currentContracts.core,
    usdc: currentContracts.usdc,
    usdt: currentContracts.usdt,
    abi: abi,
  }
}

// Export debug info
export const contractDebugInfo = {
  environment: ENVIRONMENT,
  supportedNetworks: Object.keys(contracts),
  supportedChainIds: Object.keys(NETWORKS).map(Number),
  networkMappings: NETWORKS,
}
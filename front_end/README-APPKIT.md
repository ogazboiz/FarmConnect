# AppKit Integration Guide for AgriDAO

This guide explains how to use AppKit with Wagmi in your AgriDAO project.

## Overview

Your project is now configured with AppKit using the Wagmi adapter, which provides seamless integration with multiple blockchain ecosystems including Mantle Network.

## Configuration Files

### 1. AppKit Configuration (`src/context/appkit.tsx`)
- Uses `WagmiAdapter` for blockchain integration
- Supports Mantle mainnet and testnet networks
- Configured with your project ID from Reown Dashboard
- Includes analytics and explorer features

### 2. Wagmi Configuration (`src/config/index.tsx`)
- Sets up the Wagmi adapter with proper storage and SSR support
- Configures networks: Mantle, Mantle Sepolia Testnet, and Sepolia
- Handles cookie storage for server-side rendering

### 3. Providers (`src/context/providers.tsx`)
- Wraps your app with WagmiProvider and QueryClientProvider
- Handles SSR state management with cookies
- Includes your custom RefreshProvider and Toaster

## Usage

### Basic Wallet Connection

Use the AppKit web component for wallet connection:

```tsx
import { ConnectWalletModal } from '@/components/consumer/ConnectWalletModal';

export default function MyPage() {
  return (
    <div>
      <h1>Connect Your Wallet</h1>
      <ConnectWalletModal />
    </div>
  );
}
```

### Smart Contract Interaction

Use Wagmi hooks for smart contract interaction:

```tsx
import { useReadContract, useWriteContract } from 'wagmi';
import { useAccount } from 'wagmi';

export default function ContractInteraction() {
  const { address, isConnected } = useAccount();
  
  // Read from contract
  const { data: balance } = useReadContract({
    abi: YourContractABI,
    address: '0x...',
    functionName: 'balanceOf',
    args: [address]
  });
  
  // Write to contract
  const { writeContract } = useWriteContract();
  
  const handleTransfer = () => {
    writeContract({
      abi: YourContractABI,
      address: '0x...',
      functionName: 'transfer',
      args: ['0x...', 1000]
    });
  };
  
  return (
    <div>
      <p>Balance: {balance?.toString()}</p>
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  );
}
```

### Available Networks

Your app supports these networks:

- **Mantle Mainnet** (ID: 5000) - Production network
- **Mantle Sepolia Testnet** (ID: 5003) - Test network
- **Sepolia** (ID: 11155111) - Ethereum testnet

### Environment Variables

Set these environment variables:

```bash
# Required
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id

# Optional - set to 'mainnet' for production
NEXT_PUBLIC_ENVIRONMENT=testnet
```

## Features

- ✅ Wallet connection with multiple providers
- ✅ Smart contract interaction via Wagmi hooks
- ✅ Server-side rendering support
- ✅ Cookie-based state persistence
- ✅ Analytics integration
- ✅ Network switching
- ✅ Mantle Network support

## Troubleshooting

### Common Issues

1. **Project ID not defined**: Make sure `NEXT_PUBLIC_PROJECT_ID` is set
2. **Network not supported**: Verify the network is in your supported networks list
3. **SSR errors**: Check that cookies are properly passed to the Providers component

### Development Tips

- Use the browser console to see AppKit initialization logs
- Check the Network tab for RPC calls
- Verify wallet connection state with `useAccount` hook

## Next Steps

1. **Deploy Contracts**: Deploy your smart contracts to Mantle testnet
2. **Update ABIs**: Replace example ABIs with your actual contract ABIs
3. **Test Integration**: Test wallet connection and contract calls
4. **Go Live**: Switch to mainnet when ready for production

## Resources

- [AppKit Documentation](https://docs.reown.com)
- [Wagmi Documentation](https://wagmi.sh)
- [Mantle Network Documentation](https://docs.mantle.xyz)
- [Reown Dashboard](https://dashboard.reown.com)

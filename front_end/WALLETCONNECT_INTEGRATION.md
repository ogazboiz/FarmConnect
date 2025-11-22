# WalletConnect Integration for AgriDAO

This document describes the comprehensive WalletConnect integration implemented for the AgriDAO frontend application.

## Overview

The WalletConnect integration provides multiple wallet connection methods:
- **AppKit Integration**: Traditional wallet connection via @reown/walletkit
- **WalletConnect Protocol**: Direct WalletConnect v2 integration for mobile wallet support
- **Multi-chain Support**: Core, Mantle, and other EVM-compatible chains
- **Session Management**: Automatic session handling with expiry and cleanup
- **Request Handling**: Smart request approval for seamless user experience

## Architecture

### Core Components

1. **WalletConnectProvider** (`src/context/walletconnect-provider.tsx`)
   - Main provider component that initializes WalletConnect Core and Web3Wallet
   - Manages sessions, requests, and connection state
   - Provides context for all wallet operations

2. **Custom Hooks** (`src/hooks/useWalletConnect.ts`)
   - `useWalletOperations`: Main wallet operations and connection management
   - `useWalletSession`: Session management and metadata handling
   - `useWalletRequests`: Request handling and history tracking
   - `useWalletQR`: QR code generation for mobile wallet connections

3. **UI Components**
   - `ConnectWalletModal`: Enhanced modal with both AppKit and WalletConnect options
   - `WalletStatus`: Comprehensive wallet status display with session details
   - `WalletConnectDemo`: Demo component showcasing all features

## Features

### Multi-Chain Support
- **Core Mainnet** (Chain ID: 1116)
- **Core Testnet2** (Chain ID: 1114) - Live deployment
- **Mantle Mainnet** (Chain ID: 5000)
- **Mantle Sepolia Testnet** (Chain ID: 5003)

### Connection Methods

#### AppKit Connection
```typescript
const { connectAppKit } = useWalletOperations();
await connectAppKit();
```

#### WalletConnect Connection
```typescript
const { connectWalletConnect } = useWalletOperations();
await connectWalletConnect('wc:...');
```

#### QR Code Generation
```typescript
const { generateQRCode, qrCodeUri } = useWalletQR();
await generateQRCode();
// qrCodeUri contains the connection URI
```

### Session Management

#### Get Active Sessions
```typescript
const { sessions, activeSession } = useWalletOperations();
```

#### Session Metadata
```typescript
const { getSessionMetadata, getAllSessionMetadata } = useWalletSession();
const metadata = getSessionMetadata(session);
```

#### Session Cleanup
```typescript
const { cleanupExpiredSessions } = useWalletSession();
await cleanupExpiredSessions();
```

### Request Handling

#### Handle Requests
```typescript
const { handleRequest } = useWalletRequests();
await handleRequest(request, true); // true = approve, false = reject
```

#### Request History
```typescript
const { requestHistory, getRequestsByMethod } = useWalletRequests();
const ethRequests = getRequestsByMethod('eth_sendTransaction');
```

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ENVIRONMENT=testnet # or mainnet
```

### Supported Networks

The integration automatically configures supported networks based on the environment:

**Testnet Networks:**
- Core Testnet2 (1114) - Primary
- Mantle Sepolia Testnet (5003)

**Mainnet Networks:**
- Core Mainnet (1116) - Primary
- Mantle Mainnet (5000)

### Supported Methods

The WalletConnect integration supports the following RPC methods:
- `eth_sendTransaction`
- `eth_signTransaction`
- `eth_sign`
- `personal_sign`
- `eth_signTypedData`
- `eth_signTypedData_v4`
- `eth_requestAccounts`
- `eth_accounts`
- `wallet_switchEthereumChain`
- `wallet_addEthereumChain`

## Usage Examples

### Basic Connection
```typescript
import { useWalletOperations } from '@/hooks/useWalletConnect';

function MyComponent() {
  const { connectAppKit, isConnected, address } = useWalletOperations();
  
  return (
    <button onClick={connectAppKit}>
      {isConnected ? `Connected: ${address}` : 'Connect Wallet'}
    </button>
  );
}
```

### WalletConnect with QR Code
```typescript
import { useWalletOperations, useWalletQR } from '@/hooks/useWalletConnect';

function QRConnect() {
  const { generateQRCode, qrCodeUri } = useWalletQR();
  
  return (
    <div>
      <button onClick={generateQRCode}>Generate QR Code</button>
      {qrCodeUri && <QRCodeDisplay uri={qrCodeUri} />}
    </div>
  );
}
```

### Session Management
```typescript
import { useWalletSession } from '@/hooks/useWalletConnect';

function SessionManager() {
  const { sessions, cleanupExpiredSessions } = useWalletSession();
  
  return (
    <div>
      <p>Active Sessions: {sessions.length}</p>
      <button onClick={cleanupExpiredSessions}>Cleanup Expired</button>
    </div>
  );
}
```

## Error Handling

The integration includes comprehensive error handling:

```typescript
const { error, clearError } = useWalletOperations();

if (error) {
  return (
    <div className="error">
      <p>{error}</p>
      <button onClick={clearError}>Dismiss</button>
    </div>
  );
}
```

## Security Considerations

1. **Private Keys**: Never stored or transmitted
2. **Session Security**: Automatic expiry and cleanup
3. **Request Validation**: All requests are validated before approval
4. **Network Validation**: Only supported networks are allowed

## Demo Page

Visit `/walletconnect-demo` to see the integration in action with:
- Live wallet connection status
- QR code generation
- Session management
- Request handling
- Multi-chain support

## Dependencies

- `@reown/walletkit`: Main wallet connection library
- `@walletconnect/core`: Core WalletConnect functionality
- `@walletconnect/web3wallet`: Web3 wallet implementation
- `@walletconnect/utils`: Utility functions
- `@walletconnect/types`: TypeScript type definitions

## Troubleshooting

### Common Issues

1. **Connection Failed**: Check network connectivity and project ID
2. **Session Expired**: Sessions automatically expire after 7 days
3. **Unsupported Chain**: Ensure the chain is in the supported networks list
4. **Request Rejected**: Check if the method is supported

### Debug Mode

Enable debug logging by setting:
```env
NEXT_PUBLIC_DEBUG=true
```

This will log detailed information about sessions, requests, and connection events.

## Future Enhancements

- [ ] Push notifications for mobile wallets
- [ ] Enhanced session persistence
- [ ] Custom wallet adapters
- [ ] Advanced request filtering
- [ ] Multi-wallet support
- [ ] Offline mode support


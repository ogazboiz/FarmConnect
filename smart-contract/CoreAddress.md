## 📍 Contract Addresses

### Core Testnet2 (Chain ID: 1114)

| Contract | Address | Explorer |
|----------|---------|----------|
| **FarmToken** | `0x4ccdc62B9c2e0ef3FcC8329dBfe96823EEd7F473` | [View](https://scan.test2.btcs.network/address/0x4ccdc62B9c2e0ef3FcC8329dBfe96823EEd7F473) |
| **GreenPoints** | `0x59315b3ffB558850259bB1C269966BF4dd1eb28E` | [View](https://scan.test2.btcs.network/address/0x59315b3ffB558850259bB1C269966BF4dd1eb28E) |
| **CropNFT** | `0x3e91E05302a457F367374780f373e418220377DA` | [View](https://scan.test2.btcs.network/address/0x3e91E05302a457F367374780f373e418220377DA) |
| **FarmerDAO** | `0xC23dcB8a45183F74A669b8fCB05Fce15291CF789` | [View](https://scan.test2.btcs.network/address/0xC23dcB8a45183F74A669b8fCB05Fce15291CF789) |
| **AgriBounties** | `0xD490818200d1B0Fa2091B514EE8AE202E86E38ED` | [View](https://scan.test2.btcs.network/address/0xD490818200d1B0Fa2091B514EE8AE202E86E38ED) |

**Network Info:**
- **RPC URL:** `https://rpc.test2.btcs.network`
- **Explorer:** https://scan.test2.btcs.network
- **Faucet:** https://scan.test2.btcs.network/faucet

### Frontend Integration

```javascript
// Core Testnet2 Contract Addresses
export const CONTRACTS = {
  FARM_TOKEN: '0x4ccdc62B9c2e0ef3FcC8329dBfe96823EEd7F473',
  GREEN_POINTS: '0x59315b3ffB558850259bB1C269966BF4dd1eb28E',
  CROP_NFT: '0x3e91E05302a457F367374780f373e418220377DA',
  FARMER_DAO: '0xC23dcB8a45183F74A669b8fCB05Fce15291CF789',
  AGRI_BOUNTIES: '0xD490818200d1B0Fa2091B514EE8AE202E86E38ED'
};

export const NETWORK = {
  chainId: 1114,
  name: 'Core Testnet2',
  rpcUrl: 'https://rpc.test2.btcs.network'
};
```

**Status:** ✅ All contracts deployed and verified
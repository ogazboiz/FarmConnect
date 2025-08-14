'use client';

import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Example ABI - replace with your actual contract ABI
const ExampleABI = [
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Example contract address - replace with your actual contract address
const ExampleContractAddress = "0x..."; // Your contract address here

export default function AppKitExample() {
  const { address, isConnected } = useAccount();
  
  // Example of reading from a smart contract using Wagmi hooks
  const { data: totalSupply, isLoading, error } = useReadContract({
    abi: ExampleABI,
    address: ExampleContractAddress,
    functionName: "totalSupply",
  });

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Connect Your Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Connect your wallet to interact with smart contracts
          </p>
          <appkit-button />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Smart Contract Interaction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Connected Address:</p>
          <p className="text-xs font-mono bg-gray-100 p-2 rounded">
            {address}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Total Supply:</p>
          {isLoading ? (
            <p className="text-sm">Loading...</p>
          ) : error ? (
            <p className="text-sm text-red-600">Error: {error.message}</p>
          ) : (
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">
              {totalSupply?.toString() || '0'}
            </p>
          )}
        </div>

        <div className="pt-4">
          <p className="text-xs text-gray-500">
            This example shows how to use AppKit with Wagmi hooks for smart contract interaction.
            Replace the ABI and contract address with your actual contract details.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Comprehensive debug component
"use client"

import { useReadContract } from 'wagmi'
import { getContractAddresses, FarmTokenABI } from '@/config'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

export function ComprehensiveDebug() {
  const { address, isConnected, chain } = useAccount()
  const contracts = getContractAddresses()
  
  // Individual contract calls for debugging
  const nameCall = useReadContract({
    address: contracts.FARM_TOKEN,
    abi: FarmTokenABI,
    functionName: 'name',
  })
  
  const symbolCall = useReadContract({
    address: contracts.FARM_TOKEN,
    abi: FarmTokenABI,
    functionName: 'symbol',
  })
  
  const decimalsCall = useReadContract({
    address: contracts.FARM_TOKEN,
    abi: FarmTokenABI,
    functionName: 'decimals',
  })

  const totalSupplyCall = useReadContract({
    address: contracts.FARM_TOKEN,
    abi: FarmTokenABI,
    functionName: 'totalSupply',
  })

  useEffect(() => {
    console.log("=== COMPREHENSIVE DEBUG ===")
    console.log("Wallet Connected:", isConnected)
    console.log("Wallet Address:", address)
    console.log("Current Chain:", chain)
    console.log("Contract Addresses:", contracts)
    
    console.log("\n=== CONTRACT CALLS ===")
    console.log("Name Call:", nameCall)
    console.log("Symbol Call:", symbolCall)
    console.log("Decimals Call:", decimalsCall)
    console.log("Total Supply Call:", totalSupplyCall)
    
    console.log("\n=== ENVIRONMENT ===")
    console.log("Environment:", process.env.NEXT_PUBLIC_ENVIRONMENT)
    console.log("Farm Token Address:", contracts.FARM_TOKEN)
    
    console.log("\n=== ABI SAMPLE ===")
    console.log("First few ABI entries:", FarmTokenABI.slice(0, 3))
    
    // Check if the contract address is valid
    if (contracts.FARM_TOKEN === "0x0000000000000000000000000000000000000000") {
      console.error("❌ Contract address is zero address!")
    }
    
    if (!contracts.FARM_TOKEN) {
      console.error("❌ Contract address is undefined!")
    }
  }, [nameCall, symbolCall, decimalsCall, totalSupplyCall, isConnected, address, chain, contracts])

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="font-bold mb-4 text-red-800">🔍 Comprehensive Debug</h3>
      
      <div className="space-y-3 text-sm">
        <div>
          <strong>Wallet:</strong> {isConnected ? "✅ Connected" : "❌ Not Connected"}
        </div>
        
        <div>
          <strong>Chain:</strong> {chain?.name || "Unknown"} (ID: {chain?.id || "Unknown"})
        </div>
        
        <div>
          <strong>Environment:</strong> {process.env.NEXT_PUBLIC_ENVIRONMENT || "undefined"}
        </div>
        
        <div>
          <strong>Contract Address:</strong> 
          <code className="ml-2 bg-gray-200 px-1 rounded">{contracts.FARM_TOKEN}</code>
        </div>
        
        <div className="border-t pt-3">
          <h4 className="font-semibold mb-2">Contract Calls:</h4>
          
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-white p-2 rounded border">
              <strong>Name:</strong> 
              <span className="ml-2">
                {nameCall.isLoading ? "Loading..." : 
                 nameCall.error ? `Error: ${nameCall.error.message}` : 
                 nameCall.data || "undefined"}
              </span>
            </div>
            
            <div className="bg-white p-2 rounded border">
              <strong>Symbol:</strong> 
              <span className="ml-2">
                {symbolCall.isLoading ? "Loading..." : 
                 symbolCall.error ? `Error: ${symbolCall.error.message}` : 
                 symbolCall.data || "undefined"}
              </span>
            </div>
            
            <div className="bg-white p-2 rounded border">
              <strong>Decimals:</strong> 
              <span className="ml-2">
                {decimalsCall.isLoading ? "Loading..." : 
                 decimalsCall.error ? `Error: ${decimalsCall.error.message}` : 
                 decimalsCall.data?.toString() || "undefined"}
              </span>
            </div>
            
            <div className="bg-white p-2 rounded border">
              <strong>Total Supply:</strong> 
              <span className="ml-2">
                {totalSupplyCall.isLoading ? "Loading..." : 
                 totalSupplyCall.error ? `Error: ${totalSupplyCall.error.message}` : 
                 totalSupplyCall.data?.toString() || "undefined"}
              </span>
            </div>
          </div>
        </div>
        
        {nameCall.error && (
          <div className="bg-red-100 p-2 rounded border border-red-300">
            <strong className="text-red-800">Error Details:</strong>
            <pre className="text-xs mt-1 text-red-700">{JSON.stringify(nameCall.error, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
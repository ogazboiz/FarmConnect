// Config debug component
"use client"

import { useEffect } from 'react'

export function ConfigDebug() {
  useEffect(() => {
    console.log("=== CONFIG DEBUG ===")
    console.log("NEXT_PUBLIC_ENVIRONMENT:", process.env.NEXT_PUBLIC_ENVIRONMENT)
    console.log("NEXT_PUBLIC_MANTLE_TESTNET_FARM_TOKEN_ADDRESS:", process.env.NEXT_PUBLIC_MANTLE_TESTNET_FARM_TOKEN_ADDRESS)
    console.log("NEXT_PUBLIC_MANTLE_TESTNET_GREEN_POINTS_ADDRESS:", process.env.NEXT_PUBLIC_MANTLE_TESTNET_GREEN_POINTS_ADDRESS)
    console.log("NEXT_PUBLIC_MANTLE_TESTNET_CROP_NFT_ADDRESS:", process.env.NEXT_PUBLIC_MANTLE_TESTNET_CROP_NFT_ADDRESS)
    console.log("NEXT_PUBLIC_MANTLE_TESTNET_FARMER_DAO_ADDRESS:", process.env.NEXT_PUBLIC_MANTLE_TESTNET_FARMER_DAO_ADDRESS)
    console.log("NEXT_PUBLIC_MANTLE_TESTNET_AGRI_BOUNTIES_ADDRESS:", process.env.NEXT_PUBLIC_MANTLE_TESTNET_AGRI_BOUNTIES_ADDRESS)
  }, [])

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-bold mb-4 text-blue-800">⚙️ Config Debug</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Environment:</strong> {process.env.NEXT_PUBLIC_ENVIRONMENT || "undefined"}
        </div>
        
        <div>
          <strong>Farm Token:</strong> 
          <code className="ml-2 bg-gray-200 px-1 rounded text-xs">
            {process.env.NEXT_PUBLIC_MANTLE_TESTNET_FARM_TOKEN_ADDRESS || "undefined"}
          </code>
        </div>
        
        <div>
          <strong>Green Points:</strong> 
          <code className="ml-2 bg-gray-200 px-1 rounded text-xs">
            {process.env.NEXT_PUBLIC_MANTLE_TESTNET_GREEN_POINTS_ADDRESS || "undefined"}
          </code>
        </div>
        
        <div>
          <strong>Crop NFT:</strong> 
          <code className="ml-2 bg-gray-200 px-1 rounded text-xs">
            {process.env.NEXT_PUBLIC_MANTLE_TESTNET_CROP_NFT_ADDRESS || "undefined"}
          </code>
        </div>
        
        <div>
          <strong>Farmer DAO:</strong> 
          <code className="ml-2 bg-gray-200 px-1 rounded text-xs">
            {process.env.NEXT_PUBLIC_MANTLE_TESTNET_FARMER_DAO_ADDRESS || "undefined"}
          </code>
        </div>
        
        <div>
          <strong>Agri Bounties:</strong> 
          <code className="ml-2 bg-gray-200 px-1 rounded text-xs">
            {process.env.NEXT_PUBLIC_MANTLE_TESTNET_AGRI_BOUNTIES_ADDRESS || "undefined"}
          </code>
        </div>
      </div>
    </div>
  )
}
// src/app/api/getAllCrops/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'
import { CropNFTABI, getContractAddresses } from '@/config'

const contracts = getContractAddresses()

// Create provider for your chain
const provider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.sepolia.mantle.xyz'
)

export async function GET(request: NextRequest) {
  try {
    // Create contract instance
    const cropNFTContract = new ethers.Contract(
      contracts.CROP_NFT,
      CropNFTABI,
      provider
    )

    // Get total supply first
    const totalSupply = await cropNFTContract.totalSupply()
    console.log('Total supply:', totalSupply.toString())

    if (!totalSupply || totalSupply === 0n) {
      return NextResponse.json([])
    }

    const crops = []
    
    // Fetch all crops
    for (let i = 1; i <= Number(totalSupply); i++) {
      try {
        // Get crop batch data
        const cropData = await cropNFTContract.getCropBatch(BigInt(i))
        
        // Get engagement data separately
        const engagementData = await cropNFTContract.getEngagementData(BigInt(i))
        
        console.log(`Crop ${i} data:`, cropData)
        console.log(`Crop ${i} engagement:`, engagementData)

        // Check if crop exists (farmer is not zero address)
        if (cropData && cropData.farmer !== '0x0000000000000000000000000000000000000000') {
          crops.push({
            tokenId: i,
            cropType: cropData.cropType,
            location: cropData.location,
            farmer: cropData.farmer,
            status: cropData.status,
            isOrganic: cropData.isOrganic,
            quantity: cropData.quantity.toString(),
            createdAt: cropData.createdAt.toString(),
            harvestDate: cropData.harvestDate.toString(),
            cropImage: cropData.cropImage,
            certifications: cropData.certifications,
            // Add engagement data
            scanCount: engagementData.totalScans.toString(),
            ratingSum: engagementData.averageRating.toString(), // Note: this is actually averageRating * totalRatings in your contract
            ratingCount: engagementData.totalRatings.toString(),
            socialShares: engagementData.socialShares.toString()
          })
        }
      } catch (error) {
        console.log(`Crop ${i} doesn't exist or failed to fetch:`, error)
      }
    }

    console.log('Total crops found:', crops.length)
    return NextResponse.json(crops)
  } catch (error) {
    console.error('Error fetching all crops:', error)
    return NextResponse.json(
      { error: `Failed to fetch crops: ${error.message}` },
      { status: 500 }
    )
  }
}
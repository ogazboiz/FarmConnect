// src/app/api/getCropBatch/route.ts
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
    const { searchParams } = new URL(request.url)
    const tokenId = searchParams.get('tokenId')

    if (!tokenId) {
      return NextResponse.json(
        { error: 'Token ID is required' },
        { status: 400 }
      )
    }

    // Create contract instance
    const cropNFTContract = new ethers.Contract(
      contracts.CROP_NFT,
      CropNFTABI,
      provider
    )

    // Check if token exists
    const tokenExists = await cropNFTContract.tokenExists(BigInt(tokenId))
    if (!tokenExists) {
      return NextResponse.json(
        { error: 'Crop not found' },
        { status: 404 }
      )
    }

    // Get crop batch data
    const cropData = await cropNFTContract.getCropBatch(BigInt(tokenId))
    
    // Get engagement data
    const engagementData = await cropNFTContract.getEngagementData(BigInt(tokenId))

    if (!cropData || cropData.farmer === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json(
        { error: 'Crop not found' },
        { status: 404 }
      )
    }

    // Format the response
    const formattedCropData = {
      cropType: cropData.cropType,
      location: cropData.location,
      farmer: cropData.farmer,
      status: cropData.status,
      isOrganic: cropData.isOrganic,
      quantity: cropData.quantity,
      createdAt: cropData.createdAt,
      harvestDate: cropData.harvestDate,
      cropImage: cropData.cropImage,
      certifications: cropData.certifications,
      // Add engagement data
      scanCount: engagementData.totalScans,
      ratingSum: engagementData.averageRating, // This is actually averageRating in your contract
      ratingCount: engagementData.totalRatings,
      socialShares: engagementData.socialShares
    }

    return NextResponse.json(formattedCropData)
  } catch (error) {
    console.error('Error fetching crop:', error)
    return NextResponse.json(
      { error: `Failed to fetch crop data: ${error.message}` },
      { status: 500 }
    )
  }
}

// Alternative POST method for getCropBatch
export async function POST(request: NextRequest) {
  try {
    const { tokenId } = await request.json()

    if (!tokenId) {
      return NextResponse.json(
        { error: 'Token ID is required' },
        { status: 400 }
      )
    }

    // Create contract instance
    const cropNFTContract = new ethers.Contract(
      contracts.CROP_NFT,
      CropNFTABI,
      provider
    )

    // Check if token exists
    const tokenExists = await cropNFTContract.tokenExists(BigInt(tokenId))
    if (!tokenExists) {
      return NextResponse.json(
        { error: 'Crop not found' },
        { status: 404 }
      )
    }

    // Get crop batch data
    const cropData = await cropNFTContract.getCropBatch(BigInt(tokenId))
    
    // Get engagement data
    const engagementData = await cropNFTContract.getEngagementData(BigInt(tokenId))

    if (!cropData || cropData.farmer === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json(
        { error: 'Crop not found' },
        { status: 404 }
      )
    }

    // Format the response
    const formattedCropData = {
      cropType: cropData.cropType,
      location: cropData.location,
      farmer: cropData.farmer,
      status: cropData.status,
      isOrganic: cropData.isOrganic,
      quantity: cropData.quantity,
      createdAt: cropData.createdAt,
      harvestDate: cropData.harvestDate,
      cropImage: cropData.cropImage,
      certifications: cropData.certifications,
      // Add engagement data
      scanCount: engagementData.totalScans,
      ratingSum: engagementData.averageRating,
      ratingCount: engagementData.totalRatings,
      socialShares: engagementData.socialShares
    }

    return NextResponse.json(formattedCropData)
  } catch (error) {
    console.error('Error fetching crop:', error)
    return NextResponse.json(
      { error: `Failed to fetch crop data: ${error.message}` },
      { status: 500 }
    )
  }
}
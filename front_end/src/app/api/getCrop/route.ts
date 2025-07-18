// src/app/api/getCropBatch/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { mantleSepoliaTestnet } from 'viem/chains' // or your chain
import { CropNFTABI, getContractAddresses } from '@/config'

const contracts = getContractAddresses()

// Create a public client for reading from the blockchain
const publicClient = createPublicClient({
  chain: mantleSepoliaTestnet, // Replace with your actual chain
  transport: http()
})

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

    // Read crop data from contract
    const cropData = await publicClient.readContract({
      address: contracts.CROP_NFT as `0x${string}`,
      abi: CropNFTABI,
      functionName: 'getCropBatch',
      args: [BigInt(tokenId)]
    })

    if (!cropData || cropData.farmer === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json(
        { error: 'Crop not found' },
        { status: 404 }
      )
    }

    // Format the response with proper types
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
      scanCount: cropData.scanCount,
      ratingSum: cropData.ratingSum,
      ratingCount: cropData.ratingCount
    }

    return NextResponse.json(formattedCropData)
  } catch (error) {
    console.error('Error fetching crop:', error)
    return NextResponse.json(
      { error: 'Failed to fetch crop data' },
      { status: 500 }
    )
  }
}

// Alternative POST method for getCropBatch (if you prefer POST)
export async function POST(request: NextRequest) {
  try {
    const { tokenId } = await request.json()

    if (!tokenId) {
      return NextResponse.json(
        { error: 'Token ID is required' },
        { status: 400 }
      )
    }

    // Read crop data from contract
    const cropData = await publicClient.readContract({
      address: contracts.CROP_NFT as `0x${string}`,
      abi: CropNFTABI,
      functionName: 'getCropBatch',
      args: [BigInt(tokenId)]
    })

    if (!cropData || cropData.farmer === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json(
        { error: 'Crop not found' },
        { status: 404 }
      )
    }

    // Format the response with proper types
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
      scanCount: cropData.scanCount,
      ratingSum: cropData.ratingSum,
      ratingCount: cropData.ratingCount
    }

    return NextResponse.json(formattedCropData)
  } catch (error) {
    console.error('Error fetching crop:', error)
    return NextResponse.json(
      { error: 'Failed to fetch crop data' },
      { status: 500 }
    )
  }
}
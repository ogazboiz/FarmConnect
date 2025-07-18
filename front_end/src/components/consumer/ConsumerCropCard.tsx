// src/components/consumer/ConsumerCropCard.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, Calendar, Star, Eye, QrCode, Share, Leaf, 
  User, Hash, Lock, ExternalLink, TrendingUp 
} from "lucide-react"

interface CropData {
  tokenId: number
  cropType: string
  location: string
  farmer: string
  status: string
  isOrganic: boolean
  quantity: bigint | string
  createdAt: bigint | string
  harvestDate: bigint | string
  cropImage: string
  certifications: string
  scanCount: bigint | string
  ratingSum: bigint | string
  ratingCount: bigint | string
  socialShares?: bigint | string
}

interface ConsumerCropCardProps {
  crop: CropData
  onScan: (tokenId: bigint) => Promise<void>
  onRate: (tokenId: bigint, rating: number) => Promise<void>
  onShare: (tokenId: bigint) => Promise<void>
  userAddress?: string
  onConnectPrompt: () => void
}

export function ConsumerCropCard({
  crop,
  onScan,
  onRate,
  onShare,
  userAddress,
  onConnectPrompt
}: ConsumerCropCardProps) {
  const router = useRouter()
  const [isInteracting, setIsInteracting] = useState(false)

  // Helper functions
  const getImageUrl = (imageString: string) => {
    if (!imageString) return null
    
    if (imageString.startsWith('ipfs://')) {
      return imageString.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
    }
    
    if (imageString.startsWith('https://')) {
      return imageString
    }
    
    if (imageString.startsWith('baf') || imageString.startsWith('Qm')) {
      return `https://gateway.pinata.cloud/ipfs/${imageString}`
    }
    
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "planted": return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "growing": return "bg-green-100 text-green-800 border-green-300"
      case "flowering": return "bg-purple-100 text-purple-800 border-purple-300"
      case "fruiting": return "bg-orange-100 text-orange-800 border-orange-300"
      case "harvested": return "bg-blue-100 text-blue-800 border-blue-300"
      default: return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const formatDate = (timestamp: bigint | string) => {
    const num = typeof timestamp === 'string' ? parseInt(timestamp) : Number(timestamp)
    if (!num || num === 0) return "Not set"
    return new Date(num * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateAverageRating = () => {
    const ratingCount = Number(crop.ratingCount)
    const ratingSum = Number(crop.ratingSum)
    
    if (ratingCount === 0) return 0
    
    // If your contract stores averageRating directly, use it as is
    // If it stores sum of ratings, divide by count
    return ratingSum / ratingCount // Adjust this based on your contract logic
  }

  const handleScan = async () => {
    if (!userAddress) {
      onConnectPrompt()
      return
    }

    setIsInteracting(true)
    try {
      await onScan(BigInt(crop.tokenId))
    } catch (error) {
      console.error('Error scanning:', error)
    } finally {
      setIsInteracting(false)
    }
  }

  const handleViewDetails = () => {
    router.push(`/scan/${crop.tokenId}`)
  }

  const imageUrl = getImageUrl(crop.cropImage)
  const averageRating = calculateAverageRating()
  const scanCount = Number(crop.scanCount)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm border border-emerald-200 hover:border-emerald-300">
      {/* Crop Image */}
      <div className="aspect-square bg-gradient-to-br from-emerald-100 to-green-100 relative overflow-hidden rounded-t-lg">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={crop.cropType} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center bg-emerald-100 ${imageUrl ? 'hidden' : ''}`}>
          <Leaf className="w-16 h-16 text-emerald-400" />
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge className={`${getStatusColor(crop.status)} border backdrop-blur-sm text-xs`}>
            {crop.status}
          </Badge>
        </div>
        
        {/* Organic Badge */}
        {crop.isOrganic && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
              🌿 Organic
            </Badge>
          </div>
        )}

        {/* Popularity Indicators */}
        <div className="absolute bottom-3 left-3 flex gap-1">
          {scanCount > 50 && (
            <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">
              🔥 Trending
            </Badge>
          )}
          {scanCount > 100 && (
            <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs">
              ⭐ Popular
            </Badge>
          )}
          {scanCount === 0 && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
              🆕 New
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
              {crop.cropType}
            </CardTitle>
            <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
              <MapPin className="w-3 h-3" />
              <span>{crop.location}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewDetails}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="flex items-center justify-center gap-1">
              <Eye className="w-3 h-3 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">{scanCount}</span>
            </div>
            <p className="text-xs text-slate-500">Scans</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-sm font-medium text-slate-700">
                {Number(crop.ratingCount) > 0 ? averageRating.toFixed(1) : '-'}
              </span>
            </div>
            <p className="text-xs text-slate-500">Rating</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center gap-1">
              <Hash className="w-3 h-3 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">#{crop.tokenId}</span>
            </div>
            <p className="text-xs text-slate-500">NFT ID</p>
          </div>
        </div>

        {/* Farmer Info */}
        <div className="bg-emerald-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-emerald-800">
                {crop.farmer.slice(0, 6)}...{crop.farmer.slice(-4)}
              </p>
              <p className="text-xs text-emerald-600">Verified Farmer</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleScan}
            disabled={!userAddress || isInteracting}
            size="sm"
            className={`${
              userAddress 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {!userAddress ? (
              <>
                <Lock className="w-3 h-3 mr-1" />
                Connect
              </>
            ) : (
              <>
                <QrCode className="w-3 h-3 mr-1" />
                Scan
              </>
            )}
          </Button>
          
          <Button
            onClick={handleViewDetails}
            variant="outline"
            size="sm"
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            View Details
          </Button>
        </div>

        {/* Rewards Info */}
        {userAddress && (
          <div className="bg-green-50 p-2 rounded text-center">
            <p className="text-xs text-green-700">
              💚 Scan: +10 pts • Rate: +20 pts • Share: +25 pts
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
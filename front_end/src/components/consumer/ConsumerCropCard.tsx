// src/components/consumer/ConsumerCropCard.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
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
      case "planted": return "bg-yellow-800/80 text-yellow-200 border-yellow-600/40"
      case "growing": return "bg-green-800/80 text-green-200 border-green-600/40"
      case "flowering": return "bg-purple-800/80 text-purple-200 border-purple-600/40"
      case "fruiting": return "bg-orange-800/80 text-orange-200 border-orange-600/40"
      case "harvested": return "bg-blue-800/80 text-blue-200 border-blue-600/40"
      default: return "bg-gray-800/80 text-gray-200 border-gray-600/40"
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
    <Card className="group hover:shadow-xl transition-all duration-300 bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40 hover:border-emerald-600/60 overflow-hidden">
      {/* Crop Image */}
      <div className="aspect-[4/3] bg-gradient-to-br from-emerald-800/60 to-green-800/60 relative overflow-hidden">
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
        <div className={`w-full h-full flex items-center justify-center bg-emerald-800/60 ${imageUrl ? 'hidden' : ''}`}>
          <Leaf className="w-12 h-12 text-emerald-400" />
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge className={`${getStatusColor(crop.status)} border backdrop-blur-sm text-xs px-2 py-0.5`}>
            {crop.status}
          </Badge>
        </div>
        
        {/* Organic Badge */}
        {crop.isOrganic && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-green-800/80 text-green-200 border-green-600/40 text-xs px-2 py-0.5">
              🌿 Organic
            </Badge>
          </div>
        )}

        {/* Popularity Indicators */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {scanCount > 50 && (
            <Badge className="bg-red-800/80 text-red-200 border-red-600/40 text-xs px-1.5 py-0.5">
              🔥
            </Badge>
          )}
          {scanCount > 100 && (
            <Badge className="bg-purple-800/80 text-purple-200 border-purple-600/40 text-xs px-1.5 py-0.5">
              ⭐
            </Badge>
          )}
          {scanCount === 0 && (
            <Badge className="bg-blue-800/80 text-blue-200 border-blue-600/40 text-xs px-1.5 py-0.5">
              🆕
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-emerald-100 group-hover:text-emerald-200 transition-colors text-base truncate">
              {crop.cropType}
            </h3>
            <div className="flex items-center gap-1 text-xs text-emerald-300/80 mt-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{crop.location}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewDetails}
            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-700/30 p-1 h-auto ml-2"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Compact Stats */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-emerald-300/80">
            <Eye className="w-3 h-3" />
            <span>{scanCount}</span>
          </div>
          
          <div className="flex items-center gap-1 text-emerald-300/80">
            <Star className="w-3 h-3 text-yellow-400" />
            <span>
              {Number(crop.ratingCount) > 0 ? averageRating.toFixed(1) : '-'}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-emerald-300/80">
            <Hash className="w-3 h-3" />
            <span>#{crop.tokenId}</span>
          </div>
        </div>

        {/* Farmer Info - Compact */}
        <div className="bg-emerald-700/30 p-2 rounded-md border border-emerald-600/30">
          <div className="flex items-center gap-2">
            <User className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-emerald-200 truncate">
                {crop.farmer.slice(0, 6)}...{crop.farmer.slice(-4)}
              </p>
              <p className="text-xs text-emerald-400/80">Verified</p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Compact */}
        <div className="flex gap-2">
          <Button
            onClick={handleScan}
            disabled={!userAddress || isInteracting}
            size="sm"
            className={`flex-1 h-8 text-xs ${
              userAddress 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-emerald-800/50 text-emerald-400/70 cursor-not-allowed border border-emerald-700/40'
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
            className="flex-1 h-8 text-xs border-emerald-600/40 text-emerald-300 hover:bg-emerald-700/30"
          >
            Details
          </Button>
        </div>

        {/* Rewards Info - Compact */}
        {userAddress && (
          <div className="bg-emerald-700/20 p-1.5 rounded text-center border border-emerald-600/30">
            <p className="text-xs text-emerald-300/90">
              💚 +10 • ⭐ +20 • 🔗 +25 pts
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
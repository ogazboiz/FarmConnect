// src/components/consumer/ConsumerCropCard.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  MapPin, Calendar, Star, Eye, QrCode, Share, Leaf, 
  User, Hash, Lock, ExternalLink, TrendingUp, ShoppingCart,
  MessageSquare, DollarSign, Package, Truck, Scale
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
  // Business fields
  bulkPrice?: string
  minimumOrder?: number
  businessRating?: number
  businessOrderCount?: number
  estimatedDelivery?: string
}

interface ConsumerCropCardProps {
  crop: CropData
  onScan: (tokenId: bigint) => Promise<void>
  onRate: (tokenId: bigint, rating: number) => Promise<void>
  onShare: (tokenId: bigint) => Promise<void>
  userAddress?: string
  userType?: 'consumer' | 'business'
  onConnectPrompt: () => void
  isInteracting?: boolean
  // Business-specific props
  onOrder?: (tokenId: bigint, quantity: number, specialRequests?: string) => Promise<void>
  onContact?: (tokenId: bigint) => Promise<void>
  onQuoteRequest?: (tokenId: bigint, quantity: number, requirements: string) => Promise<void>
  businessProfile?: {
    name: string
    type: string
    location: string
    verified: boolean
  }
}

export function ConsumerCropCard({
  crop,
  onScan,
  onRate,
  onShare,
  userAddress,
  userType = 'consumer',
  onConnectPrompt,
  isInteracting = false,
  onOrder,
  onContact,
  onQuoteRequest,
  businessProfile
}: ConsumerCropCardProps) {
  const router = useRouter()
  const [isCardInteracting, setIsCardInteracting] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderQuantity, setOrderQuantity] = useState<number>(crop.minimumOrder || 25)
  const [specialRequests, setSpecialRequests] = useState("")

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
      case "available": return "bg-emerald-800/80 text-emerald-200 border-emerald-600/40"
      default: return "bg-gray-800/80 text-gray-200 border-gray-600/40"
    }
  }

  const getAvailabilityBadge = () => {
    const availableKg = Number(crop.quantity)
    const harvestDate = Number(crop.harvestDate)
    const now = Date.now() / 1000
    
    if (harvestDate > now) {
      const daysUntil = Math.ceil((harvestDate - now) / (24 * 60 * 60))
      return {
        text: `Ready in ${daysUntil}d`,
        color: "bg-amber-800/80 text-amber-200 border-amber-600/40"
      }
    } else if (availableKg > 0) {
      return {
        text: "Available Now",
        color: "bg-green-800/80 text-green-200 border-green-600/40"
      }
    } else {
      return {
        text: "Sold Out",
        color: "bg-red-800/80 text-red-200 border-red-600/40"
      }
    }
  }

  const calculateAverageRating = () => {
    const ratingCount = Number(crop.ratingCount)
    const ratingSum = Number(crop.ratingSum)
    
    if (ratingCount === 0) return 0
    return ratingSum / ratingCount
  }

  const calculateTotalPrice = () => {
    const pricePerKg = parseFloat(crop.bulkPrice || "0")
    return (orderQuantity * pricePerKg).toFixed(2)
  }

  const calculateDistance = () => {
    // Mock distance calculation - replace with real geolocation
    return Math.floor(Math.random() * 50) + 5
  }

  // Consumer handlers
  const handleScan = async () => {
    if (!userAddress) {
      onConnectPrompt()
      return
    }

    setIsCardInteracting(true)
    try {
      await onScan(BigInt(crop.tokenId))
    } catch (error) {
      console.error('Error scanning:', error)
    } finally {
      setIsCardInteracting(false)
    }
  }

  // Business handlers
  const handleOrder = async () => {
    if (!userAddress || userType !== 'business' || !onOrder) {
      onConnectPrompt()
      return
    }

    setIsCardInteracting(true)
    try {
      await onOrder(BigInt(crop.tokenId), orderQuantity, specialRequests)
      setShowOrderForm(false)
    } catch (error) {
      console.error('Error placing order:', error)
    } finally {
      setIsCardInteracting(false)
    }
  }

  const handleContact = async () => {
    if (!userAddress || !onContact) {
      onConnectPrompt()
      return
    }

    setIsCardInteracting(true)
    try {
      await onContact(BigInt(crop.tokenId))
    } catch (error) {
      console.error('Error contacting farmer:', error)
    } finally {
      setIsCardInteracting(false)
    }
  }

  const handleQuoteRequest = async () => {
    if (!userAddress || userType !== 'business' || !onQuoteRequest) {
      onConnectPrompt()
      return
    }

    setIsCardInteracting(true)
    try {
      await onQuoteRequest(BigInt(crop.tokenId), orderQuantity, specialRequests)
    } catch (error) {
      console.error('Error requesting quote:', error)
    } finally {
      setIsCardInteracting(false)
    }
  }

  const handleViewDetails = () => {
    router.push(`/scan/${crop.tokenId}`)
  }

  const imageUrl = getImageUrl(crop.cropImage)
  const averageRating = calculateAverageRating()
  const scanCount = Number(crop.scanCount)
  const availableKg = Number(crop.quantity)
  const minimumOrder = crop.minimumOrder || 25
  const distance = calculateDistance()
  const availabilityBadge = getAvailabilityBadge()

  // Show business view for business users
  if (userType === 'business') {
    return (
      <Card className="overflow-hidden transition-all duration-300 border group hover:shadow-xl bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40 hover:border-emerald-600/60">
        {/* Crop Image */}
        <div className="aspect-[4/3] bg-gradient-to-br from-emerald-800/60 to-green-800/60 relative overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={crop.cropType} 
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center bg-emerald-800/60 ${imageUrl ? 'hidden' : ''}`}>
            <Leaf className="w-12 h-12 text-emerald-400" />
          </div>
          
          {/* Availability Badge */}
          <div className="absolute top-2 right-2">
            <Badge className={`${availabilityBadge.color} border backdrop-blur-sm text-xs px-2 py-0.5`}>
              {availabilityBadge.text}
            </Badge>
          </div>
          
          {/* Organic Badge */}
          {crop.isOrganic && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-green-800/80 text-green-200 border-green-600/40 text-xs px-2 py-0.5">
                🌿 Certified Organic
              </Badge>
            </div>
          )}

          {/* Business Popularity Indicators */}
          <div className="absolute flex gap-1 bottom-2 left-2">
            {(crop.businessOrderCount || 0) > 10 && (
              <Badge className="bg-blue-800/80 text-blue-200 border-blue-600/40 text-xs px-1.5 py-0.5">
                🏆 Top Supplier
              </Badge>
            )}
            {(crop.businessOrderCount || 0) > 25 && (
              <Badge className="bg-purple-800/80 text-purple-200 border-purple-600/40 text-xs px-1.5 py-0.5">
                ⭐ Premium
              </Badge>
            )}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Header with Price */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold transition-colors text-emerald-100 group-hover:text-emerald-200">
                {crop.cropType}
              </h3>
              <div className="flex items-center gap-1 text-xs text-emerald-300/80 mt-0.5">
                <MapPin className="flex-shrink-0 w-3 h-3" />
                <span>{crop.location} • {distance} miles</span>
              </div>
            </div>
            <div className="ml-2 text-right">
              <div className="text-lg font-bold text-emerald-200">
                ${crop.bulkPrice || '4.20'}/kg
              </div>
              <div className="text-xs text-emerald-300/80">
                Min: {minimumOrder}kg
              </div>
            </div>
          </div>

          {/* Business Stats */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 text-center border rounded bg-emerald-700/30 border-emerald-600/30">
              <div className="font-medium text-emerald-200">{availableKg}kg</div>
              <div className="text-emerald-400/80">Available</div>
            </div>
            
            <div className="p-2 text-center border rounded bg-emerald-700/30 border-emerald-600/30">
              <div className="flex items-center justify-center gap-0.5">
                <Star className="w-3 h-3 text-yellow-400" />
                <span className="font-medium text-emerald-200">
                  {(crop.businessRating || 0) > 0 ? (crop.businessRating || 0).toFixed(1) : '-'}
                </span>
              </div>
              <div className="text-emerald-400/80">B2B Rating</div>
            </div>
            
            <div className="p-2 text-center border rounded bg-emerald-700/30 border-emerald-600/30">
              <div className="font-medium text-emerald-200">{crop.businessOrderCount || 0}</div>
              <div className="text-emerald-400/80">Orders</div>
            </div>
          </div>

          {/* Farmer Info */}
          <div className="p-2 border rounded-md bg-emerald-700/30 border-emerald-600/30">
            <div className="flex items-center gap-2">
              <User className="flex-shrink-0 w-3 h-3 text-emerald-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate text-emerald-200">
                  {crop.farmer.slice(0, 6)}...{crop.farmer.slice(-4)}
                </p>
                <p className="text-xs text-emerald-400/80">Verified Farmer</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-300/80">
                <Truck className="w-3 h-3" />
                <span>{crop.estimatedDelivery || "2-3 days"}</span>
              </div>
            </div>
          </div>

          {/* Quick Order Form */}
          {showOrderForm ? (
            <div className="p-3 space-y-3 border rounded-lg bg-emerald-700/20 border-emerald-600/30">
              <div>
                <label className="block mb-1 text-xs text-emerald-300">Quantity (kg)</label>
                <Input
                  type="number"
                  min={minimumOrder}
                  max={availableKg}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Number(e.target.value))}
                  className="h-8 text-sm bg-emerald-800/50 border-emerald-600/40 text-emerald-100"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-xs text-emerald-300">Special Requirements (optional)</label>
                <Input
                  placeholder="Delivery notes, quality specs, etc."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="h-8 text-sm bg-emerald-800/50 border-emerald-600/40 text-emerald-100"
                />
              </div>

              <div className="p-2 border rounded bg-emerald-700/40 border-emerald-600/40">
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-300">Total:</span>
                  <span className="font-bold text-emerald-100">${calculateTotalPrice()}</span>
                </div>
                <div className="mt-1 text-xs text-emerald-400/80">
                  + delivery fee • 5% platform fee
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleOrder}
                  disabled={isCardInteracting || isInteracting || orderQuantity < minimumOrder}
                  size="sm"
                  className="flex-1 h-8 text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  {isCardInteracting || isInteracting ? "Processing..." : "Place Order"}
                </Button>
                <Button
                  onClick={() => setShowOrderForm(false)}
                  variant="outline"
                  size="sm"
                  className="h-8 border-emerald-600/40 text-emerald-300 hover:bg-emerald-700/30"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            /* Action Buttons */
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowOrderForm(true)}
                  disabled={!userAddress || userType !== 'business' || availableKg < minimumOrder}
                  size="sm"
                  className={`flex-1 h-8 text-xs ${
                    userAddress && userType === 'business' && availableKg >= minimumOrder
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-emerald-800/50 text-emerald-400/70 cursor-not-allowed border border-emerald-700/40'
                  }`}
                >
                  {!userAddress ? (
                    <>
                      <Lock className="w-3 h-3 mr-1" />
                      Connect Wallet
                    </>
                  ) : userType !== 'business' ? (
                    <>
                      <Package className="w-3 h-3 mr-1" />
                      Business Only
                    </>
                  ) : availableKg < minimumOrder ? (
                    <>
                      <Package className="w-3 h-3 mr-1" />
                      Insufficient Stock
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Quick Order
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleContact}
                  disabled={!userAddress || isCardInteracting || isInteracting}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-emerald-600/40 text-emerald-300 hover:bg-emerald-700/30"
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Contact
                </Button>
              </div>

              <Button
                onClick={handleQuoteRequest}
                disabled={!userAddress || userType !== 'business' || isCardInteracting || isInteracting}
                variant="outline"
                size="sm"
                className="w-full text-xs border-emerald-600/40 text-emerald-300 hover:bg-emerald-700/30 h-7"
              >
                <DollarSign className="w-3 h-3 mr-1" />
                Request Custom Quote
              </Button>
            </div>
          )}

          {/* Business Benefits */}
          {userAddress && userType === 'business' && (
            <div className="p-2 text-center border rounded bg-emerald-700/20 border-emerald-600/30">
              <p className="text-xs text-emerald-300/90">
                💼 B2B Benefits: Volume discounts • Direct farmer contact • Flexible delivery
              </p>
            </div>
          )}
        </div>
      </Card>
    )
  }

  // Consumer view (original)
  return (
    <Card className="overflow-hidden transition-all duration-300 border group hover:shadow-xl bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40 hover:border-emerald-600/60">
      {/* Crop Image */}
      <div className="aspect-[4/3] bg-gradient-to-br from-emerald-800/60 to-green-800/60 relative overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={crop.cropType} 
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
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
        <div className="absolute flex gap-1 bottom-2 left-2">
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
            <h3 className="text-base font-semibold truncate transition-colors text-emerald-100 group-hover:text-emerald-200">
              {crop.cropType}
            </h3>
            <div className="flex items-center gap-1 text-xs text-emerald-300/80 mt-0.5">
              <MapPin className="flex-shrink-0 w-3 h-3" />
              <span className="truncate">{crop.location}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewDetails}
            className="h-auto p-1 ml-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-700/30"
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
        <div className="p-2 border rounded-md bg-emerald-700/30 border-emerald-600/30">
          <div className="flex items-center gap-2">
            <User className="flex-shrink-0 w-3 h-3 text-emerald-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate text-emerald-200">
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
            disabled={!userAddress || isCardInteracting || isInteracting}
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
                {isCardInteracting || isInteracting ? "Scanning..." : "Scan"}
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
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, MapPin, Calendar, User, Hash, Star, Share, QrCode, 
  Leaf, Award, TrendingUp, ExternalLink, CheckCircle, Shield,
  Heart, Eye, Loader2, Wallet, Lock
} from "lucide-react"
import { 
  useCropBatch, 
  useCropNFT, 
  useGreenPointsBalance,
} from "@/hooks/useAgriDAO"
import { ConnectWalletModal } from "@/components/consumer/ConnectWalletModal"

export default function CropScanPage() {
  const params = useParams()
  const router = useRouter()
  const { address } = useAccount()
  const [hasScanned, setHasScanned] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [isInteracting, setIsInteracting] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)

  const tokenId = params?.tokenId ? BigInt(params.tokenId as string) : undefined
  const cropBatch = useCropBatch(tokenId)
  const cropNFT = useCropNFT()
  const greenBalance = useGreenPointsBalance(address)

  // Auto-scan on page load if wallet connected
  useEffect(() => {
    if (tokenId && address && !hasScanned) {
      handleAutoScan()
    }
  }, [tokenId, address])

  const handleAutoScan = async () => {
    if (!tokenId || hasScanned || !address) return
    
    setIsInteracting(true)
    try {
      await cropNFT.scanProduct(tokenId)
      setHasScanned(true)
    } catch (error) {
      console.error('Auto-scan failed:', error)
    } finally {
      setIsInteracting(false)
    }
  }

  const handleRating = async (rating: number) => {
    if (!address) {
      setShowConnectModal(true)
      return
    }
    
    if (!tokenId || hasRated) return
    
    setIsInteracting(true)
    try {
      await cropNFT.rateProduct(tokenId, BigInt(rating))
      setSelectedRating(rating)
      setHasRated(true)
    } catch (error) {
      console.error('Rating failed:', error)
    } finally {
      setIsInteracting(false)
    }
  }

  const handleShare = async () => {
    if (!address) {
      setShowConnectModal(true)
      return
    }
    
    if (!tokenId) return
    
    setIsInteracting(true)
    try {
      await cropNFT.shareProduct(tokenId)
      
      // Native share API
      if (navigator.share && cropBatch.data) {
        await navigator.share({
          title: `${cropBatch.data.cropType} from ${cropBatch.data.location}`,
          text: `I just discovered the story behind my ${cropBatch.data.cropType}! This ${cropBatch.data.isOrganic ? 'organic' : ''} crop was grown by farmer ${cropBatch.data.farmer.slice(0,6)}... in ${cropBatch.data.location}. Transparent farming on the blockchain! 🌱`,
          url: window.location.href
        })
      } else {
        // Fallback copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Share failed:', error)
    } finally {
      setIsInteracting(false)
    }
  }

  const handleManualScan = async () => {
    if (!address) {
      setShowConnectModal(true)
      return
    }
    
    if (!tokenId || hasScanned) return
    
    setIsInteracting(true)
    try {
      await cropNFT.scanProduct(tokenId)
      setHasScanned(true)
    } catch (error) {
      console.error('Manual scan failed:', error)
    } finally {
      setIsInteracting(false)
    }
  }

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

  const calculateGrowthProgress = (createdAt: bigint, status: string) => {
    const now = Date.now() / 1000
    const created = Number(createdAt)
    const daysPassed = (now - created) / (24 * 60 * 60)
    
    switch (status?.toLowerCase()) {
      case "planted": return Math.min(daysPassed * 2, 20)
      case "growing": return Math.min(20 + daysPassed * 1.5, 50)
      case "flowering": return Math.min(50 + daysPassed * 2, 75)
      case "fruiting": return Math.min(75 + daysPassed * 3, 90)
      case "harvested": return 100
      default: return 0
    }
  }

  const formatDate = (timestamp: bigint) => {
    if (!timestamp || timestamp === 0n) return "Not set"
    return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateAverageRating = (ratingSum: bigint, ratingCount: bigint) => {
    if (ratingCount === 0n) return 0
    return Number(ratingSum) / Number(ratingCount)
  }

  // Loading state
  if (cropBatch.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-500" />
                <h3 className="text-lg font-medium text-slate-700 mb-2">Loading Crop Details...</h3>
                <p className="text-slate-500">Fetching information from the blockchain...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Error state
  if (!cropBatch.data || !tokenId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <Card className="max-w-2xl mx-auto bg-red-50 border-red-200">
              <CardContent className="text-center py-16">
                <div className="text-red-600 mb-4">❌ Crop Not Found</div>
                <h3 className="text-xl font-semibold text-red-700 mb-2">Invalid QR Code</h3>
                <p className="text-red-600 mb-6">The crop you're looking for doesn't exist or has been removed.</p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={() => router.back()}
                    variant="outline"
                    className="border-red-300 text-red-700"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Button>
                  <Button 
                    onClick={() => router.push('/marketplace')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Browse Marketplace
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const crop = cropBatch.data
  const imageUrl = getImageUrl(crop.cropImage)
  const progress = calculateGrowthProgress(crop.createdAt, crop.status)
  const averageRating = calculateAverageRating(crop.ratingSum || 0n, crop.ratingCount || 0n)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Product Details</h1>
              <p className="text-slate-600">Scanned from QR Code</p>
            </div>

            {/* User Points */}
            {address && (
              <div className="ml-auto">
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  💚 {greenBalance.formatted || '0'} GREEN Points
                </Badge>
              </div>
            )}
          </div>

          {/* Connect Wallet Banner */}
          {!address && (
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-800">Connect Your Wallet</h3>
                    <p className="text-blue-700 text-sm">Connect your wallet to scan products and earn GREEN points for every interaction!</p>
                  </div>
                  <Button 
                    onClick={() => setShowConnectModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Connect Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scan Success Banner */}
          {hasScanned && (
            <Card className="mb-6 bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="font-medium text-green-800">Product Scanned Successfully!</h3>
                    <p className="text-green-700 text-sm">You earned 10 GREEN points for scanning this product</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Manual Scan Button (if not auto-scanned) */}
          {address && !hasScanned && (
            <Card className="mb-6 bg-emerald-50 border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  <div className="flex-1">
                    <h3 className="font-medium text-emerald-800">Scan This Product</h3>
                    <p className="text-emerald-700 text-sm">Scan to verify authenticity and earn 10 GREEN points</p>
                  </div>
                  <Button 
                    onClick={handleManualScan}
                    disabled={isInteracting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {isInteracting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <QrCode className="w-4 h-4 mr-2" />
                    )}
                    Scan Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Image and Basic Info */}
            <div className="space-y-6">
              {/* Crop Image */}
              <Card className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-emerald-100 to-green-100 relative">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={crop.cropType} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center bg-emerald-100 ${imageUrl ? 'hidden' : ''}`}>
                    <Leaf className="w-24 h-24 text-emerald-400" />
                  </div>
                  
                  {/* Status Overlay */}
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getStatusColor(crop.status)} border backdrop-blur-sm text-sm`}>
                      {crop.status}
                    </Badge>
                  </div>
                  
                  {/* Organic Badge */}
                  {crop.isOrganic && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        🌿 Certified Organic
                      </Badge>
                    </div>
                  )}

                  {/* Rating Badge */}
                  {crop.ratingCount && crop.ratingCount > 0n && (
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        ⭐ {averageRating.toFixed(1)} ({crop.ratingCount.toString()} reviews)
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Show Your Appreciation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Rating Section */}
                  <div>
                    <p className="text-sm text-slate-600 mb-3">
                      {address ? 'Rate this product (earn 20 GREEN points):' : 'Connect wallet to rate:'}
                    </p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant="ghost"
                          size="sm"
                          disabled={!address || hasRated || isInteracting}
                          onClick={() => handleRating(rating)}
                          className={`p-1 ${
                            selectedRating >= rating 
                              ? 'text-yellow-500' 
                              : hasRated 
                                ? 'text-gray-300'
                                : 'text-gray-400 hover:text-yellow-500'
                          } ${!address ? 'cursor-not-allowed' : ''}`}
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </Button>
                      ))}
                      {!address && <Lock className="w-4 h-4 text-gray-400 ml-2 mt-1" />}
                    </div>
                    {hasRated && (
                      <p className="text-sm text-green-600 mt-2">
                        ✅ Thank you for rating! You earned 20 GREEN points.
                      </p>
                    )}
                  </div>

                  {/* Share Button */}
                  <Button
                    onClick={handleShare}
                    disabled={!address || isInteracting}
                    className={`w-full ${
                      address 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isInteracting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : address ? (
                      <Share className="w-4 h-4 mr-2" />
                    ) : (
                      <Lock className="w-4 h-4 mr-2" />
                    )}
                    Share This Story {address ? '(+25 GREEN points)' : '(Connect wallet)'}
                  </Button>

                  {/* Current Rating Display */}
                  {crop.ratingCount && crop.ratingCount > 0n && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Community Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{averageRating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">({crop.ratingCount.toString()} votes)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-slate-800 text-xl">{crop.cropType}</CardTitle>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{crop.location}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Growth Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Growth Progress</span>
                      <span className="text-sm text-slate-600">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Key Details Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Quantity</p>
                      <p className="font-medium text-slate-800">{crop.quantity?.toString()} units</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">NFT ID</p>
                      <p className="font-medium text-slate-800 font-mono">#{tokenId.toString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Created</p>
                      <p className="font-medium text-slate-800">{formatDate(crop.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Harvest Date</p>
                      <p className="font-medium text-slate-800">{formatDate(crop.harvestDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Scans</p>
                      <p className="font-medium text-slate-800 flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {crop.scanCount?.toString() || '0'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Popularity</p>
                      <div className="flex items-center gap-1">
                        {Number(crop.scanCount || 0n) > 50 && <Badge variant="outline" className="text-xs">🔥 Trending</Badge>}
                        {Number(crop.scanCount || 0n) > 100 && <Badge variant="outline" className="text-xs">⭐ Popular</Badge>}
                        {Number(crop.scanCount || 0n) === 0 && <Badge variant="outline" className="text-xs">🆕 New</Badge>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Farmer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    Meet Your Farmer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        Farmer {crop.farmer.slice(0, 6)}...{crop.farmer.slice(-4)}
                      </p>
                      <p className="text-sm text-slate-600">Verified on blockchain</p>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <p className="text-sm text-emerald-800">
                      💚 <strong>Direct Impact:</strong> By choosing this product, you're supporting 
                      sustainable farming practices and helping this farmer earn fair compensation 
                      through blockchain technology.
                    </p>
                  </div>

                  <Button 
                    variant="outline"
                    className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    onClick={() => window.open(`https://explorer.sepolia.mantle.xyz/address/${crop.farmer}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Farmer on Blockchain
                  </Button>
                </CardContent>
              </Card>

              {/* Certifications & Blockchain Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Certifications & Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Certifications */}
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Certifications</p>
                    {crop.certifications ? (
                      <div className="flex flex-wrap gap-2">
                        {crop.certifications.split(',').map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-blue-700 border-blue-300">
                            ✅ {cert.trim()}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">No certifications added yet</p>
                    )}
                  </div>

                  {/* Blockchain Verification */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Blockchain Verified</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      This crop's entire journey is recorded on the Mantle blockchain, 
                      ensuring complete transparency and authenticity.
                    </p>
                  </div>

                  <Button 
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                    onClick={() => window.open(`https://explorer.sepolia.mantle.xyz/token/${tokenId}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Blockchain Explorer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <Card className="mt-8 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
            <CardContent className="text-center py-8">
              <h2 className="text-2xl font-bold mb-2">🌱 Love What You See?</h2>
              <p className="text-emerald-100 mb-6">
                Discover more amazing crops from farmers worldwide and earn GREEN points for every interaction!
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => router.push('/marketplace')}
                  variant="secondary"
                  className="bg-white text-emerald-700 hover:bg-emerald-50"
                >
                  🛒 Browse Marketplace
                </Button>
                <Button 
                  onClick={() => router.push('/track')}
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  📱 Scan More Products
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />

      {/* Connect Wallet Modal */}
      {showConnectModal && (
        <ConnectWalletModal 
          isOpen={showConnectModal}
          onClose={() => setShowConnectModal(false)}
        />
      )}
    </div>
  )
}
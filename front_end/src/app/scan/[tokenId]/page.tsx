"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { toast } from 'react-hot-toast'
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, MapPin, User, Hash, Star, Share, QrCode, 
  Leaf, ExternalLink, CheckCircle, Shield,
  Eye, Loader2, Wallet, Lock
} from "lucide-react"
import { 
  useCropBatch, 
  useCropNFT, 
  useGreenPointsBalance,
} from "@/hooks/useAgriDAO"
import { ConnectWalletModal } from "@/components/consumer/ConnectWalletModal"
import { useGlobalRefresh } from "@/contexts/RefreshContext"

export default function CropScanPage() {
  const params = useParams()
  const router = useRouter()
  const { address } = useAccount()
  const [hasScanned, setHasScanned] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [isInteracting, setIsInteracting] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const tokenId = params?.tokenId ? BigInt(params.tokenId as string) : undefined
  const cropBatch = useCropBatch(tokenId)
  const cropNFT = useCropNFT()
  const greenBalance = useGreenPointsBalance(address)
  
  // Global refresh context
  const { triggerRefreshWithDelay } = useGlobalRefresh()
  
  // Track processed transaction hashes to avoid duplicate refreshes
  const [processedTxHashes, setProcessedTxHashes] = useState<Set<string>>(new Set())

  // Force refresh function with retry logic
  const forceRefreshCrop = () => {
    console.log('Forcing crop data refresh...')
    setRefreshTrigger(prev => prev + 1)
    
    // Retry with delay to account for blockchain propagation
    setTimeout(() => {
      console.log('Executing delayed crop refresh retry...')
      setRefreshTrigger(prev => prev + 1)
    }, 3000)
  }

  // Watch for transaction success to trigger refetch
  useEffect(() => {
    console.log('CropNFT transaction watcher triggered:', {
      isSuccess: cropNFT.isSuccess,
      hash: cropNFT.hash,
      isConfirming: cropNFT.isConfirming,
      isPending: cropNFT.isPending,
      processedHashes: Array.from(processedTxHashes)
    })

    if (cropNFT.isSuccess && cropNFT.hash && !processedTxHashes.has(cropNFT.hash)) {
      console.log('CropNFT transaction confirmed, refreshing UI:', cropNFT.hash)
      
      // Show success toast
      toast.success('Transaction confirmed! UI updating... ✅')
      
      // Mark this hash as processed
      setProcessedTxHashes(prev => new Set(prev).add(cropNFT.hash!))
      
      // Trigger global refresh (which will update header and this page)
      triggerRefreshWithDelay(2000) // 2 second delay
      
      // Also trigger local refresh for immediate feedback
      setTimeout(() => {
        console.log('Executing delayed crop refresh after transaction confirmation')
        forceRefreshCrop()
        
        // Refresh the crop batch data specifically
        if (cropBatch.refetch) {
          cropBatch.refetch()
        }
      }, 2000) // 2 second delay
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropNFT.isSuccess, cropNFT.hash, cropNFT.isConfirming, cropNFT.isPending, triggerRefreshWithDelay, processedTxHashes])

  // Refetch crop data when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0 && cropBatch.refetch) {
      console.log('Crop refetch triggered, trigger value:', refreshTrigger)
      setTimeout(() => {
        console.log('Executing crop refetch')
        cropBatch.refetch()
      }, 500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger])

  // Auto-scan on page load if wallet connected
  useEffect(() => {
    const autoScan = async () => {
      if (tokenId && address && !hasScanned) {
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
    }
    autoScan()
  }, [tokenId, address, hasScanned, cropNFT])

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
      // Use gateway.pinata.cloud which is configured in next.config.ts
      return imageString.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
    }
    
    if (imageString.startsWith('https://')) {
      return imageString
    }
    
    if (imageString.startsWith('baf') || imageString.startsWith('Qm')) {
      // Use gateway.pinata.cloud for raw IPFS hashes
      return `https://gateway.pinata.cloud/ipfs/${imageString}`
    }
    
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "planted": return "bg-yellow-800/40 text-yellow-200 border-yellow-600/40"
      case "growing": return "bg-green-800/40 text-green-200 border-green-600/40"
      case "flowering": return "bg-purple-800/40 text-purple-200 border-purple-600/40"
      case "fruiting": return "bg-orange-800/40 text-orange-200 border-orange-600/40"
      case "harvested": return "bg-blue-800/40 text-blue-200 border-blue-600/40"
      default: return "bg-gray-800/40 text-gray-200 border-gray-600/40"
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
    if (!timestamp || timestamp === BigInt(0)) return "Not set"
    return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateAverageRating = (ratingSum: bigint, ratingCount: bigint) => {
    if (ratingCount === BigInt(0)) return 0
    return Number(ratingSum) / Number(ratingCount)
  }

  // Loading state
  if (cropBatch.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
        <Header />
        <div className="px-4 pt-24 pb-16">
          <div className="container mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-emerald-400" />
                <h3 className="mb-2 text-lg font-medium text-emerald-200">Loading Crop Details...</h3>
                <p className="text-emerald-300/80">Fetching information from the blockchain...</p>
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
        <Header />
        <div className="px-4 pt-24 pb-16">
          <div className="container mx-auto">
            <Card className="max-w-2xl mx-auto bg-red-900/40 border-red-600/40">
              <CardContent className="py-16 text-center">
                <div className="mb-4 text-red-300">❌ Crop Not Found</div>
                <h3 className="mb-2 text-xl font-semibold text-red-200">Invalid QR Code</h3>
                <p className="mb-6 text-red-300/80">The crop you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                <div className="flex justify-center gap-2">
                  <Button 
                    onClick={() => router.back()}
                    variant="outline"
                    className="text-red-300 border-red-600/40 hover:bg-red-800/30"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Button>
                  <Button 
                    onClick={() => router.push('/marketplace')}
                    className="text-white bg-emerald-600 hover:bg-emerald-700"
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
  const averageRating = calculateAverageRating(crop.ratingSum || BigInt(0), crop.ratingCount || BigInt(0))

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
      <Header />

      <div className="px-4 pt-24 pb-16">
        <div className="container max-w-6xl mx-auto">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="border-emerald-600/40 text-emerald-300 hover:bg-emerald-700/30 bg-emerald-800/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-white">Product Details</h1>
              <p className="text-emerald-200/80">Scanned from QR Code</p>
            </div>

            {/* User Points */}
            {address && (
              <div className="ml-auto">
                <Badge className="px-3 py-1 bg-emerald-800/40 text-emerald-300 border-emerald-600/40">
                  💚 {greenBalance.formatted || '0'} GREEN Points
                </Badge>
              </div>
            )}
          </div>

          {/* Connect Wallet Banner */}
          {!address && (
            <Card className="mb-6 bg-emerald-800/40 border-emerald-600/40 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  <div className="flex-1">
                    <h3 className="font-medium text-emerald-200">Connect Your Wallet</h3>
                    <p className="text-sm text-emerald-300/80">Connect your wallet to scan products and earn GREEN points for every interaction!</p>
                  </div>
                  <Button 
                    onClick={() => setShowConnectModal(true)}
                    className="text-white bg-emerald-600 hover:bg-emerald-700"
                  >
                    Connect Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scan Success Banner */}
          {hasScanned && (
            <Card className="mb-6 bg-green-900/40 border-green-600/40 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <h3 className="font-medium text-green-200">Product Scanned Successfully!</h3>
                    <p className="text-sm text-green-300/80">You earned 10 GREEN points for scanning this product</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Manual Scan Button (if not auto-scanned) */}
          {address && !hasScanned && (
            <Card className="mb-6 bg-emerald-800/40 border-emerald-600/40 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  <div className="flex-1">
                    <h3 className="font-medium text-emerald-200">Scan This Product</h3>
                    <p className="text-sm text-emerald-300/80">Scan to verify authenticity and earn 10 GREEN points</p>
                  </div>
                  <Button 
                    onClick={handleManualScan}
                    disabled={isInteracting}
                    className="text-white bg-emerald-600 hover:bg-emerald-700"
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

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Image and Quick Actions */}
            <div className="space-y-4 lg:col-span-1">
              {/* Crop Image */}
              <Card className="overflow-hidden bg-emerald-800/40 border-emerald-700/40 backdrop-blur-sm">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-emerald-800/60 to-green-800/60">
                  {imageUrl ? (
                    <Image 
                      src={imageUrl} 
                      alt={crop.cropType} 
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center bg-emerald-800/60 ${imageUrl ? 'hidden' : ''}`}>
                    <Leaf className="w-16 h-16 text-emerald-400" />
                  </div>
                  
                  {/* Status Overlay */}
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getStatusColor(crop.status)} border backdrop-blur-sm px-2 py-1`}>
                      {crop.status}
                    </Badge>
                  </div>
                  
                  {/* Organic Badge */}
                  {crop.isOrganic && (
                    <div className="absolute top-3 left-3">
                      <Badge className="px-2 py-1 text-green-200 bg-green-800/80 border-green-600/40 backdrop-blur-sm">
                        🌿 Organic
                      </Badge>
                    </div>
                  )}

                  {/* Rating Badge */}
                  {crop.ratingCount && crop.ratingCount > BigInt(0) && (
                    <div className="absolute bottom-3 right-3">
                      <Badge className="px-2 py-1 text-yellow-200 bg-yellow-800/80 border-yellow-600/40 backdrop-blur-sm">
                        ⭐ {averageRating.toFixed(1)} ({crop.ratingCount.toString()})
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>

              {/* Quick Stats & Actions */}
              <Card className="bg-emerald-800/40 border-emerald-700/40 backdrop-blur-sm">
                <div className="p-4 space-y-4">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-emerald-300">
                        <Eye className="w-4 h-4" />
                        <span className="font-semibold">{crop.scanCount?.toString() || '0'}</span>
                      </div>
                      <p className="mt-1 text-xs text-emerald-400/80">Scans</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-emerald-300">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="font-semibold">
                          {Number(crop.ratingCount) > 0 ? averageRating.toFixed(1) : '-'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-emerald-400/80">Rating</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-emerald-300">
                        <Hash className="w-4 h-4" />
                        <span className="font-semibold">#{tokenId.toString()}</span>
                      </div>
                      <p className="mt-1 text-xs text-emerald-400/80">ID</p>
                    </div>
                  </div>

                  {/* Rating Section */}
                  <div className="pt-4 border-t border-emerald-600/30">
                    <p className="mb-3 text-sm text-emerald-200">
                      {address ? 'Rate this product (+20 GREEN points)' : 'Connect wallet to rate'}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            variant="ghost"
                            size="sm"
                            disabled={!address || hasRated || isInteracting}
                            onClick={() => handleRating(rating)}
                            className={`p-1 hover:bg-emerald-700/30 ${
                              selectedRating >= rating 
                                ? 'text-yellow-400' 
                                : hasRated 
                                  ? 'text-emerald-600/50'
                                  : 'text-emerald-400/70 hover:text-yellow-400'
                            } ${!address ? 'cursor-not-allowed' : ''}`}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </Button>
                        ))}
                      </div>
                      {!address && <Lock className="w-4 h-4 text-emerald-400/50" />}
                    </div>
                    {hasRated && (
                      <p className="mt-2 text-sm text-green-300">
                        ✅ Thank you! You earned 20 GREEN points.
                      </p>
                    )}
                  </div>

                  {/* Share Button */}
                  <Button
                    onClick={handleShare}
                    disabled={!address || isInteracting}
                    className={`w-full ${
                      address 
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white'
                        : 'bg-emerald-800/50 text-emerald-400/70 cursor-not-allowed border border-emerald-700/40'
                    }`}
                  >
                    {isInteracting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : address ? (
                      <Share className="w-4 h-4 mr-2" />
                    ) : (
                      <Lock className="w-4 h-4 mr-2" />
                    )}
                    {address ? 'Share Story (+25 pts)' : 'Connect to Share'}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="space-y-4 lg:col-span-2">
              {/* Header Card */}
              <Card className="bg-emerald-800/40 border-emerald-700/40 backdrop-blur-sm">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="mb-2 text-3xl font-bold text-white">{crop.cropType}</h1>
                      <div className="flex items-center gap-2 text-emerald-300/80">
                        <MapPin className="w-4 h-4" />
                        <span>{crop.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-emerald-400">Growth Progress</div>
                      <div className="text-2xl font-bold text-white">{progress.toFixed(0)}%</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <Progress value={progress} className="h-3 bg-emerald-700/30" />
                </div>
              </Card>

              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Basic Details */}
                <Card className="bg-emerald-800/40 border-emerald-700/40 backdrop-blur-sm">
                  <div className="p-4">
                    <h3 className="mb-4 text-lg font-semibold text-emerald-200">Product Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-emerald-300/80">Quantity</span>
                        <span className="font-medium text-emerald-100">{crop.quantity?.toString()} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-300/80">Created</span>
                        <span className="font-medium text-emerald-100">{formatDate(crop.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-300/80">Harvest Date</span>
                        <span className="font-medium text-emerald-100">{formatDate(crop.harvestDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-300/80">Type</span>
                        <span className="font-medium text-emerald-100">
                          {crop.isOrganic ? '🌿 Organic' : '🌾 Conventional'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Farmer Information */}
                <Card className="bg-emerald-800/40 border-emerald-700/40 backdrop-blur-sm">
                  <div className="p-4">
                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-emerald-200">
                      <User className="w-5 h-5" />
                      Farmer Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-700/40">
                          <User className="w-5 h-5 text-emerald-300" />
                        </div>
                        <div>
                          <p className="font-medium text-emerald-100">
                            {crop.farmer.slice(0, 6)}...{crop.farmer.slice(-4)}
                          </p>
                          <p className="text-sm text-emerald-300/80">Verified Farmer</p>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg bg-emerald-700/30 border-emerald-600/40">
                        <p className="text-sm text-emerald-200">
                          💚 <strong>Direct Impact:</strong> Supporting sustainable farming through blockchain transparency.
                        </p>
                      </div>

                      <Button 
                        variant="outline"
                        size="sm"
                        className="w-full border-emerald-600/40 text-emerald-300 hover:bg-emerald-700/30"
                        onClick={() => window.open(`https://explorer.sepolia.mantle.xyz/address/${crop.farmer}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on Blockchain
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Certifications */}
                <Card className="bg-emerald-800/40 border-emerald-700/40 backdrop-blur-sm md:col-span-2">
                  <div className="p-4">
                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-emerald-200">
                      <Shield className="w-5 h-5" />
                      Certifications & Verification
                    </h3>
                    <div className="space-y-4">
                      {crop.certifications ? (
                        <div className="flex flex-wrap gap-2">
                          {crop.certifications.split(',').map((cert: string, index: number) => (
                            <Badge 
                              key={index} 
                              className="text-blue-200 bg-blue-800/40 border-blue-600/40"
                            >
                              ✅ {cert.trim()}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="italic text-emerald-300/80">No certifications added yet</p>
                      )}
                      
                      <div className="p-3 border rounded-lg bg-blue-800/30 border-blue-600/40">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-blue-300" />
                          <span className="font-medium text-blue-200">Blockchain Verified</span>
                        </div>
                        <p className="text-sm text-blue-300/90">
                          Complete transparency and authenticity on Mantle blockchain.
                        </p>
                      </div>

                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-blue-300 border-blue-600/40 hover:bg-blue-700/30"
                        onClick={() => window.open(`https://explorer.sepolia.mantle.xyz/token/${tokenId}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View NFT on Explorer
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <Card className="mt-8 bg-gradient-to-r from-emerald-600 to-green-600 border-emerald-500/40 backdrop-blur-sm">
            <div className="p-8 text-center text-white">
              <h2 className="mb-3 text-2xl font-bold">🌱 Love What You See?</h2>
              <p className="mb-6 text-emerald-100">
                Discover more amazing crops from farmers worldwide and earn GREEN points for every interaction!
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => router.push('/marketplace')}
                  className="bg-white text-emerald-700 hover:bg-emerald-50"
                >
                  🛒 Browse Marketplace
                </Button>
                <Button 
                  onClick={() => router.push('/track')}
                  variant="outline"
                  className="text-white border-white hover:bg-white/10"
                >
                  📱 Scan More Products
                </Button>
              </div>
            </div>
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

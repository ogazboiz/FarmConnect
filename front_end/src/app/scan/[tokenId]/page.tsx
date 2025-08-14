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
    Eye, Loader2, Wallet, Lock, Gift, AlertCircle
} from "lucide-react"
import {
    useCropBatch,
    useCropNFT,
    useGreenPointsBalance,
} from "@/hooks/useAgriDAO"
import { useReadContract } from "wagmi"
import { CropNFTABI, getContractAddresses } from "@/config"
import { ConnectWalletModal } from "@/components/consumer/ConnectWalletModal"
import { useGlobalRefresh } from "@/contexts/RefreshContext"


interface CropData {
    cropType: string
    location: string
    farmer: string
    isOrganic: boolean
    quantity: bigint
    createdAt: bigint
    harvestDate: bigint
    status: string
    scanCount: bigint
    ratingCount: bigint
    ratingSum: bigint
    cropImage: string
    certifications?: string
}

const contracts = getContractAddresses()

export default function CropScanPage() {
    const params = useParams()
    const router = useRouter()
    const { address } = useAccount()

    // State for UI interactions
    const [hasViewed, setHasViewed] = useState(false)
    const [selectedRating, setSelectedRating] = useState(0)
    const [isInteracting, setIsInteracting] = useState(false)
    const [showConnectModal, setShowConnectModal] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const tokenId = params?.tokenId ? BigInt(params.tokenId as string) : undefined
    const cropBatch = useCropBatch(tokenId)
    const cropNFT = useCropNFT()
    const greenBalance = useGreenPointsBalance(address)

    // Blockchain state for user interactions
    const { data: hasScannedContract } = useReadContract({
        address: contracts.CROP_NFT,
        abi: CropNFTABI,
        functionName: 'hasScanned',
        args: tokenId && address ? [tokenId, address] : undefined,
        query: {
            enabled: !!(tokenId && address),
            gcTime: 1000,
            staleTime: 0,
        },
    }) as {data: boolean}

    const { data: hasRatedContract } = useReadContract({
        address: contracts.CROP_NFT,
        abi: CropNFTABI,
        functionName: 'hasRated',
        args: tokenId && address ? [tokenId, address] : undefined,
        query: {
            enabled: !!(tokenId && address),
            gcTime: 1000,
            staleTime: 0,
        },
    }) as {data: boolean}

    const { data: userRating } = useReadContract({
        address: contracts.CROP_NFT,
        abi: CropNFTABI,
        functionName: 'ratings',
        args: tokenId && address ? [tokenId, address] : undefined,
        query: {
            enabled: !!(tokenId && address),
            gcTime: 1000,
            staleTime: 0,
        },
    }) as {data: bigint}

    const { triggerRefreshWithDelay } = useGlobalRefresh()
    const [processedTxHashes, setProcessedTxHashes] = useState<Set<string>>(new Set())

    // Auto-view product on page load (no wallet required)
    useEffect(() => {
        if (tokenId && !hasViewed) {
            setHasViewed(true)
            console.log('Product viewed (no wallet required)')
        }
    }, [tokenId, hasViewed])

    // Update selectedRating when userRating changes
    useEffect(() => {
        if (userRating && Number(userRating) > 0) {
            setSelectedRating(Number(userRating))
        }
    }, [userRating])

    // Force refresh function with retry logic
    const forceRefreshCrop = () => {
        console.log('Forcing crop data refresh...')
        setRefreshTrigger(prev => prev + 1)
        setTimeout(() => {
            console.log('Executing delayed crop refresh retry...')
            setRefreshTrigger(prev => prev + 1)
        }, 3000)
    }

    // Watch for transaction success to trigger refetch
    useEffect(() => {
        if (cropNFT.isSuccess && cropNFT.hash && !processedTxHashes.has(cropNFT.hash)) {
            console.log('CropNFT transaction confirmed, refreshing UI:', cropNFT.hash)
            toast.success('Transaction confirmed! UI updating... ✅')
            setProcessedTxHashes(prev => new Set(prev).add(cropNFT.hash!))
            triggerRefreshWithDelay(2000)
            setTimeout(() => {
                console.log('Executing delayed crop refresh after transaction confirmation')
                forceRefreshCrop()
                if (cropBatch.refetch) {
                    cropBatch.refetch()
                }
            }, 2000)
        }
    }, [cropNFT.isSuccess, cropNFT.hash, triggerRefreshWithDelay, processedTxHashes, cropBatch])

    // Refetch crop data when refreshTrigger changes
    useEffect(() => {
        if (refreshTrigger > 0 && cropBatch.refetch) {
            console.log('Crop refetch triggered, trigger value:', refreshTrigger)
            setTimeout(() => {
                console.log('Executing crop refetch')
                cropBatch.refetch()
            }, 500)
        }
    }, [refreshTrigger, cropBatch])

    // Claim scan points (requires wallet)
    const handleClaimScanPoints = async () => {
        if (!address) {
            setShowConnectModal(true)
            return
        }
        if (!tokenId || hasScannedContract) return
        setIsInteracting(true)
        try {
            await cropNFT.scanProduct(tokenId)
            toast.success('🎉 You earned 10 GREEN points for scanning!')
        } catch (error) {
            console.error('Scan claim failed:', error)
            toast.error('Failed to claim scan points. Please try again.')
        } finally {
            setIsInteracting(false)
        }
    }

    const handleRating = async (rating: number) => {
        if (!address) {
            setShowConnectModal(true)
            return
        }
        if (!tokenId || hasRatedContract) return
        if (!hasScannedContract) {
            toast.error('You must scan the product before rating it!')
            return
        }
        setIsInteracting(true)
        try {
            await cropNFT.rateProduct(tokenId, BigInt(rating))
            setSelectedRating(rating)
            toast.success('🎉 You earned 20 GREEN points for rating!')
        } catch (error) {
            console.error('Rating failed:', error)
            toast.error('Failed to submit rating. Please try again.')
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
        if (!hasScannedContract) {
            toast.error('You must scan the product before sharing it!')
            return
        }
        setIsInteracting(true)
        try {
            await cropNFT.shareProduct(tokenId)
            toast.success('🎉 You earned 25 GREEN points for sharing!')
            if (navigator.share && cropBatch.data) {
                const cropData = cropBatch.data as CropData
                await navigator.share({
                    title: `${cropData.cropType} from ${cropData.location}`,
                    text: `I just discovered the story behind my ${cropData.cropType}! This ${cropData.isOrganic ? 'organic' : ''} crop was grown by farmer ${cropData.farmer.slice(0, 6)}... in ${cropData.location}. Transparent farming on the blockchain! 🌱`,
                    url: window.location.href
                })
            } else {
                await navigator.clipboard.writeText(window.location.href)
                toast.success('Link copied to clipboard!')

            }
        } catch (error) {
            console.error('Share failed:', error)
            toast.error('Failed to share. Please try again.')
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

    const calculateAverageRating = (averageRating: bigint, totalRatings: bigint) => {
        if (totalRatings === BigInt(0)) return 0
        return Number(averageRating) / 100
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
                         <div className="mb-4 text-emerald-300">🚀 Ready to Explore</div>
<h3 className="mb-2 text-xl font-semibold text-emerald-200">Connect Wallet to View Details</h3>
<p className="mb-6 text-emerald-300/80">
  This QR code is valid! Connect your wallet to unlock product details, farming information, and claim your GREEN points reward.
</p>
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

    const crop = cropBatch.data as CropData
    const imageUrl = getImageUrl(crop.cropImage)
    const progress = calculateGrowthProgress(crop.createdAt, crop.status)
    const averageRating = calculateAverageRating(crop.ratingSum || BigInt(0), crop.ratingCount || BigInt(0))

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
            <Header />

            <div className="px-4 pt-24 pb-16">
                <div className="container max-w-6xl mx-auto">
                    {/* Header with Back Button */}
                 <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center">
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            size="sm"
                            className="border-slate-600/40 text-slate-300 hover:bg-slate-700/30 bg-slate-800/20 w-fit"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>

                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-white sm:text-2xl">Product Details</h1>
                            <p className="text-sm text-slate-300/80 sm:text-base">
                                {hasViewed ? 'Product Information Available' : 'Scanned from QR Code'}
                            </p>
                        </div>

                        {/* User Points */}
                        {address && (
                            <div className="w-fit">
                                <Badge className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border-emerald-400/50">
                                    💚 {greenBalance.formatted || '0'} GREEN Points
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Reward Opportunities Banner - Only show if wallet not connected */}
                    {!address && hasViewed && (
                        <Card className="mb-6 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border-emerald-500/40 backdrop-blur-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <Gift className="w-6 h-6 text-emerald-400" />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-emerald-200">🎉 Earn Rewards for Engagement!</h3>
                                        <p className="text-sm text-emerald-300/80">
                                            Connect your wallet to claim <strong>10 points for scanning</strong>, <strong>20 points for rating</strong>, and <strong>25 points for sharing</strong> this product!
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setShowConnectModal(true)}
                                        className="text-white bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        <Wallet className="w-4 h-4 mr-2" />
                                        Connect to Earn
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Status Banners - Only show if wallet connected */}
                    {address && (
                        <div className="mb-6 space-y-3">
                            {/* Scan Points Status */}
                            {!hasScannedContract && (
                                <Card className="bg-emerald-800/40 border-emerald-600/40 backdrop-blur-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <QrCode className="w-5 h-5 text-emerald-400" />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-emerald-200">🎁 Claim Your Scan Reward</h3>
                                                <p className="text-sm text-emerald-300/80">
                                                    You can earn 10 GREEN points by claiming your scan reward for this product
                                                </p>
                                            </div>
                                            <Button
                                                onClick={handleClaimScanPoints}
                                                disabled={isInteracting}
                                                className="text-white bg-emerald-600 hover:bg-emerald-700"
                                            >
                                                {isInteracting ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Gift className="w-4 h-4 mr-2" />
                                                )}
                                                Claim 10 Points
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Success Banner for completed scan */}
                            {hasScannedContract && (
                                <Card className="bg-green-900/40 border-green-600/40 backdrop-blur-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                            <div>
                                                <h3 className="font-medium text-green-200">✅ Scan Reward Claimed!</h3>
                                                <p className="text-sm text-green-300/80">
                                                    You earned 10 GREEN points for scanning this product
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Already Rated Banner */}
                            {hasRatedContract && (
                                <Card className="bg-blue-900/40 border-blue-600/40 backdrop-blur-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Star className="w-5 h-5 text-yellow-400" />
                                            <div>
                                                <h3 className="font-medium text-blue-200">Thank You for Your Rating!</h3>
                                                <p className="text-sm text-blue-300/80">
                                                    You rated this product {selectedRating} star{selectedRating !== 1 ? 's' : ''} and earned 20 GREEN points
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
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
                                            {!address
                                                ? 'Connect wallet to rate (+20 GREEN points)'
                                                : !hasScannedContract
                                                    ? 'Scan product first to unlock rating'
                                                    : hasRatedContract
                                                        ? 'Thank you for rating this product!'
                                                        : 'Rate this product (+20 GREEN points)'
                                            }
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((rating) => (
                                                    <Button
                                                        key={rating}
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={!address || hasRatedContract || !hasScannedContract || isInteracting}
                                                        onClick={() => handleRating(rating)}
                                                        className={`p-1 hover:bg-emerald-700/30 ${selectedRating >= rating
                                                                ? 'text-yellow-400'
                                                                : hasRatedContract
                                                                    ? 'text-emerald-600/50'
                                                                    : !hasScannedContract
                                                                        ? 'text-emerald-600/30'
                                                                        : 'text-emerald-400/70 hover:text-yellow-400'
                                                            } ${!address || !hasScannedContract ? 'cursor-not-allowed' : ''}`}
                                                    >
                                                        <Star className="w-4 h-4 fill-current" />
                                                    </Button>
                                                ))}
                                            </div>
                                            {!address && <Lock className="w-4 h-4 text-emerald-400/50" />}
                                            {address && !hasScannedContract && <QrCode className="w-4 h-4 text-emerald-400/50" />}
                                        </div>
                                    </div>

                                    {/* Share Button */}
                                    <Button
                                        onClick={handleShare}
                                        disabled={!address || !hasScannedContract || isInteracting}
                                        className={`w-full ${address && hasScannedContract
                                                ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white'
                                                : 'bg-emerald-800/50 text-emerald-400/70 cursor-not-allowed border border-emerald-700/40'
                                            }`}
                                    >
                                        {isInteracting ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : address && hasScannedContract ? (
                                            <Share className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Lock className="w-4 h-4 mr-2" />
                                        )}
                                        {address && hasScannedContract ? 'Share Story (+25 pts)' : 'Connect & Scan to Share'}
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
                                                onClick={() => window.open(`https://explorer.sepolia.mantle.xyz/token/${contracts.CROP_NFT}/instance/${tokenId}`, '_blank')}

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
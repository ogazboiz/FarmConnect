"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, Filter, MapPin, Calendar, Leaf, Star, Eye, QrCode, Share, 
  Loader2, ShoppingCart, Users, TrendingUp, Award, Hash, Wallet, Lock
} from "lucide-react"
import { toast } from "react-hot-toast"
import { 
  useCropNFT, 
  useGreenPointsBalance,
  formatTokenAmount 
} from "@/hooks/useAgriDAO"
import { CropData, useAllCropsForConsumers } from "@/hooks/useConsumerCrops"
import { ConnectWalletModal } from "@/components/consumer/ConnectWalletModal"
import { ConsumerCropCard } from "@/components/consumer/ConsumerCropCard"

export default function ConsumerMarketplacePage() {
  const { address } = useAccount()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterOrganic, setFilterOrganic] = useState('all')
  const [showConnectModal, setShowConnectModal] = useState(false)
  
  const { crops, loading, error, refetch } = useAllCropsForConsumers()
  const cropNFT = useCropNFT()
  const greenBalance = useGreenPointsBalance(address)

  // Filter crops based on search and filters
  const filteredCrops = crops.filter(crop => {
    const matchesSearch = searchTerm === '' || 
      crop.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || crop.status === filterStatus
    const matchesOrganic = filterOrganic === 'all' || 
      (filterOrganic === 'organic' && crop.isOrganic) ||
      (filterOrganic === 'conventional' && !crop.isOrganic)
    
    return matchesSearch && matchesStatus && matchesOrganic
  })

  // Consumer interaction handlers
  const handleScan = async (tokenId: bigint) => {
    if (!address) {
      setShowConnectModal(true)
      return
    }
    try {
      await cropNFT.scanProduct(tokenId)
    } catch (error) {
      console.error('Error scanning product:', error)
    }
  }

  const handleRate = async (tokenId: bigint, rating: number) => {
    if (!address) {
      setShowConnectModal(true)
      return
    }
    try {
      await cropNFT.rateProduct(tokenId, BigInt(rating))
    } catch (error) {
      console.error('Error rating product:', error)
    }
  }

  const handleShare = async (tokenId: bigint) => {
    if (!address) {
      setShowConnectModal(true)
      return
    }
    try {
      await cropNFT.shareProduct(tokenId)
    } catch (error) {
      console.error('Error sharing product:', error)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
      <Header />

      <div className="px-4 pt-24 pb-16">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-white">
              <span className="text-transparent bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text">
                🛒 Crop Marketplace
              </span>
            </h1>
            
            {address ? (
              <div className="space-y-2">
                <p className="text-xl text-emerald-200/80">
                  Discover crops and earn GREEN points for every interaction!
                </p>
                <div className="flex justify-center gap-4">
                  <Badge variant="outline" className="text-emerald-300 border-emerald-600/40 bg-emerald-800/30">
                    💚 {greenBalance.formatted || '0'} GREEN Points
                  </Badge>
                  <Badge variant="outline" className="text-emerald-300 border-emerald-600/40 bg-emerald-800/30">
                    🌾 {filteredCrops.length} Crops Available
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xl text-emerald-200/80">
                  Discover the story behind your food from farmers worldwide
                </p>
                <div className="max-w-2xl p-4 mx-auto border rounded-lg bg-emerald-800/40 border-emerald-600/40">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-emerald-400" />
                    <div className="text-left">
                      <p className="font-medium text-emerald-200">
                        💡 Connect your wallet to earn GREEN points!
                      </p>
                      <p className="text-sm text-emerald-300/80">
                        Scan products, rate quality, and support farmers directly
                      </p>
                    </div>
                    <Button 
                      onClick={() => setShowConnectModal(true)}
                      size="sm"
                      className="text-white bg-emerald-600 hover:bg-emerald-700"
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <Card className="mb-8 border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute w-4 h-4 left-3 top-3 text-emerald-400" />
                  <Input
                    placeholder="Search crops or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-emerald-700/30 border-emerald-600/40 text-emerald-100 placeholder:text-emerald-300/50 focus:border-emerald-500"
                  />
                </div>
                
                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-2 border rounded-md bg-emerald-700/30 border-emerald-600/40 text-emerald-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="all">All Status</option>
                  <option value="planted">Planted</option>
                  <option value="growing">Growing</option>
                  <option value="flowering">Flowering</option>
                  <option value="fruiting">Fruiting</option>
                  <option value="harvested">Harvested</option>
                </select>
                
                {/* Organic Filter */}
                <select
                  value={filterOrganic}
                  onChange={(e) => setFilterOrganic(e.target.value)}
                  className="p-2 border rounded-md bg-emerald-700/30 border-emerald-600/40 text-emerald-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="all">All Types</option>
                  <option value="organic">Organic Only</option>
                  <option value="conventional">Conventional</option>
                </select>
                
                {/* Refresh Button */}
                <Button 
                  onClick={refetch}
                  variant="outline"
                  className="border-emerald-600/40 text-emerald-300 hover:bg-emerald-700/30 bg-emerald-800/20"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-emerald-400" />
                <h3 className="mb-2 text-lg font-medium text-emerald-200">Loading Marketplace...</h3>
                <p className="text-emerald-300/80">Discovering crops from farmers worldwide...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="bg-red-900/40 border-red-600/40">
              <CardContent className="py-8 text-center">
                <div className="mb-4 text-red-300">❌ Error loading crops</div>
                <p className="mb-4 text-red-200/80">{error}</p>
                <Button onClick={refetch} variant="outline" className="text-red-300 border-red-600/40 hover:bg-red-800/30">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!loading && !error && filteredCrops.length === 0 && (
            <Card className="bg-emerald-800/30 border-emerald-700/40">
              <CardContent className="py-16 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-700/40">
                  <ShoppingCart className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-emerald-200">No Crops Found</h3>
                <p className="mb-4 text-emerald-300/80">
                  {searchTerm || filterStatus !== 'all' || filterOrganic !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'No crops have been added to the marketplace yet'}
                </p>
                <div className="flex justify-center gap-2">
                  <Button 
                    onClick={() => {
                      setSearchTerm('')
                      setFilterStatus('all')
                      setFilterOrganic('all')
                      toast.success('Filters cleared! 🧹')
                    }}
                    variant="outline"
                    className="border-emerald-600/40 text-emerald-300 hover:bg-emerald-700/30"
                  >
                    Clear Filters
                  </Button>
                  <Button 
                    onClick={() => {
                      refetch()
                      toast.success('Marketplace refreshed! 🔄')
                    }}
                    className="text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  >
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Crops Grid */}
          {!loading && !error && filteredCrops.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                {filteredCrops.map((crop: CropData) => (
                  <ConsumerCropCard
                    key={crop.tokenId.toString()}
                    crop={crop}
                    onScan={handleScan}
                    onRate={handleRate}
                    onShare={handleShare}
                    userAddress={address}
                    onConnectPrompt={() => setShowConnectModal(true)}
                  />
                ))}
              </div>

              {/* Results Summary */}
              <div className="text-center">
                <p className="text-slate-500">
                  Showing {filteredCrops.length} of {crops.length} crops
                </p>
              </div>
            </>
          )}

          {/* How It Works Section */}
          {!loading && (
            <Card className="mt-12 text-white bg-gradient-to-r from-emerald-600 to-green-600">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-white">
                  🌱 How to Earn GREEN Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-white/20">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <h3 className="mb-2 font-semibold">1. Scan Products</h3>
                    <p className="text-emerald-100">Scan any crop to learn about its journey and earn 10 GREEN points</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-white/20">
                      <Star className="w-6 h-6" />
                    </div>
                    <h3 className="mb-2 font-semibold">2. Rate Quality</h3>
                    <p className="text-emerald-100">Rate products after trying them and earn 20 GREEN points</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-white/20">
                      <Share className="w-6 h-6" />
                    </div>
                    <h3 className="mb-2 font-semibold">3. Share Stories</h3>
                    <p className="text-emerald-100">Share farmer stories on social media and earn 25 GREEN points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Connect Wallet Modal */}
      {showConnectModal && (
        <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
      )}

      <Footer />
    </div>
  )
}
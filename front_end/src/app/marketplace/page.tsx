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
import { 
  useCropNFT, 
  useGreenPointsBalance,
  formatTokenAmount 
} from "@/hooks/useAgriDAO"
import { useAllCropsForConsumers } from "@/hooks/useConsumerCrops"
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                🛒 Crop Marketplace
              </span>
            </h1>
            
            {address ? (
              <div className="space-y-2">
                <p className="text-xl text-slate-600">
                  Discover crops and earn GREEN points for every interaction!
                </p>
                <div className="flex justify-center gap-4">
                  <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                    💚 {greenBalance.formatted || '0'} GREEN Points
                  </Badge>
                  <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">
                    🌾 {filteredCrops.length} Crops Available
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xl text-slate-600">
                  Discover the story behind your food from farmers worldwide
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-yellow-600" />
                    <div className="text-left">
                      <p className="text-yellow-800 font-medium">
                        💡 Connect your wallet to earn GREEN points!
                      </p>
                      <p className="text-yellow-700 text-sm">
                        Scan products, rate quality, and support farmers directly
                      </p>
                    </div>
                    <Button 
                      onClick={() => setShowConnectModal(true)}
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-emerald-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search crops or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-emerald-300 focus:border-emerald-500"
                  />
                </div>
                
                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-2 border border-emerald-300 rounded-md focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
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
                  className="p-2 border border-emerald-300 rounded-md focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="all">All Types</option>
                  <option value="organic">Organic Only</option>
                  <option value="conventional">Conventional</option>
                </select>
                
                {/* Refresh Button */}
                <Button 
                  onClick={refetch}
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
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
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-500" />
                <h3 className="text-lg font-medium text-slate-700 mb-2">Loading Marketplace...</h3>
                <p className="text-slate-500">Discovering crops from farmers worldwide...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="text-center py-8">
                <div className="text-red-600 mb-4">❌ Error loading crops</div>
                <p className="text-red-700 mb-4">{error}</p>
                <Button onClick={refetch} variant="outline" className="border-red-300 text-red-700">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!loading && !error && filteredCrops.length === 0 && (
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="text-center py-16">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <ShoppingCart className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No Crops Found</h3>
                <p className="text-slate-500 mb-4">
                  {searchTerm || filterStatus !== 'all' || filterOrganic !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'No crops have been added to the marketplace yet'}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={() => {
                      setSearchTerm('')
                      setFilterStatus('all')
                      setFilterOrganic('all')
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                  <Button onClick={refetch}>
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Crops Grid */}
          {!loading && !error && filteredCrops.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {filteredCrops.map((crop: any) => (
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
            <Card className="mt-12 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
              <CardHeader>
                <CardTitle className="text-white text-center text-2xl">
                  🌱 How to Earn GREEN Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold mb-2">1. Scan Products</h3>
                    <p className="text-emerald-100">Scan any crop to learn about its journey and earn 10 GREEN points</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold mb-2">2. Rate Quality</h3>
                    <p className="text-emerald-100">Rate products after trying them and earn 20 GREEN points</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Share className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold mb-2">3. Share Stories</h3>
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
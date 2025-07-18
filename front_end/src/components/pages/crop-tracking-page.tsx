// src/app/dashboard/crops/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from 'react-hot-toast'
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, MapPin, Calendar, Leaf, TrendingUp, Eye, Edit, ExternalLink, Shield, Hash, Loader2, QrCode, Star, Share, RefreshCw } from "lucide-react"
import { useAccount } from "wagmi"
import { 
  useFarmerCrops, 
  useCropBatch, 
  useCropNFT, 
  useCropNFTTotalSupply,
  parseTokenAmount 
} from "@/hooks/useAgriDAO"
import { QRCodeGenerator } from "@/components/farmer/QRCodeGenerator"
import { useGlobalRefresh } from "@/contexts/RefreshContext"
import Image from "next/image"


interface CropData {
  cropType: string
  location: string
  quantity: bigint
  isOrganic: boolean
  status: string
  createdAt: bigint
  harvestDate: bigint
  farmer: string
  certifications?: string
  cropImage?: string
  scanCount?: bigint
  ratingCount?: bigint
  ratingSum?: bigint
}

interface FarmerCropsData {
  data: bigint[]
  count: number
  isLoading: boolean
  refetch: () => void
}


export default function CropTrackingPage() {
  const { address, isConnected } = useAccount()
  const [selectedCropId, setSelectedCropId] = useState<bigint | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false)
  const [isAddCertificationOpen, setIsAddCertificationOpen] = useState(false)
  const [isUpdateImageOpen, setIsUpdateImageOpen] = useState(false)
  
  // QR Generator state
  const [isQRGeneratorOpen, setIsQRGeneratorOpen] = useState(false)
  const [qrTokenData, setQrTokenData] = useState<{
    tokenId: bigint | null
    cropType: string
  }>({
    tokenId: null,
    cropType: ''
  })
  
  // Form state for creating new crop
  const [newCrop, setNewCrop] = useState({
    cropType: '',
    location: '',
    isOrganic: false,
    quantity: '',
    cropImage: ''
  })

  // Form state for updating status
  const [statusUpdate, setStatusUpdate] = useState({
    tokenId: null as bigint | null,
    newStatus: ''
  })

  // Form state for adding certification
  const [certificationData, setCertificationData] = useState({
    tokenId: null as bigint | null,
    certification: ''
  })

  // Form state for updating image
  const [imageUpdate, setImageUpdate] = useState({
    tokenId: null as bigint | null,
    newImage: ''
  })

  // Get farmer's crops and contract interactions
  const farmerCrops = useFarmerCrops(address) as FarmerCropsData
  const totalSupply = useCropNFTTotalSupply()
  const cropNFT = useCropNFT()
  
  // Global refresh context
  const { triggerRefreshWithDelay } = useGlobalRefresh()
  
  // Get selected crop details
 const selectedCropBatchResult = useCropBatch(selectedCropId || undefined)
const selectedCropBatch = {
  ...selectedCropBatchResult,
  data: selectedCropBatchResult.data as CropData | null
}

  // Cache invalidation function - more specific to avoid over-fetching
  const invalidateQueries = useCallback(() => {
    console.log('Invalidating queries - refetching farmer crops and total supply')
    // Refetch farmer crops specifically
    farmerCrops.refetch()
    totalSupply.refetch()
    if (selectedCropId) {
      selectedCropBatch.refetch()
    }
    console.log('Queries invalidated')
  }, [farmerCrops, totalSupply, selectedCropBatch, selectedCropId])

  // Force refetch all crop cards after mutations with retry mechanism
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const forceRefreshCrops = useCallback(async () => {
    console.log('Force refresh crops triggered - updating refresh trigger and invalidating queries')
    setRefreshTrigger(prev => {
      const newValue = prev + 1
      console.log('Refresh trigger updated from', prev, 'to', newValue)
      return newValue
    })
    
    // Initial refresh
    invalidateQueries()
    
    // Retry mechanism - sometimes blockchain state takes time to propagate
    setTimeout(() => {
      console.log('Retry refresh #1 after 3 seconds')
      invalidateQueries()
    }, 3000)
    
    setTimeout(() => {
      console.log('Retry refresh #2 after 6 seconds')
      invalidateQueries()
    }, 6000)
  }, [invalidateQueries])

  // Track processed transaction hashes to avoid duplicate refreshes
  const [processedTxHashes, setProcessedTxHashes] = useState<Set<string>>(new Set())

  // Watch for transaction success to trigger refetch
  useEffect(() => {
    console.log('Transaction watcher triggered:', {
      isSuccess: cropNFT.isSuccess,
      hash: cropNFT.hash,
      isConfirming: cropNFT.isConfirming,
      isPending: cropNFT.isPending,
      processedHashes: Array.from(processedTxHashes)
    })

    if (cropNFT.isSuccess && cropNFT.hash && !processedTxHashes.has(cropNFT.hash)) {
      console.log('Transaction confirmed, refreshing UI:', cropNFT.hash)
      
      // Show success toast
      toast.success('Transaction confirmed! UI updating... ✅')
      
      // Mark this hash as processed
      setProcessedTxHashes(prev => new Set(prev).add(cropNFT.hash!))
      
      // Trigger global refresh (which will update header and this page)
      triggerRefreshWithDelay(2000) // 2 second delay
      
      // Also trigger local refresh for immediate feedback
      setTimeout(() => {
        console.log('Executing delayed refresh after transaction confirmation')
        forceRefreshCrops()
      }, 2000) // 2 second delay
    }
  }, [cropNFT.isSuccess, cropNFT.hash, cropNFT.isConfirming, cropNFT.isPending, forceRefreshCrops, processedTxHashes, triggerRefreshWithDelay])

  // Additional watcher for hash changes to trigger immediate refresh
  useEffect(() => {
    if (cropNFT.hash && !cropNFT.isConfirming && cropNFT.isSuccess) {
      console.log('Hash confirmed, checking for refresh:', cropNFT.hash)
      if (!processedTxHashes.has(cropNFT.hash)) {
        console.log('Hash not processed yet, will be handled by main watcher')
      }
    }
  }, [cropNFT.hash, cropNFT.isConfirming, cropNFT.isSuccess, processedTxHashes])

  const handleCreateCrop = async () => {
    if (!newCrop.cropType || !newCrop.location || !newCrop.quantity) {
      return
    }

    try {
      console.log('Creating crop batch...')
      const quantity = parseTokenAmount(newCrop.quantity, 0) // No decimals for quantity
      await cropNFT.createCropBatch(
        newCrop.cropType,
        newCrop.location,
        newCrop.isOrganic,
        quantity,
        newCrop.cropImage || 'ipfs://default-crop-image'
      )
      
      console.log('Crop batch creation initiated, waiting for confirmation...')
      
      // Reset form
      setNewCrop({
        cropType: '',
        location: '',
        isOrganic: false,
        quantity: '',
        cropImage: ''
      })
      setIsCreateModalOpen(false)
      // Refresh will be handled automatically by useEffect when transaction succeeds
    } catch (error) {
      console.error('Error creating crop:', error)
    }
  }

  const handleScanProduct = async (tokenId: bigint) => {
    try {
      await cropNFT.scanProduct(tokenId)
    } catch (error) {
      console.error('Error scanning product:', error)
    }
  }

  const handleRateProduct = async (tokenId: bigint, rating: number) => {
    try {
      await cropNFT.rateProduct(tokenId, BigInt(rating))
    } catch (error) {
      console.error('Error rating product:', error)
    }
  }

  const handleShareProduct = async (tokenId: bigint) => {
    try {
      await cropNFT.shareProduct(tokenId)
    } catch (error) {
      console.error('Error sharing product:', error)
    }
  }

  const handleUpdateStatus = async () => {
    if (!statusUpdate.tokenId || !statusUpdate.newStatus) return

    try {
      console.log('Updating status for token:', statusUpdate.tokenId, 'to:', statusUpdate.newStatus)
      await cropNFT.updateStatus(statusUpdate.tokenId, statusUpdate.newStatus)
      console.log('Status update initiated, waiting for confirmation...')
      setStatusUpdate({ tokenId: null, newStatus: '' })
      setIsUpdateStatusOpen(false)
      // Refresh will be handled automatically by useEffect when transaction succeeds
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleAddCertification = async () => {
    if (!certificationData.tokenId || !certificationData.certification) return

    try {
      console.log('Adding certification for token:', certificationData.tokenId)
      await cropNFT.addCertification(certificationData.tokenId, certificationData.certification)
      console.log('Certification addition initiated, waiting for confirmation...')
      setCertificationData({ tokenId: null, certification: '' })
      setIsAddCertificationOpen(false)
      // Refresh will be handled automatically by useEffect when transaction succeeds
    } catch (error) {
      console.error('Error adding certification:', error)
    }
  }

  const handleUpdateImage = async () => {
    if (!imageUpdate.tokenId || !imageUpdate.newImage) return

    try {
      console.log('Updating image for token:', imageUpdate.tokenId)
      if (cropNFT.updateCropImage) {
        await cropNFT.updateCropImage(imageUpdate.tokenId, imageUpdate.newImage)
        console.log('Image update initiated, waiting for confirmation...')
      } else {
        console.error('updateCropImage function not available in hook')
      }
      setImageUpdate({ tokenId: null, newImage: '' })
      setIsUpdateImageOpen(false)
      // Refresh will be handled automatically by useEffect when transaction succeeds
    } catch (error) {
      console.error('Error updating image:', error)
    }
  }

  // QR Generator functions
  const openQRGenerator = (tokenId: bigint, cropType: string) => {
    setQrTokenData({ tokenId, cropType })
    setIsQRGeneratorOpen(true)
  }

  const closeQRGenerator = () => {
    setIsQRGeneratorOpen(false)
    setQrTokenData({ tokenId: null, cropType: '' })
  }

  const openUpdateStatus = (tokenId: bigint) => {
    setStatusUpdate({ tokenId, newStatus: '' })
    setIsUpdateStatusOpen(true)
  }

  const openAddCertification = (tokenId: bigint) => {
    setCertificationData({ tokenId, certification: '' })
    setIsAddCertificationOpen(true)
  }

  const openUpdateImage = (tokenId: bigint) => {
    setImageUpdate({ tokenId, newImage: '' })
    setIsUpdateImageOpen(true)
  }

  const getStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case "planted":
        return "bg-yellow-900/30 text-yellow-300 border-yellow-500/50"
      case "growing":
        return "bg-green-900/30 text-green-300 border-green-500/50"
      case "flowering":
        return "bg-purple-900/30 text-purple-300 border-purple-500/50"
      case "fruiting":
        return "bg-orange-900/30 text-orange-300 border-orange-500/50"
      case "harvested":
        return "bg-blue-900/30 text-blue-300 border-blue-500/50"
      default:
        return "bg-gray-900/30 text-gray-300 border-gray-500/50"
    }
  }

  const formatDate = (timestamp: bigint) => {
    if (!timestamp || timestamp === BigInt(0)) return "Not set"
    return new Date(Number(timestamp) * 1000).toLocaleDateString()
  }

  const calculateProgress = (createdAt: bigint, status: string) => {
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

  const getImageUrl = (imageString: string | undefined) => {
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

  const openCropDetails = (tokenId: bigint) => {
    setSelectedCropId(tokenId)
    setIsDetailsOpen(true)
  }

  if (!isConnected) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
        <Header />
        <div className="px-4 pt-24 pb-16">
          <div className="container mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="mb-2 text-2xl font-semibold text-emerald-100">Connect Your Wallet</h2>
                <p className="text-emerald-200/80">Please connect your wallet to view and manage your crops on the blockchain</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
      <Header />

      <div className="px-4 pt-24 pb-16">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-emerald-100">
                <span className="text-transparent bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text">
                  🌾 My Crops Dashboard
                </span>
              </h1>
              <p className="text-xl text-emerald-200/80">
                Monitor your crops from seed to harvest on the blockchain • 
                Total Crops in System: {totalSupply.data?.toString() || "Loading..."}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="bg-transparent border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60"
                onClick={forceRefreshCrops}
                disabled={farmerCrops.isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${farmerCrops.isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                className="font-semibold text-white shadow-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Crop
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {farmerCrops.isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-emerald-300" />
                <p className="text-emerald-200/80">Loading your crops from the blockchain...</p>
              </div>
            </div>
          ) : farmerCrops.count === 0 ? (
            /* Empty State */
            <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-700/50">
                    <Plus className="w-8 h-8 text-emerald-300" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-emerald-100">No Crops Yet</h3>
                  <p className="mb-4 text-emerald-200/80">Create your first crop batch to start tracking on the blockchain</p>
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Crop
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Crops Grid */}
              <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
                {farmerCrops.data.map((tokenId: bigint) => (
                  <CropCard 
                    key={`${tokenId.toString()}-${refreshTrigger}`} 
                    tokenId={tokenId}
                    refreshTrigger={refreshTrigger}
                    onViewDetails={openCropDetails}
                    onScan={handleScanProduct}
                    onRate={handleRateProduct}
                    onShare={handleShareProduct}
                    onUpdateStatus={openUpdateStatus}
                    onAddCertification={openAddCertification}
                    onUpdateImage={openUpdateImage}
                    onGenerateQR={openQRGenerator}
                    getStageColor={getStageColor}
                    formatDate={formatDate}
                    calculateProgress={calculateProgress}
                    getImageUrl={getImageUrl}
                    userAddress={address}
                  />
                ))}
              </div>

              {/* Blockchain Records */}
              <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-100">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Your Blockchain Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {farmerCrops.data.slice(0, 3).map((tokenId: bigint, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 transition-colors duration-300 border rounded-lg bg-emerald-900/30 border-emerald-700/30 hover:bg-emerald-800/40"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-emerald-100">
                              Crop NFT #{tokenId.toString()} - Created
                            </h3>
                            <Badge
                              variant="outline"
                              className="text-emerald-300 border-emerald-500/50 bg-emerald-900/20"
                            >
                              Confirmed
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-emerald-200/80">
                            <span>Token ID: #{tokenId.toString()}</span>
                            <span>On Mantle Sepolia</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-emerald-300 hover:text-emerald-100 hover:bg-emerald-800/60"
                          onClick={() => window.open(`https://explorer.sepolia.mantle.xyz/token/${address}`, '_blank')}
                        >
                          View on Explorer
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-transparent border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 hover:border-emerald-500"
                    onClick={() => window.open(`https://explorer.sepolia.mantle.xyz/address/${address}`, '_blank')}
                  >
                    View All Records on Explorer
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Create Crop Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md bg-emerald-900 border-emerald-700 text-emerald-100">
          <DialogHeader>
            <DialogTitle className="text-emerald-100">Create New Crop Batch</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cropType" className="text-emerald-200">Crop Type</Label>
              <Input
                id="cropType"
                value={newCrop.cropType}
                onChange={(e) => setNewCrop({...newCrop, cropType: e.target.value})}
                placeholder="e.g., Organic Tomatoes"
                className="bg-emerald-800/50 border-emerald-600 text-emerald-100 placeholder:text-emerald-300"
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-emerald-200">Location</Label>
              <Input
                id="location"
                value={newCrop.location}
                onChange={(e) => setNewCrop({...newCrop, location: e.target.value})}
                placeholder="e.g., Field A-1"
                className="bg-emerald-800/50 border-emerald-600 text-emerald-100 placeholder:text-emerald-300"
              />
            </div>
            <div>
              <Label htmlFor="quantity" className="text-emerald-200">Quantity (units)</Label>
              <Input
                id="quantity"
                type="number"
                value={newCrop.quantity}
                onChange={(e) => setNewCrop({...newCrop, quantity: e.target.value})}
                placeholder="e.g., 1000"
                className="bg-emerald-800/50 border-emerald-600 text-emerald-100 placeholder:text-emerald-300"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isOrganic"
                checked={newCrop.isOrganic}
                onCheckedChange={(checked) => setNewCrop({...newCrop, isOrganic: checked})}
              />
              <Label htmlFor="isOrganic" className="text-emerald-200">Organic Certification</Label>
            </div>
            <div>
              <Label htmlFor="cropImage" className="text-emerald-200">Image URL</Label>
              <Input
                id="cropImage"
                value={newCrop.cropImage}
                onChange={(e) => setNewCrop({...newCrop, cropImage: e.target.value})}
                placeholder="https://jade-adjacent-mosquito-859.mypinata.cloud/ipfs/..."
                className="bg-emerald-800/50 border-emerald-600 text-emerald-100 placeholder:text-emerald-300"
              />
              <p className="mt-1 text-xs text-emerald-300/70">
                Use your Pinata IPFS URL or any HTTPS image URL
              </p>
            </div>
            <Button 
              onClick={handleCreateCrop}
              className="w-full text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              disabled={cropNFT.isConfirming || !newCrop.cropType || !newCrop.location || !newCrop.quantity}
            >
              {cropNFT.isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating on Blockchain...
                </>
              ) : (
                'Create Crop Batch'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
        <DialogContent className="max-w-md bg-emerald-900 border-emerald-700 text-emerald-100">
          <DialogHeader>
            <DialogTitle className="text-emerald-100">Update Crop Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newStatus" className="text-emerald-200">New Status</Label>
              <select
                id="newStatus"
                value={statusUpdate.newStatus}
                onChange={(e) => setStatusUpdate({...statusUpdate, newStatus: e.target.value})}
                className="w-full px-3 py-2 border rounded-md bg-emerald-800/50 border-emerald-600 text-emerald-100"
              >
                <option value="">Select status...</option>
                <option value="planted">Planted</option>
                <option value="growing">Growing</option>
                <option value="flowering">Flowering</option>
                <option value="fruiting">Fruiting</option>
                <option value="harvested">Harvested</option>
              </select>
            </div>
            <Button 
              onClick={handleUpdateStatus}
              className="w-full text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              disabled={cropNFT.isConfirming || !statusUpdate.newStatus}
            >
              {cropNFT.isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Status...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Certification Modal */}
      <Dialog open={isAddCertificationOpen} onOpenChange={setIsAddCertificationOpen}>
        <DialogContent className="max-w-md bg-emerald-900 border-emerald-700 text-emerald-100">
          <DialogHeader>
            <DialogTitle className="text-emerald-100">Add Certification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="certification" className="text-emerald-200">Certification</Label>
              <Input
                id="certification"
                value={certificationData.certification}
                onChange={(e) => setCertificationData({...certificationData, certification: e.target.value})}
                placeholder="e.g., USDA Organic, Fair Trade, etc."
                className="bg-emerald-800/50 border-emerald-600 text-emerald-100 placeholder:text-emerald-300"
              />
            </div>
            <Button 
              onClick={handleAddCertification}
              className="w-full text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              disabled={cropNFT.isConfirming || !certificationData.certification}
            >
              {cropNFT.isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Certification...
                </>
              ) : (
                'Add Certification'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Image Modal */}
      <Dialog open={isUpdateImageOpen} onOpenChange={setIsUpdateImageOpen}>
        <DialogContent className="max-w-md bg-emerald-900 border-emerald-700 text-emerald-100">
          <DialogHeader>
            <DialogTitle className="text-emerald-100">Update Crop Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newImage" className="text-emerald-200">New Image URL</Label>
              <Input
                id="newImage"
                value={imageUpdate.newImage}
                onChange={(e) => setImageUpdate({...imageUpdate, newImage: e.target.value})}
                placeholder="https://jade-adjacent-mosquito-859.mypinata.cloud/ipfs/..."
                className="bg-emerald-800/50 border-emerald-600 text-emerald-100 placeholder:text-emerald-300"
              />
              <p className="mt-1 text-xs text-emerald-300/70">
                Use your Pinata IPFS URL or any HTTPS image URL
              </p>
            </div>
            {imageUpdate.newImage && (
              <div className="space-y-2">
                <Label className="text-emerald-200">Preview</Label>
                <div className="w-full max-w-xs mx-auto overflow-hidden rounded-lg aspect-video">
                  <Image 
                    src={getImageUrl(imageUpdate.newImage) || imageUpdate.newImage} 
                    alt="Preview" 
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}
            <Button 
              onClick={handleUpdateImage}
              className="w-full text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              disabled={cropNFT.isConfirming || !imageUpdate.newImage}
            >
              {cropNFT.isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Image...
                </>
              ) : (
                'Update Image'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Generator Modal */}
      {isQRGeneratorOpen && qrTokenData.tokenId && (
        <QRCodeGenerator
          tokenId={qrTokenData.tokenId.toString()}
          cropType={qrTokenData.cropType}
          onClose={closeQRGenerator}
          isOpen={isQRGeneratorOpen}
        />
      )}

      {/* Crop Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-7xl h-[95vh] bg-emerald-900 border-emerald-700 text-emerald-100">
         {selectedCropId && selectedCropBatch.data && (
  <CropDetailsModal 
    cropBatch={selectedCropBatch.data as CropData}
    tokenId={selectedCropId}
    formatDate={formatDate}
    getStageColor={getStageColor}
    getImageUrl={getImageUrl}
    userAddress={address}
    onUpdateStatus={openUpdateStatus}
    onAddCertification={openAddCertification}
    onUpdateImage={openUpdateImage}
    onGenerateQR={openQRGenerator}
  />
)}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}

// Individual Crop Card Component
function CropCard({ 
  tokenId, 
  refreshTrigger,
  onViewDetails, 
  onScan, 
  onRate, 
  onShare,
  onUpdateStatus,
  onAddCertification,
  onUpdateImage,
  onGenerateQR,
  getStageColor,
  formatDate,
  calculateProgress,
  getImageUrl,
  userAddress
}: { 
  tokenId: bigint
  refreshTrigger?: number
  onViewDetails: (id: bigint) => void
  onScan: (id: bigint) => void
  onRate: (id: bigint, rating: number) => void
  onShare: (id: bigint) => void
  onUpdateStatus: (id: bigint) => void
  onAddCertification: (id: bigint) => void
  onUpdateImage: (id: bigint) => void
  onGenerateQR: (tokenId: bigint, cropType: string) => void
  getStageColor: (stage: string) => string
  formatDate: (timestamp: bigint) => string
  calculateProgress: (createdAt: bigint, status: string) => number
  getImageUrl: (imageString: string | undefined) => string | null
  userAddress?: string
}) {
  const cropBatch = useCropBatch(tokenId)

  // Refetch when refreshTrigger changes, but with debouncing to avoid excessive calls
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      console.log('CropCard refetch triggered for token:', tokenId.toString(), 'trigger:', refreshTrigger)
      const timer = setTimeout(() => {
        if (cropBatch.refetch) {
          console.log('Executing CropCard refetch for token:', tokenId.toString())
          cropBatch.refetch()
        }
      }, 500) // Debounce refetch calls
      
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]) // Intentionally excluding cropBatch to avoid infinite loops

  if (cropBatch.isLoading) {
    return (
      <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-300" />
        </CardContent>
      </Card>
    )
  }

  if (!cropBatch.data) {
    return (
      <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-emerald-200/80">Failed to load crop data</p>
        </CardContent>
      </Card>
    )
  }

  const crop = cropBatch.data as CropData
  const isOwner = userAddress && crop.farmer.toLowerCase() === userAddress.toLowerCase()
  const progress = calculateProgress(crop.createdAt, crop.status)
  const imageUrl = getImageUrl(crop.cropImage)

  return (
    <Card className="transition-all duration-300 transform border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40 hover:border-emerald-600/60 hover:shadow-2xl hover:scale-105 group">
      <div className="relative overflow-hidden rounded-t-lg aspect-video bg-gradient-to-br from-emerald-900/50 to-green-900/50">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={crop.cropType} 
            width={400}
            height={300}
            className="object-cover w-full h-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center bg-emerald-800/30 ${imageUrl ? 'hidden' : ''}`}>
          <Leaf className="w-16 h-16 text-emerald-300/50" />
        </div>
        <div className="absolute top-3 right-3">
          <Badge className={`${getStageColor(crop.status)} border backdrop-blur-sm`}>{crop.status}</Badge>
        </div>
        {crop.isOrganic && (
          <div className="absolute top-3 left-3">
            <Badge className="text-xs text-green-800 bg-green-100 border-green-300">
              🌿 Organic
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-emerald-100">{crop.cropType}</CardTitle>
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="ghost" 
              className="w-8 h-8 p-0 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-800/60"
              onClick={() => onViewDetails(tokenId)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="w-8 h-8 p-0 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-800/60"
              onClick={() => onScan(tokenId)}
            >
              <QrCode className="w-4 h-4" />
            </Button>
            {isOwner && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="w-8 h-8 p-0 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-800/60"
                onClick={() => onUpdateStatus(tokenId)}
                title="Update Status"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-emerald-200/80">NFT #{tokenId.toString()}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-200/80">Growth Progress</span>
            <span className="font-medium text-emerald-100">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-emerald-900/50" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-emerald-200/80">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{crop.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-200/80">
            <Calendar className="w-4 h-4" />
            <span>Created: {formatDate(crop.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-200/80">
            <Hash className="w-4 h-4" />
            <span>Qty: {crop.quantity?.toString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span className="text-sm font-medium text-emerald-300">
              On Blockchain
            </span>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRate(tokenId, 5)}
              className="w-6 h-6 p-0 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-800/60"
            >
              <Star className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onShare(tokenId)}
              className="w-6 h-6 p-0 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-800/60"
            >
              <Share className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full bg-transparent border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 hover:border-emerald-500"
          onClick={() => onViewDetails(tokenId)}
        >
          View Details
        </Button>

        {/* Owner Action Buttons */}
        {isOwner && (
          <div className="space-y-2">
            {/* Main Actions Row */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs bg-transparent border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60"
                onClick={() => onUpdateStatus(tokenId)}
              >
                <Edit className="w-3 h-3 mr-1" />
                Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs bg-transparent border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60"
                onClick={() => onAddCertification(tokenId)}
              >
                <Hash className="w-3 h-3 mr-1" />
                Cert
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs bg-transparent border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60"
                onClick={() => onUpdateImage(tokenId)}
              >
                <Eye className="w-3 h-3 mr-1" />
                Image
              </Button>
            </div>

            {/* QR Generator Button - Prominent */}
            <Button
              variant="outline"
              className="w-full text-yellow-200 bg-transparent border-yellow-600/50 hover:bg-yellow-800/60 hover:border-yellow-500"
              onClick={() => onGenerateQR(tokenId, crop.cropType)}
            >
              <QrCode className="w-4 h-4 mr-2" />
              📱 Generate QR Code for Packaging
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Crop Details Modal Component
function CropDetailsModal({ 
  cropBatch, 
  tokenId, 
  formatDate, 
  getStageColor,
  getImageUrl,
  userAddress,
  onUpdateStatus,
  onAddCertification,
  onUpdateImage,
  onGenerateQR
}: { 
  cropBatch: {
    cropType: string
    location: string
    quantity: bigint
    isOrganic: boolean
    status: string
    createdAt: bigint
    harvestDate: bigint
    farmer: string
    certifications?: string
    cropImage?: string
  }
  tokenId: bigint
  formatDate: (timestamp: bigint) => string
  getStageColor: (stage: string) => string
  getImageUrl: (imageString: string | undefined) => string | null
  userAddress?: string
  onUpdateStatus: (id: bigint) => void
  onAddCertification: (id: bigint) => void
  onUpdateImage: (id: bigint) => void
  onGenerateQR: (tokenId: bigint, cropType: string) => void
}) {
  const imageUrl = getImageUrl(cropBatch.cropImage)
  const isOwner = userAddress && cropBatch.farmer.toLowerCase() === userAddress.toLowerCase()

  // Mock engagement data - you can implement this properly later
  const engagementData = {
    data: {
      totalScans: BigInt(0),
      totalRatings: BigInt(0), 
      averageRating: BigInt(0),
      socialShares: BigInt(0)
    },
    isLoading: false
  }

  return (
    <div className="h-full pr-2 mt-4 space-y-6 overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3 text-2xl text-emerald-100">
          <Leaf className="w-6 h-6 text-emerald-400" />
          {cropBatch.cropType} Details
          <Badge className={`${getStageColor(cropBatch.status)} border ml-auto`}>
            {cropBatch.status}
          </Badge>
        </DialogTitle>
      </DialogHeader>

      {/* Crop Image Section */}
      {imageUrl && (
        <Card className="bg-emerald-800/40 border-emerald-700/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-100">
              <Eye className="w-5 h-5 text-emerald-400" />
              Crop Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-2xl mx-auto overflow-hidden rounded-lg aspect-video">
              <Image 
                src={imageUrl} 
                alt={cropBatch.cropType} 
                width={800}
                height={600}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.currentTarget.parentElement?.classList.add('hidden')
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card className="bg-emerald-800/40 border-emerald-700/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-100">
            <MapPin className="w-5 h-5 text-emerald-400" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Crop Type</p>
            <p className="font-medium text-emerald-100">{cropBatch.cropType}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Location</p>
            <p className="font-medium text-emerald-100">{cropBatch.location}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Quantity</p>
            <p className="font-medium text-emerald-100">{cropBatch.quantity?.toString()} units</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Organic</p>
            <p className="font-medium text-emerald-100">{cropBatch.isOrganic ? "Yes" : "No"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Status</p>
            <p className="font-medium capitalize text-emerald-100">{cropBatch.status}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Created</p>
            <p className="font-medium text-emerald-100">{formatDate(cropBatch.createdAt)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Data Card */}
      <Card className="bg-emerald-800/40 border-emerald-700/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-100">
            <Star className="w-5 h-5 text-emerald-400" />
            Engagement & Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm text-emerald-200/80">Total Scans</p>
              <p className="text-lg font-medium text-emerald-100">
                {engagementData.data?.totalScans?.toString() || '0'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-emerald-200/80">Total Ratings</p>
              <p className="text-lg font-medium text-emerald-100">
                {engagementData.data?.totalRatings?.toString() || '0'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-emerald-200/80">Average Rating</p>
              <p className="text-lg font-medium text-emerald-100">
                {engagementData.data?.averageRating ? 
                  (Number(engagementData.data.averageRating) / 100).toFixed(1) + '/5' : 
                  'No ratings'
                }
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-emerald-200/80">Social Shares</p>
              <p className="text-lg font-medium text-emerald-100">
                {engagementData.data?.socialShares?.toString() || '0'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Information */}
      <Card className="bg-emerald-800/40 border-emerald-700/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-100">
            <Shield className="w-5 h-5 text-emerald-400" />
            Blockchain Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">NFT Token ID</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm text-emerald-100">#{tokenId.toString()}</p>
              <Button 
                size="sm" 
                variant="ghost" 
                className="w-6 h-6 p-0 text-emerald-300 hover:text-emerald-100"
                onClick={() => window.open(`https://explorer.sepolia.mantle.xyz/token/${tokenId.toString()}`, '_blank')}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Owner</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-emerald-100">{cropBatch.farmer}</p>
              <Button 
                size="sm" 
                variant="ghost" 
                className="w-6 h-6 p-0 text-emerald-300 hover:text-emerald-100"
                onClick={() => window.open(`https://explorer.sepolia.mantle.xyz/address/${cropBatch.farmer}`, '_blank')}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Network</p>
            <p className="font-medium text-emerald-100">Mantle Sepolia Testnet</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Harvest Date</p>
            <p className="font-medium text-emerald-100">{formatDate(cropBatch.harvestDate)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Certifications</p>
            <p className="font-medium text-emerald-100">{cropBatch.certifications || "None yet"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Image URL</p>
            <div className="flex items-center gap-2">
              <p className="max-w-xs font-mono text-xs truncate text-emerald-100">
                {cropBatch.cropImage || "No image"}
              </p>
              {cropBatch.cropImage && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="w-6 h-6 p-0 text-emerald-300 hover:text-emerald-100"
                  onClick={() => window.open(getImageUrl(cropBatch.cropImage) || '', '_blank')}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Owner Actions */}
      {isOwner && (
        <Card className="bg-emerald-800/40 border-emerald-700/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-100">
              <Edit className="w-5 h-5 text-emerald-400" />
              Owner Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Actions Grid */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Button 
                variant="outline" 
                className="bg-transparent border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60"
                onClick={() => onUpdateStatus(tokenId)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Update Status
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-transparent border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60"
                onClick={() => onAddCertification(tokenId)}
              >
                <Hash className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-transparent border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60"
                onClick={() => onUpdateImage(tokenId)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Update Image
              </Button>
            </div>

            {/* QR Generator - Highlighted */}
            <div className="p-4 border rounded-lg bg-yellow-900/20 border-yellow-600/30">
              <h4 className="flex items-center gap-2 mb-2 font-medium text-yellow-200">
                <QrCode className="w-4 h-4" />
                Create QR Code for Product Packaging
              </h4>
              <p className="mb-3 text-sm text-yellow-300/70">
                Generate a QR code that consumers can scan to see this crop&apos;s story and earn GREEN points
              </p>
              <Button 
                className="w-full text-white bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
                onClick={() => onGenerateQR(tokenId, cropBatch.cropType)}
              >
                <QrCode className="w-4 h-4 mr-2" />
                Generate QR Code
              </Button>
            </div>

            <p className="text-xs text-emerald-300/70">
              You are the owner of this crop NFT and can make updates
            </p>
          </CardContent>
        </Card>
      )}
        
      <div className="flex flex-wrap gap-3 mt-6">
        <Button 
          className="text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
          onClick={() => window.open(`https://explorer.sepolia.mantle.xyz/token/${tokenId.toString()}`, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Explorer
        </Button>
      </div>
    </div>
  )
}
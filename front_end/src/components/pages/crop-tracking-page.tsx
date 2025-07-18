// src/app/dashboard/crops/page.tsx
"use client"

import { useState } from "react"
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
import { Plus, MapPin, Calendar, Leaf, TrendingUp, Eye, Edit, ExternalLink, Shield, Hash, Loader2, QrCode, Star, Share, User } from "lucide-react"
import { useAccount } from "wagmi"
import { 
  useFarmerCrops, 
  useCropBatch, 
  useCropNFT, 
  useCropNFTTotalSupply,
  parseTokenAmount 
} from "@/hooks/useAgriDAO"
import { QRCodeGenerator } from "@/components/farmer/QRCodeGenerator"

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
  const farmerCrops = useFarmerCrops(address)
  const totalSupply = useCropNFTTotalSupply()
  const cropNFT = useCropNFT()
  
  // Get selected crop details
  const selectedCropBatch = useCropBatch(selectedCropId || undefined)

  const handleCreateCrop = async () => {
    if (!newCrop.cropType || !newCrop.location || !newCrop.quantity) {
      return
    }

    try {
      const quantity = parseTokenAmount(newCrop.quantity, 0) // No decimals for quantity
      await cropNFT.createCropBatch(
        newCrop.cropType,
        newCrop.location,
        newCrop.isOrganic,
        quantity,
        newCrop.cropImage || 'ipfs://default-crop-image'
      )
      
      // Reset form
      setNewCrop({
        cropType: '',
        location: '',
        isOrganic: false,
        quantity: '',
        cropImage: ''
      })
      setIsCreateModalOpen(false)
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
      await cropNFT.updateStatus(statusUpdate.tokenId, statusUpdate.newStatus)
      setStatusUpdate({ tokenId: null, newStatus: '' })
      setIsUpdateStatusOpen(false)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleAddCertification = async () => {
    if (!certificationData.tokenId || !certificationData.certification) return

    try {
      await cropNFT.addCertification(certificationData.tokenId, certificationData.certification)
      setCertificationData({ tokenId: null, certification: '' })
      setIsAddCertificationOpen(false)
    } catch (error) {
      console.error('Error adding certification:', error)
    }
  }

  const handleUpdateImage = async () => {
    if (!imageUpdate.tokenId || !imageUpdate.newImage) return

    try {
      if (cropNFT.updateCropImage) {
        await cropNFT.updateCropImage(imageUpdate.tokenId, imageUpdate.newImage)
      } else {
        console.error('updateCropImage function not available in hook')
      }
      setImageUpdate({ tokenId: null, newImage: '' })
      setIsUpdateImageOpen(false)
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
    if (!timestamp || timestamp === 0n) return "Not set"
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800 relative">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-emerald-100 mb-2">Connect Your Wallet</h2>
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800 relative">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-emerald-100 mb-2">
                <span className="bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                  🌾 My Crops Dashboard
                </span>
              </h1>
              <p className="text-xl text-emerald-200/80">
                Monitor your crops from seed to harvest on the blockchain • 
                Total Crops in System: {totalSupply.data?.toString() || "Loading..."}
              </p>
            </div>
            <Button 
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-xl font-semibold"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Crop
            </Button>
          </div>

          {/* Loading State */}
          {farmerCrops.isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-300" />
                <p className="text-emerald-200/80">Loading your crops from the blockchain...</p>
              </div>
            </div>
          ) : farmerCrops.count === 0 ? (
            /* Empty State */
            <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-700/50 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Plus className="w-8 h-8 text-emerald-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-emerald-100 mb-2">No Crops Yet</h3>
                  <p className="text-emerald-200/80 mb-4">Create your first crop batch to start tracking on the blockchain</p>
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {farmerCrops.data.map((tokenId: bigint) => (
                  <CropCard 
                    key={tokenId.toString()} 
                    tokenId={tokenId}
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
              <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
                <CardHeader>
                  <CardTitle className="text-emerald-100 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Your Blockchain Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {farmerCrops.data.slice(0, 3).map((tokenId: bigint, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-emerald-900/30 border border-emerald-700/30 rounded-lg hover:bg-emerald-800/40 transition-colors duration-300"
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
                    className="w-full mt-4 border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 bg-transparent hover:border-emerald-500"
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
              <p className="text-xs text-emerald-300/70 mt-1">
                Use your Pinata IPFS URL or any HTTPS image URL
              </p>
            </div>
            <Button 
              onClick={handleCreateCrop}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
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
                className="w-full bg-emerald-800/50 border border-emerald-600 text-emerald-100 rounded-md px-3 py-2"
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
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
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
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
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
              <p className="text-xs text-emerald-300/70 mt-1">
                Use your Pinata IPFS URL or any HTTPS image URL
              </p>
            </div>
            {imageUpdate.newImage && (
              <div className="space-y-2">
                <Label className="text-emerald-200">Preview</Label>
                <div className="aspect-video w-full max-w-xs mx-auto overflow-hidden rounded-lg">
                  <img 
                    src={getImageUrl(imageUpdate.newImage) || imageUpdate.newImage} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}
            <Button 
              onClick={handleUpdateImage}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
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
              cropBatch={selectedCropBatch.data}
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

  if (cropBatch.isLoading) {
    return (
      <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-300" />
        </CardContent>
      </Card>
    )
  }

  if (!cropBatch.data) {
    return (
      <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-emerald-200/80">Failed to load crop data</p>
        </CardContent>
      </Card>
    )
  }

  const crop = cropBatch.data
  const isOwner = userAddress && crop.farmer.toLowerCase() === userAddress.toLowerCase()
  const progress = calculateProgress(crop.createdAt, crop.status)
  const imageUrl = getImageUrl(crop.cropImage)

  return (
    <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40 hover:border-emerald-600/60 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
      <div className="aspect-video bg-gradient-to-br from-emerald-900/50 to-green-900/50 rounded-t-lg relative overflow-hidden">
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
        <div className={`w-full h-full flex items-center justify-center bg-emerald-800/30 ${imageUrl ? 'hidden' : ''}`}>
          <Leaf className="w-16 h-16 text-emerald-300/50" />
        </div>
        <div className="absolute top-3 right-3">
          <Badge className={`${getStageColor(crop.status)} border backdrop-blur-sm`}>{crop.status}</Badge>
        </div>
        {crop.isOrganic && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
              🌿 Organic
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-emerald-100 text-lg">{crop.cropType}</CardTitle>
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-800/60"
              onClick={() => onViewDetails(tokenId)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-800/60"
              onClick={() => onScan(tokenId)}
            >
              <QrCode className="w-4 h-4" />
            </Button>
            {isOwner && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-800/60"
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
            <span className="text-emerald-100 font-medium">{progress.toFixed(0)}%</span>
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
              className="h-6 w-6 p-0 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-800/60"
            >
              <Star className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onShare(tokenId)}
              className="h-6 w-6 p-0 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-800/60"
            >
              <Share className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 bg-transparent hover:border-emerald-500"
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
                className="flex-1 border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 bg-transparent text-xs"
                onClick={() => onUpdateStatus(tokenId)}
              >
                <Edit className="w-3 h-3 mr-1" />
                Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 bg-transparent text-xs"
                onClick={() => onAddCertification(tokenId)}
              >
                <Hash className="w-3 h-3 mr-1" />
                Cert
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 bg-transparent text-xs"
                onClick={() => onUpdateImage(tokenId)}
              >
                <Eye className="w-3 h-3 mr-1" />
                Image
              </Button>
            </div>

            {/* QR Generator Button - Prominent */}
            <Button
              variant="outline"
              className="w-full border-yellow-600/50 text-yellow-200 hover:bg-yellow-800/60 bg-transparent hover:border-yellow-500"
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
  cropBatch: any
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
    <div className="space-y-6 mt-4 h-full overflow-y-auto pr-2">
      <DialogHeader>
        <DialogTitle className="text-2xl text-emerald-100 flex items-center gap-3">
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
            <CardTitle className="text-emerald-100 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-400" />
              Crop Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full max-w-2xl mx-auto overflow-hidden rounded-lg">
              <img 
                src={imageUrl} 
                alt={cropBatch.cropType} 
                className="w-full h-full object-cover"
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
          <CardTitle className="text-emerald-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Crop Type</p>
            <p className="text-emerald-100 font-medium">{cropBatch.cropType}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Location</p>
            <p className="text-emerald-100 font-medium">{cropBatch.location}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Quantity</p>
            <p className="text-emerald-100 font-medium">{cropBatch.quantity?.toString()} units</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Organic</p>
            <p className="text-emerald-100 font-medium">{cropBatch.isOrganic ? "Yes" : "No"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Status</p>
            <p className="text-emerald-100 font-medium capitalize">{cropBatch.status}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Created</p>
            <p className="text-emerald-100 font-medium">{formatDate(cropBatch.createdAt)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Data Card */}
      <Card className="bg-emerald-800/40 border-emerald-700/40">
        <CardHeader>
          <CardTitle className="text-emerald-100 flex items-center gap-2">
            <Star className="w-5 h-5 text-emerald-400" />
            Engagement & Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-emerald-200/80">Total Scans</p>
              <p className="text-emerald-100 font-medium text-lg">
                {engagementData.data?.totalScans?.toString() || '0'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-emerald-200/80">Total Ratings</p>
              <p className="text-emerald-100 font-medium text-lg">
                {engagementData.data?.totalRatings?.toString() || '0'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-emerald-200/80">Average Rating</p>
              <p className="text-emerald-100 font-medium text-lg">
                {engagementData.data?.averageRating ? 
                  (Number(engagementData.data.averageRating) / 100).toFixed(1) + '/5' : 
                  'No ratings'
                }
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-emerald-200/80">Social Shares</p>
              <p className="text-emerald-100 font-medium text-lg">
                {engagementData.data?.socialShares?.toString() || '0'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Information */}
      <Card className="bg-emerald-800/40 border-emerald-700/40">
        <CardHeader>
          <CardTitle className="text-emerald-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Blockchain Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">NFT Token ID</p>
            <div className="flex items-center gap-2">
              <p className="text-emerald-100 font-mono text-sm">#{tokenId.toString()}</p>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 text-emerald-300 hover:text-emerald-100"
                onClick={() => window.open(`https://explorer.sepolia.mantle.xyz/token/${tokenId.toString()}`, '_blank')}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Owner</p>
            <div className="flex items-center gap-2">
              <p className="text-emerald-100 font-mono text-xs">{cropBatch.farmer}</p>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 text-emerald-300 hover:text-emerald-100"
                onClick={() => window.open(`https://explorer.sepolia.mantle.xyz/address/${cropBatch.farmer}`, '_blank')}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Network</p>
            <p className="text-emerald-100 font-medium">Mantle Sepolia Testnet</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Harvest Date</p>
            <p className="text-emerald-100 font-medium">{formatDate(cropBatch.harvestDate)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Certifications</p>
            <p className="text-emerald-100 font-medium">{cropBatch.certifications || "None yet"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">Image URL</p>
            <div className="flex items-center gap-2">
              <p className="text-emerald-100 font-mono text-xs truncate max-w-xs">
                {cropBatch.cropImage || "No image"}
              </p>
              {cropBatch.cropImage && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0 text-emerald-300 hover:text-emerald-100"
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
            <CardTitle className="text-emerald-100 flex items-center gap-2">
              <Edit className="w-5 h-5 text-emerald-400" />
              Owner Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 bg-transparent"
                onClick={() => onUpdateStatus(tokenId)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Update Status
              </Button>
              
              <Button 
                variant="outline" 
                className="border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 bg-transparent"
                onClick={() => onAddCertification(tokenId)}
              >
                <Hash className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
              
              <Button 
                variant="outline" 
                className="border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 bg-transparent"
                onClick={() => onUpdateImage(tokenId)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Update Image
              </Button>
            </div>

            {/* QR Generator - Highlighted */}
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
              <h4 className="text-yellow-200 font-medium mb-2 flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                Create QR Code for Product Packaging
              </h4>
              <p className="text-yellow-300/70 text-sm mb-3">
                Generate a QR code that consumers can scan to see this crop's story and earn GREEN points
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
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
        
      <div className="flex gap-3 mt-6 flex-wrap">
        <Button 
          className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
          onClick={() => window.open(`https://explorer.sepolia.mantle.xyz/token/${tokenId.toString()}`, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Explorer
        </Button>
      </div>
    </div>
  )
}
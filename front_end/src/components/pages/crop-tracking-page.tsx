"use client"

import { useState } from "react"
import { Footer } from "../layout/footer"
import { Header } from "../layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, MapPin, Calendar, Droplets, Thermometer, Leaf, TrendingUp, Eye, Edit, ExternalLink, Shield, Hash } from "lucide-react"

type CropType = {
  id: number
  name: string
  variety: string
  planted: string
  location: string
  stage: string
  progress: number
  health: string
  nextAction: string
  image: string
  soil: {
    ph: number
    nitrogen: string
    phosphorus: string
    potassium: string
  }
  weather: {
    temperature: string
    humidity: string
    rainfall: string
  }
  nftId: string
  contractAddress: string
  blockchainData: {
    totalTransactions: number
    lastUpdate: string
    carbonCredits: number
    sustainabilityScore: number
  }
}

export function CropTrackingPage() {
  const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const crops = [
    {
      id: 1,
      name: "Organic Tomatoes",
      variety: "Cherry Tomatoes",
      planted: "2024-01-15",
      location: "Field A-1",
      stage: "Flowering",
      progress: 65,
      health: "Excellent",
      nextAction: "Watering in 2 days",
      image: "/placeholder.svg?height=200&width=300",
      soil: { ph: 6.5, nitrogen: "High", phosphorus: "Medium", potassium: "High" },
      weather: { temperature: "22°C", humidity: "65%", rainfall: "12mm" },
      nftId: "0x1a2b...3c4d",
      contractAddress: "0xAbC123...DeF456",
      blockchainData: {
        totalTransactions: 15,
        lastUpdate: "2024-03-01 14:30",
        carbonCredits: 2.5,
        sustainabilityScore: 95
      }
    },
    {
      id: 2,
      name: "Sweet Corn",
      variety: "Golden Bantam",
      planted: "2024-02-01",
      location: "Field B-2",
      stage: "Growing",
      progress: 45,
      health: "Good",
      nextAction: "Fertilize tomorrow",
      image: "/placeholder.svg?height=200&width=300",
      soil: { ph: 6.8, nitrogen: "Medium", phosphorus: "High", potassium: "Medium" },
      weather: { temperature: "25°C", humidity: "70%", rainfall: "8mm" },
      nftId: "0x2b3c...4d5e",
      contractAddress: "0xAbC123...DeF456",
      blockchainData: {
        totalTransactions: 12,
        lastUpdate: "2024-02-28 09:15",
        carbonCredits: 1.8,
        sustainabilityScore: 88
      }
    },
    {
      id: 3,
      name: "Lettuce",
      variety: "Romaine",
      planted: "2024-02-20",
      location: "Greenhouse 1",
      stage: "Seedling",
      progress: 25,
      health: "Good",
      nextAction: "Monitor growth",
      image: "/placeholder.svg?height=200&width=300",
      soil: { ph: 6.2, nitrogen: "High", phosphorus: "Medium", potassium: "Medium" },
      weather: { temperature: "20°C", humidity: "75%", rainfall: "5mm" },
      nftId: "0x3c4d...5e6f",
      contractAddress: "0xAbC123...DeF456",
      blockchainData: {
        totalTransactions: 8,
        lastUpdate: "2024-02-25 16:45",
        carbonCredits: 1.2,
        sustainabilityScore: 92
      }
    },
    {
      id: 4,
      name: "Carrots",
      variety: "Nantes",
      planted: "2024-01-30",
      location: "Field C-3",
      stage: "Mature",
      progress: 90,
      health: "Excellent",
      nextAction: "Ready for harvest",
      image: "/placeholder.svg?height=200&width=300",
      soil: { ph: 6.0, nitrogen: "Medium", phosphorus: "High", potassium: "High" },
      weather: { temperature: "18°C", humidity: "60%", rainfall: "15mm" },
      nftId: "0x4d5e...6f7g",
      contractAddress: "0xAbC123...DeF456",
      blockchainData: {
        totalTransactions: 20,
        lastUpdate: "2024-03-01 11:20",
        carbonCredits: 3.2,
        sustainabilityScore: 98
      }
    },
    {
      id: 5,
      name: "Bell Peppers",
      variety: "California Wonder",
      planted: "2024-02-10",
      location: "Greenhouse 2",
      stage: "Fruiting",
      progress: 75,
      health: "Good",
      nextAction: "Pest inspection",
      image: "/placeholder.svg?height=200&width=300",
      soil: { ph: 6.7, nitrogen: "High", phosphorus: "Medium", potassium: "High" },
      weather: { temperature: "24°C", humidity: "68%", rainfall: "10mm" },
      nftId: "0x5e6f...7g8h",
      contractAddress: "0xAbC123...DeF456",
      blockchainData: {
        totalTransactions: 14,
        lastUpdate: "2024-02-29 13:10",
        carbonCredits: 2.1,
        sustainabilityScore: 90
      }
    },
    {
      id: 6,
      name: "Spinach",
      variety: "Space",
      planted: "2024-02-25",
      location: "Field D-1",
      stage: "Growing",
      progress: 35,
      health: "Fair",
      nextAction: "Nutrient check",
      image: "/placeholder.svg?height=200&width=300",
      soil: { ph: 6.3, nitrogen: "Medium", phosphorus: "Low", potassium: "Medium" },
      weather: { temperature: "19°C", humidity: "72%", rainfall: "7mm" },
      nftId: "0x6f7g...8h9i",
      contractAddress: "0xAbC123...DeF456",
      blockchainData: {
        totalTransactions: 6,
        lastUpdate: "2024-02-27 08:45",
        carbonCredits: 0.9,
        sustainabilityScore: 82
      }
    },
  ]

  const getCropBlockchainRecords = (cropId: number) => {
    const allRecords = [
      {
        crop: "Organic Tomatoes",
        action: "Planting Record",
        block: "0x1a2b3c4d...",
        gas: "21,000",
        timestamp: "2024-01-15 08:30",
        status: "Confirmed",
        txHash: "0x1234567890abcdef...",
        cropId: 1
      },
      {
        crop: "Organic Tomatoes",
        action: "Growth Update",
        block: "0x2b3c4d5e...",
        gas: "18,500",
        timestamp: "2024-02-15 14:20",
        status: "Confirmed",
        txHash: "0x2345678901bcdef0...",
        cropId: 1
      },
      {
        crop: "Organic Tomatoes",
        action: "Health Assessment",
        block: "0x3c4d5e6f...",
        gas: "19,200",
        timestamp: "2024-02-28 10:15",
        status: "Confirmed",
        txHash: "0x3456789012cdef01...",
        cropId: 1
      },
      {
        crop: "Sweet Corn",
        action: "Planting Record",
        block: "0x4d5e6f7g...",
        gas: "22,100",
        timestamp: "2024-02-01 09:00",
        status: "Confirmed",
        txHash: "0x4567890123def012...",
        cropId: 2
      },
      {
        crop: "Sweet Corn",
        action: "Fertilization",
        block: "0x5e6f7g8h...",
        gas: "20,300",
        timestamp: "2024-02-20 16:30",
        status: "Confirmed",
        txHash: "0x5678901234ef0123...",
        cropId: 2
      }
    ]
    return allRecords.filter(record => record.cropId === cropId)
  }

  const openCropDetails = (crop: CropType) => {
    setSelectedCrop(crop)
    setIsDetailsOpen(true)
  }

  const blockchainRecords = [
    {
      crop: "Organic Tomatoes",
      action: "Planting Record",
      block: "0x1a2b3c4d...",
      gas: "21,000",
      timestamp: "2024-01-15 08:30",
      status: "Confirmed",
    },
    {
      crop: "Sweet Corn",
      action: "Growth Update",
      block: "0x2b3c4d5e...",
      gas: "18,500",
      timestamp: "2024-02-15 14:20",
      status: "Confirmed",
    },
    {
      crop: "Lettuce",
      action: "Health Assessment",
      block: "0x3c4d5e6f...",
      gas: "19,200",
      timestamp: "2024-02-28 10:15",
      status: "Confirmed",
    },
    {
      crop: "Carrots",
      action: "Harvest Ready",
      block: "0x4d5e6f7g...",
      gas: "22,100",
      timestamp: "2024-03-01 16:45",
      status: "Pending",
    },
  ]

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Seedling":
        return "bg-yellow-900/30 text-yellow-300 border-yellow-500/50"
      case "Growing":
        return "bg-green-900/30 text-green-300 border-green-500/50"
      case "Flowering":
        return "bg-purple-900/30 text-purple-300 border-purple-500/50"
      case "Fruiting":
        return "bg-orange-900/30 text-orange-300 border-orange-500/50"
      case "Mature":
        return "bg-blue-900/30 text-blue-300 border-blue-500/50"
      case "Harvesting":
        return "bg-red-900/30 text-red-300 border-red-500/50"
      default:
        return "bg-gray-900/30 text-gray-300 border-gray-500/50"
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "Excellent":
        return "text-emerald-400"
      case "Good":
        return "text-green-400"
      case "Fair":
        return "text-yellow-400"
      case "Poor":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800 relative">
      <Header isConnected={true} />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-emerald-100 mb-2">
                <span className="bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                  Crop Tracking
                </span>
              </h1>
              <p className="text-xl text-emerald-200/80">Monitor your crops from seed to harvest on the blockchain</p>
            </div>
            <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-xl font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Add New Crop
            </Button>
          </div>

          {/* Crops Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {crops.map((crop) => (
              <Card
                key={crop.id}
                className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40 hover:border-emerald-600/60 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="aspect-video bg-gradient-to-br from-emerald-900/50 to-green-900/50 rounded-t-lg relative overflow-hidden">
                  <img src={crop.image || "/placeholder.svg"} alt={crop.name} className="w-full h-full object-cover opacity-70" />
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getStageColor(crop.stage)} border backdrop-blur-sm`}>{crop.stage}</Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-emerald-100 text-lg">{crop.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-800/60">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-800/60">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-emerald-200/80">{crop.variety}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-200/80">Growth Progress</span>
                      <span className="text-emerald-100 font-medium">{crop.progress}%</span>
                    </div>
                    <Progress value={crop.progress} className="h-2 bg-emerald-900/50" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-emerald-200/80">
                      <MapPin className="w-4 h-4" />
                      <span>{crop.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-200/80">
                      <Calendar className="w-4 h-4" />
                      <span>Planted: {crop.planted}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${crop.health === "Excellent" ? "bg-emerald-400" : crop.health === "Good" ? "bg-green-400" : crop.health === "Fair" ? "bg-yellow-400" : "bg-red-400"}`}
                      ></div>
                      <span className={`text-sm font-medium ${getHealthColor(crop.health)}`}>
                        Health: {crop.health}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <Thermometer className="w-4 h-4 text-red-400" />
                      <Leaf className="w-4 h-4 text-green-400" />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-emerald-700/50">
                    <p className="text-sm text-emerald-200/80 mb-2">Next Action:</p>
                    <p className="text-sm font-medium text-emerald-100">{crop.nextAction}</p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 bg-transparent hover:border-emerald-500"
                    onClick={() => openCropDetails(crop)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Blockchain Records */}
          <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
            <CardHeader>
              <CardTitle className="text-emerald-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Blockchain Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {blockchainRecords.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-emerald-900/30 border border-emerald-700/30 rounded-lg hover:bg-emerald-800/40 transition-colors duration-300"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-emerald-100">
                          {record.crop} - {record.action}
                        </h3>
                        <Badge
                          variant="outline"
                          className={
                            record.status === "Confirmed"
                              ? "text-emerald-300 border-emerald-500/50 bg-emerald-900/20"
                              : "text-amber-300 border-amber-500/50 bg-amber-900/20"
                          }
                        >
                          {record.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-emerald-200/80">
                        <span>Block: {record.block}</span>
                        <span>Gas: {record.gas}</span>
                        <span>{record.timestamp}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-emerald-300 hover:text-emerald-100 hover:bg-emerald-800/60">
                      View on Explorer
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 bg-transparent hover:border-emerald-500"
              >
                View All Records
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Crop Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-7xl h-[95vh] bg-emerald-900 border-emerald-700 text-emerald-100">
          <DialogHeader>
            <DialogTitle className="text-2xl text-emerald-100 flex items-center gap-3">
              <Leaf className="w-6 h-6 text-emerald-400" />
              {selectedCrop?.name} Details
              <Badge className={`${getStageColor(selectedCrop?.stage || "")} border ml-auto`}>
                {selectedCrop?.stage}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedCrop && (
            <div className="space-y-6 mt-4 h-full overflow-y-auto pr-2 emerald-scrollbar">
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
                    <p className="text-sm text-emerald-200/80">Variety</p>
                    <p className="text-emerald-100 font-medium">{selectedCrop.variety}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-emerald-200/80">Location</p>
                    <p className="text-emerald-100 font-medium">{selectedCrop.location}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-emerald-200/80">Planted Date</p>
                    <p className="text-emerald-100 font-medium">{selectedCrop.planted}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-emerald-200/80">Health Status</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedCrop.health === "Excellent" ? "bg-emerald-400" : selectedCrop.health === "Good" ? "bg-green-400" : selectedCrop.health === "Fair" ? "bg-yellow-400" : "bg-red-400"}`}></div>
                      <span className={`font-medium ${getHealthColor(selectedCrop.health)}`}>{selectedCrop.health}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-emerald-200/80">Growth Progress</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-100">{selectedCrop.progress}%</span>
                      </div>
                      <Progress value={selectedCrop.progress} className="h-2 bg-emerald-900/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-emerald-200/80">Next Action</p>
                    <p className="text-emerald-100 font-medium">{selectedCrop.nextAction}</p>
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
                    <p className="text-sm text-emerald-200/80">NFT ID</p>
                    <div className="flex items-center gap-2">
                      <p className="text-emerald-100 font-mono text-sm">{selectedCrop.nftId}</p>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-emerald-300 hover:text-emerald-100">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-emerald-200/80">Contract Address</p>
                    <div className="flex items-center gap-2">
                      <p className="text-emerald-100 font-mono text-sm">{selectedCrop.contractAddress}</p>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-emerald-300 hover:text-emerald-100">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-emerald-200/80">Total Transactions</p>
                    <p className="text-emerald-100 font-medium">{selectedCrop.blockchainData.totalTransactions}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-emerald-200/80">Last Update</p>
                    <p className="text-emerald-100 font-medium">{selectedCrop.blockchainData.lastUpdate}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-emerald-200/80">Carbon Credits</p>
                    <p className="text-emerald-100 font-medium">{selectedCrop.blockchainData.carbonCredits} tons</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-emerald-200/80">Sustainability Score</p>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedCrop.blockchainData.sustainabilityScore} className="h-2 bg-emerald-900/50 flex-1" />
                      <span className="text-emerald-100 font-medium">{selectedCrop.blockchainData.sustainabilityScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Environmental Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Soil Conditions */}
                <Card className="bg-emerald-800/40 border-emerald-700/40">
                  <CardHeader>
                    <CardTitle className="text-emerald-100 flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-emerald-400" />
                      Soil Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-200/80">pH Level</span>
                      <span className="text-emerald-100 font-medium">{selectedCrop.soil.ph}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-200/80">Nitrogen</span>
                      <Badge variant="outline" className={`${selectedCrop.soil.nitrogen === "High" ? "text-green-300 border-green-500/50" : selectedCrop.soil.nitrogen === "Medium" ? "text-yellow-300 border-yellow-500/50" : "text-red-300 border-red-500/50"} bg-emerald-900/20`}>
                        {selectedCrop.soil.nitrogen}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-200/80">Phosphorus</span>
                      <Badge variant="outline" className={`${selectedCrop.soil.phosphorus === "High" ? "text-green-300 border-green-500/50" : selectedCrop.soil.phosphorus === "Medium" ? "text-yellow-300 border-yellow-500/50" : "text-red-300 border-red-500/50"} bg-emerald-900/20`}>
                        {selectedCrop.soil.phosphorus}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-200/80">Potassium</span>
                      <Badge variant="outline" className={`${selectedCrop.soil.potassium === "High" ? "text-green-300 border-green-500/50" : selectedCrop.soil.potassium === "Medium" ? "text-yellow-300 border-yellow-500/50" : "text-red-300 border-red-500/50"} bg-emerald-900/20`}>
                        {selectedCrop.soil.potassium}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Weather Data */}
                <Card className="bg-emerald-800/40 border-emerald-700/40">
                  <CardHeader>
                    <CardTitle className="text-emerald-100 flex items-center gap-2">
                      <Thermometer className="w-5 h-5 text-emerald-400" />
                      Weather Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-200/80">Temperature</span>
                      <span className="text-emerald-100 font-medium">{selectedCrop.weather.temperature}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-200/80">Humidity</span>
                      <span className="text-emerald-100 font-medium">{selectedCrop.weather.humidity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-200/80">Rainfall (Last 24h)</span>
                      <span className="text-emerald-100 font-medium">{selectedCrop.weather.rainfall}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Blockchain Transaction History */}
              <Card className="bg-emerald-800/40 border-emerald-700/40">
                <CardHeader>
                  <CardTitle className="text-emerald-100 flex items-center gap-2">
                    <Hash className="w-5 h-5 text-emerald-400" />
                    Blockchain Transaction History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getCropBlockchainRecords(selectedCrop.id).map((record, index) => (
                      <div key={index} className="p-4 bg-emerald-900/30 border border-emerald-700/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-emerald-100">{record.action}</h4>
                          <Badge className="bg-emerald-900/30 text-emerald-300 border-emerald-500/50">
                            {record.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-emerald-200/80">
                          <div>
                            <span className="text-emerald-200">Block:</span> {record.block}
                          </div>
                          <div>
                            <span className="text-emerald-200">Gas:</span> {record.gas}
                          </div>
                          <div>
                            <span className="text-emerald-200">Time:</span> {record.timestamp}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-200">Tx Hash:</span> 
                            <span className="font-mono">{record.txHash}</span>
                            <Button size="sm" variant="ghost" className="h-4 w-4 p-0 text-emerald-300 hover:text-emerald-100">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Explorer
                    </Button>
                    <Button variant="outline" className="border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 bg-transparent">
                      <Hash className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}

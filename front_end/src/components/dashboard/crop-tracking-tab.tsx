"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MapPin, Calendar, Droplets, Thermometer } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function CropTrackingTab() {
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
    },
  ]

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Seedling":
        return "bg-yellow-100 text-yellow-800"
      case "Growing":
        return "bg-green-100 text-green-800"
      case "Flowering":
        return "bg-purple-100 text-purple-800"
      case "Harvesting":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Crop Tracking</h1>
          <p className="text-green-600">Monitor your crops from seed to harvest on the blockchain</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New Crop
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <Card
            key={crop.id}
            className="bg-white/70 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-800">{crop.name}</CardTitle>
                <Badge className={getStageColor(crop.stage)}>{crop.stage}</Badge>
              </div>
              <p className="text-sm text-green-600">{crop.variety}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">Growth Progress</span>
                  <span className="text-green-800 font-medium">{crop.progress}%</span>
                </div>
                <Progress value={crop.progress} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <MapPin className="w-4 h-4" />
                  <span>{crop.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Calendar className="w-4 h-4" />
                  <span>Planted: {crop.planted}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Health: {crop.health}</span>
                </div>
                <div className="flex gap-1">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <Thermometer className="w-4 h-4 text-red-500" />
                </div>
              </div>

              <div className="pt-2 border-t border-green-200">
                <p className="text-sm text-green-600 mb-2">Next Action:</p>
                <p className="text-sm font-medium text-green-800">{crop.nextAction}</p>
              </div>

              <Button
                variant="outline"
                className="w-full border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Blockchain Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">Tomatoes - Planting Record</p>
                <p className="text-sm text-green-600">Block: 0x1a2b3c... | Gas: 21,000</p>
              </div>
              <Badge variant="outline" className="text-green-700">
                Confirmed
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">Corn - Growth Update</p>
                <p className="text-sm text-green-600">Block: 0x2b3c4d... | Gas: 18,500</p>
              </div>
              <Badge variant="outline" className="text-green-700">
                Confirmed
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

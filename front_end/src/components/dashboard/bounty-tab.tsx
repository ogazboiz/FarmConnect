"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, Clock, Coins, Plus, CheckCircle, AlertCircle } from "lucide-react"

export function BountyTab() {
  const availableBounties = [
    {
      id: 1,
      title: "Develop Drought-Resistant Wheat Variety",
      description: "Create a wheat variety that can survive with 30% less water while maintaining yield",
      reward: "5,000 $FARM",
      deadline: "30 days",
      difficulty: "Expert",
      category: "Research",
      applicants: 12,
    },
    {
      id: 2,
      title: "Organic Pest Control Solution",
      description: "Find an effective organic method to control aphids in tomato crops",
      reward: "1,500 $FARM",
      deadline: "14 days",
      difficulty: "Intermediate",
      category: "Pest Control",
      applicants: 8,
    },
    {
      id: 3,
      title: "Soil Health Improvement Protocol",
      description: "Develop a 6-month protocol to improve soil organic matter by 15%",
      reward: "3,000 $FARM",
      deadline: "21 days",
      difficulty: "Advanced",
      category: "Soil Management",
      applicants: 15,
    },
  ]

  const myBounties = [
    {
      id: 1,
      title: "Companion Planting Guide",
      status: "In Progress",
      reward: "800 $FARM",
      progress: 75,
      deadline: "5 days",
    },
    {
      id: 2,
      title: "Water Conservation Technique",
      status: "Completed",
      reward: "1,200 $FARM",
      progress: 100,
      deadline: "Completed",
    },
    {
      id: 3,
      title: "Crop Rotation Optimization",
      status: "Under Review",
      reward: "2,000 $FARM",
      progress: 100,
      deadline: "Pending",
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-orange-100 text-orange-800"
      case "Expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Agricultural Bounties</h1>
          <p className="text-green-600">Solve farming challenges and earn rewards for your innovations</p>
        </div>
        <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Bounty
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Available Bounties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableBounties.map((bounty) => (
                <div
                  key={bounty.id}
                  className="border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-800 mb-1">{bounty.title}</h3>
                      <p className="text-sm text-green-600 mb-2">{bounty.description}</p>
                    </div>
                    <Badge className={getDifficultyColor(bounty.difficulty)}>{bounty.difficulty}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-green-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-700">{bounty.reward}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{bounty.deadline}</span>
                    </div>
                    <div>
                      <span>{bounty.applicants} applicants</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      Apply Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              My Bounties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myBounties.map((bounty) => (
                <div key={bounty.id} className="border border-green-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-green-800 mb-1">{bounty.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(bounty.status)}>{bounty.status}</Badge>
                        <span className="text-sm text-green-600">{bounty.deadline}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-700">
                        <Coins className="w-4 h-4" />
                        <span className="font-medium">{bounty.reward}</span>
                      </div>
                    </div>
                  </div>

                  {bounty.status === "In Progress" && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-green-600">Progress</span>
                        <span className="text-green-800 font-medium">{bounty.progress}%</span>
                      </div>
                      <div className="w-full bg-green-100 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${bounty.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {bounty.status === "In Progress" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                      >
                        Update Progress
                      </Button>
                    )}
                    {bounty.status === "Under Review" && (
                      <div className="flex items-center gap-2 text-sm text-yellow-700">
                        <AlertCircle className="w-4 h-4" />
                        <span>Awaiting review</span>
                      </div>
                    )}
                    {bounty.status === "Completed" && (
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Reward claimed</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Bounty Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Research",
              "Pest Control",
              "Soil Management",
              "Water Conservation",
              "Crop Breeding",
              "Sustainable Practices",
              "Technology",
              "Marketing",
            ].map((category) => (
              <Button
                key={category}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50 justify-start bg-transparent"
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Clock, Coins, Plus, CheckCircle, AlertCircle, Users, Award, TrendingUp, Filter } from "lucide-react"

export function BountyPage() {
  const availableBounties = [
    {
      id: 1,
      title: "Develop Drought-Resistant Wheat Variety",
      description:
        "Create a wheat variety that can survive with 30% less water while maintaining yield quality and nutritional value.",
      reward: "5,000 $AGRI",
      deadline: "30 days",
      difficulty: "Expert",
      category: "Research",
      applicants: 12,
      sponsor: "Agricultural Research Foundation",
      requirements: ["PhD in Plant Biology", "5+ years experience", "Access to lab facilities"],
    },
    {
      id: 2,
      title: "Organic Pest Control Solution",
      description: "Find an effective organic method to control aphids in tomato crops without harmful chemicals.",
      reward: "1,500 $AGRI",
      deadline: "14 days",
      difficulty: "Intermediate",
      category: "Pest Control",
      applicants: 8,
      sponsor: "Organic Farmers Collective",
      requirements: ["Organic farming experience", "Documented results", "Cost-effective solution"],
    },
    {
      id: 3,
      title: "Soil Health Improvement Protocol",
      description: "Develop a 6-month protocol to improve soil organic matter by 15% using sustainable methods.",
      reward: "3,000 $AGRI",
      deadline: "21 days",
      difficulty: "Advanced",
      category: "Soil Management",
      applicants: 15,
      sponsor: "Sustainable Agriculture DAO",
      requirements: ["Soil science background", "Field testing capability", "Measurable results"],
    },
    {
      id: 4,
      title: "Smart Irrigation System Design",
      description:
        "Create an IoT-based irrigation system that reduces water usage by 40% while maintaining crop health.",
      reward: "4,200 $FARM",
      deadline: "45 days",
      difficulty: "Expert",
      category: "Technology",
      applicants: 6,
      sponsor: "Tech for Agriculture Initiative",
      requirements: ["IoT development experience", "Agricultural knowledge", "Prototype development"],
    },
    {
      id: 5,
      title: "Companion Planting Guide",
      description: "Develop a comprehensive guide for companion planting to maximize yield and reduce pest issues.",
      reward: "800 $FARM",
      deadline: "10 days",
      difficulty: "Beginner",
      category: "Education",
      applicants: 23,
      sponsor: "Local Produce Network",
      requirements: ["Farming experience", "Writing skills", "Research ability"],
    },
    {
      id: 6,
      title: "Carbon Sequestration Measurement Tool",
      description:
        "Create a tool to accurately measure carbon sequestration in agricultural soils for carbon credit programs.",
      reward: "6,500 $FARM",
      deadline: "60 days",
      difficulty: "Expert",
      category: "Environmental",
      applicants: 4,
      sponsor: "Climate Action Agriculture",
      requirements: ["Environmental science degree", "Carbon measurement experience", "Software development skills"],
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
      description: "Creating comprehensive guide for companion planting strategies",
      lastUpdate: "2024-02-28",
    },
    {
      id: 2,
      title: "Water Conservation Technique",
      status: "Completed",
      reward: "1,200 $FARM",
      progress: 100,
      deadline: "Completed",
      description: "Developed drip irrigation optimization method",
      lastUpdate: "2024-02-20",
    },
    {
      id: 3,
      title: "Crop Rotation Optimization",
      status: "Under Review",
      reward: "2,000 $FARM",
      progress: 100,
      deadline: "Pending",
      description: "Submitted 4-season crop rotation plan for small farms",
      lastUpdate: "2024-02-25",
    },
  ]

  const categories = [
    { name: "Research", count: 8, color: "bg-blue-100 text-blue-800" },
    { name: "Pest Control", count: 12, color: "bg-green-100 text-green-800" },
    { name: "Soil Management", count: 6, color: "bg-amber-100 text-amber-800" },
    { name: "Water Conservation", count: 9, color: "bg-cyan-100 text-cyan-800" },
    { name: "Technology", count: 5, color: "bg-purple-100 text-purple-800" },
    { name: "Education", count: 15, color: "bg-pink-100 text-pink-800" },
    { name: "Environmental", count: 7, color: "bg-emerald-100 text-emerald-800" },
    { name: "Marketing", count: 4, color: "bg-orange-100 text-orange-800" },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-900/30 text-green-300 border-green-500/50"
      case "Intermediate":
        return "bg-yellow-900/30 text-yellow-300 border-yellow-500/50"
      case "Advanced":
        return "bg-orange-900/30 text-orange-300 border-orange-500/50"
      case "Expert":
        return "bg-red-900/30 text-red-300 border-red-500/50"
      default:
        return "bg-gray-900/30 text-gray-300 border-gray-500/50"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-900/30 text-emerald-300 border-emerald-500/50"
      case "In Progress":
        return "bg-blue-900/30 text-blue-300 border-blue-500/50"
      case "Under Review":
        return "bg-amber-900/30 text-amber-300 border-amber-500/50"
      default:
        return "bg-gray-900/30 text-gray-300 border-gray-500/50"
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
                <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                  Agricultural Bounties
                </span>
              </h1>
              <p className="text-xl text-emerald-200/80">Solve farming challenges and earn rewards for your innovations</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-amber-600/50 text-amber-200 hover:bg-amber-800/60 bg-transparent hover:border-amber-500">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 shadow-xl font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Create Bounty
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-100 mb-1">47</div>
                <div className="text-sm text-emerald-200/80">Available Bounties</div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-100 mb-1">3</div>
                <div className="text-sm text-emerald-200/80">My Active Bounties</div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
              <CardContent className="p-6 text-center">
                <Coins className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-100 mb-1">4,000</div>
                <div className="text-sm text-emerald-200/80">$AGRI Earned</div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-100 mb-1">8</div>
                <div className="text-sm text-emerald-200/80">Completed Bounties</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Available Bounties */}
            <div className="lg:col-span-2">
              <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
                <CardHeader>
                  <CardTitle className="text-emerald-100 flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-400" />
                    Available Bounties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {availableBounties.map((bounty) => (
                      <div
                        key={bounty.id}
                        className="border border-emerald-700/50 rounded-lg p-6 hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-emerald-900/30 to-green-900/30 hover:from-emerald-800/40 hover:to-green-800/40"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-emerald-100 text-lg">{bounty.title}</h3>
                              <Badge className={`${getDifficultyColor(bounty.difficulty)} border backdrop-blur-sm`}>
                                {bounty.difficulty}
                              </Badge>
                            </div>
                            <p className="text-emerald-200/80 mb-3 leading-relaxed">{bounty.description}</p>
                            <div className="text-sm text-emerald-200/80 mb-3">
                              <span className="font-medium">Sponsored by:</span> {bounty.sponsor}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-emerald-200/80 mb-4">
                          <div className="flex items-center gap-1">
                            <Coins className="w-4 h-4 text-amber-400" />
                            <span className="font-medium text-amber-300 text-base">{bounty.reward}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{bounty.deadline}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{bounty.applicants} applicants</span>
                          </div>
                          <Badge variant="outline" className="text-emerald-300 border-emerald-500/50 bg-emerald-900/20">
                            {bounty.category}
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-emerald-200 mb-2">Requirements:</p>
                          <div className="flex flex-wrap gap-2">
                            {bounty.requirements.map((req, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-emerald-900/30 text-emerald-200 border-emerald-600/30">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button size="sm" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-semibold">
                            Apply Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-amber-600/50 text-amber-200 hover:bg-amber-800/60 bg-transparent hover:border-amber-500"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-6 border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
                  >
                    Load More Bounties
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* My Bounties */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200/50">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    My Bounties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myBounties.map((bounty) => (
                      <div key={bounty.id} className="border border-emerald-200 rounded-lg p-4 bg-emerald-50/30">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 mb-1">{bounty.title}</h3>
                            <p className="text-sm text-slate-600 mb-2">{bounty.description}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`${getStatusColor(bounty.status)} border text-xs`}>
                                {bounty.status}
                              </Badge>
                              <span className="text-xs text-slate-600">Updated: {bounty.lastUpdate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1 text-amber-700">
                            <Coins className="w-4 h-4" />
                            <span className="font-medium">{bounty.reward}</span>
                          </div>
                          <span className="text-sm text-slate-600">{bounty.deadline}</span>
                        </div>

                        {bounty.status === "In Progress" && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-slate-600">Progress</span>
                              <span className="text-slate-800 font-medium">{bounty.progress}%</span>
                            </div>
                            <Progress value={bounty.progress} className="h-2" />
                          </div>
                        )}

                        <div className="flex gap-2">
                          {bounty.status === "In Progress" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent text-xs"
                            >
                              Update Progress
                            </Button>
                          )}
                          {bounty.status === "Under Review" && (
                            <div className="flex items-center gap-2 text-sm text-amber-700">
                              <AlertCircle className="w-4 h-4" />
                              <span>Awaiting review</span>
                            </div>
                          )}
                          {bounty.status === "Completed" && (
                            <div className="flex items-center gap-2 text-sm text-emerald-700">
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

              {/* Categories */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200/50">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.name}
                        variant="outline"
                        className="w-full justify-between border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                      >
                        <span>{category.name}</span>
                        <Badge variant="secondary" className={category.color}>
                          {category.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

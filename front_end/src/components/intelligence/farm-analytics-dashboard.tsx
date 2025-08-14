"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Droplets,
  DollarSign,
  Target,
  Award,
  ThumbsUp
} from "lucide-react"
import { useState, useEffect } from "react"

interface AnalyticsData {
  cropPerformance: Array<{
    crop: string
    plantedArea: number
    expectedYield: number
    actualYield: number
    profitability: number
    successRate: number
    season: string
    status: 'excellent' | 'good' | 'average' | 'poor'
  }>
  resourceEfficiency: {
    waterUsage: {
      total: number
      efficient: number
      wasted: number
      efficiency: number
    }
    fertilizerUsage: {
      cost: number
      effectiveness: number
      recommendation: string
    }
    laborHours: {
      total: number
      productive: number
      efficiency: number
    }
  }
  customerFeedback: Array<{
    crop: string
    rating: number
    totalReviews: number
    comments: string[]
    satisfaction: number
  }>
  recommendations: Array<{
    category: 'yield' | 'cost' | 'quality' | 'timing'
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
    effort: 'easy' | 'moderate' | 'complex'
  }>
}

export function FarmAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('current-season')

  useEffect(() => {
    // Simulate API call - replace with actual analytics API
    setTimeout(() => {
      setAnalyticsData({
        cropPerformance: [
          {
            crop: "Tomatoes",
            plantedArea: 100,
            expectedYield: 2500,
            actualYield: 2750,
            profitability: 85,
            successRate: 92,
            season: "Summer 2024",
            status: "excellent"
          },
          {
            crop: "Lettuce", 
            plantedArea: 75,
            expectedYield: 1200,
            actualYield: 1180,
            profitability: 78,
            successRate: 88,
            season: "Fall 2024",
            status: "good"
          },
          {
            crop: "Peppers",
            plantedArea: 50,
            expectedYield: 800,
            actualYield: 720,
            profitability: 65,
            successRate: 75,
            season: "Summer 2024", 
            status: "average"
          },
          {
            crop: "Carrots",
            plantedArea: 80,
            expectedYield: 1600,
            actualYield: 1200,
            profitability: 45,
            successRate: 60,
            season: "Spring 2024",
            status: "poor"
          }
        ],
        resourceEfficiency: {
          waterUsage: {
            total: 5000,
            efficient: 4200,
            wasted: 800,
            efficiency: 84
          },
          fertilizerUsage: {
            cost: 1200,
            effectiveness: 76,
            recommendation: "Switch to organic compost for better soil health"
          },
          laborHours: {
            total: 480,
            productive: 420,
            efficiency: 87.5
          }
        },
        customerFeedback: [
          {
            crop: "Tomatoes",
            rating: 4.8,
            totalReviews: 24,
            comments: ["Excellent flavor", "Perfect ripeness", "Great quality"],
            satisfaction: 96
          },
          {
            crop: "Lettuce",
            rating: 4.5,
            totalReviews: 18,
            comments: ["Fresh and crisp", "Good size", "Long lasting"],
            satisfaction: 90
          },
          {
            crop: "Peppers", 
            rating: 4.2,
            totalReviews: 12,
            comments: ["Good heat level", "Nice color", "Bit small"],
            satisfaction: 84
          }
        ],
        recommendations: [
          {
            category: "yield",
            title: "Optimize Pepper Growing Conditions",
            description: "Peppers underperformed by 10%. Consider better spacing and nutrient management.",
            impact: "high",
            effort: "moderate"
          },
          {
            category: "cost",
            title: "Reduce Water Waste",
            description: "16% water waste detected. Install drip irrigation in sections 3-4.",
            impact: "medium", 
            effort: "easy"
          },
          {
            category: "quality",
            title: "Improve Carrot Storage",
            description: "Customer feedback indicates quality issues. Review post-harvest handling.",
            impact: "high",
            effort: "easy"
          },
          {
            category: "timing",
            title: "Adjust Planting Schedule",
            description: "Plant lettuce 2 weeks earlier for better fall harvest timing.",
            impact: "medium",
            effort: "easy"
          }
        ]
      })
      setLoading(false)
    }, 1000)
  }, [selectedPeriod])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200'
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'average': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'poor': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'yield': return <TrendingUp className="w-4 h-4" />
      case 'cost': return <DollarSign className="w-4 h-4" />
      case 'quality': return <Award className="w-4 h-4" />
      case 'timing': return <Calendar className="w-4 h-4" />
      default: return <BarChart3 className="w-4 h-4" />
    }
  }

  // Calculate overall metrics
  const avgProfitability = analyticsData.cropPerformance.reduce((acc, crop) => acc + crop.profitability, 0) / analyticsData.cropPerformance.length
  const avgSuccessRate = analyticsData.cropPerformance.reduce((acc, crop) => acc + crop.successRate, 0) / analyticsData.cropPerformance.length
  const totalRevenue = analyticsData.cropPerformance.reduce((acc, crop) => acc + (crop.actualYield * crop.profitability / 100 * 4.5), 0)

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-purple-50 to-emerald-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            📊 Farm Performance Analytics
          </h1>
          <p className="text-gray-600 mt-1">Optimize your farming operations with data insights</p>
        </div>
        <div className="flex gap-2">
          {[
            { key: 'current-season', label: 'Current Season' },
            { key: 'last-season', label: 'Last Season' },
            { key: 'year-to-date', label: 'Year to Date' }
          ].map((period) => (
            <Button
              key={period.key}
              variant={selectedPeriod === period.key ? "default" : "outline"}
              onClick={() => setSelectedPeriod(period.key)}
              className="text-sm"
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Avg Profitability</p>
                <p className="text-2xl font-bold">{avgProfitability.toFixed(1)}%</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Success Rate</p>
                <p className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</p>
              </div>
              <Target className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(0)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Water Efficiency</p>
                <p className="text-2xl font-bold">{analyticsData.resourceEfficiency.waterUsage.efficiency}%</p>
              </div>
              <Droplets className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🌱 Crop Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.cropPerformance.map((crop, index) => (
              <div key={index} className="p-4 rounded-lg border bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{crop.crop}</h3>
                    <Badge className={getStatusColor(crop.status)}>
                      {crop.status === 'excellent' ? '🌟 Excellent' :
                       crop.status === 'good' ? '👍 Good' :
                       crop.status === 'average' ? '📊 Average' : '⚠️ Needs Attention'}
                    </Badge>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {crop.season}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Yield Performance</p>
                    <p className="font-semibold flex items-center gap-1">
                      {crop.actualYield > crop.expectedYield ? 
                        <TrendingUp className="w-4 h-4 text-green-500" /> :
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      }
                      {((crop.actualYield / crop.expectedYield - 1) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Profitability</p>
                    <p className="font-semibold text-green-600">{crop.profitability}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Success Rate</p>
                    <p className="font-semibold text-blue-600">{crop.successRate}%</p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Expected: </span>
                    <span className="font-medium">{crop.expectedYield} kg</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Actual: </span>
                    <span className="font-medium">{crop.actualYield} kg</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Customer Satisfaction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              😊 Customer Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.customerFeedback.map((feedback, index) => (
              <div key={index} className="p-4 rounded-lg border bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{feedback.crop}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {"⭐".repeat(Math.floor(feedback.rating))}
                      <span className="font-semibold">{feedback.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">({feedback.totalReviews} reviews)</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">{feedback.satisfaction}% satisfaction</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${feedback.satisfaction}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Recent Comments:</p>
                  <div className="space-y-1">
                    {feedback.comments.slice(0, 2).map((comment, commentIndex) => (
                      <p key={commentIndex} className="text-sm bg-gray-50 p-2 rounded italic">
                        &ldquo;{comment}&rdquo;
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Resource Efficiency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚡ Resource Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Water Usage */}
            <div className="p-4 rounded-lg border bg-blue-50">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Water Usage</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Used:</span>
                  <span className="font-medium">{analyticsData.resourceEfficiency.waterUsage.total}L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Efficiently Used:</span>
                  <span className="font-medium text-green-600">{analyticsData.resourceEfficiency.waterUsage.efficient}L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Wasted:</span>
                  <span className="font-medium text-red-600">{analyticsData.resourceEfficiency.waterUsage.wasted}L</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between font-semibold">
                    <span>Efficiency:</span>
                    <span className="text-blue-600">{analyticsData.resourceEfficiency.waterUsage.efficiency}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fertilizer Usage */}
            <div className="p-4 rounded-lg border bg-green-50">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Fertilizer</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Cost:</span>
                  <span className="font-medium">${analyticsData.resourceEfficiency.fertilizerUsage.cost}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Effectiveness:</span>
                  <span className="font-medium text-green-600">{analyticsData.resourceEfficiency.fertilizerUsage.effectiveness}%</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-green-700">
                    💡 {analyticsData.resourceEfficiency.fertilizerUsage.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* Labor Efficiency */}
            <div className="p-4 rounded-lg border bg-purple-50">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Labor</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Hours:</span>
                  <span className="font-medium">{analyticsData.resourceEfficiency.laborHours.total}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Productive:</span>
                  <span className="font-medium text-green-600">{analyticsData.resourceEfficiency.laborHours.productive}h</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between font-semibold">
                    <span>Efficiency:</span>
                    <span className="text-purple-600">{analyticsData.resourceEfficiency.laborHours.efficiency}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤖 AI Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyticsData.recommendations.map((rec, index) => (
              <div key={index} className="p-4 rounded-lg border bg-white">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    {getCategoryIcon(rec.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{rec.title}</h3>
                      <Badge className={getImpactColor(rec.impact)}>
                        {rec.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {rec.effort} effort
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {rec.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

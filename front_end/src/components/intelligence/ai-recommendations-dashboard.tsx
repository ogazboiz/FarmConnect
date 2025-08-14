"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Brain, 
  TrendingUp, 
  Calendar,
  Target,
  Droplets,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lightbulb,
  BarChart3
} from "lucide-react"
import { useState, useEffect } from "react"

interface RecommendationData {
  cropSelection: Array<{
    crop: string
    confidence: number
    reasonScore: number
    recommendation: 'highly-recommended' | 'recommended' | 'consider' | 'avoid'
    reasons: string[]
    expectedYield: number
    expectedRevenue: number
    riskLevel: 'low' | 'medium' | 'high'
    plantingWindow: string
  }>
  plantingCalendar: Array<{
    crop: string
    optimalDates: string
    currentWindow: 'excellent' | 'good' | 'marginal' | 'poor'
    daysRemaining: number
    weatherConsiderations: string[]
  }>
  resourceOptimization: Array<{
    resource: 'water' | 'fertilizer' | 'labor' | 'seeds'
    currentUsage: number
    optimizedUsage: number
    savings: number
    implementation: string
    priority: 'high' | 'medium' | 'low'
  }>
  riskAssessment: Array<{
    riskType: 'weather' | 'pest' | 'market' | 'disease'
    crop: string
    probability: number
    impact: 'high' | 'medium' | 'low'
    mitigation: string
    cost: number
  }>
  successPredictions: Array<{
    crop: string
    successProbability: number
    factors: Array<{
      factor: string
      impact: number
      status: 'positive' | 'neutral' | 'negative'
    }>
    recommendations: string[]
  }>
}

export function AIRecommendationsDashboard() {
  const [recommendationData, setRecommendationData] = useState<RecommendationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('crop-selection')

  useEffect(() => {
    // Simulate API call - replace with actual AI recommendations API
    setTimeout(() => {
      setRecommendationData({
        cropSelection: [
          {
            crop: "Lettuce",
            confidence: 95,
            reasonScore: 92,
            recommendation: "highly-recommended",
            reasons: [
              "High local demand (8 businesses requesting)",
              "Optimal weather conditions for leafy greens",
              "Low competition in area",
              "93% historical success rate"
            ],
            expectedYield: 1800,
            expectedRevenue: 5760,
            riskLevel: "low",
            plantingWindow: "Next 2 weeks"
          },
          {
            crop: "Tomatoes",
            confidence: 88,
            reasonScore: 85,
            recommendation: "recommended",
            reasons: [
              "Rising market prices (+12%)",
              "Good weather conditions",
              "Previous success on your farm",
              "Strong consumer demand"
            ],
            expectedYield: 2750,
            expectedRevenue: 11550,
            riskLevel: "medium",
            plantingWindow: "Next 10 days"
          },
          {
            crop: "Hot Peppers",
            confidence: 72,
            reasonScore: 68,
            recommendation: "consider",
            reasons: [
              "Niche market opportunity",
              "Premium pricing available",
              "Limited local suppliers",
              "Moderate growing difficulty"
            ],
            expectedYield: 450,
            expectedRevenue: 5625,
            riskLevel: "medium",
            plantingWindow: "Wait 1 week"
          },
          {
            crop: "Carrots",
            confidence: 35,
            reasonScore: 28,
            recommendation: "avoid",
            reasons: [
              "Market oversaturation",
              "5 new carrot farms this season",
              "Declining prices (-7%)",
              "High labor requirements"
            ],
            expectedYield: 1200,
            expectedRevenue: 3360,
            riskLevel: "high",
            plantingWindow: "Not recommended"
          }
        ],
        plantingCalendar: [
          {
            crop: "Lettuce",
            optimalDates: "March 15 - April 1",
            currentWindow: "excellent",
            daysRemaining: 12,
            weatherConsiderations: ["Perfect temperature range", "Good soil moisture"]
          },
          {
            crop: "Tomatoes", 
            optimalDates: "March 20 - April 5",
            currentWindow: "good",
            daysRemaining: 8,
            weatherConsiderations: ["Plant before rain tomorrow", "Night temps suitable"]
          },
          {
            crop: "Peppers",
            optimalDates: "April 1 - April 15", 
            currentWindow: "marginal",
            daysRemaining: 5,
            weatherConsiderations: ["Wait for warmer weather", "Risk of late frost"]
          }
        ],
        resourceOptimization: [
          {
            resource: "water",
            currentUsage: 5000,
            optimizedUsage: 4200,
            savings: 800,
            implementation: "Install drip irrigation in sections 3-4",
            priority: "high"
          },
          {
            resource: "fertilizer",
            currentUsage: 1200,
            optimizedUsage: 950,
            savings: 250,
            implementation: "Switch to organic compost blend",
            priority: "medium"
          },
          {
            resource: "labor",
            currentUsage: 480,
            optimizedUsage: 420,
            savings: 60,
            implementation: "Automate seedling transplanting",
            priority: "low"
          }
        ],
        riskAssessment: [
          {
            riskType: "weather",
            crop: "Tomatoes",
            probability: 25,
            impact: "medium",
            mitigation: "Install row covers, have protection ready",
            cost: 150
          },
          {
            riskType: "pest",
            crop: "Lettuce",
            probability: 15,
            impact: "low",
            mitigation: "Companion planting with herbs",
            cost: 75
          },
          {
            riskType: "market",
            crop: "Carrots",
            probability: 85,
            impact: "high",
            mitigation: "Diversify into higher-value crops",
            cost: 0
          }
        ],
        successPredictions: [
          {
            crop: "Lettuce",
            successProbability: 93,
            factors: [
              { factor: "Weather conditions", impact: 25, status: "positive" },
              { factor: "Market demand", impact: 30, status: "positive" },
              { factor: "Soil quality", impact: 20, status: "positive" },
              { factor: "Competition", impact: 18, status: "positive" }
            ],
            recommendations: [
              "Plant in sections for continuous harvest",
              "Consider organic certification"
            ]
          },
          {
            crop: "Tomatoes",
            successProbability: 87,
            factors: [
              { factor: "Weather conditions", impact: 22, status: "positive" },
              { factor: "Market prices", impact: 28, status: "positive" },
              { factor: "Disease risk", impact: -8, status: "negative" },
              { factor: "Labor availability", impact: 15, status: "neutral" }
            ],
            recommendations: [
              "Monitor for early blight",
              "Stake plants properly for support"
            ]
          }
        ]
      })
      setLoading(false)
    }, 1000)
  }, [selectedCategory])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!recommendationData) return null

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'highly-recommended': return 'bg-green-100 text-green-800 border-green-200'
      case 'recommended': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'consider': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'avoid': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getWindowColor = (window: string) => {
    switch (window) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'marginal': return 'bg-yellow-100 text-yellow-800'
      case 'poor': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const categories = [
    { id: 'crop-selection', label: 'Crop Selection', icon: Target },
    { id: 'planting-calendar', label: 'Planting Calendar', icon: Calendar },
    { id: 'resource-optimization', label: 'Resource Optimization', icon: BarChart3 },
    { id: 'risk-assessment', label: 'Risk Assessment', icon: AlertTriangle },
    { id: 'success-predictions', label: 'Success Predictions', icon: TrendingUp }
  ]

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            🤖 AI-Powered Recommendations
          </h1>
          <p className="text-gray-600 mt-1">Personalized insights based on your farm data and conditions</p>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          <span className="text-sm text-purple-600 font-medium">AI Confidence: 89%</span>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            <category.icon className="w-4 h-4" />
            {category.label}
          </Button>
        ))}
      </div>

      {/* Crop Selection */}
      {selectedCategory === 'crop-selection' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Smart Crop Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendationData.cropSelection.map((crop, index) => (
                  <div key={index} className="p-6 rounded-lg border bg-white shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold">{crop.crop}</h3>
                        <Badge className={getRecommendationColor(crop.recommendation)}>
                          {crop.recommendation === 'highly-recommended' ? '🌟 Highly Recommended' :
                           crop.recommendation === 'recommended' ? '👍 Recommended' :
                           crop.recommendation === 'consider' ? '🤔 Consider' : '❌ Avoid'}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{crop.confidence}%</div>
                        <div className="text-sm text-gray-600">AI Confidence</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Expected Yield</p>
                        <p className="text-lg font-semibold">{crop.expectedYield} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Expected Revenue</p>
                        <p className="text-lg font-semibold text-green-600">${crop.expectedRevenue}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Risk Level:</span>
                        <span className={`font-semibold ${getRiskColor(crop.riskLevel)}`}>
                          {crop.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Planting Window:</span>
                        <span className="font-medium">{crop.plantingWindow}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">AI Reasoning:</p>
                      <ul className="space-y-1">
                        {crop.reasons.map((reason, reasonIndex) => (
                          <li key={reasonIndex} className="text-sm text-gray-600 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Planting Calendar */}
      {selectedCategory === 'planting-calendar' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📅 Optimal Planting Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendationData.plantingCalendar.map((item, index) => (
                <div key={index} className="p-4 rounded-lg border bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{item.crop}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getWindowColor(item.currentWindow)}>
                        {item.currentWindow === 'excellent' ? '🎯 Excellent' :
                         item.currentWindow === 'good' ? '👍 Good' :
                         item.currentWindow === 'marginal' ? '⚠️ Marginal' : '❌ Poor'}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Days remaining</p>
                        <p className="font-bold text-lg">{item.daysRemaining}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Optimal Dates:</p>
                      <p className="font-medium">{item.optimalDates}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Weather Considerations:</p>
                      <ul className="space-y-1">
                        {item.weatherConsiderations.map((consideration, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-center gap-1">
                            <Thermometer className="w-3 h-3" />
                            {consideration}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resource Optimization */}
      {selectedCategory === 'resource-optimization' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚡ Resource Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendationData.resourceOptimization.map((resource, index) => (
                <div key={index} className="p-4 rounded-lg border bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    {resource.resource === 'water' && <Droplets className="w-5 h-5 text-blue-500" />}
                    {resource.resource === 'fertilizer' && <Target className="w-5 h-5 text-green-500" />}
                    {resource.resource === 'labor' && <Clock className="w-5 h-5 text-purple-500" />}
                    <h3 className="font-semibold capitalize">{resource.resource}</h3>
                    <Badge className={`text-xs ${
                      resource.priority === 'high' ? 'bg-red-100 text-red-800' :
                      resource.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {resource.priority}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>Current:</span>
                      <span>{resource.currentUsage} {resource.resource === 'water' ? 'L' : resource.resource === 'labor' ? 'hrs' : '$'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Optimized:</span>
                      <span className="text-green-600">{resource.optimizedUsage} {resource.resource === 'water' ? 'L' : resource.resource === 'labor' ? 'hrs' : '$'}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Savings:</span>
                      <span className="text-green-600">{resource.savings} {resource.resource === 'water' ? 'L' : resource.resource === 'labor' ? 'hrs' : '$'}</span>
                    </div>
                  </div>

                  <div className="text-sm bg-gray-50 p-2 rounded">
                    <strong>Implementation:</strong> {resource.implementation}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Assessment */}
      {selectedCategory === 'risk-assessment' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚠️ Risk Assessment & Mitigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendationData.riskAssessment.map((risk, index) => (
                <div key={index} className="p-4 rounded-lg border bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{risk.crop}</h3>
                      <Badge variant="outline" className="capitalize">
                        {risk.riskType} Risk
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Probability</p>
                      <p className="text-lg font-bold text-red-600">{risk.probability}%</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Impact Level:</p>
                      <p className={`font-medium ${getRiskColor(risk.impact)}`}>
                        {risk.impact.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Mitigation Cost:</p>
                      <p className="font-medium">${risk.cost}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 bg-blue-50 p-3 rounded border border-blue-200">
                    <p className="text-sm"><strong>Mitigation Strategy:</strong> {risk.mitigation}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Predictions */}
      {selectedCategory === 'success-predictions' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Success Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recommendationData.successPredictions.map((prediction, index) => (
                <div key={index} className="p-6 rounded-lg border bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{prediction.crop}</h3>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{prediction.successProbability}%</p>
                      <p className="text-sm text-gray-600">Success Probability</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Contributing Factors:</p>
                    <div className="space-y-2">
                      {prediction.factors.map((factor, factorIndex) => (
                        <div key={factorIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{factor.factor}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${
                              factor.status === 'positive' ? 'text-green-600' :
                              factor.status === 'negative' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {factor.impact > 0 ? '+' : ''}{factor.impact}%
                            </span>
                            <div className={`w-3 h-3 rounded-full ${
                              factor.status === 'positive' ? 'bg-green-500' :
                              factor.status === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                            }`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">AI Recommendations:</p>
                    <ul className="space-y-1">
                      {prediction.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

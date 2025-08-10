"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  DollarSign,
  BarChart3,
  Users,
  Target
} from "lucide-react"
import { useState, useEffect } from "react"

interface MarketData {
  localDemand: Array<{
    crop: string
    demandLevel: 'high' | 'moderate' | 'low'
    avgPrice: number
    businesses: number
    competition: 'low' | 'moderate' | 'high'
    recommendation: string
    opportunity: string
  }>
  priceData: Array<{
    crop: string
    currentPrice: number
    change: number
    changePercent: number
    trend: 'up' | 'down' | 'stable'
  }>
  insights: Array<{
    type: 'opportunity' | 'warning' | 'trend'
    title: string
    description: string
    actionable: string
  }>
  seasonalData: {
    peakSeason: Array<{
      crop: string
      months: string[]
      expectedDemand: number
    }>
  }
}

export function MarketIntelligenceDashboard() {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('90d')

  useEffect(() => {
    // Simulate API call - replace with actual market data API
    setTimeout(() => {
      setMarketData({
        localDemand: [
          {
            crop: "Lettuce",
            demandLevel: "high",
            avgPrice: 3.20,
            businesses: 8,
            competition: "low",
            recommendation: "Plant 100kg for spring harvest",
            opportunity: "High demand, low competition"
          },
          {
            crop: "Tomatoes", 
            demandLevel: "high",
            avgPrice: 4.20,
            businesses: 12,
            competition: "moderate",
            recommendation: "Increase production by 25%",
            opportunity: "Rising prices, steady demand"
          },
          {
            crop: "Hot Peppers",
            demandLevel: "moderate",
            avgPrice: 12.50,
            businesses: 3,
            competition: "low",
            recommendation: "Niche opportunity for specialty varieties",
            opportunity: "Premium pricing, limited suppliers"
          },
          {
            crop: "Carrots",
            demandLevel: "low",
            avgPrice: 2.80,
            businesses: 5,
            competition: "high",
            recommendation: "Focus on other crops",
            opportunity: "Oversupplied market"
          }
        ],
        priceData: [
          { crop: "Tomatoes", currentPrice: 4.20, change: 0.50, changePercent: 12, trend: "up" },
          { crop: "Lettuce", currentPrice: 3.20, change: 0.24, changePercent: 8, trend: "up" },
          { crop: "Hot Peppers", currentPrice: 12.50, change: 0, changePercent: 0, trend: "stable" },
          { crop: "Carrots", currentPrice: 2.80, change: -0.20, changePercent: -7, trend: "down" },
          { crop: "Spinach", currentPrice: 3.80, change: 0.15, changePercent: 4, trend: "up" }
        ],
        insights: [
          {
            type: "opportunity",
            title: "Lettuce Demand Surge",
            description: "Local restaurants report 40% increase in salad orders",
            actionable: "Consider increasing lettuce production for next planting cycle"
          },
          {
            type: "warning", 
            title: "Carrot Market Saturation",
            description: "5 new farms started carrot production this season",
            actionable: "Diversify into higher-value crops like herbs or peppers"
          },
          {
            type: "trend",
            title: "Organic Premium Growing",
            description: "Organic produce commands 35% price premium",
            actionable: "Consider organic certification for premium crops"
          }
        ],
        seasonalData: {
          peakSeason: [
            { crop: "Tomatoes", months: ["June", "July", "August"], expectedDemand: 85 },
            { crop: "Lettuce", months: ["March", "April", "October", "November"], expectedDemand: 92 },
            { crop: "Peppers", months: ["July", "August", "September"], expectedDemand: 78 }
          ]
        }
      })
      setLoading(false)
    }, 1000)
  }, [selectedTimeframe])

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

  if (!marketData) return null

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800' 
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />
      case 'stable': return <Minus className="w-4 h-4 text-gray-600" />
      default: return null
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return '💡'
      case 'warning': return '⚠️'
      case 'trend': return '📈'
      default: return '📊'
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-emerald-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            📊 Market Intelligence Dashboard
          </h1>
          <p className="text-gray-600 mt-1">📍 Your Local Market Area</p>
        </div>
        <div className="flex gap-2">
          {['30d', '90d', '180d'].map((period) => (
            <Button
              key={period}
              variant={selectedTimeframe === period ? "default" : "outline"}
              onClick={() => setSelectedTimeframe(period)}
              className="text-sm"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Market Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {marketData.insights.map((insight, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getInsightIcon(insight.type)}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">{insight.title}</h3>
                  <p className="text-sm text-blue-800 mb-2">{insight.description}</p>
                  <p className="text-xs bg-blue-100 p-2 rounded border border-blue-200">
                    <strong>Action:</strong> {insight.actionable}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Local Demand Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔥 Local Demand Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {marketData.localDemand.map((item, index) => (
              <div key={index} className="p-4 rounded-lg border bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{item.crop}</h3>
                    <Badge className={getDemandColor(item.demandLevel)}>
                      {item.demandLevel === 'high' ? '🔴 HIGH' :
                       item.demandLevel === 'moderate' ? '🟡 MODERATE' : '🟢 LOW'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${item.avgPrice.toFixed(2)}/kg
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{item.businesses} businesses want</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={getCompetitionColor(item.competition)}>
                      Competition: {item.competition}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">
                    💡 {item.opportunity}
                  </div>
                  <div className="text-sm bg-gray-50 p-2 rounded border">
                    <strong>Recommendation:</strong> {item.recommendation}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Price Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 Price Trends (Last {selectedTimeframe})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {marketData.priceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {getTrendIcon(item.trend)}
                  </div>
                  <div>
                    <div className="font-semibold">{item.crop}</div>
                    <div className="text-sm text-gray-600">
                      ${item.currentPrice.toFixed(2)}/kg
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    item.changePercent > 0 ? 'text-green-600' :
                    item.changePercent < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {item.changePercent > 0 ? '+' : ''}{item.changePercent}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.change > 0 ? '+' : ''}${item.change.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Seasonal Demand Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📅 Seasonal Demand Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketData.seasonalData.peakSeason.map((item, index) => (
              <div key={index} className="p-4 rounded-lg border bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{item.crop}</h3>
                  <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    {item.expectedDemand}% demand
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Peak Months:</div>
                  <div className="flex flex-wrap gap-1">
                    {item.months.map((month, monthIndex) => (
                      <Badge key={monthIndex} variant="outline" className="text-xs">
                        {month}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col gap-1" variant="outline">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm">Custom Report</span>
            </Button>
            <Button className="h-16 flex-col gap-1" variant="outline">
              <Target className="w-5 h-5" />
              <span className="text-sm">Set Price Alerts</span>
            </Button>
            <Button className="h-16 flex-col gap-1" variant="outline">
              <Users className="w-5 h-5" />
              <span className="text-sm">Contact Buyers</span>
            </Button>
            <Button className="h-16 flex-col gap-1" variant="outline">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm">Price History</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

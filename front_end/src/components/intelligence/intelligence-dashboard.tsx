"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeatherDashboard } from "./weather-dashboard"
import { MarketIntelligenceDashboard } from "./market-dashboard"
import { FarmAnalyticsDashboard } from "./farm-analytics-dashboard"
import { AIRecommendationsDashboard } from "./ai-recommendations-dashboard"
import { DashboardChatbot } from "../dashboard/DashboardChatbot"
import { 
  Cloud, 
  TrendingUp, 
  BarChart3,
  Brain,
  Zap
} from "lucide-react"
import { useState } from "react"

export function IntelligenceDashboard() {
  const [activeTab, setActiveTab] = useState("weather")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                🧠 Agricultural Intelligence
              </h1>
              <p className="text-emerald-100 mt-1">
                Smart farming through data and AI insights
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-emerald-100">AI Status</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Active & Learning</span>
                </div>
              </div>
              <div className="text-right text-emerald-100">
                <div className="text-sm">Smart Recommendations</div>
                <div className="text-lg font-semibold">Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Intelligence Overview Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Weather Intelligence</p>
                  <p className="text-2xl font-bold">94% Accuracy</p>
                  <p className="text-blue-100 text-xs">7-day predictions</p>
                </div>
                <Cloud className="w-10 h-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Market Intelligence</p>
                  <p className="text-2xl font-bold">8 Opportunities</p>
                  <p className="text-green-100 text-xs">High demand crops</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Farm Analytics</p>
                  <p className="text-2xl font-bold">87% Efficiency</p>
                  <p className="text-purple-100 text-xs">Resource optimization</p>
                </div>
                <BarChart3 className="w-10 h-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">AI Recommendations</p>
                  <p className="text-2xl font-bold">12 Insights</p>
                  <p className="text-orange-100 text-xs">Personalized advice</p>
                </div>
                <Brain className="w-10 h-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Intelligence Dashboards */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              Weather
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Market
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ai-recommendations" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weather" className="space-y-6">
            <WeatherDashboard />
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <MarketIntelligenceDashboard />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <FarmAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="ai-recommendations" className="space-y-6">
            <AIRecommendationsDashboard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Action Buttons */}
      <div className="fixed left-6 bottom-6 space-y-3 z-30">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm shadow-lg"
          onClick={() => setActiveTab("weather")}
        >
          <Cloud className="w-4 h-4 mr-2" />
          Weather Alert
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm shadow-lg"
          onClick={() => setActiveTab("market")}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Market Update
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm shadow-lg"
          onClick={() => setActiveTab("ai-recommendations")}
        >
          <Zap className="w-4 h-4 mr-2" />
          Quick Insights
        </Button>
      </div>

      {/* Dashboard Chatbot */}
      <DashboardChatbot />
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Thermometer, 
  Droplets, 
  Wind,
  AlertTriangle,
  CheckCircle,
  Clock,
  X
} from "lucide-react"
import { useState, useEffect } from "react"

interface WeatherData {
  current: {
    temp: number
    condition: string
    humidity: number
    windSpeed: number
    icon: string
  }
  forecast: Array<{
    day: string
    high: number
    low: number
    condition: string
    precipitation: number
    icon: string
  }>
  alerts: Array<{
    type: 'warning' | 'info' | 'danger'
    title: string
    message: string
    recommendation: string
  }>
  recommendations: {
    planting: Array<{
      crop: string
      status: 'excellent' | 'good' | 'wait' | 'avoid'
      reason: string
    }>
    activities: Array<{
      activity: string
      timing: string
      priority: 'high' | 'medium' | 'low'
    }>
  }
}

export function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState("Austin, TX (78738)")

  useEffect(() => {
    // Simulate API call - replace with actual weather API
    setTimeout(() => {
      setWeatherData({
        current: {
          temp: 76,
          condition: "Sunny",
          humidity: 45,
          windSpeed: 8,
          icon: "☀️"
        },
        forecast: [
          { day: "Today", high: 76, low: 62, condition: "Sunny", precipitation: 0, icon: "☀️" },
          { day: "Tomorrow", high: 68, low: 55, condition: "Rainy", precipitation: 0.8, icon: "🌧" },
          { day: "Wed", high: 72, low: 58, condition: "Partly Cloudy", precipitation: 0.1, icon: "⛅" },
          { day: "Thu", high: 75, low: 61, condition: "Sunny", precipitation: 0, icon: "☀️" },
          { day: "Fri", high: 78, low: 64, condition: "Sunny", precipitation: 0, icon: "☀️" },
        ],
        alerts: [
          {
            type: 'warning',
            title: 'Heavy Rain Tomorrow',
            message: 'Heavy rain expected tomorrow morning (0.8" rainfall)',
            recommendation: 'Delay tomato harvest. Cover sensitive seedlings.'
          }
        ],
        recommendations: {
          planting: [
            { crop: "Lettuce", status: "excellent", reason: "Cool weather perfect for leafy greens" },
            { crop: "Spinach", status: "excellent", reason: "Optimal temperature range" },
            { crop: "Peppers", status: "wait", reason: "Wait 1 week for warmer weather" },
            { crop: "Basil", status: "wait", reason: "Too cool, wait for 78°F+ weather" },
            { crop: "Summer Squash", status: "avoid", reason: "Too late in season" }
          ],
          activities: [
            { activity: "Harvest tomatoes", timing: "Before tomorrow 8 AM", priority: "high" },
            { activity: "Water greenhouse plants", timing: "Skip tomorrow (rain)", priority: "medium" },
            { activity: "Apply fertilizer", timing: "Wait until Thursday", priority: "low" }
          ]
        }
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-4 animate-pulse">
          <div className="w-1/3 h-8 bg-gray-300 rounded"></div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!weatherData) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200'
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'wait': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'avoid': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen p-6 space-y-6 bg-gradient-to-br from-sky-50 to-emerald-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            🌤️ Smart Weather Intelligence
          </h1>
          <p className="mt-1 text-gray-600">📍 {location}</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Wind className="w-4 h-4" />
          Change Location
        </Button>
      </div>

      {/* Current Weather */}
      <Card className="text-white border-0 bg-gradient-to-r from-blue-500 to-sky-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-5xl font-bold">{weatherData.current.temp}°F</div>
              <div className="text-xl opacity-90">{weatherData.current.condition}</div>
            </div>
            <div className="text-6xl">{weatherData.current.icon}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              <span>Humidity: {weatherData.current.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5" />
              <span>Wind: {weatherData.current.windSpeed} mph</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {weatherData.alerts.length > 0 && (
        <Card className="border-l-4 border-l-orange-500 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              🚨 Farm Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weatherData.alerts.map((alert, index) => (
              <div key={index} className="space-y-2">
                <div className="font-semibold text-orange-900">⚠️ {alert.title}</div>
                <div className="text-orange-800">{alert.message}</div>
                <div className="p-2 text-sm bg-orange-100 border border-orange-200 rounded">
                  <strong>Recommendation:</strong> {alert.recommendation}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 7-Day Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📅 7-Day Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{day.icon}</span>
                  <div>
                    <div className="font-semibold">{day.day}</div>
                    <div className="text-sm text-gray-600">{day.condition}</div>
                    {day.precipitation > 0 && (
                      <div className="text-sm text-blue-600">💧 {day.precipitation} rain</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{day.high}°F</div>
                  <div className="text-sm text-gray-600">{day.low}°F</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Planting Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🌱 Planting Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weatherData.recommendations.planting.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'excellent' ? 'bg-green-500' :
                    item.status === 'good' ? 'bg-blue-500' :
                    item.status === 'wait' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <div className="font-semibold">{item.crop}</div>
                    <div className="text-sm text-gray-600">{item.reason}</div>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status === 'excellent' ? '✅ Excellent' :
                   item.status === 'good' ? '👍 Good' :
                   item.status === 'wait' ? '⏳ Wait' : '❌ Avoid'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Farm Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 Recommended Farm Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {weatherData.recommendations.activities.map((activity, index) => (
              <div key={index} className="p-4 bg-white border rounded-lg shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getPriorityColor(activity.priority)}>
                    {activity.priority.toUpperCase()}
                  </Badge>
                </div>
                <div className="mb-1 font-semibold">{activity.activity}</div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {activity.timing}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

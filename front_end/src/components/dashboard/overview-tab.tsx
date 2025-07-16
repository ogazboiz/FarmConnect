"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sprout, Users, Target, TrendingUp, Coins, Award } from "lucide-react"

export function OverviewTab() {
  const stats = [
    { title: "Active Crops", value: "12", icon: Sprout, color: "text-green-600", bg: "bg-green-50" },
    { title: "DAO Memberships", value: "3", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Completed Bounties", value: "8", icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "$FARM Earned", value: "1,250", icon: Coins, color: "text-yellow-600", bg: "bg-yellow-50" },
  ]

  const recentActivity = [
    { action: "Harvested Tomatoes", time: "2 hours ago", status: "success" },
    { action: "Joined Organic Farmers DAO", time: "1 day ago", status: "info" },
    { action: "Completed Pest Control Bounty", time: "3 days ago", status: "success" },
    { action: "Updated Corn Growth Stage", time: "5 days ago", status: "info" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800 mb-2">Welcome back, Farmer!</h1>
        <p className="text-green-600">Here's what's happening on your farm today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white/70 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-green-800">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-800">{activity.action}</p>
                    <p className="text-sm text-green-600">{activity.time}</p>
                  </div>
                  <Badge variant={activity.status === "success" ? "default" : "secondary"}>{activity.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">Sustainable Farmer</p>
                  <p className="text-sm text-green-600">Completed 10 eco-friendly practices</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">Community Leader</p>
                  <p className="text-sm text-green-600">Active in 3 farmer cooperatives</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

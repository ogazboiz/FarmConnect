"use client"

import { Footer } from "../layout/footer"
import { Header } from "../layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Sprout,
  Users,
  Target,
  TrendingUp,
  Coins,
  Award,
  ArrowRight,
  Plus,
  BarChart3,
  Calendar,
  MapPin,
} from "lucide-react"
import Link from "next/link"

export function DashboardPage() {
  const stats = [
    {
      title: "Active Crops",
      value: "12",
      icon: Sprout,
      color: "text-emerald-400",
      bg: "bg-emerald-900/20",
      href: "/dashboard/crops",
    },
    {
      title: "DAO Memberships",
      value: "3",
      icon: Users,
      color: "text-green-400",
      bg: "bg-green-900/20",
      href: "/dashboard/cooperative",
    },
    {
      title: "Completed Bounties",
      value: "8",
      icon: Target,
      color: "text-yellow-400",
      bg: "bg-yellow-900/20",
      href: "/dashboard/bounties",
    },
    {
      title: "$AGRI Earned",
      value: "1,250",
      icon: Coins,
      color: "text-amber-400",
      bg: "bg-amber-900/20",
      href: "/dashboard",
    },
  ]

  const recentActivity = [
    { action: "Harvested Organic Tomatoes", time: "2 hours ago", status: "success", type: "harvest" },
    { action: "Joined Sustainable Farmers DAO", time: "1 day ago", status: "info", type: "dao" },
    { action: "Completed Pest Control Bounty", time: "3 days ago", status: "success", type: "bounty" },
    { action: "Updated Corn Growth Stage", time: "5 days ago", status: "info", type: "crop" },
    { action: "Voted on Equipment Purchase", time: "1 week ago", status: "info", type: "vote" },
  ]

  const activeCrops = [
    { name: "Organic Tomatoes", stage: "Flowering", progress: 65, location: "Field A-1" },
    { name: "Sweet Corn", stage: "Growing", progress: 45, location: "Field B-2" },
    { name: "Lettuce", stage: "Seedling", progress: 25, location: "Greenhouse 1" },
  ]

  const upcomingTasks = [
    { task: "Water tomatoes in Field A-1", due: "Today", priority: "high" },
    { task: "Fertilize corn crops", due: "Tomorrow", priority: "medium" },
    { task: "Harvest lettuce batch #3", due: "3 days", priority: "low" },
    { task: "DAO voting deadline", due: "5 days", priority: "medium" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800 relative">
      <Header isConnected={true} />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-emerald-100 mb-2">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-yellow-300 bg-clip-text text-transparent">
                Farmer John!
              </span>
            </h1>
            <p className="text-xl text-emerald-200/80">Here&apos;s what&apos;s happening on your farm today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Link key={stat.title} href={stat.href}>
                <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40 hover:border-emerald-600/60 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-emerald-200/80 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-emerald-100">{stat.value}</p>
                      </div>
                      <div className={`p-4 rounded-2xl ${stat.bg} border border-emerald-600/30 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Activity */}
            <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
              <CardHeader>
                <CardTitle className="text-emerald-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-emerald-900/30 border border-emerald-700/30 rounded-lg hover:bg-emerald-800/40 transition-colors duration-300">
                      <div>
                        <p className="font-medium text-emerald-100">{activity.action}</p>
                        <p className="text-sm text-emerald-200/80">{activity.time}</p>
                      </div>
                      <Badge
                        variant={activity.status === "success" ? "default" : "secondary"}
                        className={activity.status === "success" ? "bg-emerald-600/60 text-emerald-200 border-emerald-500/50" : "bg-slate-700/60 text-slate-200 border-slate-600/50"}
                      >
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 bg-transparent hover:border-emerald-500"
                >
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            {/* Active Crops */}
            <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-emerald-100 flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-green-400" />
                    Active Crops
                  </CardTitle>
                  <Link href="/dashboard/crops">
                    <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-0">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Crop
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeCrops.map((crop, index) => (
                    <div key={index} className="p-3 bg-emerald-900/30 border border-emerald-700/30 rounded-lg hover:bg-emerald-800/40 transition-colors duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-emerald-100">{crop.name}</h3>
                        <Badge variant="outline" className="text-green-300 border-green-500/50 bg-green-900/20">
                          {crop.stage}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-emerald-200/80 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{crop.location}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-emerald-200/80">Progress</span>
                          <span className="text-emerald-100 font-medium">{crop.progress}%</span>
                        </div>
                        <Progress value={crop.progress} className="h-2 bg-emerald-900/50" />
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/crops">
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-green-600/50 text-green-200 hover:bg-green-800/60 bg-transparent hover:border-green-500"
                  >
                    View All Crops
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Tasks */}
            <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
              <CardHeader>
                <CardTitle className="text-emerald-100 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-emerald-900/30 border border-emerald-700/30 rounded-lg hover:bg-emerald-800/40 transition-colors duration-300">
                      <div>
                        <p className="font-medium text-emerald-100">{task.task}</p>
                        <p className="text-sm text-emerald-200/80">Due: {task.due}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          task.priority === "high"
                            ? "border-red-400/50 text-red-300 bg-red-900/20"
                            : task.priority === "medium"
                              ? "border-amber-400/50 text-amber-300 bg-amber-900/20"
                              : "border-green-400/50 text-green-300 bg-green-900/20"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-amber-600/50 text-amber-200 hover:bg-amber-800/60 bg-transparent hover:border-amber-500"
                >
                  View All Tasks
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
              <CardHeader>
                <CardTitle className="text-emerald-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-emerald-900/30 border border-emerald-700/30 rounded-lg hover:bg-emerald-800/40 transition-colors duration-300">
                    <div className="w-12 h-12 bg-yellow-900/30 border border-yellow-600/40 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium text-emerald-100">Sustainable Farmer</p>
                      <p className="text-sm text-emerald-200/80">Completed 10 eco-friendly practices</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-900/30 border border-emerald-700/30 rounded-lg hover:bg-emerald-800/40 transition-colors duration-300">
                    <div className="w-12 h-12 bg-green-900/30 border border-green-600/40 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-emerald-100">Community Leader</p>
                      <p className="text-sm text-emerald-200/80">Active in 3 farmer cooperatives</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-900/30 border border-emerald-700/30 rounded-lg hover:bg-emerald-800/40 transition-colors duration-300">
                    <div className="w-12 h-12 bg-emerald-900/30 border border-emerald-600/40 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-emerald-100">Data Pioneer</p>
                      <p className="text-sm text-emerald-200/80">Tracked 50+ crop cycles</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-yellow-600/50 text-yellow-200 hover:bg-yellow-800/60 bg-transparent hover:border-yellow-500"
                >
                  View All Achievements
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

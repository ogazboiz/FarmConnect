"use client"

import { Footer } from "../layout/footer"
import { Header } from "../layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useAccount } from "wagmi"
import { useFarmTokenBalance, useGreenPointsBalance, useFarmerCrops, useFarmTokenInfo } from "@/hooks/useAgriDAO"
import { toast } from "react-hot-toast"

export function DashboardPage() {
  const { address, isConnected } = useAccount();
  
  // Individual hooks
  const farmBalance = useFarmTokenBalance(address);
  const greenBalance = useGreenPointsBalance(address);
  const farmerCrops = useFarmerCrops(address);
  const farmTokenInfo = useFarmTokenInfo();

  // Show loading state
  if (!isConnected) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
        <Header />
        <div className="px-4 pt-24 pb-16">
          <div className="container mx-auto">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold text-emerald-100">
                Please connect your wallet to view your dashboard
              </h1>
              <p className="text-emerald-200/80">Connect your wallet to start tracking your crops and earning rewards. Get started today!</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isLoading = farmBalance.isLoading || greenBalance.isLoading || farmerCrops.isLoading;

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
        <Header />
        <div className="px-4 pt-24 pb-16">
          <div className="container mx-auto">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-emerald-300 animate-spin" />
              <h1 className="mb-4 text-4xl font-bold text-emerald-100">
                Loading your dashboard...
              </h1>
              <p className="text-emerald-200/80">Fetching your data from the blockchain. Please wait...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const stats = [
    {
      title: "Active Crops",
      value: farmerCrops.count?.toString() || "0",
      icon: Sprout,
      color: "text-emerald-400",
      bg: "bg-emerald-900/20",
      href: "/dashboard/crops",
    },
    {
      title: "FARM Balance",
      value: farmBalance.formatted ? parseFloat(farmBalance.formatted).toFixed(2) : "0.00",
      icon: Coins,
      color: "text-amber-400",
      bg: "bg-amber-900/20",
      href: "/dashboard",
    },
    {
      title: "GREEN Points",
      value: greenBalance.formatted ? parseFloat(greenBalance.formatted).toFixed(0) : "0",
      icon: Award,
      color: "text-green-400",
      bg: "bg-green-900/20",
      href: "/dashboard",
    },
    {
      title: "Token Info",
      value: farmTokenInfo.name,
      icon: TrendingUp,
      color: "text-yellow-400",
      bg: "bg-yellow-900/20",
      href: "/dashboard",
    },
  ];

  const recentActivity = [
    { action: "Wallet connected", time: "Just now", status: "success", type: "connection" },
    { action: "Dashboard loaded", time: "Now", status: "info", type: "system" },
    { action: "Ready to create crops", time: "Now", status: "success", type: "ready" },
  ];

  const upcomingTasks = [
    { task: "Create your first crop batch", due: "Today", priority: "high" },
    { task: "Connect with other farmers", due: "This week", priority: "medium" },
    { task: "Explore bounties", due: "Anytime", priority: "low" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
      <Header />

      <div className="px-4 pt-24 pb-16">
        <div className="container mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-emerald-100">
              Welcome to FarmConnect,{" "}
              <span className="text-transparent bg-gradient-to-r from-emerald-300 to-yellow-300 bg-clip-text">
                Farmer!
              </span>
            </h1>
            <p className="text-xl text-emerald-200/80">
              Your decentralized agriculture platform is ready. Manage your crops and earn rewards.
            </p>
            {address && (
              <div className="inline-block p-3 mt-2 border rounded-lg bg-emerald-800/40 border-emerald-700/40">
                <p className="text-sm text-emerald-200/80">Connected Wallet:</p>
                <p className="font-mono text-sm text-emerald-300">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Link key={stat.title} href={stat.href}>
                <Card className="transition-all duration-300 transform border cursor-pointer bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40 hover:border-emerald-600/60 hover:shadow-2xl hover:scale-105 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="mb-1 text-sm text-emerald-200/80">{stat.title}</p>
                        <p className="text-2xl font-bold text-emerald-100">{stat.value}</p>
                      </div>
                      <div className={`p-4 rounded-2xl ${stat.bg} border border-emerald-600/30 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-100">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-emerald-900/30 border-emerald-700/30">
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
              </CardContent>
            </Card>

            {/* Your Crops */}
            <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-emerald-100">
                    <Sprout className="w-5 h-5 text-green-400" />
                    Your Crops ({farmerCrops.count})
                  </CardTitle>
                  <Link href="/dashboard/crops">
                    <Button size="sm" className="text-white border-0 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                      <Plus className="w-4 h-4 mr-1" />
                      Create Crop
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {farmerCrops.count > 0 ? (
                  <div className="space-y-3">
                    {farmerCrops.data.slice(0, 3).map((tokenId: bigint, index: number) => (
                      <div key={index} className="p-3 border rounded-lg bg-emerald-900/30 border-emerald-700/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-emerald-100">Crop NFT #{tokenId.toString()}</h3>
                            <p className="text-sm text-emerald-200/80">Active on blockchain</p>
                          </div>
                          <Badge variant="outline" className="text-green-300 border-green-500/50 bg-green-900/20">
                            NFT
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Link href="/dashboard/crops">
                      <Button
                        variant="outline"
                        className="w-full mt-4 text-green-200 bg-transparent border-green-600/50 hover:bg-green-800/60 hover:border-green-500"
                      >
                        View All Crops
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Sprout className="w-12 h-12 mx-auto mb-4 opacity-50 text-emerald-400" />
                    <p className="mb-4 text-emerald-200/80">No crops yet. Create your first crop batch to get started!</p>
                    <Link href="/dashboard/crops">
                      <Button className="text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Crop
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Token Information */}
            <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-100">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  Token Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-emerald-900/30 border-emerald-700/30">
                    <div>
                      <p className="font-medium text-emerald-100">FARM Token</p>
                      <p className="text-sm text-emerald-200/80">Your balance</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-100">
                        {farmBalance.formatted ? parseFloat(farmBalance.formatted).toFixed(2) : '0.00'}
                      </p>
                      <p className="text-sm text-emerald-200/80">FARM</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-emerald-900/30 border-emerald-700/30">
                    <div>
                      <p className="font-medium text-emerald-100">GREEN Points</p>
                      <p className="text-sm text-emerald-200/80">Sustainability rewards</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-100">
                        {greenBalance.formatted ? parseFloat(greenBalance.formatted).toFixed(0) : '0'}
                      </p>
                      <p className="text-sm text-emerald-200/80">GREEN</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-emerald-900/30 border-emerald-700/30">
                    <div>
                      <p className="font-medium text-emerald-100">Token Name</p>
                      <p className="text-sm text-emerald-200/80">Farm token info</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-100">
                        {farmTokenInfo.name || 'Loading...'}
                      </p>
                      <p className="text-sm text-emerald-200/80">
                        {farmTokenInfo.symbol || 'Loading...'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Getting Started */}
            <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-100">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-emerald-900/30 border-emerald-700/30">
                      <div>
                        <p className="font-medium text-emerald-100">{task.task}</p>
                        <p className="text-sm text-emerald-200/80">{task.due}</p>
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
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-100">
                  <Target className="w-5 h-5 text-emerald-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Link href="/dashboard/crops">
                    <Button className="w-full text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Crop Batch
                    </Button>
                  </Link>
                  <Link href="/dashboard/cooperative">
                    <Button className="w-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Users className="w-4 h-4 mr-2" />
                      Join DAO
                    </Button>
                  </Link>
                  <Link href="/dashboard/bounties">
                    <Button className="w-full text-white bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
                      <Target className="w-4 h-4 mr-2" />
                      View Bounties
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full bg-transparent border-emerald-600/50 text-emerald-200 hover:bg-emerald-800/60 hover:border-emerald-500"
                    onClick={() => {
                      window.open(`https://scan.test2.btcs.network/address/${address}`, '_blank')
                      toast.success('Opening Core explorer in new tab 🔍')
                    }}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View on Explorer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contract Information */}
          <div className="mt-8">
            <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-100">
                  <Award className="w-5 h-5 text-emerald-400" />
                  Contract Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg bg-emerald-900/30 border-emerald-700/30">
                    <h3 className="mb-2 font-medium text-emerald-100">Network</h3>
                    <p className="text-sm text-emerald-200/80">Core Testnet 2</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-emerald-900/30 border-emerald-700/30">
                    <h3 className="mb-2 font-medium text-emerald-100">Environment</h3>
                    <p className="text-sm text-emerald-200/80">
                      {process.env.NEXT_PUBLIC_ENVIRONMENT || 'testnet'}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-emerald-900/30 border-emerald-700/30">
                    <h3 className="mb-2 font-medium text-emerald-100">Total Supply</h3>
                    <p className="text-sm text-emerald-200/80">
                      {farmTokenInfo.totalSupplyFormatted || 'Loading...'} FARM
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-emerald-900/30 border-emerald-700/30">
                    <h3 className="mb-2 font-medium text-emerald-100">Decimals</h3>
                    <p className="text-sm text-emerald-200/80">
                      {farmTokenInfo.decimals?.toString() || 'Loading...'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
"use client"

import { useAccount } from "wagmi"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Award, Coins, Star, Share, QrCode, TrendingUp, 
  Gift, Users, Target, Wallet, Loader2
} from "lucide-react"
import { useGreenPointsBalance, useFarmTokenBalance, useGreenPoints } from "@/hooks/useAgriDAO"
import { ConnectWalletModal } from "@/components/consumer/ConnectWalletModal"
import { useState } from "react"

export default function RewardsPage() {
  const { address, isConnected } = useAccount()
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)
  
  const greenBalance = useGreenPointsBalance(address)
  const farmBalance = useFarmTokenBalance(address)
  const greenPoints = useGreenPoints()

  const handleRedeem = async (amount: number, item: string) => {
    if (!address) {
      setShowConnectModal(true)
      return
    }
    
    setIsRedeeming(true)
    try {
      await greenPoints.redeemPoints(BigInt(amount), item)
    } catch (error) {
      console.error('Redemption failed:', error)
    } finally {
      setIsRedeeming(false)
    }
  }

  const rewardTiers = [
    { name: "Bronze Supporter", points: 100, icon: "🥉", description: "Thank you for supporting farmers!" },
    { name: "Silver Advocate", points: 500, icon: "🥈", description: "Active community member" },
    { name: "Gold Champion", points: 1000, icon: "🥇", description: "Sustainability champion" },
    { name: "Platinum Hero", points: 2500, icon: "💎", description: "Farming ecosystem hero" }
  ]

  const redeemableItems = [
    { name: "Store Discount (5%)", points: 50, description: "5% off your next purchase", category: "discount" as const },
    { name: "Store Discount (10%)", points: 100, description: "10% off your next purchase", category: "discount" as const },
    { name: "Free Delivery", points: 75, description: "Free delivery on any order", category: "delivery" as const },
    { name: "Farmer Support Donation", points: 200, description: "Direct support to farmers", category: "donation" as const },
    { name: "Carbon Offset Certificate", points: 150, description: "Offset 1 ton of CO2", category: "environment" as const },
    { name: "Exclusive Recipe Book", points: 300, description: "Digital cookbook from farmers", category: "content" as const }
  ]

  const currentPoints = greenBalance.formatted ? parseInt(greenBalance.formatted) : 0
  const currentTier = rewardTiers.filter(tier => currentPoints >= tier.points).pop() || rewardTiers[0]
  const nextTier = rewardTiers.find(tier => tier.points > currentPoints)
  const progressToNext = nextTier ? (currentPoints / nextTier.points) * 100 : 100

  if (!isConnected) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
        <Header />
        <div className="px-4 pt-24 pb-16">
          <div className="container max-w-2xl mx-auto">
            <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
              <CardContent className="py-16 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-900/50">
                  <Wallet className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-emerald-100">Connect Wallet to View Rewards</h2>
                <p className="mb-6 text-emerald-200/80">
                  Connect your wallet to see your GREEN points balance and available rewards
                </p>
                <Button
                  onClick={() => setShowConnectModal(true)}
                  className="text-white shadow-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {showConnectModal && (
          <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
        )}
        <Footer />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
      <Header />

      <div className="px-4 pt-24 pb-16">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl text-emerald-100">
              <span className="text-transparent bg-gradient-to-r from-emerald-300 via-green-300 to-yellow-300 bg-clip-text">
                🎁 Your Rewards
              </span>
            </h1>
            <p className="text-xl text-emerald-200/80">
              Redeem your GREEN points for amazing rewards and support farmers
            </p>
          </div>

          {/* Current Balance */}
          <Card className="mb-8 border bg-gradient-to-r from-emerald-600 to-green-600 border-emerald-400/50">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Award className="w-12 h-12 text-white" />
                <div>
                  <h2 className="text-4xl font-bold text-white">
                    {greenBalance.isLoading ? (
                      <Loader2 className="inline w-8 h-8 animate-spin" />
                    ) : (
                      currentPoints.toLocaleString()
                    )}
                  </h2>
                  <p className="text-emerald-100">GREEN Points</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">{currentTier.icon}</span>
                <span className="text-xl font-semibold text-white">{currentTier.name}</span>
              </div>
              
              {nextTier && (
                <div>
                  <p className="mb-2 text-emerald-100">
                    {nextTier.points - currentPoints} points to {nextTier.name}
                  </p>
                  <Progress 
                    value={progressToNext} 
                    className="h-2 bg-emerald-700"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Earning Methods */}
            <div className="lg:col-span-1">
              <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-100">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Earn More Points
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-emerald-900/30 border-emerald-700/30">
                    <div className="flex items-center gap-3">
                      <QrCode className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="font-medium text-emerald-100">Scan Products</p>
                        <p className="text-sm text-emerald-200/80">+10 points each</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-amber-900/30 border-amber-700/30">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="font-medium text-emerald-100">Rate Products</p>
                        <p className="text-sm text-emerald-200/80">+20 points each</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-900/30 border-blue-700/30">
                    <div className="flex items-center gap-3">
                      <Share className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium text-emerald-100">Share Stories</p>
                        <p className="text-sm text-emerald-200/80">+25 points each</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    asChild
                    className="w-full text-white shadow-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                  >
                    <a href="/marketplace">
                      Start Earning Points
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Reward Tiers */}
              <Card className="mt-6 border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-100">
                    <Award className="w-5 h-5 text-emerald-400" />
                    Reward Tiers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {rewardTiers.map((tier, index) => (
                    <div 
                      key={tier.name}
                      className={`p-3 rounded-lg border ${
                        currentPoints >= tier.points 
                          ? 'bg-green-900/40 border-green-600/50' 
                          : 'bg-emerald-900/20 border-emerald-700/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{tier.icon}</span>
                        <div>
                          <p className={`font-medium ${
                            currentPoints >= tier.points ? 'text-green-300' : 'text-emerald-200/80'
                          }`}>
                            {tier.name}
                          </p>
                          <p className="text-sm text-emerald-200/60">{tier.points} points</p>
                        </div>
                        {currentPoints >= tier.points && (
                          <Badge className="ml-auto text-green-300 bg-green-900/50 border-green-600/50">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Redeemable Items */}
            <div className="lg:col-span-2">
              <Card className="border bg-white/80 backdrop-blur-sm border-emerald-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Gift className="w-5 h-5 text-emerald-600" />
                    Redeem Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {redeemableItems.map((item, index) => {
                      const canAfford = currentPoints >= item.points
                      const categoryColors = {
                        discount: 'text-amber-600 bg-amber-50 border-amber-200',
                        delivery: 'text-blue-600 bg-blue-50 border-blue-200',
                        donation: 'text-green-600 bg-green-50 border-green-200',
                        environment: 'text-emerald-600 bg-emerald-50 border-emerald-200',
                        content: 'text-purple-600 bg-purple-50 border-purple-200'
                      }
                      
                      return (
                        <Card 
                          key={index}
                          className={`${
                            canAfford 
                              ? 'border-emerald-200 hover:border-emerald-400' 
                              : 'border-slate-200 opacity-75'
                          } transition-all duration-300`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className={`font-medium ${
                                canAfford ? 'text-slate-800' : 'text-slate-500'
                              }`}>
                                {item.name}
                              </h3>
                              <Badge 
                                className={`${categoryColors[item.category]} text-xs`}
                                variant="outline"
                              >
                                {item.points} pts
                              </Badge>
                            </div>
                            
                            <p className={`text-sm mb-4 ${
                              canAfford ? 'text-slate-600' : 'text-slate-400'
                            }`}>
                              {item.description}
                            </p>
                            
                            <Button
                              onClick={() => handleRedeem(item.points, item.name)}
                              disabled={!canAfford || isRedeeming}
                              className={`w-full ${
                                canAfford
                                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white'
                                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              {isRedeeming ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : canAfford ? (
                                'Redeem Now'
                              ) : (
                                `Need ${item.points - currentPoints} more points`
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Impact Section */}
          <Card className="mt-8 text-white bg-gradient-to-r from-green-600 to-emerald-600">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-white">
                🌱 Your Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
                <div>
                  <div className="mb-2 text-3xl font-bold">{Math.floor(currentPoints / 10)}</div>
                  <p className="text-green-100">Products Scanned</p>
                </div>
                <div>
                  <div className="mb-2 text-3xl font-bold">{Math.floor(currentPoints / 45)}</div>
                  <p className="text-green-100">Farmers Supported</p>
                </div>
                <div>
                  <div className="mb-2 text-3xl font-bold">{currentPoints}</div>
                  <p className="text-green-100">Total Contribution Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showConnectModal && (
        <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
      )}

      {/* <Footer /> */}
    </div>
  )
}
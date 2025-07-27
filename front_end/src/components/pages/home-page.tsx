"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Footer } from "../layout/footer"
import { Header } from "../layout/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Leaf, Users, Award, Shield, Globe, Coins, TrendingUp, CheckCircle, Sparkles } from "lucide-react"
import { useAppKitAccount, useAppKit } from "@reown/appkit/react"
import { useAccount } from "wagmi"
import { toast } from "react-hot-toast"

export function HomePage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // AppKit hooks
  const { isConnected: appkitIsConnected } = useAppKitAccount()
  const { open } = useAppKit()

  // Wagmi hooks
  const { isConnected: wagmiIsConnected } = useAccount()

  // Get actual connection state - these variables are used in the JSX
  const isConnected = appkitIsConnected || wagmiIsConnected

  useEffect(() => setMounted(true), [])

  // Show success toast when wallet connects
  useEffect(() => {
    if (mounted && isConnected) {
      toast.success("🎉 Wallet connected successfully!")
    }
  }, [mounted, isConnected])

  const handleWalletConnect = async () => {
    try {
      await open()
      // Note: Success toast will be handled by the connection state change effect
    } catch (error: unknown) {
      console.error("Connection error:", error instanceof Error ? error.message : String(error))
      toast.error("Failed to connect wallet. Please try again.")
    }
  }

  const handleWatchDemo = () => {
    // Scroll to the "How It Works" section
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const features = [
    {
      icon: Leaf,
      title: "Crop Traceability",
      description: "Track every step from planting to harvest with blockchain transparency",
      color: "text-emerald-400",
      bg: "bg-emerald-900/20",
    },
    {
      icon: Users,
      title: "Farmer Cooperatives",
      description: "Join decentralized farmer DAOs for collective decision making",
      color: "text-green-400",
      bg: "bg-green-900/20",
    },
    {
      icon: Award,
      title: "Agri Bounties",
      description: "Earn rewards for solving agricultural challenges and innovations",
      color: "text-yellow-400",
      bg: "bg-yellow-900/20",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Farmers Connected", color: "text-emerald-400" },
    { number: "50M+", label: "Crops Tracked", color: "text-green-400" },
    { number: "$2.5M", label: "Rewards Distributed", color: "text-yellow-400" },
    { number: "25", label: "Countries Active", color: "text-lime-400" },
  ]

  const benefits = [
    "Transparent supply chain tracking",
    "Direct farmer-to-consumer connections",
    "Reduced middleman exploitation",
    "Sustainable farming incentives",
    "Global marketplace access",
    "Decentralized governance participation",
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
     
      {/* Hero Section */}
      <section className="relative min-h-screen px-4 bg-center bg-no-repeat bg-cover sm:px-6 lg:px-8" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
      }}>
        {/* Enhanced overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/70 to-green-800/80"></div>
        
        <Header onWalletConnect={handleWalletConnect} />
        
        <div className="container relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 pb-16 mx-auto text-center sm:pt-24 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-7xl"
          >
            <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-emerald-500/20 to-yellow-500/20 text-emerald-200 border-emerald-400/50 px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm text-xs sm:text-sm">
              <Sparkles className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
              Built on Mantle Network
            </Badge>

            <h1 className="px-2 mb-6 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl sm:mb-8 drop-shadow-lg">
              <span className="text-transparent bg-gradient-to-r from-emerald-300 via-green-300 to-yellow-300 bg-clip-text">
                Revolutionizing
              </span>
              <br />
              <span className="text-white">Agriculture with</span>
              <br />
              <span className="text-transparent bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-300 bg-clip-text">
                Blockchain
              </span>
            </h1>

            <p className="max-w-4xl px-4 mx-auto mb-8 text-base leading-relaxed sm:text-lg md:text-xl lg:text-xl text-emerald-100/90 sm:mb-12 drop-shadow-md">
              Track your crops from seed to harvest, join farmer cooperatives, and earn rewards for sustainable farming
              practices on the decentralized web.
            </p>

            <div className="flex flex-col justify-center gap-4 px-4 mb-12 sm:flex-row sm:gap-6 sm:mb-16">
              {!mounted ? (
                <Button
                  size="lg"
                  className="w-full px-6 py-3 text-base text-white transition-all duration-300 transform border shadow-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 sm:px-8 sm:py-4 sm:text-lg hover:shadow-2xl hover:scale-105 backdrop-blur-sm border-emerald-400/30 sm:w-auto"
                >
                  Start Farming on Blockchain
                  <ArrowRight className="w-4 h-4 ml-2 sm:w-5 sm:h-5" />
                </Button>
              ) : isConnected ? (
                <Button
                  onClick={() => router.push('/dashboard')}
                  size="lg"
                  className="w-full px-6 py-3 text-base text-white transition-all duration-300 transform border shadow-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 sm:px-8 sm:py-4 sm:text-lg hover:shadow-2xl hover:scale-105 backdrop-blur-sm border-emerald-400/30 sm:w-auto"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2 sm:w-5 sm:h-5" />
                </Button>
              ) : (
                <Button
                  onClick={handleWalletConnect}
                  size="lg"
                  className="w-full px-6 py-3 text-base text-white transition-all duration-300 transform border shadow-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 sm:px-8 sm:py-4 sm:text-lg hover:shadow-2xl hover:scale-105 backdrop-blur-sm border-emerald-400/30 sm:w-auto"
                >
                  Start Farming on Blockchain
                  <ArrowRight className="w-4 h-4 ml-2 sm:w-5 sm:h-5" />
                </Button>
              )}
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleWatchDemo}
                className="w-full px-6 py-3 text-base transition-all duration-300 border-2 shadow-lg border-emerald-300/70 text-emerald-100 hover:bg-emerald-800/30 sm:px-8 sm:py-4 sm:text-lg bg-emerald-900/20 backdrop-blur-sm hover:shadow-xl sm:w-auto"
              >
                Watch Demo
              </Button>
            </div>

            {/* Feature Cards Preview */}
            <div className="grid max-w-6xl grid-cols-1 gap-6 px-4 mx-auto mt-12 md:grid-cols-3 sm:gap-8 sm:mt-16">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                  className="p-4 transition-all duration-300 border bg-emerald-900/20 backdrop-blur-md rounded-2xl sm:p-6 border-emerald-700/30 hover:bg-emerald-800/30 group"
                >
                  <div className={`${feature.bg} border border-emerald-600/30 w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${feature.color}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold sm:text-xl text-emerald-100 sm:mb-3">{feature.title}</h3>
                  <p className="text-sm leading-relaxed sm:text-base text-emerald-200/80">{feature.description}</p>
                </motion.div>
              ))}
            </div>
           
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute transform -translate-x-1/2 bottom-4 sm:bottom-8 left-1/2"
          >
            <div className="animate-bounce">
              <div className="flex justify-center w-5 h-8 border-2 rounded-full sm:w-6 sm:h-10 border-emerald-300/50">
                <div className="w-1 h-2 sm:h-3 bg-emerald-300/70 rounded-full mt-1.5 sm:mt-2 animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative px-4 py-16 overflow-hidden sm:py-20 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-24 h-24 rounded-full top-10 sm:top-20 left-10 sm:left-20 sm:w-32 sm:h-32 bg-emerald-400 blur-3xl"></div>
          <div className="absolute w-32 h-32 bg-yellow-400 rounded-full bottom-10 sm:bottom-20 right-10 sm:right-20 sm:w-40 sm:h-40 blur-3xl"></div>
        </div>
        
        <div className="container relative z-10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center sm:mb-16"
          >
            <Badge className="mb-3 sm:mb-4 bg-emerald-800/60 text-emerald-200 border-emerald-600/50 px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm text-xs sm:text-sm">
              Platform Statistics
            </Badge>
            <h2 className="px-4 mb-4 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl text-emerald-100 sm:mb-6">
              Transforming Agriculture{" "}
              <span className="text-transparent bg-gradient-to-r from-emerald-300 to-yellow-300 bg-clip-text">
                Globally
              </span>
            </h2>
            <p className="max-w-4xl px-4 mx-auto text-lg leading-relaxed sm:text-xl text-emerald-200/80">
              Join thousands of farmers, cooperatives, and agricultural innovators who are already using blockchain 
              to revolutionize farming practices worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 px-4 mx-auto lg:grid-cols-4 sm:gap-6 lg:gap-8 max-w-7xl">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-4 transition-all duration-300 border shadow-xl bg-emerald-800/40 backdrop-blur-sm rounded-2xl sm:p-6 lg:p-8 hover:shadow-2xl border-emerald-700/40 group hover:-translate-y-2"
              >
                <div className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${stat.color} mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                <div className="mb-1 text-sm font-semibold text-emerald-200 sm:text-base lg:text-lg sm:mb-2">{stat.label}</div>
                <div className={`h-1 w-full rounded-full ${stat.color.replace('text-', 'bg-')} opacity-40 group-hover:opacity-70 transition-opacity duration-300`}></div>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="px-4 mt-16 text-center sm:mt-20"
          >
            <p className="mb-6 text-base text-emerald-300/60 sm:mb-8 sm:text-lg">Trusted by leading agricultural organizations</p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12 opacity-40">
              <div className="text-lg font-bold sm:text-xl lg:text-2xl text-emerald-200">USDA</div>
              <div className="text-lg font-bold sm:text-xl lg:text-2xl text-emerald-200">FAO</div>
              <div className="text-lg font-bold sm:text-xl lg:text-2xl text-emerald-200">AgriTech</div>
              <div className="text-lg font-bold sm:text-xl lg:text-2xl text-emerald-200">FarmCorp</div>
              <div className="text-lg font-bold sm:text-xl lg:text-2xl text-emerald-200">GreenChain</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features & Benefits Section */}
      <section className="relative px-4 py-16 overflow-hidden sm:py-20 sm:px-6 lg:px-8 bg-gradient-to-r from-green-900 via-emerald-900 to-green-800">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center sm:mb-16"
          >
            <Badge className="mb-3 sm:mb-4 bg-gradient-to-r from-emerald-800/60 to-green-800/60 text-emerald-200 border-emerald-600/50 px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm text-xs sm:text-sm">
              Platform Features
            </Badge>
            <h2 className="px-4 mb-4 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl text-emerald-100 sm:mb-6">
              Everything You Need to{" "}
              <span className="text-transparent bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text">
                Succeed
              </span>
            </h2>
            <p className="max-w-4xl px-4 mx-auto text-lg leading-relaxed sm:text-xl text-emerald-200/80">
              Our comprehensive blockchain platform provides all the tools and features you need to modernize 
              your agricultural operations and connect with the global farming community.
            </p>
          </motion.div>

          <div className="grid items-center grid-cols-1 gap-12 mb-16 lg:grid-cols-2 sm:gap-16 sm:mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="px-4"
            >
              <div className="space-y-4 sm:space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-3 transition-all duration-300 sm:gap-4 sm:p-4 rounded-xl hover:bg-emerald-800/30 group"
                  >
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 transition-transform duration-300 rounded-full sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-green-500 group-hover:scale-110">
                      <CheckCircle className="w-5 h-5 text-white sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-base font-medium text-emerald-200 sm:text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative px-4"
            >
              <div className="p-6 border shadow-2xl bg-gradient-to-br from-emerald-800/40 to-green-800/40 rounded-3xl sm:p-8 border-emerald-700/40 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="p-4 text-center transition-all duration-300 border shadow-lg bg-emerald-800/60 backdrop-blur-sm rounded-2xl sm:p-6 border-emerald-600/40 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl sm:mb-4">
                      <Shield className="w-6 h-6 text-white sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="mb-1 text-base font-bold text-emerald-100 sm:mb-2 sm:text-lg">Secure & Transparent</h3>
                    <p className="text-xs sm:text-sm text-emerald-200/80">Blockchain-secured data with full transparency</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="p-4 text-center transition-all duration-300 border shadow-lg bg-emerald-800/60 backdrop-blur-sm rounded-2xl sm:p-6 border-emerald-600/40 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl sm:mb-4">
                      <Globe className="w-6 h-6 text-white sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="mb-1 text-base font-bold text-emerald-100 sm:mb-2 sm:text-lg">Global Network</h3>
                    <p className="text-xs sm:text-sm text-emerald-200/80">Connect with farmers worldwide</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="p-4 text-center transition-all duration-300 border shadow-lg bg-emerald-800/60 backdrop-blur-sm rounded-2xl sm:p-6 border-emerald-600/40 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-2xl sm:mb-4">
                      <Coins className="w-6 h-6 text-white sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="mb-1 text-base font-bold text-emerald-100 sm:mb-2 sm:text-lg">Earn Rewards</h3>
                    <p className="text-xs sm:text-sm text-emerald-200/80">$AGRI token incentives and bounties</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="p-4 text-center transition-all duration-300 border shadow-lg bg-emerald-800/60 backdrop-blur-sm rounded-2xl sm:p-6 border-emerald-600/40 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 sm:w-16 sm:h-16 bg-gradient-to-r from-lime-500 to-green-500 rounded-2xl sm:mb-4">
                      <TrendingUp className="w-6 h-6 text-white sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="mb-1 text-base font-bold text-emerald-100 sm:mb-2 sm:text-lg">Grow Together</h3>
                    <p className="text-xs sm:text-sm text-emerald-200/80">Community-driven development</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* How It Works Section */}
          <motion.div
            id="how-it-works"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="px-4 text-center"
          >
            <h3 className="mb-8 text-2xl font-bold sm:text-3xl md:text-4xl text-emerald-100 sm:mb-12">
              How It <span className="text-transparent bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text">Works</span>
            </h3>
            
            <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto md:grid-cols-3 sm:gap-8">
              {[
                {
                  step: "01",
                  title: "Connect Your Wallet",
                  description: "Link your Web3 wallet to access the platform and start your agricultural journey on the blockchain.",
                  icon: Shield,
                  color: "from-emerald-500 to-green-500"
                },
                {
                  step: "02", 
                  title: "Track Your Crops",
                  description: "Use our advanced tracking system to monitor your crops from seed to harvest with complete transparency.",
                  icon: Leaf,
                  color: "from-green-500 to-lime-500"
                },
                {
                  step: "03",
                  title: "Earn & Collaborate", 
                  description: "Join cooperatives, complete bounties, and earn rewards while contributing to sustainable agriculture.",
                  icon: Award,
                  color: "from-yellow-500 to-yellow-400"
                }
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="p-6 transition-all duration-300 border shadow-lg bg-emerald-800/40 backdrop-blur-sm rounded-2xl sm:p-8 border-emerald-600/40 hover:shadow-xl group-hover:-translate-y-2">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-8 h-8 text-white sm:w-10 sm:h-10" />
                    </div>
                    <div className="mb-1 text-xs font-bold sm:text-sm text-emerald-400/80 sm:mb-2">{step.step}</div>
                    <h4 className="mb-3 text-lg font-bold sm:text-xl text-emerald-100 sm:mb-4">{step.title}</h4>
                    <p className="text-sm leading-relaxed sm:text-base text-emerald-200/80">{step.description}</p>
                  </div>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-green-400 transform -translate-y-1/2"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative px-4 py-16 overflow-hidden sm:py-20 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-600">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute w-48 h-48 rounded-full top-5 sm:top-10 left-5 sm:left-10 sm:w-72 sm:h-72 bg-emerald-300/5 blur-3xl animate-pulse"></div>
          <div className="absolute w-64 h-64 delay-1000 rounded-full bottom-5 sm:bottom-10 right-5 sm:right-10 sm:w-96 sm:h-96 bg-yellow-300/10 blur-3xl animate-pulse"></div>
          <div className="absolute w-48 h-48 delay-500 rounded-full top-1/2 left-1/2 sm:w-64 sm:h-64 bg-green-300/5 blur-3xl animate-pulse"></div>
        </div>

        <div className="container relative z-10 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-5xl px-4 mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full shadow-2xl sm:w-24 sm:h-24 bg-gradient-to-r from-yellow-400 to-yellow-300 sm:mb-8"
            >
              <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-800" />
            </motion.div>
            
            <Badge className="mb-4 sm:mb-6 bg-emerald-800/30 text-emerald-200 border-emerald-400/50 px-4 py-1.5 sm:px-6 sm:py-2 backdrop-blur-sm text-xs sm:text-sm">
              Join the Revolution
            </Badge>
            
            <h2 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl text-emerald-100 sm:mb-6">
              Ready to Transform <br />
              <span className="text-transparent bg-gradient-to-r from-yellow-300 to-yellow-200 bg-clip-text">
                Your Farm?
              </span>
            </h2>
            
            <p className="max-w-4xl mx-auto mb-8 text-lg leading-relaxed sm:text-xl md:text-2xl text-emerald-200/90 sm:mb-12">
              Join thousands of farmers already using blockchain technology to increase profits, 
              reduce costs, and build sustainable agricultural practices for the future.
            </p>

            <div className="flex flex-col justify-center gap-4 mb-8 sm:flex-row sm:gap-6 sm:mb-12">
              {!mounted ? (
                <Button
                  size="lg"
                  className="w-full px-8 py-3 text-base font-bold transition-all duration-300 transform border border-yellow-300 shadow-2xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-emerald-900 sm:px-10 sm:py-4 sm:text-lg hover:shadow-3xl hover:scale-105 sm:w-auto"
                >
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 ml-2 sm:w-5 sm:h-5" />
                </Button>
              ) : isConnected ? (
                <Button
                  onClick={() => router.push('/dashboard')}
                  size="lg"
                  className="w-full px-8 py-3 text-base font-bold transition-all duration-300 transform border border-yellow-300 shadow-2xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-emerald-900 sm:px-10 sm:py-4 sm:text-lg hover:shadow-3xl hover:scale-105 sm:w-auto"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2 sm:w-5 sm:h-5" />
                </Button>
              ) : (
                <Button
                  onClick={handleWalletConnect}
                  size="lg"
                  className="w-full px-8 py-3 text-base font-bold transition-all duration-300 transform border border-yellow-300 shadow-2xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-emerald-900 sm:px-10 sm:py-4 sm:text-lg hover:shadow-3xl hover:scale-105 sm:w-auto"
                >
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 ml-2 sm:w-5 sm:h-5" />
                </Button>
              )}
              
              <Button
                variant="outline"
                size="lg"
                className="w-full px-8 py-3 text-base transition-all duration-300 bg-transparent border-2 shadow-xl border-emerald-300/70 text-emerald-200 hover:bg-emerald-800/20 sm:px-10 sm:py-4 sm:text-lg backdrop-blur-sm hover:shadow-2xl hover:border-emerald-200 sm:w-auto"
              >
                <Users className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                Join Community
              </Button>
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="grid max-w-4xl grid-cols-2 gap-4 mx-auto md:grid-cols-4 sm:gap-6 lg:gap-8"
            >
              {[
                { number: "24/7", label: "Platform Uptime" },
                { number: "0%", label: "Setup Fees" },
                { number: "< 5min", label: "Getting Started" },
                { number: "∞", label: "Growth Potential" }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="mb-1 text-xl font-bold text-yellow-300 sm:text-2xl md:text-3xl">{stat.number}</div>
                  <div className="text-xs font-medium text-emerald-200 sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
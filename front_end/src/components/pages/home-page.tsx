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
import { useDisconnect } from "@reown/appkit/react"
import { useWalletInfo } from "@reown/appkit/react"
import { useAccount, useDisconnect as useWagmiDisconnect } from "wagmi"

export function HomePage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // AppKit hooks
  const { address: appkitAddress, isConnected: appkitIsConnected } = useAppKitAccount()
  const { open, close } = useAppKit()
  const { walletInfo } = useWalletInfo()
  const { disconnect: appkitDisconnect } = useDisconnect()

  // Wagmi hooks
  const { address: wagmiAddress, isConnected: wagmiIsConnected, connector } = useAccount()
  const { disconnect: wagmiDisconnect } = useWagmiDisconnect()

  // Get actual connection state
  const address = appkitAddress || wagmiAddress
  const isConnected = appkitIsConnected || wagmiIsConnected

  useEffect(() => setMounted(true), [])

  const handleWalletConnect = async () => {
    try {
      await open()
    } catch (error: unknown) {
      console.error("Connection error:", error instanceof Error ? error.message : String(error))
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
    <div className="min-h-screen relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
     {/* <div className="min-h-screen relative"> */}
     
      {/* Hero Section */}
       <section className="min-h-screen px-4 relative bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
      }}>
        {/* Enhanced overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/70 to-green-800/80"></div>
        
        <Header onWalletConnect={handleWalletConnect} />
        
        <div className="container mx-auto text-center h-screen flex flex-col items-center justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-gradient-to-r from-emerald-500/20 to-yellow-500/20 text-emerald-200 border-emerald-400/50 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Built on Mantle Network
            </Badge>

            <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight drop-shadow-lg">
              <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-yellow-300 bg-clip-text text-transparent">
                Revolutionizing
              </span>
              <br />
              <span className="text-white">Agriculture with</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-300 bg-clip-text text-transparent">
                Blockchain
              </span>
            </h1>

            <p className="text-xl md:text-xl text-emerald-100/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Track your crops from seed to harvest, join farmer cooperatives, and earn rewards for sustainable farming
              practices on the decentralized web.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              {!mounted ? (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-emerald-400/30"
                >
                  Start Farming on Blockchain
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : isConnected ? (
                <Button
                  onClick={() => router.push('/dashboard')}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-emerald-400/30"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleWalletConnect}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-emerald-400/30"
                >
                  Start Farming on Blockchain
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleWatchDemo}
                className="border-2 border-emerald-300/70 text-emerald-100 hover:bg-emerald-800/30 px-8 py-4 text-lg bg-emerald-900/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Watch Demo
              </Button>
            </div>

            {/* Feature Cards Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                  className="bg-emerald-900/20 backdrop-blur-md rounded-2xl p-6 border border-emerald-700/30 hover:bg-emerald-800/30 transition-all duration-300 group"
                >
                  <div className={`${feature.bg} border border-emerald-600/30 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-emerald-100 mb-3">{feature.title}</h3>
                  <p className="text-emerald-200/80 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
           
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="animate-bounce">
              <div className="w-6 h-10 border-2 border-emerald-300/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-emerald-300/70 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-emerald-800/60 text-emerald-200 border-emerald-600/50 px-4 py-2 backdrop-blur-sm">
              Platform Statistics
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-emerald-100 mb-6">
              Transforming Agriculture{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-yellow-300 bg-clip-text text-transparent">
                Globally
              </span>
            </h2>
            <p className="text-xl text-emerald-200/80 max-w-3xl mx-auto leading-relaxed">
              Join thousands of farmers, cooperatives, and agricultural innovators who are already using blockchain 
              to revolutionize farming practices worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-emerald-800/40 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-emerald-700/40 group hover:-translate-y-2"
              >
                <div className={`text-5xl md:text-6xl font-bold ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                <div className="text-emerald-200 font-semibold text-lg mb-2">{stat.label}</div>
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
            className="mt-20 text-center"
          >
            <p className="text-emerald-300/60 mb-8 text-lg">Trusted by leading agricultural organizations</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-40">
              <div className="text-2xl font-bold text-emerald-200">USDA</div>
              <div className="text-2xl font-bold text-emerald-200">FAO</div>
              <div className="text-2xl font-bold text-emerald-200">AgriTech</div>
              <div className="text-2xl font-bold text-emerald-200">FarmCorp</div>
              <div className="text-2xl font-bold text-emerald-200">GreenChain</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features & Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-900 via-emerald-900 to-green-800 relative overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-gradient-to-r from-emerald-800/60 to-green-800/60 text-emerald-200 border-emerald-600/50 px-4 py-2 backdrop-blur-sm">
              Platform Features
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-emerald-100 mb-6">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-emerald-200/80 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive blockchain platform provides all the tools and features you need to modernize 
              your agricultural operations and connect with the global farming community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-emerald-800/30 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-emerald-200 text-lg font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-emerald-800/40 to-green-800/40 rounded-3xl p-8 shadow-2xl border border-emerald-700/40 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-emerald-800/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-emerald-600/40 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-emerald-100 mb-2 text-lg">Secure & Transparent</h3>
                    <p className="text-sm text-emerald-200/80">Blockchain-secured data with full transparency</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-emerald-800/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-emerald-600/40 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-emerald-100 mb-2 text-lg">Global Network</h3>
                    <p className="text-sm text-emerald-200/80">Connect with farmers worldwide</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-emerald-800/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-emerald-600/40 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Coins className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-emerald-100 mb-2 text-lg">Earn Rewards</h3>
                    <p className="text-sm text-emerald-200/80">$AGRI token incentives and bounties</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-emerald-800/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-emerald-600/40 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-lime-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-emerald-100 mb-2 text-lg">Grow Together</h3>
                    <p className="text-sm text-emerald-200/80">Community-driven development</p>
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
            className="text-center"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-emerald-100 mb-12">
              How It <span className="bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">Works</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                  <div className="bg-emerald-800/40 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-600/40 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                    <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-sm font-bold text-emerald-400/80 mb-2">{step.step}</div>
                    <h4 className="text-xl font-bold text-emerald-100 mb-4">{step.title}</h4>
                    <p className="text-emerald-200/80 leading-relaxed">{step.description}</p>
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
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-600 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-300/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-300/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
            >
              <Leaf className="w-12 h-12 text-emerald-800" />
            </motion.div>
            
            <Badge className="mb-6 bg-emerald-800/30 text-emerald-200 border-emerald-400/50 px-6 py-2 backdrop-blur-sm">
              Join the Revolution
            </Badge>
            
            <h2 className="text-4xl md:text-6xl font-bold text-emerald-100 mb-6 leading-tight">
              Ready to Transform <br />
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-200 bg-clip-text text-transparent">
                Your Farm?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-emerald-200/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of farmers already using blockchain technology to increase profits, 
              reduce costs, and build sustainable agricultural practices for the future.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              {!mounted ? (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-emerald-900 font-bold px-10 py-4 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border border-yellow-300"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : isConnected ? (
                <Button
                  onClick={() => router.push('/dashboard')}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-emerald-900 font-bold px-10 py-4 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border border-yellow-300"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleWalletConnect}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-emerald-900 font-bold px-10 py-4 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border border-yellow-300"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-emerald-300/70 text-emerald-200 hover:bg-emerald-800/20 px-10 py-4 text-lg bg-transparent backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-emerald-200"
              >
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Button>
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
            >
              {[
                { number: "24/7", label: "Platform Uptime" },
                { number: "0%", label: "Setup Fees" },
                { number: "< 5min", label: "Getting Started" },
                { number: "∞", label: "Growth Potential" }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-1">{stat.number}</div>
                  <div className="text-emerald-200 text-sm font-medium">{stat.label}</div>
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
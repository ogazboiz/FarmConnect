"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Footer } from "../layout/footer"
import { Header } from "../layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Globe, Coins, Sprout, Users2, Target, Leaf, Lock, Zap, Heart, Award } from "lucide-react"
import { toast } from "react-hot-toast"

export function FeaturesPage() {
  // Welcome toast when component mounts
  useEffect(() => {
    toast.success('Welcome to AgriDAO Features! 🌱', {
      icon: '🌱',
      duration: 3000,
    })
  }, [])
  
  const mainFeatures = [
    {
      icon: Shield,
      title: "Transparent Supply Chain",
      description:
        "Every crop's journey is recorded immutably on the blockchain, ensuring authenticity and quality from farm to table.",
      color: "text-emerald-400",
      bg: "bg-emerald-900/20",
      details: ["Immutable crop records", "Quality verification", "Origin authentication", "Real-time tracking"],
    },
    {
      icon: Users2,
      title: "Decentralized Governance",
      description:
        "Farmers vote on cooperative decisions, equipment sharing, and resource allocation through democratic DAOs.",
      color: "text-green-400",
      bg: "bg-green-900/20",
      details: ["Democratic voting", "Resource sharing", "Collective decisions", "Fair representation"],
    },
    {
      icon: Coins,
      title: "Token Rewards",
      description: "Earn $AGRI tokens for sustainable practices, quality yields, and active community participation.",
      color: "text-yellow-400",
      bg: "bg-yellow-900/20",
      details: ["Sustainability rewards", "Quality incentives", "Community participation", "Staking opportunities"],
    },
    {
      icon: Globe,
      title: "Global Marketplace",
      description: "Connect directly with buyers worldwide, eliminating middlemen and increasing your profit margins.",
      color: "text-blue-400",
      bg: "bg-blue-900/20",
      details: ["Direct buyer connections", "No middlemen fees", "Global reach", "Fair pricing"],
    },
    {
      icon: Target,
      title: "Bounty System",
      description: "Solve agricultural challenges and earn rewards for innovative farming solutions and research.",
      color: "text-purple-400",
      bg: "bg-purple-900/20",
      details: ["Innovation rewards", "Research funding", "Problem solving", "Knowledge sharing"],
    },
    {
      icon: Sprout,
      title: "Sustainability Scoring",
      description: "Get reputation NFTs for eco-friendly practices and carbon footprint reduction efforts.",
      color: "text-lime-400",
      bg: "bg-lime-900/20",
      details: ["Eco-friendly tracking", "Carbon credits", "Reputation system", "Green incentives"],
    },
  ]

  const additionalFeatures = [
    {
      icon: Lock,
      title: "Secure Data Storage",
      description: "Your farming data is encrypted and stored securely on the blockchain.",
      color: "text-emerald-400",
    },
    {
      icon: Zap,
      title: "Real-time Analytics",
      description: "Get instant insights into your farm's performance and market trends.",
      color: "text-yellow-400",
    },
    {
      icon: Heart,
      title: "Community Support",
      description: "Access a global network of farmers and agricultural experts.",
      color: "text-pink-400",
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Unlock badges and achievements for reaching farming milestones.",
      color: "text-indigo-400",
    },
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen px-4 bg-center bg-no-repeat bg-cover sm:px-6 lg:px-8" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
      }}>
        {/* Enhanced overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/70 to-green-800/80"></div>
        
        <div className="container relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 pb-16 mx-auto text-center sm:pt-24 sm:pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-emerald-500/20 to-yellow-500/20 text-emerald-200 border-emerald-400/50 px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm text-xs sm:text-sm">
              <Leaf className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
              Powerful Features
            </Badge>

            <h1 className="px-2 mb-4 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl sm:mb-6 drop-shadow-lg">
              <span className="text-transparent bg-gradient-to-r from-emerald-300 via-green-300 to-yellow-300 bg-clip-text">
                Everything You Need
              </span>
              <br />
              <span className="text-white">for Modern Farming</span>
            </h1>

            <p className="max-w-4xl px-4 mx-auto mb-8 text-base leading-relaxed sm:text-lg md:text-xl lg:text-2xl text-emerald-100/90 sm:mb-12 drop-shadow-md">
              Discover the comprehensive suite of tools and features designed to revolutionize your agricultural
              operations with blockchain technology.
            </p>

            {/* Feature Highlights */}
            <div className="grid max-w-6xl grid-cols-1 gap-6 px-4 mx-auto mt-12 md:grid-cols-3 sm:gap-8 sm:mt-16">
              {mainFeatures.slice(0, 3).map((feature, index) => (
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

      {/* Main Features */}
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
              Core Features
            </Badge>
            <h2 className="px-4 mb-4 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl text-emerald-100 sm:mb-6">
              Comprehensive{" "}
              <span className="text-transparent bg-gradient-to-r from-emerald-300 to-yellow-300 bg-clip-text">
                Platform
              </span>
            </h2>
            <p className="max-w-4xl px-4 mx-auto text-lg leading-relaxed sm:text-xl text-emerald-200/80">
              Explore all the features that make AgriChain the most advanced agricultural platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 sm:gap-8">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full transition-all duration-300 transform border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40 hover:border-emerald-600/60 hover:shadow-2xl hover:scale-105">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 ${feature.bg} border border-emerald-600/30 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg text-emerald-100 sm:text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="mb-4 text-sm leading-relaxed text-emerald-200/80 sm:mb-6 sm:text-base">{feature.description}</p>
                    <div className="space-y-2 sm:space-y-3">
                      {feature.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-2 sm:gap-3">
                          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${feature.color.replace("text-", "bg-")}`}></div>
                          <span className="text-xs sm:text-sm text-emerald-200/90">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
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
              Additional Features
            </Badge>
            <h2 className="px-4 mb-4 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl text-emerald-100 sm:mb-6">
              And Much{" "}
              <span className="text-transparent bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text">More</span>
            </h2>
            <p className="max-w-3xl px-4 mx-auto text-lg sm:text-xl text-emerald-200/80">
              Additional features to enhance your farming experience and maximize productivity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="flex flex-col justify-center h-full p-6 text-center transition-all duration-300 border bg-emerald-800/40 backdrop-blur-sm border-emerald-600/40 hover:shadow-xl sm:p-8 hover:bg-emerald-800/60 group-hover:-translate-y-2">
                  <feature.icon className={`w-12 h-12 sm:w-16 sm:h-16 ${feature.color} mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`} />
                  <h3 className="mb-3 text-base font-bold text-emerald-100 sm:mb-4 sm:text-lg">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-emerald-200/80 sm:text-base">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="relative px-4 py-16 overflow-hidden sm:py-20 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-800 to-slate-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center sm:mb-16"
          >
            <Badge className="mb-3 sm:mb-4 bg-emerald-800/60 text-emerald-200 border-emerald-600/50 px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm text-xs sm:text-sm">
              Platform Comparison
            </Badge>
            <h2 className="px-4 mb-4 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl text-emerald-100 sm:mb-6">
              Traditional vs{" "}
              <span className="text-transparent bg-gradient-to-r from-emerald-300 to-yellow-300 bg-clip-text">
                AgriChain
              </span>
            </h2>
            <p className="max-w-4xl px-4 mx-auto text-lg sm:text-xl text-emerald-200/80">
              See how AgriChain transforms traditional farming practices with cutting-edge blockchain technology
            </p>
          </motion.div>

          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden border shadow-2xl bg-emerald-800/40 backdrop-blur-sm border-emerald-600/40">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-6 sm:p-8 bg-slate-800/50">
                    <h3 className="flex items-center gap-2 mb-4 text-xl font-bold sm:text-2xl text-slate-300 sm:mb-6 sm:gap-3">
                      <div className="w-2 h-2 rounded-full sm:w-3 sm:h-3 bg-slate-400"></div>
                      Traditional Farming
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        "Paper-based record keeping",
                        "Limited market access",
                        "Middleman dependencies",
                        "No transparency in supply chain",
                        "Individual decision making",
                        "Limited reward systems",
                      ].map((item, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-center gap-2 p-2 transition-colors duration-300 rounded-lg sm:gap-3 sm:p-3 hover:bg-slate-700/30"
                        >
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-slate-300 sm:text-base">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 bg-gradient-to-br from-emerald-800/60 to-green-800/60">
                    <h3 className="flex items-center gap-2 mb-4 text-xl font-bold sm:text-2xl text-emerald-200 sm:mb-6 sm:gap-3">
                      <div className="w-2 h-2 rounded-full sm:w-3 sm:h-3 bg-emerald-400"></div>
                      AgriChain Platform
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        "Blockchain-secured records",
                        "Global marketplace access",
                        "Direct buyer connections",
                        "Complete supply chain transparency",
                        "Decentralized governance",
                        "Token-based reward system",
                      ].map((item, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-center gap-2 p-2 transition-colors duration-300 rounded-lg sm:gap-3 sm:p-3 hover:bg-emerald-700/30"
                        >
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-emerald-200 sm:text-base">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
"use client"

import { motion } from "framer-motion"
import { Footer } from "../layout/footer"
import { Header } from "../layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Globe, Coins, Sprout, Users2, Target, Leaf, Lock, Zap, Heart, Award } from "lucide-react"

export function FeaturesPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800 relative">
      <Header />

      {/* Hero Section */}
      <section className="min-h-screen px-4 relative bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
      }}>
        {/* Enhanced overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/70 to-green-800/80"></div>
        
        <div className="container mx-auto text-center h-screen flex flex-col items-center justify-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-gradient-to-r from-emerald-500/20 to-yellow-500/20 text-emerald-200 border-emerald-400/50 px-4 py-2 backdrop-blur-sm">
              <Leaf className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
              <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-yellow-300 bg-clip-text text-transparent">
                Everything You Need
              </span>
              <br />
              <span className="text-white">for Modern Farming</span>
            </h1>

            <p className="text-xl md:text-2xl text-emerald-100/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Discover the comprehensive suite of tools and features designed to revolutionize your agricultural
              operations with blockchain technology.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
              {mainFeatures.slice(0, 3).map((feature, index) => (
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

      {/* Main Features */}
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
              Core Features
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-emerald-100 mb-6">
              Comprehensive{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-yellow-300 bg-clip-text text-transparent">
                Platform
              </span>
            </h2>
            <p className="text-xl text-emerald-200/80 max-w-3xl mx-auto leading-relaxed">
              Explore all the features that make AgriChain the most advanced agricultural platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40 hover:border-emerald-600/60 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-full">
                  <CardHeader>
                    <div
                      className={`w-16 h-16 ${feature.bg} border border-emerald-600/30 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-emerald-100 text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-emerald-200/80 mb-6 leading-relaxed">{feature.description}</p>
                    <div className="space-y-3">
                      {feature.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${feature.color.replace("text-", "bg-")}`}></div>
                          <span className="text-sm text-emerald-200/90">{detail}</span>
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
              Additional Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-emerald-100 mb-6">
              And Much{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">More</span>
            </h2>
            <p className="text-xl text-emerald-200/80 max-w-2xl mx-auto">
              Additional features to enhance your farming experience and maximize productivity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-600/40 hover:shadow-xl transition-all duration-300 text-center p-8 hover:bg-emerald-800/60 group-hover:-translate-y-2">
                  <feature.icon className={`w-16 h-16 ${feature.color} mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`} />
                  <h3 className="font-bold text-emerald-100 mb-4 text-lg">{feature.title}</h3>
                  <p className="text-emerald-200/80 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-800 to-slate-900 relative overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-emerald-800/60 text-emerald-200 border-emerald-600/50 px-4 py-2 backdrop-blur-sm">
              Platform Comparison
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-emerald-100 mb-6">
              Traditional vs{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-yellow-300 bg-clip-text text-transparent">
                AgriChain
              </span>
            </h2>
            <p className="text-xl text-emerald-200/80 max-w-3xl mx-auto">
              See how AgriChain transforms traditional farming practices with cutting-edge blockchain technology
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-600/40 overflow-hidden shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-8 bg-slate-800/50">
                    <h3 className="text-2xl font-bold text-slate-300 mb-6 flex items-center gap-3">
                      <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                      Traditional Farming
                    </h3>
                    <div className="space-y-4">
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
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors duration-300"
                        >
                          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                          <span className="text-slate-300">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 bg-gradient-to-br from-emerald-800/60 to-green-800/60">
                    <h3 className="text-2xl font-bold text-emerald-200 mb-6 flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                      AgriChain Platform
                    </h3>
                    <div className="space-y-4">
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
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-700/30 transition-colors duration-300"
                        >
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span className="text-emerald-200">{item}</span>
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

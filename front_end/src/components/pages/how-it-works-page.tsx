"use client"

import { motion } from "framer-motion"
import { Footer } from "../layout/footer"
import { Header } from "../layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Wallet,
  SproutIcon as Seedling,
  Users,
  Award,
  ArrowRight,
  CheckCircle,
  Leaf,
  Smartphone,
  Globe,
  Shield,
} from "lucide-react"

export function HowItWorksPage() {
  const steps = [
    {
      icon: Wallet,
      title: "Connect Your Wallet",
      description:
        "Link your Web3 wallet to access the decentralized agricultural ecosystem and start your blockchain farming journey.",
      color: "bg-yellow-500",
      details: [
        "Support for MetaMask, WalletConnect, and more",
        "Secure blockchain authentication",
        "One-time setup process",
        "Access to all platform features",
      ],
    },
    {
      icon: Seedling,
      title: "Track Your Crops",
      description:
        "Record planting, growth stages, and harvest data on the blockchain for complete traceability and transparency.",
      color: "bg-emerald-500",
      details: ["Digital crop passports", "Growth stage monitoring", "Quality verification", "Harvest documentation"],
    },
    {
      icon: Users,
      title: "Join Cooperatives",
      description:
        "Participate in farmer DAOs to make collective decisions, share resources, and strengthen your community.",
      color: "bg-green-500",
      details: ["Democratic governance", "Resource pooling", "Collective bargaining", "Knowledge sharing"],
    },
    {
      icon: Award,
      title: "Earn Rewards",
      description:
        "Complete bounties, maintain quality standards, and earn $AGRI tokens for your sustainable farming efforts.",
      color: "bg-amber-500",
      details: ["Sustainability bonuses", "Quality achievements", "Innovation rewards", "Community contributions"],
    },
  ]

  const benefits = [
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "All data is secured on the blockchain with complete transparency",
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Connect with farmers and buyers from around the world",
    },
    {
      icon: Smartphone,
      title: "Easy to Use",
      description: "Intuitive interface designed specifically for farmers",
    },
  ]

  const process = [
    {
      step: "1",
      title: "Registration",
      description: "Create your farmer profile and verify your identity",
    },
    {
      step: "2",
      title: "Farm Setup",
      description: "Add your farm details, location, and crop information",
    },
    {
      step: "3",
      title: "Start Tracking",
      description: "Begin recording your farming activities on the blockchain",
    },
    {
      step: "4",
      title: "Join Community",
      description: "Connect with other farmers and participate in governance",
    },
    {
      step: "5",
      title: "Earn & Grow",
      description: "Complete bounties and earn rewards for your contributions",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800 relative">
      <Header />

      {/* Hero Section */}
      <section className="min-h-screen px-4 relative bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
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
              Simple Process
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
              <span className="text-white">How</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-yellow-300 bg-clip-text text-transparent">
                AgriChain Works
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-emerald-100/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Simple steps to join the future of decentralized agriculture and start earning rewards for sustainable
              farming practices.
            </p>

            {/* Quick Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-16">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.15 }}
                  className="bg-emerald-900/20 backdrop-blur-md rounded-2xl p-6 border border-emerald-700/30 hover:bg-emerald-800/30 transition-all duration-300 group"
                >
                  <div className={`w-16 h-16 ${step.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-100 mb-2">{step.title}</h3>
                  <p className="text-emerald-200/80 text-sm leading-relaxed">{step.description}</p>
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

      {/* Detailed Steps */}
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
              Detailed Process
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-emerald-100 mb-6">
              Step by Step{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-yellow-300 bg-clip-text text-transparent">
                Guide
              </span>
            </h2>
            <p className="text-xl text-emerald-200/80 max-w-3xl mx-auto leading-relaxed">
              Follow these simple steps to get started with AgriChain and transform your farming operations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40 hover:border-emerald-600/60 hover:shadow-2xl transition-all duration-300 text-center h-full group-hover:-translate-y-2">
                  <CardContent className="p-8">
                    <div
                      className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-emerald-300 mb-4">{index + 1}</div>
                    <h3 className="text-xl font-semibold text-emerald-100 mb-4">{step.title}</h3>
                    <p className="text-emerald-200/80 mb-6 leading-relaxed">{step.description}</p>

                    <div className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span className="text-emerald-200/90">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-amber-400 transform -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Process */}
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
              Step by Step
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-emerald-100 mb-6">
              Detailed{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                Process
              </span>
            </h2>
            <p className="text-xl text-emerald-200/80 max-w-2xl mx-auto">
              A step-by-step breakdown of your journey on AgriChain
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-6 mb-8 last:mb-0 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <div className="flex-1 bg-emerald-800/30 backdrop-blur-sm border border-emerald-700/40 rounded-xl p-6 hover:bg-emerald-800/50 transition-all duration-300">
                  <h3 className="text-xl font-semibold text-emerald-100 mb-2">{item.title}</h3>
                  <p className="text-emerald-200/80 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
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
              Platform Benefits
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-emerald-100 mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-yellow-300 bg-clip-text text-transparent">
                Our Platform?
              </span>
            </h2>
            <p className="text-xl text-emerald-200/80 max-w-2xl mx-auto">
              Built with farmers in mind, designed for the future of agriculture
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-600/40 hover:shadow-xl transition-all duration-300 text-center p-8 hover:bg-emerald-800/60 group-hover:-translate-y-2">
                  <benefit.icon className="w-16 h-16 text-emerald-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-semibold text-emerald-100 mb-4">{benefit.title}</h3>
                  <p className="text-emerald-200/80 leading-relaxed">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of farmers already transforming their operations with blockchain technology.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-slate-900 font-semibold px-10 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Connect Wallet & Start
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

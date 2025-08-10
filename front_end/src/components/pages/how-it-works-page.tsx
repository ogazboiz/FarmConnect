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
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen px-4 bg-center bg-no-repeat bg-cover sm:px-6 lg:px-8" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
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
              Simple Process
            </Badge>

            <h1 className="px-2 mb-4 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl sm:mb-6 drop-shadow-lg">
              <span className="text-white">How</span>
              <br />
              <span className="text-transparent bg-gradient-to-r from-emerald-300 via-green-300 to-yellow-300 bg-clip-text">
                FarmConnect Works
              </span>
            </h1>

            <p className="max-w-4xl px-4 mx-auto mb-8 text-base leading-relaxed sm:text-lg md:text-xl lg:text-2xl text-emerald-100/90 sm:mb-12 drop-shadow-md">
              Simple steps to join the future of decentralized agriculture and start earning rewards for sustainable
              farming practices.
            </p>

            {/* Quick Overview Cards */}
            <div className="grid max-w-6xl grid-cols-1 gap-4 px-4 mx-auto mt-12 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:mt-16">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.15 }}
                  className="p-4 transition-all duration-300 border bg-emerald-900/20 backdrop-blur-md rounded-2xl sm:p-6 border-emerald-700/30 hover:bg-emerald-800/30 group"
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${step.color} rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-6 h-6 text-white sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold sm:text-lg text-emerald-100">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-emerald-200/80 sm:text-sm">{step.description}</p>
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

      {/* Detailed Steps */}
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
              Detailed Process
            </Badge>
            <h2 className="px-4 mb-4 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl text-emerald-100 sm:mb-6">
              Step by Step{" "}
              <span className="text-transparent bg-gradient-to-r from-emerald-300 to-yellow-300 bg-clip-text">
                Guide
              </span>
            </h2>
            <p className="max-w-4xl px-4 mx-auto text-lg leading-relaxed sm:text-xl text-emerald-200/80">
              Follow these simple steps to get started with FarmConnect and transform your farming operations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <Card className="h-full text-center transition-all duration-300 border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40 hover:border-emerald-600/60 hover:shadow-2xl group-hover:-translate-y-2">
                  <CardContent className="p-6 sm:p-8">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <step.icon className="w-8 h-8 text-white sm:w-10 sm:h-10" />
                    </div>
                    <div className="mb-3 text-2xl font-bold sm:text-3xl text-emerald-300 sm:mb-4">{index + 1}</div>
                    <h3 className="mb-3 text-lg font-semibold sm:text-xl text-emerald-100 sm:mb-4">{step.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-emerald-200/80 sm:mb-6 sm:text-base">{step.description}</p>

                    <div className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-left text-emerald-200/90">{detail}</span>
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
              Step by Step
            </Badge>
            <h2 className="px-4 mb-4 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl text-emerald-100 sm:mb-6">
              Detailed{" "}
              <span className="text-transparent bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text">
                Process
              </span>
            </h2>
            <p className="max-w-3xl px-4 mx-auto text-lg sm:text-xl text-emerald-200/80">
              A step-by-step breakdown of your journey on FarmConnect
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-start gap-4 mb-6 sm:flex-row sm:gap-6 sm:mb-8 last:mb-0 group"
              >
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-base font-bold text-white transition-transform duration-300 rounded-full shadow-lg sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-green-500 sm:text-lg group-hover:scale-110">
                  {item.step}
                </div>
                <div className="flex-1 w-full p-4 transition-all duration-300 border bg-emerald-800/30 backdrop-blur-sm border-emerald-700/40 rounded-xl sm:p-6 hover:bg-emerald-800/50">
                  <h3 className="mb-2 text-lg font-semibold sm:text-xl text-emerald-100">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-emerald-200/80 sm:text-base">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
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
              Platform Benefits
            </Badge>
            <h2 className="px-4 mb-4 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl text-emerald-100 sm:mb-6">
              Why Choose{" "}
              <span className="text-transparent bg-gradient-to-r from-emerald-300 to-yellow-300 bg-clip-text">
                Our Platform?
              </span>
            </h2>
            <p className="max-w-3xl px-4 mx-auto text-lg sm:text-xl text-emerald-200/80">
              Built with farmers in mind, designed for the future of agriculture
            </p>
          </motion.div>

          <div className="grid max-w-5xl grid-cols-1 gap-6 mx-auto md:grid-cols-3 sm:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="flex flex-col justify-center h-full p-6 text-center transition-all duration-300 border bg-emerald-800/40 backdrop-blur-sm border-emerald-600/40 hover:shadow-xl sm:p-8 hover:bg-emerald-800/60 group-hover:-translate-y-2">
                  <benefit.icon className="w-12 h-12 mx-auto mb-4 transition-transform duration-300 sm:w-16 sm:h-16 text-emerald-400 sm:mb-6 group-hover:scale-110" />
                  <h3 className="mb-3 text-lg font-semibold sm:text-xl text-emerald-100 sm:mb-4">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed text-emerald-200/80 sm:text-base">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-16 overflow-hidden sm:py-20 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative z-10 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full sm:w-20 sm:h-20 bg-white/20 sm:mb-8">
              <Leaf className="w-8 h-8 text-white sm:w-10 sm:h-10" />
            </div>
            <h2 className="px-4 mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl sm:mb-6">Ready to Get Started?</h2>
            <p className="max-w-3xl px-4 mx-auto mb-8 text-lg leading-relaxed sm:text-xl text-emerald-100 sm:mb-10">
              Join thousands of farmers already transforming their operations with blockchain technology.
            </p>
            <Button
              size="lg"
              className="w-full px-8 py-3 text-base font-semibold transition-all duration-300 transform shadow-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-slate-900 sm:px-10 sm:py-4 sm:text-lg hover:shadow-2xl hover:scale-105 sm:w-auto"
            >
              <span className="hidden sm:inline">Connect Wallet & Start</span>
              <span className="sm:hidden">Get Started</span>
              <ArrowRight className="w-4 h-4 ml-2 sm:w-5 sm:h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
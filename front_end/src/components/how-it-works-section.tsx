"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Wallet, SproutIcon as Seedling, Users, Award } from "lucide-react"
import { motion } from "framer-motion"

export function HowItWorksSection() {
  const steps = [
    {
      icon: Wallet,
      title: "Connect Wallet",
      description: "Link your Web3 wallet to access the decentralized agricultural ecosystem.",
      color: "bg-yellow-500",
    },
    {
      icon: Seedling,
      title: "Track Your Crops",
      description: "Record planting, growth stages, and harvest data on the blockchain for full traceability.",
      color: "bg-green-500",
    },
    {
      icon: Users,
      title: "Join Cooperatives",
      description: "Participate in farmer DAOs to make collective decisions and share resources.",
      color: "bg-emerald-500",
    },
    {
      icon: Award,
      title: "Earn Rewards",
      description: "Complete bounties, maintain quality standards, and earn $FARM tokens for your efforts.",
      color: "bg-yellow-600",
    },
  ]

  return (
    <section id="how-it-works" className="py-16 px-4 bg-white/30 backdrop-blur-sm">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">How FarmConnect Works</h2>
          <p className="text-xl text-green-600 max-w-2xl mx-auto">
            Simple steps to join the future of decentralized agriculture
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
              className="relative"
            >
              <Card className="bg-white/80 backdrop-blur-sm border-green-200 text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-800 mb-2">{index + 1}</div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">{step.title}</h3>
                  <p className="text-green-600">{step.description}</p>
                </CardContent>
              </Card>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-green-400 to-yellow-400 transform -translate-y-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Globe, Coins, Sprout, Users2, Target } from "lucide-react"
import { motion } from "framer-motion"

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Transparent Supply Chain",
      description: "Every crop's journey is recorded immutably on the blockchain, ensuring authenticity and quality.",
      color: "text-green-600",
    },
    {
      icon: Users2,
      title: "Decentralized Governance",
      description: "Farmers vote on cooperative decisions, equipment sharing, and resource allocation through DAOs.",
      color: "text-emerald-600",
    },
    {
      icon: Coins,
      title: "Token Rewards",
      description: "Earn $FARM tokens for sustainable practices, quality yields, and community participation.",
      color: "text-yellow-600",
    },
    {
      icon: Globe,
      title: "Global Marketplace",
      description: "Connect directly with buyers worldwide, eliminating middlemen and increasing profits.",
      color: "text-green-600",
    },
    {
      icon: Target,
      title: "Bounty System",
      description: "Solve agricultural challenges and earn rewards for innovative farming solutions.",
      color: "text-yellow-600",
    },
    {
      icon: Sprout,
      title: "Sustainability Scoring",
      description: "Get reputation NFTs for eco-friendly practices and carbon footprint reduction.",
      color: "text-emerald-600",
    },
  ]

  return (
    <section id="features" className="py-16 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Powerful Features for Modern Farming</h2>
          <p className="text-xl text-green-600 max-w-2xl mx-auto">
            Leverage blockchain technology to transform how agriculture works
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/70 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                  <CardTitle className="text-green-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

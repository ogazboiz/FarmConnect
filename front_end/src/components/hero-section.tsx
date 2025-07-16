"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, Users, Award } from "lucide-react"
import { motion } from "framer-motion"

interface HeroSectionProps {
  onWalletConnect: () => void
}

export function HeroSection({ onWalletConnect }: HeroSectionProps) {
  return (
    <section className="pt-24 pb-16 px-4">
      <div className="container mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-yellow-600 bg-clip-text text-transparent">
              Revolutionizing Agriculture
            </span>
            <br />
            <span className="text-green-800">with Blockchain</span>
          </h1>

          <p className="text-xl text-green-700 mb-8 max-w-3xl mx-auto">
            Track your crops from seed to harvest, join farmer cooperatives, and earn rewards for sustainable farming
            practices on the decentralized web.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={onWalletConnect}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3"
            >
              Get Started <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 bg-transparent"
            >
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-green-200"
            >
              <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">Crop Traceability</h3>
              <p className="text-green-600">Track every step from planting to harvest with blockchain transparency</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-green-200"
            >
              <Users className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">Farmer Cooperatives</h3>
              <p className="text-green-600">Join decentralized farmer DAOs for collective decision making</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-green-200"
            >
              <Award className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">Agri Bounties</h3>
              <p className="text-green-600">Earn rewards for solving agricultural challenges and innovations</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

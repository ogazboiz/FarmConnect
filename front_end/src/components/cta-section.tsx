"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf } from "lucide-react"
import { motion } from "framer-motion"

interface CTASectionProps {
  onWalletConnect: () => void
}

export function CTASection({ onWalletConnect }: CTASectionProps) {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Leaf className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Farm?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join the decentralized agriculture revolution and start earning rewards for sustainable farming today.
          </p>
          <Button
            onClick={onWalletConnect}
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-semibold px-8 py-3"
          >
            Start Farming on Blockchain <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

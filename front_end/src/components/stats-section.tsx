"use client"

import { motion } from "framer-motion"

export function StatsSection() {
  const stats = [
    { number: "10,000+", label: "Farmers Connected", color: "text-green-600" },
    { number: "50M+", label: "Crops Tracked", color: "text-emerald-600" },
    { number: "$2.5M", label: "Rewards Distributed", color: "text-yellow-600" },
    { number: "25", label: "Countries Active", color: "text-green-600" },
  ]

  return (
    <section id="stats" className="py-16 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Growing Impact Worldwide</h2>
          <p className="text-xl text-green-600 max-w-2xl mx-auto">
            Join thousands of farmers already transforming agriculture with blockchain
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
              <div className="text-green-700 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

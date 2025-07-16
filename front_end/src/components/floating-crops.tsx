"use client"

import { motion } from "framer-motion"
import { Wheat, Apple, Carrot, Grape, Cherry, CropIcon as Corn } from "lucide-react"

export function FloatingCrops() {
  const crops = [
    { Icon: Wheat, color: "text-yellow-400", size: "w-8 h-8" },
    { Icon: Apple, color: "text-red-400", size: "w-6 h-6" },
    { Icon: Carrot, color: "text-orange-400", size: "w-7 h-7" },
    { Icon: Grape, color: "text-purple-400", size: "w-6 h-6" },
    { Icon: Cherry, color: "text-red-500", size: "w-5 h-5" },
    { Icon: Corn, color: "text-yellow-500", size: "w-8 h-8" },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => {
        const crop = crops[i % crops.length]
        return (
          <motion.div
            key={i}
            className={`absolute ${crop.color} opacity-20`}
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
            }}
            animate={{
              y: -100,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          >
            <crop.Icon className={crop.size} />
          </motion.div>
        )
      })}
    </div>
  )
}

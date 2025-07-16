"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Wheat, Apple, Carrot, Grape, Cherry, CropIcon as Corn, Sprout, TreePine, Flower, Leaf } from "lucide-react"

export function AnimatedBackground() {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])
  const crops = [
    { Icon: Wheat, color: "text-amber-400/30", size: "w-8 h-8" },
    { Icon: Apple, color: "text-red-400/25", size: "w-6 h-6" },
    { Icon: Carrot, color: "text-orange-400/30", size: "w-7 h-7" },
    { Icon: Grape, color: "text-purple-400/25", size: "w-6 h-6" },
    { Icon: Cherry, color: "text-red-500/30", size: "w-5 h-5" },
    { Icon: Corn, color: "text-yellow-500/35", size: "w-8 h-8" },
    { Icon: Sprout, color: "text-green-400/30", size: "w-6 h-6" },
    { Icon: TreePine, color: "text-emerald-500/25", size: "w-7 h-7" },
    { Icon: Flower, color: "text-pink-400/30", size: "w-6 h-6" },
    { Icon: Leaf, color: "text-green-500/35", size: "w-5 h-5" },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating crop icons */}
      {Array.from({ length: 25 }).map((_, i) => {
        const crop = crops[i % crops.length]
        const randomDelay = Math.random() * 10
        const randomDuration = 15 + Math.random() * 20
        const randomX = Math.random() * 100
        const randomRotation = Math.random() * 360

        return (
          <motion.div
            key={`crop-${i}`}
            className={`absolute ${crop.color}`}
            initial={{
              x: `${randomX}vw`,
              y: "110vh",
              rotate: randomRotation,
              scale: 0.5 + Math.random() * 0.5,
            }}
            animate={{
              y: "-10vh",
              x: `${randomX + (Math.random() - 0.5) * 20}vw`,
              rotate: randomRotation + 360,
            }}
            transition={{
              duration: randomDuration,
              repeat: Number.POSITIVE_INFINITY,
              delay: randomDelay,
              ease: "linear",
            }}
          >
            <crop.Icon className={crop.size} />
          </motion.div>
        )
      })}

      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400/20 to-amber-400/20 rounded-full"
          initial={{
            x: Math.random() * dimensions.width,
            y: dimensions.height + 20,
          }}
          animate={{
            y: -20,
            x: Math.random() * dimensions.width,
          }}
          transition={{
            duration: 20 + Math.random() * 15,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 8,
            ease: "linear",
          }}
        />
      ))}

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/20 via-transparent to-amber-50/20 pointer-events-none" />
    </div>
  )
}

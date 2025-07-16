"use client"

import { useState } from "react"
import { Header } from "./header"
import { HeroSection } from "./hero-section"
import { FeaturesSection } from "./features-section"
import { HowItWorksSection } from "./how-it-works-section"
import { StatsSection } from "./stats-section"
import { CTASection } from "./cta-section"
import { Footer } from "./footer"
import { FloatingCrops } from "./floating-crops"
import { Dashboard } from "./dashboard"

export function LandingPage() {
  const [isConnected, setIsConnected] = useState(false)

  const handleWalletConnect = () => {
    // Simulate wallet connection
    setIsConnected(true)
  }

  if (isConnected) {
    return <Dashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 relative overflow-hidden">
      <FloatingCrops />
      <Header onWalletConnect={handleWalletConnect} />
      <HeroSection onWalletConnect={handleWalletConnect} />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection onWalletConnect={handleWalletConnect} />
      <Footer />
    </div>
  )
}

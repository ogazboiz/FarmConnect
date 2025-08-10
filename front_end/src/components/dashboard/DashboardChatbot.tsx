"use client"

import { AIFarmingAssistant, FloatingChatButton } from "@/components/intelligence/ai-assistant"
import { useState } from "react"
import { useAccount } from "wagmi"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export function DashboardChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const { isConnected } = useAccount()
  const pathname = usePathname()

  // Only show chatbot on dashboard pages when wallet is connected
  const isDashboardPage = pathname.startsWith('/dashboard') || pathname.startsWith('/intelligence')
  const shouldShowChatbot = isConnected && isDashboardPage

  if (!shouldShowChatbot) {
    return null
  }

  const handleChatToggle = () => {
    if (isMinimized) {
      setIsMinimized(false)
      setIsOpen(true)
    } else {
      setIsOpen(!isOpen)
    }
  }

  const handleChatClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const handleChatMinimize = () => {
    setIsOpen(false)
    setIsMinimized(true)
  }

  return (
    <>
      {/* Floating Chat Button - Show when chat is closed and not minimized */}
      {!isOpen && !isMinimized && (
        <FloatingChatButton onClick={handleChatToggle} />
      )}

      {/* Minimized Chat Indicator - Show when chat is minimized */}
      {isMinimized && (
        <Button
          onClick={handleChatToggle}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg z-50"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </Button>
      )}

      {/* AI Assistant Chat - Show when open */}
      <AIFarmingAssistant 
        isOpen={isOpen}
        onClose={handleChatClose}
        onMinimize={handleChatMinimize}
      />
    </>
  )
}

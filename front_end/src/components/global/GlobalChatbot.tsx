"use client"

import { AIFarmingAssistant, FloatingChatButton } from "@/components/intelligence/ai-assistant"
import { useChatbot } from "@/contexts/ChatbotContext"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export function GlobalChatbot() {
  const { isOpen, isMinimized, closeChat, minimizeChat, toggleChat } = useChatbot()

  return (
    <>
      {/* Floating Chat Button - Show when chat is closed and not minimized */}
      {!isOpen && !isMinimized && (
        <FloatingChatButton onClick={toggleChat} />
      )}

      {/* Minimized Chat Indicator - Show when chat is minimized */}
      {isMinimized && (
        <Button
          onClick={toggleChat}
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
        onClose={closeChat}
        onMinimize={minimizeChat}
      />
    </>
  )
}

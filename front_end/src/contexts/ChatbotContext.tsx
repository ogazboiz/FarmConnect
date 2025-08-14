"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface ChatbotContextType {
  isOpen: boolean
  isMinimized: boolean
  openChat: () => void
  closeChat: () => void
  minimizeChat: () => void
  toggleChat: () => void
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider')
  }
  return context
}

interface ChatbotProviderProps {
  children: ReactNode
}

export function ChatbotProvider({ children }: ChatbotProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const openChat = () => {
    setIsOpen(true)
    setIsMinimized(false)
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const minimizeChat = () => {
    setIsOpen(false)
    setIsMinimized(true)
  }

  const toggleChat = () => {
    if (isMinimized) {
      openChat()
    } else {
      setIsOpen(!isOpen)
    }
  }

  const value: ChatbotContextType = {
    isOpen,
    isMinimized,
    openChat,
    closeChat,
    minimizeChat,
    toggleChat,
  }

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  )
}

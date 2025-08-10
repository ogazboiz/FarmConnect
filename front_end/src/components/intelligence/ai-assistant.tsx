"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff,
  Bot,
  User,
  X,
  Minimize2
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface ChatbotProps {
  isOpen: boolean
  onClose: () => void
  onMinimize: () => void
}

export function AIFarmingAssistant({ isOpen, onClose, onMinimize }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI Farming Assistant. I can help you with weather insights, market recommendations, crop planning, and answer any agriculture questions. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "Should I plant tomatoes next week?",
        "What's the weather forecast?",
        "Market prices for lettuce",
        "Best crops for my location"
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user', 
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response - replace with actual AI API call
    setTimeout(() => {
      const response = generateAIResponse(content.trim())
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (input: string): { content: string, suggestions?: string[] } => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('weather') || lowerInput.includes('rain') || lowerInput.includes('temperature')) {
      return {
        content: "🌤️ Based on current weather data for your location:\n\n• Today: 76°F, sunny conditions\n• Tomorrow: Heavy rain expected (0.8\" rainfall)\n• Recommendation: Delay outdoor harvesting until Thursday\n\nWould you like me to set up weather alerts for your farm?",
        suggestions: ["Set weather alerts", "7-day forecast", "Irrigation recommendations"]
      }
    }
    
    if (lowerInput.includes('plant') || lowerInput.includes('tomato')) {
      return {
        content: "🍅 For tomato planting:\n\n• Current conditions: Good for transplanting\n• Soil temperature: Optimal (65°F+)\n• Weather window: Plant before tomorrow's rain\n• Expected yield: 2,500-3,000 kg/hectare\n• Market price: $4.20/kg (12% increase)\n\nRecommendation: Plant now, with protection ready for tomorrow's storm.",
        suggestions: ["Market prices", "Planting calendar", "Soil preparation tips"]
      }
    }
    
    if (lowerInput.includes('market') || lowerInput.includes('price') || lowerInput.includes('sell')) {
      return {
        content: "📊 Current market insights:\n\n• Lettuce: High demand ($3.20/kg, +8%)\n• Tomatoes: Rising prices ($4.20/kg, +12%)\n• Peppers: Stable market ($12.50/kg)\n• Local demand: 8 businesses seeking lettuce\n\nOpportunity: Plant lettuce for spring harvest - low competition, high demand.",
        suggestions: ["Demand forecast", "Best crops to plant", "Local buyers"]
      }
    }

    if (lowerInput.includes('crop') || lowerInput.includes('best') || lowerInput.includes('recommend')) {
      return {
        content: "🌱 Based on your farm data and current conditions:\n\nRecommended crops:\n✅ Lettuce (excellent conditions, high demand)\n✅ Spinach (cool weather optimal)\n⏳ Peppers (wait 1 week for warmer weather)\n❌ Summer squash (too late in season)\n\nWant specific recommendations for your soil type and location?",
        suggestions: ["Soil analysis", "Planting schedule", "Yield predictions"]
      }
    }

    // Default response
    return {
      content: "I understand you're asking about farming. I can help with:\n\n• Weather insights and recommendations\n• Market prices and demand analysis\n• Crop selection and planting advice\n• Farm performance optimization\n• Pest and disease management\n\nCould you be more specific about what you'd like to know?",
      suggestions: ["Weather forecast", "Market analysis", "Crop recommendations", "Farm analytics"]
    }
  }

  const handleVoiceToggle = () => {
    setIsListening(!isListening)
    // Implement voice recognition here
    if (!isListening) {
      // Start listening
      setTimeout(() => {
        setIsListening(false)
        setInputValue("What's the weather like for planting?")
      }, 3000)
    }
  }

  const quickSuggestions = [
    "Weather forecast",
    "Market prices", 
    "Crop recommendations",
    "Irrigation advice",
    "Pest management",
    "Harvest timing"
  ]

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h3 className="font-semibold">🤖 AI Farm Assistant</h3>
        </div>
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-white hover:bg-white/20 p-1 h-8 w-8"
            onClick={onMinimize}
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-white hover:bg-white/20 p-1 h-8 w-8"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'assistant' && (
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-green-600" />
              </div>
            )}
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
              <div
                className={`p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              
              {/* Suggestions */}
              {message.suggestions && (
                <div className="mt-2 space-y-1">
                  {message.suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => handleSendMessage(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            {message.type === 'user' && (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-blue-600" />
              </div>
            )}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-green-600" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions */}
      {messages.length === 1 && (
        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-1">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-6"
                onClick={() => handleSendMessage(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about weather, crops, market prices..."
              className="pr-10"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage(inputValue)
                }
              }}
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              onClick={handleVoiceToggle}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-red-500" />
              ) : (
                <Mic className="w-4 h-4 text-gray-500" />
              )}
            </Button>
          </div>
          <Button 
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {isListening && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <span className="animate-pulse">🎤</span> Listening...
          </p>
        )}
      </div>
    </div>
  )
}

// Floating chat button component
export function FloatingChatButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg z-40"
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </Button>
  )
}

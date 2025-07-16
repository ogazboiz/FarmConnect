"use client"

import { Button } from "@/components/ui/button"
import { Leaf, Wallet } from "lucide-react"

interface HeaderProps {
  onWalletConnect: () => void
}

export function Header({ onWalletConnect }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
            AgriChain
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-green-700 hover:text-green-800 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-green-700 hover:text-green-800 transition-colors">
            How It Works
          </a>
          <a href="#stats" className="text-green-700 hover:text-green-800 transition-colors">
            Impact
          </a>
        </nav>

        <Button
          onClick={onWalletConnect}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      </div>
    </header>
  )
}

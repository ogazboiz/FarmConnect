// src/app/qr-generator/page.tsx
"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { QrCode, Leaf, Wallet } from "lucide-react"
import { QRCodeGenerator } from "@/components/farmer/QRCodeGenerator"

export default function QRGeneratorPage() {
  const { address, isConnected } = useAccount()
  const [tokenId, setTokenId] = useState('')
  const [cropType, setCropType] = useState('')
  const [showGenerator, setShowGenerator] = useState(false)

  const handleGenerate = () => {
    if (tokenId && cropType) {
      setShowGenerator(true)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-2xl">
            <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
              <CardContent className="text-center py-16">
                <div className="w-16 h-16 bg-emerald-700/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-emerald-200 mb-2">Connect Your Wallet</h2>
                <p className="text-emerald-300/80 mb-6">Please connect your wallet to generate QR codes for your crops</p>
                <Button 
                  onClick={() => window.dispatchEvent(new Event('wallet-connect'))}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                🌾 QR Code Generator
              </span>
            </h1>
            <p className="text-xl text-emerald-200/80">
              Generate QR codes for your crop NFTs that consumers can scan to discover their story
            </p>
          </div>

          <Card className="bg-emerald-800/40 backdrop-blur-sm border border-emerald-700/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-100">
                <QrCode className="w-5 h-5 text-emerald-400" />
                Generate QR Code for Your Crop
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-200 mb-2">
                    Token ID
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter your crop NFT token ID (e.g., 1, 2, 3...)"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    className="bg-emerald-700/30 border-emerald-600/40 text-emerald-100 placeholder:text-emerald-300/50 focus:border-emerald-500"
                  />
                  <p className="text-xs text-emerald-300/60 mt-1">
                    You can find your token ID in your crops dashboard
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-emerald-200 mb-2">
                    Crop Type (for display)
                  </label>
                  <Input
                    placeholder="e.g., Organic Tomatoes, Sweet Corn, etc."
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="bg-emerald-700/30 border-emerald-600/40 text-emerald-100 placeholder:text-emerald-300/50 focus:border-emerald-500"
                  />
                  <p className="text-xs text-emerald-300/60 mt-1">
                    This will be displayed on the QR code
                  </p>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!tokenId || !cropType}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Code
                </Button>
              </div>

              {/* How it works */}
              <div className="bg-emerald-700/30 p-4 rounded-lg border border-emerald-600/40">
                <h3 className="font-medium text-emerald-300 mb-2">📋 How to Use Your QR Code:</h3>
                <ol className="text-sm text-emerald-200/80 space-y-1">
                  <li>1. Enter your crop&apos;s token ID and type above</li>
                  <li>2. Generate and download the QR code</li>
                  <li>3. Print it on stickers or labels</li>
                  <li>4. Attach to your product packaging</li>
                  <li>5. Consumers scan to discover your crop&apos;s story!</li>
                </ol>
              </div>

              {/* Benefits */}
              <div className="bg-emerald-700/30 p-4 rounded-lg border border-emerald-600/40">
                <h3 className="font-medium text-emerald-300 mb-2">🎯 Benefits for You:</h3>
                <ul className="text-sm text-emerald-200/80 space-y-1">
                  <li>• Direct connection with consumers</li>
                  <li>• Increased trust through transparency</li>
                  <li>• Higher prices for traceable products</li>
                  <li>• Build your farm&apos;s reputation</li>
                  <li>• Earn reputation points for each scan</li>
                </ul>
              </div>

              {/* Quick Links */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.open('/dashboard/crops', '_self')}
                  className="border-emerald-600/40 text-emerald-300 hover:bg-emerald-700/30 flex-1"
                >
                  <Leaf className="w-4 h-4 mr-2" />
                  View My Crops
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('/marketplace', '_self')}
                  className="flex-1 border-emerald-600/40 text-emerald-300 hover:bg-emerald-700/30"
                >
                  🛒 Marketplace
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showGenerator && (
        <QRCodeGenerator
          tokenId={tokenId}
          cropType={cropType}
          onClose={() => setShowGenerator(false)}
          isOpen={showGenerator}
        />
      )}

      <Footer />
    </div>
  )
}
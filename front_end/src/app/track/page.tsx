// src/app/track/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QrCode, Search, ArrowRight, Camera } from "lucide-react"
import { QRScanner } from "@/components/scanner/QRScanner"

export default function TrackPage() {
  const router = useRouter()
  const [tokenId, setTokenId] = useState('')
  const [showScanner, setShowScanner] = useState(false)

  const handleScan = () => {
    if (tokenId.trim()) {
      router.push(`/scan/${tokenId.trim()}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan()
    }
  }

  const handleScanResult = (scannedTokenId: string) => {
    // QR scanner will automatically navigate, but we can also handle it here
    setShowScanner(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
      <Header />

      <div className="px-4 pt-24 pb-16">
        <div className="container max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-white">
              <span className="text-transparent bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text">
                📱 Track Your Product
              </span>
            </h1>
            <p className="text-xl text-emerald-200/80">
              Scan QR code or enter product ID to discover the story behind your food
            </p>
          </div>

          <Card className="border bg-emerald-800/40 backdrop-blur-sm border-emerald-700/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-100">
                <QrCode className="w-5 h-5 text-emerald-400" />
                Enter Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Scanner Button */}
              <div className="text-center">
                <Button
                  onClick={() => setShowScanner(true)}
                  size="lg"
                  className="mb-4 text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  📱 Scan QR Code
                </Button>
                <p className="text-sm text-emerald-200/70">
                  Use your camera to scan the QR code on product packaging
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 border-t border-emerald-600/30"></div>
                <span className="px-3 py-1 text-sm rounded-full text-emerald-200/70 bg-emerald-700/30">or</span>
                <div className="flex-1 border-t border-emerald-600/30"></div>
              </div>

              {/* Manual Input */}
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-emerald-200">
                    Product ID or Token ID
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter product ID (e.g., 1, 2, 3...)"
                      value={tokenId}
                      onChange={(e) => setTokenId(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-emerald-700/30 border-emerald-600/40 text-emerald-100 placeholder:text-emerald-300/50 focus:border-emerald-500"
                    />
                    <Button 
                      onClick={handleScan}
                      disabled={!tokenId.trim()}
                      className="text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Track
                    </Button>
                  </div>
                </div>
              </div>

              {/* QR Scanner Note */}
              <div className="pt-6 border-t border-emerald-600/30">
                <div className="p-4 border rounded-lg bg-emerald-700/30 border-emerald-600/30">
                  <h3 className="mb-2 font-medium text-emerald-300">📱 Have a QR Code?</h3>
                  <p className="mb-3 text-sm text-emerald-200/80">
                    If you have a QR code on your product packaging, click the &quot;Scan QR Code&quot; button above
                    to automatically open the product details with your phone&apos;s camera.
                  </p>
                  <p className="text-xs text-emerald-300/60">
                    QR codes look like: yourapp.com/scan/123
                  </p>
                </div>
              </div>

              {/* Browse Alternative */}
              <div className="pt-6 border-t border-emerald-600/30">
                <div className="text-center">
                  <p className="mb-4 text-emerald-200/80">
                    Don&apos;t have a product ID? Browse all available crops instead.
                  </p>
                  <Button 
                    onClick={() => router.push('/marketplace')}
                    variant="outline"
                    className="border-emerald-600/40 text-emerald-300 hover:bg-emerald-700/30 bg-emerald-800/20"
                  >
                    🛒 Browse Marketplace
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="mt-8 text-white border bg-gradient-to-r from-emerald-700 to-green-700 border-emerald-600/40">
            <CardHeader>
              <CardTitle className="text-center text-white">
                🌱 How Product Tracking Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-white/20">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h3 className="mb-2 font-semibold">1. Scan QR Code</h3>
                  <p className="text-sm text-emerald-100">Use your phone&apos;s camera to scan the QR code on the product</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-white/20">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="mb-2 font-semibold">2. Discover the Story</h3>
                  <p className="text-sm text-emerald-100">Learn about the farmer, location, and journey of your food</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-white/20">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <h3 className="mb-2 font-semibold">3. Earn Rewards</h3>
                  <p className="text-sm text-emerald-100">Get GREEN points for scanning, rating, and sharing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleScanResult}
          onClose={() => setShowScanner(false)}
          isOpen={showScanner}
        />
      )}

      <Footer />
    </div>
  )
}
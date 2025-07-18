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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                📱 Track Your Product
              </span>
            </h1>
            <p className="text-xl text-slate-600">
              Scan QR code or enter product ID to discover the story behind your food
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-600" />
                Enter Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Scanner Button */}
              <div className="text-center">
                <Button
                  onClick={() => setShowScanner(true)}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white mb-4"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  📱 Scan QR Code
                </Button>
                <p className="text-sm text-slate-600">
                  Use your camera to scan the QR code on product packaging
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 border-t border-slate-200"></div>
                <span className="text-sm text-slate-500 bg-slate-50 px-3 py-1 rounded-full">or</span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>

              {/* Manual Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product ID or Token ID
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter product ID (e.g., 1, 2, 3...)"
                      value={tokenId}
                      onChange={(e) => setTokenId(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="border-emerald-300 focus:border-emerald-500"
                    />
                    <Button 
                      onClick={handleScan}
                      disabled={!tokenId.trim()}
                      className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Track
                    </Button>
                  </div>
                </div>
              </div>

              {/* QR Scanner Note */}
              <div className="border-t border-slate-200 pt-6">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h3 className="font-medium text-emerald-800 mb-2">📱 Have a QR Code?</h3>
                  <p className="text-emerald-700 text-sm mb-3">
                    If you have a QR code on your product packaging, click the "Scan QR Code" button above
                    to automatically open the product details with your phone's camera.
                  </p>
                  <p className="text-emerald-600 text-xs">
                    QR codes look like: yourapp.com/scan/123
                  </p>
                </div>
              </div>

              {/* Browse Alternative */}
              <div className="border-t border-slate-200 pt-6">
                <div className="text-center">
                  <p className="text-slate-600 mb-4">
                    Don't have a product ID? Browse all available crops instead.
                  </p>
                  <Button 
                    onClick={() => router.push('/marketplace')}
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    🛒 Browse Marketplace
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="mt-8 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="text-white text-center">
                🌱 How Product Tracking Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Scan QR Code</h3>
                  <p className="text-emerald-100 text-sm">Use your phone's camera to scan the QR code on the product</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">2. Discover the Story</h3>
                  <p className="text-emerald-100 text-sm">Learn about the farmer, location, and journey of your food</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Earn Rewards</h3>
                  <p className="text-emerald-100 text-sm">Get GREEN points for scanning, rating, and sharing</p>
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
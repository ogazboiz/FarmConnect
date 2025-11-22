// src/components/consumer/ConnectWalletModal.tsx
"use client"

import { useWalletOperations, useWalletQR } from "@/hooks/useWalletConnect"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, X, Star, QrCode, Share, Gift, Smartphone, Monitor } from "lucide-react"
import { useState, useEffect } from "react"

interface ConnectWalletModalProps {
  isOpen?: boolean
  onClose: () => void
}

export function ConnectWalletModal({ isOpen = true, onClose }: ConnectWalletModalProps) {
  const { 
    connectAppKit, 
    connectWalletConnect, 
    isConnecting, 
    error, 
    clearError 
  } = useWalletOperations()
  
  const { 
    qrCodeUri, 
    isGenerating, 
    generateQRCode, 
    clearQRCode 
  } = useWalletQR()
  
  const [connectionMethod, setConnectionMethod] = useState<'appkit' | 'walletconnect'>('appkit')
  const [walletConnectUri, setWalletConnectUri] = useState('')

  // Clear QR code when modal closes
  useEffect(() => {
    if (!isOpen) {
      clearQRCode()
      clearError()
    }
  }, [isOpen, clearQRCode, clearError])

  const handleAppKitConnect = async () => {
    try {
      await connectAppKit()
      onClose()
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  const handleWalletConnectConnect = async () => {
    try {
      if (walletConnectUri) {
        await connectWalletConnect(walletConnectUri)
        onClose()
      }
    } catch (error) {
      console.error('Error connecting via WalletConnect:', error)
    }
  }

  const handleGenerateQR = async () => {
    try {
      await generateQRCode()
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white relative">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
        >
          <X className="w-4 h-4" />
        </Button>

        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-emerald-600" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-800">
            Connect Your Wallet
          </CardTitle>
          <p className="text-slate-600 text-sm">
            Join the AgriDAO community and start earning GREEN points for every interaction!
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Connection Method Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800 text-sm">Choose connection method:</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={connectionMethod === 'appkit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setConnectionMethod('appkit')}
                className="flex items-center gap-2"
              >
                <Monitor className="w-4 h-4" />
                AppKit
              </Button>
              
              <Button
                variant={connectionMethod === 'walletconnect' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setConnectionMethod('walletconnect')}
                className="flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                WalletConnect
              </Button>
            </div>
          </div>

          {/* Connection Interface */}
          {connectionMethod === 'appkit' ? (
            <div className="space-y-4">
              <Button
                onClick={handleAppKitConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                size="lg"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect with AppKit'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* WalletConnect URI Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  WalletConnect URI
                </label>
                <input
                  type="text"
                  value={walletConnectUri}
                  onChange={(e) => setWalletConnectUri(e.target.value)}
                  placeholder="wc:..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* QR Code Generation */}
              <div className="space-y-2">
                <Button
                  onClick={handleGenerateQR}
                  disabled={isGenerating}
                  variant="outline"
                  className="w-full"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate QR Code'}
                </Button>

                {qrCodeUri && (
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-2">Scan with your wallet:</p>
                    <div className="text-xs font-mono break-all text-slate-500">
                      {qrCodeUri.substring(0, 50)}...
                    </div>
                  </div>
                )}
              </div>

              {/* Connect Button */}
              <Button
                onClick={handleWalletConnectConnect}
                disabled={isConnecting || !walletConnectUri}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                size="lg"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect via WalletConnect'}
              </Button>
            </div>
          )}

          {/* Benefits */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800 text-sm">What you can do:</h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-emerald-50 rounded-lg">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">Scan Products</p>
                  <p className="text-xs text-emerald-600">Earn 10 GREEN points per scan</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Rate Quality</p>
                  <p className="text-xs text-yellow-600">Earn 20 GREEN points per rating</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                <Share className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Share Stories</p>
                  <p className="text-xs text-blue-600">Earn 25 GREEN points per share</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                <Gift className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-800">Redeem Rewards</p>
                  <p className="text-xs text-purple-600">Use points for exclusive benefits</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
              <Button
                onClick={clearError}
                variant="ghost"
                size="sm"
                className="mt-2 text-red-600 hover:text-red-800"
              >
                Dismiss
              </Button>
            </div>
          )}

          {/* Security Note */}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              🔒 Your wallet stays secure. We never store your private keys.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
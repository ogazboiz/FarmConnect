// src/components/consumer/ConnectWalletModal.tsx
"use client"

import { useAppKit } from '@reown/appkit/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, X, Star, QrCode, Share, Gift } from "lucide-react"

interface ConnectWalletModalProps {
  isOpen?: boolean
  onClose: () => void
}

export function ConnectWalletModal({ isOpen = true, onClose }: ConnectWalletModalProps) {
  const { open } = useAppKit()

  const handleConnect = async () => {
    try {
      await open()
      onClose()
    } catch (error) {
      console.error('Error connecting wallet:', error)
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

          {/* Connect Button */}
          <Button
            onClick={handleConnect}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
            size="lg"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>

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
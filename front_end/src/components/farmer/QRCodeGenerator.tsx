// src/components/farmer/QRCodeGenerator.tsx
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Download, Copy, QrCode, Check, X, Printer } from 'lucide-react'
import Image from 'next/image'

interface QRCodeGeneratorProps {
  tokenId: string | number
  cropType?: string
  onClose?: () => void
  isOpen?: boolean
}

export function QRCodeGenerator({ tokenId, cropType, onClose, isOpen = true }: QRCodeGeneratorProps) {
  const [copied, setCopied] = useState(false)
  const [customDomain, setCustomDomain] = useState('localhost:3000') // Update this to your domain

  // Generate QR code data
  const qrData = `https://${customDomain}/scan/${tokenId}`
  const filename = `crop-${tokenId}-qr-code.png`

  // Generate QR code URL using online service
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&color=059669&bgcolor=ffffff&margin=10`

  const downloadQRCode = async () => {
    try {
      const response = await fetch(qrImageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = filename
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download QR code:', error)
      // Fallback: open in new tab
      window.open(qrImageUrl, '_blank')
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrData)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const printQRCode = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${cropType || 'Crop'} #${tokenId}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
                background: white;
                margin: 0;
              }
              .qr-container {
                display: inline-block;
                border: 3px solid #059669;
                border-radius: 15px;
                padding: 30px;
                background: #f0fdf4;
                margin: 20px;
              }
              .qr-code {
                margin: 20px 0;
                background: white;
                padding: 10px;
                border-radius: 10px;
              }
              .title {
                color: #059669;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .subtitle {
                color: #065f46;
                font-size: 18px;
                margin: 10px 0;
              }
              .instructions {
                margin-top: 20px;
                font-size: 14px;
                color: #374151;
                max-width: 300px;
                margin-left: auto;
                margin-right: auto;
              }
              .url {
                font-size: 12px;
                color: #6b7280;
                word-break: break-all;
                margin-top: 10px;
              }
              @media print {
                body { margin: 0; }
                .qr-container { margin: 10px; }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="title">🌱 AgriDAO Product</div>
              <div class="subtitle">${cropType || 'Crop'} #${tokenId}</div>
              <div class="qr-code">
                <img src="${qrImageUrl}" alt="QR Code" style="max-width: 200px;" crossorigin="anonymous" />
              </div>
              <div class="instructions">
                <strong>Scan to discover the story behind this crop</strong><br>
                Connect your wallet to earn GREEN points!
              </div>
              <div class="url">${qrData}</div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      
      // Wait for image to load before printing
      setTimeout(() => {
        printWindow.print()
      }, 1000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-white relative max-h-[90vh] overflow-y-auto">
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute z-10 top-4 right-4 text-slate-500 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        <CardHeader className="pb-4 text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-xl font-bold text-slate-800">
            <QrCode className="w-5 h-5 text-emerald-600" />
            Product QR Code
          </CardTitle>
          <p className="text-sm text-slate-600">
            {cropType ? `${cropType} #${tokenId}` : `Product #${tokenId}`}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* QR Code Display */}
          <div className="text-center">
            <div className="inline-block p-4 bg-white border-2 rounded-lg shadow-sm border-emerald-200">
              <Image 
                src={qrImageUrl}
                alt="QR Code"
                width={200}
                height={200}
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.src = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(qrData)}`
                }}
              />
            </div>
          </div>

          {/* URL Display */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Scan URL:
            </label>
            <div className="flex gap-2">
              <Input
                value={qrData}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-green-600">✅ Copied to clipboard!</p>
            )}
          </div>

          {/* Custom Domain Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Your Domain:
            </label>
            <Input
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="yourapp.com"
              className="text-sm"
            />
            <p className="text-xs text-slate-500">
              Update this to match your deployed app domain. For development, use localhost:3000
            </p>
          </div>

          {/* QR Code Preview URL */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              QR Code Image URL:
            </label>
            <div className="flex gap-2">
              <Input
                value={qrImageUrl}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                onClick={() => window.open(qrImageUrl, '_blank')}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={downloadQRCode}
              className="text-white bg-emerald-600 hover:bg-emerald-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PNG
            </Button>
            
            <Button
              onClick={printQRCode}
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print QR Code
            </Button>
          </div>

          {/* QR Service Info */}
          <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
            <p className="text-xs text-blue-800">
              💡 <strong>QR Service:</strong> Generated using QR Server API. The QR code will work perfectly for scanning and includes your crop&apos;s tracking URL.
            </p>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-lg bg-emerald-50">
            <h4 className="mb-2 font-medium text-emerald-800">📋 How to Use:</h4>
            <ol className="space-y-1 text-sm text-emerald-700">
              <li>1. Download or print this QR code</li>
              <li>2. Attach it to your product packaging</li>
              <li>3. Consumers can scan it to see your crop&apos;s story</li>
              <li>4. You earn reputation points for each scan!</li>
              <li>5. Consumers earn GREEN points for scanning!</li>
            </ol>
          </div>

          {/* Benefits */}
          <div className="p-4 rounded-lg bg-yellow-50">
            <h4 className="mb-2 font-medium text-yellow-800">🎯 Benefits:</h4>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>• Direct connection with consumers</li>
              <li>• Increased trust through transparency</li>
              <li>• Higher prices for traceable products</li>
              <li>• Build your farm&apos;s reputation</li>
              <li>• Real-time engagement tracking</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
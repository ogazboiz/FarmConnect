// src/components/scanner/QRScanner.tsx
"use client"

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, CameraOff, Loader2, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

// Import QR Scanner
// You need to install: npm install qr-scanner
import QrScannerLib from 'qr-scanner'

interface QRScannerProps {
  onScan?: (result: string) => void
  onClose?: () => void
  isOpen?: boolean
}

export function QRScanner({ onScan, onClose, isOpen = true }: QRScannerProps) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const qrScannerRef = useRef<QrScannerLib | null>(null)
  const isInitializingRef = useRef(false)
  
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(() => {
    if (!isOpen || !videoRef.current) return

    const videoElement = videoRef.current // Capture the current value
    
    const initializeScanner = async () => {
      // Prevent multiple simultaneous initializations
      if (isInitializingRef.current) return
      isInitializingRef.current = true

      try {
        setError(null)
        setIsScanning(false)

        // Stop any existing scanner
        if (qrScannerRef.current) {
          qrScannerRef.current.stop()
          qrScannerRef.current.destroy()
          qrScannerRef.current = null
        }

        // Check if camera is supported
        let hasCamera = false
        try {
          hasCamera = await QrScannerLib.hasCamera()
        } catch (cameraCheckError) {
          console.warn('Camera check failed:', cameraCheckError)
          hasCamera = false
        }
        
        if (!hasCamera) {
          setError('No camera found on this device')
          return
        }

        // Check if video element is available
        if (!videoElement) {
          setError('Video element not available')
          return
        }

        // Create QR Scanner instance
        const qrScanner = new QrScannerLib(
          videoElement,
          (result) => handleScanResult(result.data),
          {
            onDecodeError: (err) => {
              // Don't show decode errors as they're normal when scanning
              console.log('Decode attempt:', typeof err === 'string' ? err : err.message)
            },
            preferredCamera: 'environment', // Use back camera
            highlightScanRegion: true,
            highlightCodeOutline: true,
            returnDetailedScanResult: true,
          }
        )

        qrScannerRef.current = qrScanner
        setHasPermission(true)

        // Start scanning
        await qrScanner.start()
        setIsScanning(true)

      } catch (err) {
        console.error('QR Scanner initialization error:', err)
        
        const errorMessage = err instanceof Error ? err.message : String(err)
        const errorName = err instanceof Error ? err.name : 'UnknownError'
        
        if (errorName === 'NotAllowedError') {
          setError('Camera permission denied. Please allow camera access and try again.')
          setHasPermission(false)
        } else if (errorName === 'NotFoundError') {
          setError('No camera found on this device')
        } else if (errorName === 'AbortError') {
          console.log('Scanner initialization was aborted - this is normal when switching scanners')
          return
        } else {
          setError(`Scanner error: ${errorMessage}`)
        }
        
        setIsScanning(false)
      } finally {
        isInitializingRef.current = false
      }
    }

    if (isOpen) {
      initializeScanner()
    }

    // Cleanup function
    return () => {
      isInitializingRef.current = false
      
      if (qrScannerRef.current) {
        qrScannerRef.current.stop()
        qrScannerRef.current.destroy()
        qrScannerRef.current = null
      }
    }
  }, [isOpen])

  const handleScanResult = (data: string) => {
    console.log('🔍 RAW QR SCAN DATA:', data)
    
    // Stop scanner immediately to prevent multiple scans
    if (qrScannerRef.current) {
      qrScannerRef.current.stop()
    }
    
    // Show what was scanned for debugging
    toast.success(`📱 QR Code detected: ${data.substring(0, 50)}${data.length > 50 ? '...' : ''}`)
    
    // Extract token ID from various QR code formats
    let tokenId: string | null = null
    
    try {
      console.log('🔍 Processing QR data:', {
        original: data,
        trimmed: data.trim(),
        isNumeric: /^\d+$/.test(data.trim())
      })
      
      // Format 1: Full URL like "https://yourapp.com/scan/123" or "yourapp.com/scan/123"
      const urlMatch = data.match(/\/scan\/(\d+)/)
      if (urlMatch) {
        tokenId = urlMatch[1]
        console.log('✅ Matched URL format, token:', tokenId)
      }
      
      // Format 2: Just the token ID like "123"
      else if (/^\d+$/.test(data.trim())) {
        tokenId = data.trim()
        console.log('✅ Matched numeric format, token:', tokenId)
      }
      
      // Format 3: JSON format like {"tokenId": "123"}
      else {
        try {
          const parsed = JSON.parse(data)
          if (parsed.tokenId) {
            tokenId = parsed.tokenId.toString()
            console.log('✅ Matched JSON format, token:', tokenId)
          }
        } catch {
          console.log('❌ Not JSON format')
        }
      }
      
      // Format 4: Any URL with numbers - extract any number from the URL
      if (!tokenId) {
        const anyNumberMatch = data.match(/(\d+)/)
        if (anyNumberMatch) {
          tokenId = anyNumberMatch[1]
          console.log('✅ Extracted number from URL, token:', tokenId)
        }
      }

      console.log('🎯 Final extracted token ID:', tokenId)

      if (tokenId) {
        toast.success(`🎯 QR Code scanned successfully! Token ID: ${tokenId}`)
        console.log('🎯 Final extracted token ID:', tokenId)
        
        // Always call the onScan handler if provided (parent handles navigation)
        if (onScan) {
          console.log('📞 Calling onScan handler with:', tokenId)
          onScan(tokenId)
        } else {
          // Only navigate directly if no onScan handler is provided
          console.log('🔄 Using router.push to navigate')
          router.push(`/scan/${tokenId}`)
        }
        
        // Close scanner
        if (onClose) {
          console.log('❌ Closing scanner')
          onClose()
        }
      } else {
        console.log('❌ No valid token ID found')
        setError(`No valid product ID found in QR code: "${data}"`)
        toast.error(`No valid product ID found in QR code. Scanned: "${data.substring(0, 30)}..."`)
        setTimeout(() => {
          setError(null)
          // Restart scanner after error
          if (qrScannerRef.current && isOpen) {
            qrScannerRef.current.start()
          }
        }, 5000)
      }
    } catch (err) {
      console.error('Error processing QR code:', err)
      setError('Failed to process QR code')
      toast.error('Failed to process QR code. Please try again.')
      setTimeout(() => {
        setError(null)
        // Restart scanner after error
        if (qrScannerRef.current && isOpen) {
          qrScannerRef.current.start()
        }
      }, 3000)
    }
  }

  const handleClose = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop()
      qrScannerRef.current.destroy()
      qrScannerRef.current = null
    }
    
    if (onClose) {
      onClose()
    }
  }

  const requestCameraPermission = async () => {
    try {
      setError(null)
      toast.loading('Requesting camera permission...')
      
      // Test camera access
      const testStream = await navigator.mediaDevices.getUserMedia({ video: true })
      testStream.getTracks().forEach(track => track.stop())
      
      setHasPermission(true)
      toast.dismiss()
      toast.success('Camera permission granted! 📸')
      
      // Reinitialize scanner
      if (isOpen) {
        window.location.reload()
      }
    } catch (err) {
      toast.dismiss()
      setError('Camera permission is required to scan QR codes')
      setHasPermission(false)
      toast.error('Camera permission denied. Please allow camera access to scan QR codes.')
    }
  }

  // Manual scan simulation for testing (remove in production)
  const handleManualTest = () => {
    const testData = prompt('Enter test QR data (URL or token ID):')
    if (testData) {
      handleScanResult(testData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white relative">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-slate-500 hover:text-slate-700"
        >
          <X className="w-4 h-4" />
        </Button>

        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
            <Camera className="w-5 h-5" />
            Scan QR Code
          </CardTitle>
          <p className="text-slate-600 text-sm">
            Point your camera at the QR code on the product packaging
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Camera Permission Error */}
          {hasPermission === false && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <CameraOff className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Camera Access Required</h3>
                <p className="text-slate-600 text-sm mb-4">
                  We need camera permission to scan QR codes
                </p>
                <Button onClick={requestCameraPermission} className="bg-emerald-600 hover:bg-emerald-700">
                  Grant Camera Access
                </Button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Scanner Video */}
          {hasPermission !== false && (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full rounded-lg"
                style={{ maxHeight: '300px' }}
                playsInline
                muted
                autoPlay
              />
              
              {/* Loading Overlay */}
              {!isScanning && !error && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm">Starting QR scanner...</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          {isScanning && (
            <div className="bg-emerald-50 p-3 rounded-lg">
              <p className="text-emerald-800 text-sm text-center">
                📱 Position the QR code within the camera view
              </p>
              <p className="text-emerald-600 text-xs text-center mt-1">
                The scanner will automatically detect and process QR codes
              </p>
            </div>
          )}

          {/* Development Testing Button */}
          {process.env.NODE_ENV === 'development' && (
            <div className="border-t pt-4">
              <Button
                onClick={handleManualTest}
                variant="outline"
                className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50"
              >
                🧪 Test with Manual Input (Dev Only)
              </Button>
            </div>
          )}

          {/* Manual Input Alternative */}
          <div className="border-t pt-4">
            <p className="text-slate-600 text-sm text-center mb-2">
              Having trouble scanning?
            </p>
            <Button
              variant="outline"
              onClick={() => {
                handleClose()
                router.push('/track')
              }}
              className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              Enter Product ID Manually
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
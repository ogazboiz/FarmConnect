// src/components/scanner/QRScanner.tsx
"use client"

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, CameraOff, Loader2, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface QRScannerProps {
  onScan?: (result: string) => void
  onClose?: () => void
  isOpen?: boolean
}

export function QRScanner({ onScan, onClose, isOpen = true }: QRScannerProps) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializingRef = useRef(false)
  
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const initializeCamera = async () => {
      // Prevent multiple simultaneous initializations
      if (isInitializingRef.current) return
      isInitializingRef.current = true

      try {
        setError(null)
        setIsScanning(false)

        // Stop any existing stream first
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }

        // Clear any existing scan interval
        if (scanIntervalRef.current) {
          clearInterval(scanIntervalRef.current)
          scanIntervalRef.current = null
        }

        // Check if getUserMedia is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError('Camera not supported on this device')
          return
        }

        // Request camera permission
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        })

        streamRef.current = mediaStream
        setHasPermission(true)

        if (videoRef.current && isOpen) {
          videoRef.current.srcObject = mediaStream
          await videoRef.current.play()
          setIsScanning(true)
          
          // Start scanning after video is playing
          startScanning()
        }

      } catch (err) {
        console.error('Camera initialization error:', err)
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            setError('Camera permission denied. Please allow camera access and try again.')
            setHasPermission(false)
          } else if (err.name === 'NotFoundError') {
            setError('No camera found on this device')
          } else if (err.name === 'AbortError') {
            console.log('Camera initialization was aborted - this is normal when switching cameras')
            return // Don't show error for abort
          } else {
            setError(`Camera error: ${err.message}`)
          }
        } else {
          setError('Failed to initialize camera')
        }
        setIsScanning(false)
      } finally {
        isInitializingRef.current = false
      }
    }

    if (isOpen) {
      initializeCamera()
    }

    // Cleanup function
    return () => {
      isInitializingRef.current = false
      
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
        scanIntervalRef.current = null
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [isOpen])

  const startScanning = () => {
    if (!videoRef.current || scanIntervalRef.current) return

    const video = videoRef.current
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    scanIntervalRef.current = setInterval(() => {
      if (!isOpen || !video || !context || video.videoWidth === 0 || video.videoHeight === 0) {
        return
      }

      try {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        // For a real implementation, you would use a QR code library here
        // This is a placeholder - you'll need to install qr-scanner or jsQR
        // Example with jsQR:
        // const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        // const code = jsQR(imageData.data, imageData.width, imageData.height)
        // if (code) {
        //   handleScanResult(code.data)
        // }
      } catch (err) {
        console.error('Scanning error:', err)
      }
    }, 500)
  }

  const stopScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
  }

  const handleScanResult = (data: string) => {
    console.log('Scanned data:', data)
    
    // Stop scanning immediately to prevent multiple scans
    stopScanning()
    
    // Extract token ID from various QR code formats
    let tokenId: string | null = null
    
    try {
      // Format 1: Full URL like "https://yourapp.com/scan/123"
      const urlMatch = data.match(/\/scan\/(\d+)/)
      if (urlMatch) {
        tokenId = urlMatch[1]
      }
      
      // Format 2: Just the token ID like "123"
      else if (/^\d+$/.test(data.trim())) {
        tokenId = data.trim()
      }
      
      // Format 3: JSON format like {"tokenId": "123"}
      else {
        try {
          const parsed = JSON.parse(data)
          if (parsed.tokenId) {
            tokenId = parsed.tokenId.toString()
          }
        } catch {
          // Not JSON, continue with other formats
        }
      }

      if (tokenId) {
        // Stop camera
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
        
        toast.success(`🎯 QR Code scanned successfully! Token ID: ${tokenId}`)
        
        // Call custom handler or navigate to scan page
        if (onScan) {
          onScan(tokenId)
        } else {
          router.push(`/scan/${tokenId}`)
        }
        
        // Close scanner
        if (onClose) {
          onClose()
        }
      } else {
        setError('Invalid QR code format. Please scan a valid product QR code.')
        toast.error('Invalid QR code format. Please scan a valid product QR code.')
        setTimeout(() => {
          setError(null)
          // Restart scanning after error
          if (isOpen && isScanning) {
            startScanning()
          }
        }, 3000)
      }
    } catch (err) {
      console.error('Error processing QR code:', err)
      setError('Failed to process QR code')
      toast.error('Failed to process QR code. Please try again.')
      setTimeout(() => {
        setError(null)
        // Restart scanning after error
        if (isOpen && isScanning) {
          startScanning()
        }
      }, 3000)
    }
  }

  const handleClose = () => {
    stopScanning()
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (onClose) {
      onClose()
    }
  }

  const requestCameraPermission = async () => {
    try {
      setError(null)
      toast.loading('Requesting camera permission...')
      const testStream = await navigator.mediaDevices.getUserMedia({ video: true })
      testStream.getTracks().forEach(track => track.stop()) // Stop the test stream
      setHasPermission(true)
      toast.dismiss()
      toast.success('Camera permission granted! 📸')
      // Don't reload, just reinitialize
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
    const testTokenId = prompt('Enter token ID for testing:')
    if (testTokenId) {
      handleScanResult(testTokenId)
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
                    <p className="text-sm">Starting camera...</p>
                  </div>
                </div>
              )}

              {/* Scan Region Indicator */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-emerald-500 rounded-lg">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-500 rounded-br-lg"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          {isScanning && (
            <div className="bg-emerald-50 p-3 rounded-lg">
              <p className="text-emerald-800 text-sm text-center">
                📱 Position the QR code within the frame
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
                🧪 Test with Token ID (Dev Only)
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
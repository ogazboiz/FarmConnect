// src/components/scanner/QRScanner.tsx
"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
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
  const abortControllerRef = useRef<AbortController | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Cleanup function to stop camera and abort operations
  const cleanupCamera = useCallback(() => {
    // Abort any ongoing operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    // Stop video stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsScanning(false)
  }, [stream])

  useEffect(() => {
    if (!isOpen) {
      cleanupCamera()
      return
    }

    if (!videoRef.current) return

    // Create new AbortController for this effect
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    const initializeCamera = async () => {
      try {
        // Check if operation was aborted
        if (abortController.signal.aborted) return

        setError(null)
        setIsScanning(false)

        // Check if getUserMedia is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (!abortController.signal.aborted) {
            setError('Camera not supported on this device')
          }
          return
        }

        // Request camera permission
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' }, // Prefer back camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        })

        // Check if operation was aborted after getting stream
        if (abortController.signal.aborted) {
          mediaStream.getTracks().forEach(track => track.stop())
          return
        }

        setStream(mediaStream)
        setHasPermission(true)

        if (videoRef.current && !abortController.signal.aborted) {
          videoRef.current.srcObject = mediaStream
          
          // Handle video play promise properly
          try {
            await videoRef.current.play()
            if (!abortController.signal.aborted) {
              setIsScanning(true)
            }
          } catch (playError) {
            // Handle AbortError and other play errors
            if (playError instanceof Error && playError.name === 'AbortError') {
              console.log('Video play aborted (expected in React Strict Mode)')
            } else {
              console.error('Video play error:', playError)
              if (!abortController.signal.aborted) {
                throw playError
              }
            }
          }
        }

      } catch (err) {
        // Don't show errors if operation was aborted
        if (abortController.signal.aborted) return

        console.error('Camera initialization error:', err)
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            setError('Camera permission denied. Please allow camera access and try again.')
            toast.error('Camera permission denied. Please allow camera access and try again.')
            setTimeout(() => setError(null), 3000)
            setHasPermission(false)
          } else if (err.name === 'NotFoundError') {
            setError('No camera found on this device')
            toast.error('No camera found on this device. Please connect a camera and try again.')
            setTimeout(() => setError(null), 3000)
          } else {
            setError(`Camera error: ${err.message}`)
          }
        } else {
          setError('Failed to initialize camera')
          toast.error('Failed to initialize camera. Please try again.')
          setTimeout(() => setError(null), 3000)
        }
        setIsScanning(false)
      }
    }

    initializeCamera()

    // Cleanup function
    return () => {
      cleanupCamera()
    }
  }, [isOpen, cleanupCamera]) // Include cleanupCamera in dependencies

  // Simple QR code detection using canvas (basic implementation)
  useEffect(() => {
    if (!isScanning || !videoRef.current) return

    const video = videoRef.current
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    const scanInterval = setInterval(() => {
      if (video.videoWidth > 0 && video.videoHeight > 0 && context) {
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
      }
    }, 500)

    return () => clearInterval(scanInterval)
  }, [isScanning])

  const handleScanResult = (data: string) => {
    console.log('Scanned data:', data)
    
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
        cleanupCamera()
        
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
        setTimeout(() => setError(null), 3000)
      }
    } catch (err) {
      console.error('Error processing QR code:', err)
      setError('Failed to process QR code')
      toast.error('Failed to process QR code. Please try again.')
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleClose = () => {
    cleanupCamera()
    if (onClose) {
      onClose()
    }
  }

  const requestCameraPermission = async () => {
    try {
      setError(null)
      toast.loading('Requesting camera permission...')
      
      // Clean up any existing streams first
      cleanupCamera()
      
      const testStream = await navigator.mediaDevices.getUserMedia({ video: true })
      testStream.getTracks().forEach(track => track.stop()) // Stop the test stream
      
      setHasPermission(true)
      toast.success('Camera permission granted! 📸')
      
      // Force re-initialization instead of reload
      setTimeout(() => {
        setHasPermission(null) // Reset to trigger re-initialization
      }, 100)
    } catch {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <Card className="relative w-full max-w-md bg-white">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute z-10 top-4 right-4 text-slate-500 hover:text-slate-700"
        >
          <X className="w-4 h-4" />
        </Button>

        <CardHeader className="pb-4 text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-xl font-bold text-slate-800">
            <Camera className="w-5 h-5" />
            Scan QR Code
          </CardTitle>
          <p className="text-sm text-slate-600">
            Point your camera at the QR code on the product packaging
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Camera Permission Error */}
          {hasPermission === false && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
                <CameraOff className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-slate-800">Camera Access Required</h3>
                <p className="mb-4 text-sm text-slate-600">
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
            <div className="p-3 border border-red-200 rounded-lg bg-red-50">
              <p className="text-sm text-red-700">{error}</p>
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
              />
              
              {/* Loading Overlay */}
              {!isScanning && !error && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                  <div className="text-center text-white">
                    <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                    <p className="text-sm">Starting camera...</p>
                  </div>
                </div>
              )}

              {/* Scan Region Indicator */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute w-48 h-48 transform -translate-x-1/2 -translate-y-1/2 border-2 rounded-lg top-1/2 left-1/2 border-emerald-500">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 rounded-tl-lg border-emerald-500"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 rounded-tr-lg border-emerald-500"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 rounded-bl-lg border-emerald-500"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 rounded-br-lg border-emerald-500"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          {isScanning && (
            <div className="p-3 rounded-lg bg-emerald-50">
              <p className="text-sm text-center text-emerald-800">
                📱 Position the QR code within the frame
              </p>
            </div>
          )}

          {/* Development Testing Button */}
          {process.env.NODE_ENV === 'development' && (
            <div className="pt-4 border-t">
              <Button
                onClick={handleManualTest}
                variant="outline"
                className="w-full text-yellow-700 border-yellow-300 hover:bg-yellow-50"
              >
                🧪 Test with Token ID (Dev Only)
              </Button>
            </div>
          )}

          {/* Manual Input Alternative */}
          <div className="pt-4 border-t">
            <p className="mb-2 text-sm text-center text-slate-600">
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
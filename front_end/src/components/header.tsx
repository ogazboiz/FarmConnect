"use client"

import { Button } from "@/components/ui/button"
import { Leaf, Wallet, ChevronDown, ExternalLink, LogOut, Settings, Menu, X, Coins } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { useAppKitAccount, useAppKit } from "@reown/appkit/react"
import { useDisconnect } from "@reown/appkit/react"
import { useWalletInfo } from "@reown/appkit/react"
import { useAccount, useDisconnect as useWagmiDisconnect } from "wagmi"
import { useFarmTokenBalance } from "@/hooks/useAgriDAO"

interface HeaderProps {
  onWalletConnect?: () => void
}

export function Header({ onWalletConnect }: HeaderProps) {
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  // AppKit hooks
  const { address: appkitAddress, isConnected: appkitIsConnected } = useAppKitAccount()
  const { open, close } = useAppKit()
  const { walletInfo } = useWalletInfo()
  const { disconnect: appkitDisconnect } = useDisconnect()

  // Wagmi hooks
  const { address: wagmiAddress, isConnected: wagmiIsConnected, connector } = useAccount()
  const { disconnect: wagmiDisconnect } = useWagmiDisconnect()

  const address = appkitAddress || wagmiAddress
  const isConnected = appkitIsConnected || wagmiIsConnected

  // Farm token balance
  const farmBalance = useFarmTokenBalance(address)

  useEffect(() => {
    if (isConnected && pathname !== "/dashboard") {
      router.push("/dashboard")
    }
  }, [isConnected, pathname, router])

  useEffect(() => setMounted(true), [])

  const truncateAddress = (addr: string | undefined) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ""

  const getWalletIcon = () => {
    const sanitizeImageUrl = (url: string) => {
      if (!url) return null

      try {
        const trimmedUrl = url.trim()

        if (trimmedUrl.startsWith('data:')) {
          return trimmedUrl
        }

        new URL(trimmedUrl)
        return trimmedUrl
      } catch {
        console.warn('Invalid wallet icon URL:', url)
        return null
      }
    }

    if (walletInfo?.icon) {
      const sanitizedUrl = sanitizeImageUrl(walletInfo.icon)
      if (sanitizedUrl) {
        return (
          <Image
            src={sanitizedUrl}
            alt={walletInfo.name || "Wallet"}
            width={20}
            height={20}
            className="w-5 h-5 rounded-full"
            onError={(e) => {
              (e.currentTarget.style.display = "none")
              console.warn('Failed to load wallet icon:', sanitizedUrl)
            }}
            unoptimized
          />
        )
      }
    }

    if (connector?.icon) {
      const sanitizedUrl = sanitizeImageUrl(connector.icon)
      if (sanitizedUrl) {
        return (
          <Image
            src={sanitizedUrl}
            alt={connector.name || "Wallet"}
            width={20}
            height={20}
            className="w-5 h-5 rounded-full"
            onError={(e) => {
              (e.currentTarget.style.display = "none")
              console.warn('Failed to load connector icon:', sanitizedUrl)
            }}
            unoptimized
          />
        )
      }
    }

    return <Wallet className="w-5 h-5 text-green-600" />
  }

  const getWalletName = () => walletInfo?.name || connector?.name || "Connected Wallet"

  const handleConnect = async () => {
    try {
      if (onWalletConnect) {
        onWalletConnect()
      }
      await open()
    } catch (error: unknown) {
      console.error("Connection error:", error instanceof Error ? error.message : String(error))
    }
  }

  const handleDisconnect = () => {
    console.log("Disconnect initiated")
    setIsDropdownOpen(false)
    try {
      if (appkitIsConnected) {
        console.log("Disconnecting AppKit")
        appkitDisconnect()
      }
      if (wagmiIsConnected) {
        console.log("Disconnecting Wagmi")
        wagmiDisconnect()
      }
      close()
      router.push("/")
    } catch (error: unknown) {
      console.error("Disconnect error:", error instanceof Error ? error.message : String(error))
    }
  }

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest("[data-menu-toggle]")
      ) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-green-200 py-4 px-4 md:hidden"
          >
            <nav className="flex flex-col gap-4">
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
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Farm Balance Display */}
          {mounted && isConnected && (
            <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
              <Coins className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                {farmBalance.isLoading ? (
                  "Loading..."
                ) : (
                  `${farmBalance.formatted ? parseFloat(farmBalance.formatted).toFixed(2) : '0.00'} FARM`
                )}
              </span>
            </div>
          )}

          {!mounted ? (
            <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          ) : isConnected ? (
            <div className="relative" ref={dropdownRef}>
              <Button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                variant="outline"
                className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400"
              >
                <span className="hidden sm:inline mr-2">{truncateAddress(address)}</span>
                <span className="sm:hidden mr-2">{address ? `${address.slice(0, 4)}...` : ""}</span>
                {getWalletIcon()}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-green-200 z-50">
                  <div className="p-4 border-b border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      {getWalletIcon()}
                      <div>
                        <p className="font-medium text-green-800">{getWalletName()}</p>
                        <p className="text-sm text-green-600">{truncateAddress(address)}</p>
                      </div>
                    </div>
                    
                    {/* Farm Balance in Dropdown */}
                    <div className="bg-green-50 rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">FARM Balance</span>
                        </div>
                        <span className="text-sm font-bold text-green-800">
                          {farmBalance.isLoading ? (
                            "Loading..."
                          ) : (
                            `${farmBalance.formatted ? parseFloat(farmBalance.formatted).toFixed(4) : '0.0000'}`
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <a
                      href={`https://mantlescan.xyz/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 text-green-700 hover:bg-green-50 rounded-md transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Mantle Explorer
                    </a>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-green-700 hover:bg-green-50 rounded-md transition-colors">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={handleDisconnect}
                      className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={handleConnect}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          )}

          <button
            className="md:hidden text-green-700 hover:text-green-800 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-menu-toggle
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}
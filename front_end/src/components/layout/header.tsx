"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Leaf, Wallet, Bell, User, Menu, X, ChevronDown, ExternalLink, LogOut, Settings, Coins } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAppKitAccount, useAppKit } from "@reown/appkit/react"
import { useDisconnect } from "@reown/appkit/react"
import { useWalletInfo } from "@reown/appkit/react"
import { useAccount, useDisconnect as useWagmiDisconnect } from "wagmi"
import { useFarmTokenBalance, useGreenPointsBalance } from "@/hooks/useAgriDAO"

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

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "How It Works", href: "/how-it-works" },
  ]

  const dashboardNavigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Crop Tracking", href: "/dashboard/crops" },
    { name: "Cooperative", href: "/dashboard/cooperative" },
    { name: "Bounties", href: "/dashboard/bounties" },
  ]

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

  // Get real balances
  const farmBalance = useFarmTokenBalance(address)
  const greenBalance = useGreenPointsBalance(address)

  // Determine which navigation to show based on ACTUAL connection state
  const currentNav = isConnected ? dashboardNavigation : navigation

  useEffect(() => {
    if (isConnected && !pathname.startsWith("/dashboard")) {
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-lg ">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-green-400 to-lime-400 rounded-xl flex items-center justify-center shadow-lg glow-border">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-amber-600 bg-clip-text text-transparent">
              AgriChain
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {currentNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-emerald-400 ${
                  pathname === item.href
                    ? "text-emerald-400 border-b-2 border-emerald-400 pb-1 glow-text"
                    : "text-slate-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {!mounted ? (
              <Button className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            ) : isConnected ? (
              <>
                {/* Real FARM Balance */}
                <div className="hidden sm:flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-amber-900/50 to-yellow-900/50 text-amber-300 border-amber-500/30 backdrop-blur-sm p-2 rounded-lg"
                  >
                    <Coins className="w-4 h-4 mr-1" />
                    {farmBalance.isLoading ? (
                      "Loading..."
                    ) : farmBalance.error ? (
                      "Error"
                    ) : (
                      `${farmBalance.formatted ? parseFloat(farmBalance.formatted).toFixed(2) : '0.00'} FARM`
                    )}
                  </Badge>
                  
                  {/* GREEN Balance */}
                  <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-300 border-green-500/30 backdrop-blur-sm p-2 rounded-lg"
                  >
                    <Leaf className="w-4 h-4 mr-1" />
                    {greenBalance.isLoading ? (
                      "Loading..."
                    ) : greenBalance.error ? (
                      "Error"
                    ) : (
                      `${greenBalance.formatted ? parseFloat(greenBalance.formatted).toFixed(0) : '0'} GREEN`
                    )}
                  </Badge>
                </div>

                <Button variant="ghost" size="icon" className="text-slate-600 hover:text-emerald-600 bg-white/95 backdrop-blur-sm">
                  <Bell className="w-5 h-5" />
                </Button>

                <div className="relative" ref={dropdownRef}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-600 hover:text-emerald-600 bg-white/95 backdrop-blur-sm"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <User className="w-5 h-5" />
                  </Button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-green-200 z-50">
                      <div className="p-4 border-b border-green-200">
                        <div className="flex items-center gap-3 mb-3">
                          {getWalletIcon()}
                          <div>
                            <p className="font-medium text-green-800">{getWalletName()}</p>
                            <p className="text-sm text-green-600">{truncateAddress(address)}</p>
                          </div>
                        </div>
                        
                        {/* Detailed Balance in Dropdown */}
                        <div className="space-y-2">
                          <div className="bg-amber-50 rounded-md p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Coins className="w-4 h-4 text-amber-600" />
                                <span className="text-sm font-medium text-amber-700">FARM Balance</span>
                              </div>
                              <span className="text-sm font-bold text-amber-800">
                                {farmBalance.isLoading ? (
                                  "Loading..."
                                ) : farmBalance.error ? (
                                  "Error loading"
                                ) : (
                                  `${farmBalance.formatted ? parseFloat(farmBalance.formatted).toFixed(4) : '0.0000'}`
                                )}
                              </span>
                            </div>
                          </div>
                          
                          <div className="bg-green-50 rounded-md p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Leaf className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">GREEN Points</span>
                              </div>
                              <span className="text-sm font-bold text-green-800">
                                {greenBalance.isLoading ? (
                                  "Loading..."
                                ) : greenBalance.error ? (
                                  "Error loading"
                                ) : (
                                  `${greenBalance.formatted ? parseFloat(greenBalance.formatted).toFixed(0) : '0'}`
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-green-700 hover:bg-green-50 rounded-md transition-colors">
                          <User className="w-4 h-4" />
                          Profile
                        </button>
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
                          Disconnect Wallet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button
                onClick={handleConnect}
                className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-emerald-500/20 pt-4 bg-slate-800/50 backdrop-blur-sm rounded-lg mx-4">
            <div className="flex flex-col gap-2">
              {currentNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Balance Display */}
              {isConnected && (
                <div className="mt-4 pt-4 border-t border-emerald-500/20">
                  <div className="space-y-2">
                    <div className="bg-amber-50 rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-700">FARM</span>
                        </div>
                        <span className="text-sm font-bold text-amber-800">
                          {farmBalance.isLoading ? "Loading..." : farmBalance.formatted ? parseFloat(farmBalance.formatted).toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">GREEN</span>
                        </div>
                        <span className="text-sm font-bold text-green-800">
                          {greenBalance.isLoading ? "Loading..." : greenBalance.formatted ? parseFloat(greenBalance.formatted).toFixed(0) : '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
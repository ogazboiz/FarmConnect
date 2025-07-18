"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Leaf, Wallet, Bell, User, Menu, X, ChevronDown, ExternalLink, LogOut, Settings, Coins,
  ShoppingCart, QrCode, Target, Users, BarChart3
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useAppKitAccount, useAppKit } from "@reown/appkit/react"
import { useDisconnect } from "@reown/appkit/react"
import { useWalletInfo } from "@reown/appkit/react"
import { useAccount, useDisconnect as useWagmiDisconnect } from "wagmi"
import { useFarmTokenBalance, useGreenPointsBalance } from "@/hooks/useAgriDAO"
import { useGlobalRefresh } from "@/contexts/RefreshContext"

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

  // Navigation for non-connected users (public routes)
  const publicNavigation = [
    { name: "Home", href: "/" },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
    { name: "Track Product", href: "/track", icon: QrCode },
    { name: "Features", href: "/features" },
    { name: "How It Works", href: "/how-it-works" },
  ]

  // Navigation for connected users (dashboard routes)
  const dashboardNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Crop Tracking", href: "/dashboard/crops", icon: Leaf },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
    { name: "Cooperative", href: "/dashboard/cooperative", icon: Users },
    { name: "Bounties", href: "/dashboard/bounties", icon: Target },
  ]

  // Consumer-specific navigation for mobile dropdown
  const consumerRoutes = [
    { name: "Browse Marketplace", href: "/marketplace", icon: ShoppingCart },
    { name: "Track Product", href: "/track", icon: QrCode },
    { name: "My Rewards", href: "/rewards", icon: Target },
  ]

  // Farmer-specific navigation for mobile dropdown
  const farmerRoutes = [
    { name: "My Crops", href: "/dashboard/crops", icon: Leaf },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Generate QR Codes", href: "/qr-generator", icon: QrCode },
  ]

  // DAO-specific navigation for mobile dropdown
  const daoRoutes = [
    { name: "Governance", href: "/dao", icon: Users },
    { name: "Bounties", href: "/dashboard/bounties", icon: Target },
    { name: "Proposals", href: "/proposals", icon: BarChart3 },
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

  // Global refresh context
  const { refreshTrigger } = useGlobalRefresh()

  // Force refresh balances when global refresh is triggered
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('Header received global refresh trigger:', refreshTrigger)
      
      // Add a small delay for the header refresh to allow blockchain state to settle
      setTimeout(() => {
        console.log('Header executing balance refresh')
        if (farmBalance.refetch) {
          farmBalance.refetch()
        }
        if (greenBalance.refetch) {
          greenBalance.refetch()
        }
      }, 500) // 500ms delay for header refresh
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]) // Intentionally excluding balance objects to avoid infinite loops

  // Determine which navigation to show based on connection state and current path
  const getCurrentNav = () => {
    // If user is connected and on dashboard routes, show dashboard nav
    if (isConnected && pathname.startsWith("/dashboard")) {
      return dashboardNavigation
    }
    // For public routes or non-connected users, show public nav (including marketplace)
    return publicNavigation
  }

  const currentNav = getCurrentNav()

  // Don't auto-redirect to dashboard if user is browsing public routes
  useEffect(() => {
    // Only redirect to dashboard if user connects while on landing pages
    if (isConnected && (pathname === "/" || pathname === "/features" || pathname === "/how-it-works")) {
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
          <nav className="hidden lg:flex items-center gap-6">
            {/* Always show marketplace and track for consumers */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-slate-300 hover:text-emerald-400 transition-colors">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Consumer
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-white/95 backdrop-blur-sm">
                {consumerRoutes.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link href={item.href} className="flex items-center cursor-pointer">
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Farmer routes - show if connected */}
            {isConnected && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-slate-300 hover:text-emerald-400 transition-colors">
                    <Leaf className="w-4 h-4 mr-2" />
                    Farmer
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-white/95 backdrop-blur-sm">
                  {farmerRoutes.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href} className="flex items-center cursor-pointer">
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* DAO routes - show if connected */}
            {isConnected && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-slate-300 hover:text-emerald-400 transition-colors">
                    <Users className="w-4 h-4 mr-2" />
                    DAO
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-white/95 backdrop-blur-sm">
                  {daoRoutes.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href} className="flex items-center cursor-pointer">
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Show remaining navigation items */}
            {currentNav.filter(item => !['Marketplace', 'Track Product'].includes(item.name)).map((item) => (
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
                        <Link
                          href="/rewards"
                          className="w-full flex items-center gap-3 px-3 py-2 text-green-700 hover:bg-green-50 rounded-md transition-colors"
                        >
                          <Target className="w-4 h-4" />
                          My Rewards
                        </Link>
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
              data-menu-toggle="true"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav ref={mobileMenuRef} className="md:hidden mt-4 pb-4 border-t border-emerald-500/20 pt-4 bg-slate-800/50 backdrop-blur-sm rounded-lg mx-4">
            <div className="flex flex-col gap-2">
              {/* Consumer Section */}
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">Consumer</h3>
                {consumerRoutes.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-slate-300 hover:bg-emerald-800/30 hover:text-emerald-300"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Farmer Section - only if connected */}
              {isConnected && (
                <div className="px-3 py-2 border-t border-emerald-500/20">
                  <h3 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">Farmer</h3>
                  {farmerRoutes.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-slate-300 hover:bg-emerald-800/30 hover:text-emerald-300"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* DAO Section - only if connected */}
              {isConnected && (
                <div className="px-3 py-2 border-t border-emerald-500/20">
                  <h3 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">DAO</h3>
                  {daoRoutes.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-slate-300 hover:bg-emerald-800/30 hover:text-emerald-300"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
              
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
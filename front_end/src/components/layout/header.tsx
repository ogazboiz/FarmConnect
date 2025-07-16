"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Leaf, Wallet, Bell, User, Menu, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface HeaderProps {
  isConnected?: boolean
  onWalletConnect?: () => void
}

export function Header({ isConnected = false, onWalletConnect }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

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

  const currentNav = isConnected ? dashboardNavigation : navigation

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
            {isConnected ? (
              <>
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-amber-900/50 to-yellow-900/50 text-amber-300 border-amber-500/30 hidden sm:flex backdrop-blur-sm p-2 rounded-lg"
                >
                  <Wallet className="w-4 h-4 mr-1 " />
                  1,250 $FARM
                </Badge>

                <Button variant="ghost" size="icon" className="text-slate-600 hover:text-emerald-600 bg-white/95 backdrop-blur-sm">
                  <Bell className="w-5 h-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-slate-600 hover:text-emerald-600 bg-white/95 backdrop-blur-sm">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Disconnect Wallet</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                onClick={onWalletConnect}
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
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

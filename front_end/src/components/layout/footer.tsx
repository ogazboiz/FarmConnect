"use client"

import Link from "next/link"
import { Leaf, Twitter, Github, DiscIcon as Discord, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-emerald-900 via-green-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
                AgriChain
              </span>
            </div>
            <p className="text-emerald-200 mb-6 leading-relaxed">
              Revolutionizing agriculture through blockchain technology, connecting farmers worldwide for sustainable
              and profitable farming.
            </p>
            <div className="flex gap-4">
              <div className="p-2 bg-emerald-800/50 rounded-lg hover:bg-emerald-700/50 cursor-pointer transition-colors">
                <Twitter className="w-5 h-5 text-emerald-300" />
              </div>
              <div className="p-2 bg-emerald-800/50 rounded-lg hover:bg-emerald-700/50 cursor-pointer transition-colors">
                <Github className="w-5 h-5 text-emerald-300" />
              </div>
              <div className="p-2 bg-emerald-800/50 rounded-lg hover:bg-emerald-700/50 cursor-pointer transition-colors">
                <Discord className="w-5 h-5 text-emerald-300" />
              </div>
              <div className="p-2 bg-emerald-800/50 rounded-lg hover:bg-emerald-700/50 cursor-pointer transition-colors">
                <Mail className="w-5 h-5 text-emerald-300" />
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-emerald-300">Platform</h3>
            <ul className="space-y-3">
              {[
                { name: "Crop Tracking", href: "/dashboard/crops" },
                { name: "Farmer DAOs", href: "/dashboard/cooperative" },
                { name: "Bounty System", href: "/dashboard/bounties" },
                { name: "Marketplace", href: "/marketplace" },
                { name: "Analytics", href: "/analytics" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-emerald-200 hover:text-emerald-100 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-emerald-300">Resources</h3>
            <ul className="space-y-3">
              {[
                { name: "Documentation", href: "/docs" },
                { name: "API Reference", href: "/api" },
                { name: "Smart Contracts", href: "/contracts" },
                { name: "Whitepaper", href: "/whitepaper" },
                { name: "Blog", href: "/blog" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-emerald-200 hover:text-emerald-100 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-emerald-300">Community</h3>
            <ul className="space-y-3">
              {[
                { name: "Discord Server", href: "#" },
                { name: "Telegram", href: "#" },
                { name: "Forum", href: "#" },
                { name: "Newsletter", href: "#" },
                { name: "Events", href: "#" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-emerald-200 hover:text-emerald-100 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-800/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-emerald-300 text-sm">
              &copy; 2024 AgriChain. Built for Mantle Hackathon. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-emerald-200 hover:text-emerald-100 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-emerald-200 hover:text-emerald-100 transition-colors">
                Terms of Service
              </Link>
              <Link href="/support" className="text-emerald-200 hover:text-emerald-100 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

"use client"

import { Leaf, Twitter, Github, DiscIcon as Discord } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-green-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AgriChain</span>
            </div>
            <p className="text-green-200">
              Revolutionizing agriculture through blockchain technology and decentralized governance.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-green-200">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Crop Tracking
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Farmer DAOs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Bounty System
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Marketplace
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-green-200">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Smart Contracts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Whitepaper
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <div className="flex gap-4">
              <Twitter className="w-6 h-6 text-green-200 hover:text-white cursor-pointer transition-colors" />
              <Github className="w-6 h-6 text-green-200 hover:text-white cursor-pointer transition-colors" />
              <Discord className="w-6 h-6 text-green-200 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-200">
          <p>&copy; 2025 AgriChain. Built for Mantle Hackathon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

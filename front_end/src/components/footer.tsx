"use client"

import { Leaf, Twitter, Github, DiscIcon as Discord } from "lucide-react"

export function Footer() {
  return (
    <footer className="px-4 py-12 text-white bg-green-900">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">FarmConnect</span>
            </div>
            <p className="text-green-200">
              Revolutionizing agriculture through blockchain technology and decentralized governance.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Platform</h3>
            <ul className="space-y-2 text-green-200">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Crop Tracking
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Farmer DAOs
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Bounty System
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Marketplace
                </a>
              </li>
            </ul>
          </div>

        

      

        <div className="pt-8 mt-8 text-center text-green-200 border-t border-green-800">
          <p>&copy; 2025 FarmConnect. Built for Core Hackathon.</p>
        </div>
      </div>
      </div>
    </footer>
  )
}

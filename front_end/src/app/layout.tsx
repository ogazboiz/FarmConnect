import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppKit } from "@/context/appkit"
import { Providers } from "@/context/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AgriChain - Decentralized Agriculture Platform",
  description: "Track crops, join farmer cooperatives, and earn rewards on the blockchain",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>   <AppKit>
            <Providers>{children}
              </Providers>
          </AppKit>
            </body>
    </html>
  )
}

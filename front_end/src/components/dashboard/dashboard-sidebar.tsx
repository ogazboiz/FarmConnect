"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, Sprout, Users, Target } from "lucide-react"

interface DashboardSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "crops", label: "Crop Tracking", icon: Sprout },
    { id: "cooperative", label: "Cooperative", icon: Users },
    { id: "bounties", label: "Bounties", icon: Target },
  ]

  return (
    <aside className="w-64 bg-white/60 backdrop-blur-sm border-r border-green-200 p-4">
      <nav className="space-y-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                : "text-green-700 hover:bg-green-50"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </nav>
    </aside>
  )
}

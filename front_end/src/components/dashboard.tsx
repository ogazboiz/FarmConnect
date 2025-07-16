"use client"

import { useState } from "react"

import { CooperativeTab } from "./dashboard/cooperative-tab"
import { OverviewTab } from "./dashboard/overview-tab"
import { CropTrackingTab } from "./dashboard/crop-tracking-tab"
import { BountyTab } from "./dashboard/bounty-tab"
import { DashboardHeader } from "./dashboard/dashboard-header"
import { DashboardSidebar } from "./dashboard/dashboard-sidebar"


export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />
      case "crops":
        return <CropTrackingTab />
      case "cooperative":
        return <CooperativeTab />
      case "bounties":
        return <BountyTab />
      default:
        return <OverviewTab />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">{renderActiveTab()}</main>
      </div>
    </div>
  )
}

"use client"

import { DashboardCards } from "@/components/dashboard-cards"
import { RecentActivity } from "@/components/recent-activity"
import { StockAlerts } from "@/components/stock-alerts"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral do seu patrimônio</p>
      </div>

      <DashboardCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockAlerts />
        <RecentActivity />
      </div>
    </div>
  )
}

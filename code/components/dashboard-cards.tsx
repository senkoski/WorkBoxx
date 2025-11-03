"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Package, TrendingUp, FileText } from "lucide-react"
import { useState, useEffect } from "react"
import { dashboardApi } from "@/lib/api"

export function DashboardCards() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalInvoices: 0,
    lowStock: 0,
    criticalStock: 0,
    growth: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardApi.getStats()
        if (response.success && response.data) {
          setStats({
            totalProducts: response.data.stats?.totalProducts || 0,
            totalInvoices: response.data.stats?.totalInvoices || 0,
            lowStock: response.data.stats?.lowStockProducts || 0,
            criticalStock: response.data.stats?.criticalStockProducts || 0,
            growth: response.data.stats?.growth || 0,
          })
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Atualizar a cada 5 segundos
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [])

  const cards = [
    {
      title: "Produtos em Estoque",
      value: stats.totalProducts.toString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Package,
    },
    {
      title: "Notas Fiscais",
      value: stats.totalInvoices.toString(),
      change: "+8%",
      changeType: "positive" as const,
      icon: FileText,
    },
    {
      title: "Estoque Baixo",
      value: stats.lowStock.toString(),
      change: "-5%",
      changeType: "negative" as const,
      icon: AlertTriangle,
    },
    {
      title: "Estoque Crítico",
      value: stats.criticalStock.toString(),
      change: "-10%",
      changeType: "negative" as const,
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{card.value}</div>
            <p className={`text-xs ${card.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
              {card.change} em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

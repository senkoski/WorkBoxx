"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Package } from "lucide-react"
import { useState, useEffect } from "react"
import { dashboardApi } from "@/lib/api"

export function StockAlerts() {
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await dashboardApi.getStockAlerts()
        if (response.success && response.data) {
          const alertProducts = response.data.products || response.data
          const formattedAlerts = alertProducts
            .slice(0, 5) // Limitar a 5 alertas
            .map((p: any) => ({
              product: p.name,
              stock: p.stock,
              minimum: p.minimum,
              status: p.status,
            }))
          setAlerts(formattedAlerts)
        }
      } catch (error) {
        console.error("Erro ao buscar alertas de estoque:", error)
      }
    }

    fetchAlerts()

    // Atualizar a cada 5 segundos
    const interval = setInterval(fetchAlerts, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Alertas de Estoque
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Nenhum alerta de estoque.</p>
        ) : (
          alerts.map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{alert.product}</p>
                <p className="text-sm text-muted-foreground">
                  Estoque: {alert.stock} | Mínimo: {alert.minimum}
                </p>
              </div>
              <Badge variant={alert.status === 'critical' ? 'destructive' : 'secondary'}>
                {alert.status === 'critical' ? 'Crítico' : 'Baixo'}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

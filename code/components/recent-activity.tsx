"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { dashboardApi } from "@/lib/api"
import { Plus, FileText, Package, Activity } from "lucide-react"

export function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await dashboardApi.getRecentActivities()
        if (response.success && response.data) {
          const formattedActivities = response.data.activities.slice(0, 4).map((activity: any) => ({
            ...activity,
            time: getRelativeTime(activity.createdAt),
            icon: getIconComponent(activity.icon),
          }))
          setActivities(formattedActivities)
        }
      } catch (error) {
        console.error("Erro ao buscar atividades recentes:", error)
      }
    }

    fetchActivities()

    // Atualizar a cada 5 segundos
    const interval = setInterval(fetchActivities, 5000)
    return () => clearInterval(interval)
  }, [])

  const getRelativeTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Agora"
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
    return `${Math.floor(diffInMinutes / 1440)} dias atrás`
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Plus":
        return Plus
      case "FileText":
        return FileText
      case "Package":
        return Package
      default:
        return Activity
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhuma atividade recente</p>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                <activity.icon className="h-3 w-3" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

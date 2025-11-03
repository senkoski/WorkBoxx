"use client"

import { useState, useEffect } from "react"
import { Bell, Check, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { storage, type Notification } from "@/lib/storage"

interface NotificationsPopoverProps {
  unreadCount: number
  onNotificationRead: () => void
}

export function NotificationsPopover({ unreadCount, onNotificationRead }: NotificationsPopoverProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const allNotifications = storage.getNotifications()
      setNotifications(allNotifications)
    }
  }, [isOpen])

  const markAsRead = (id: string) => {
    storage.markNotificationAsRead(id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    onNotificationRead()
  }

  const markAllAsRead = () => {
    storage.markAllNotificationsAsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    // Reset unread count
    const currentUnread = notifications.filter((n) => !n.read).length
    for (let i = 0; i < currentUnread; i++) {
      onNotificationRead()
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return "⚠️"
      case "error":
        return "❌"
      case "success":
        return "✅"
      default:
        return "ℹ️"
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-l-orange-500"
      case "error":
        return "border-l-red-500"
      case "success":
        return "border-l-green-500"
      default:
        return "border-l-blue-500"
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-xs">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificações</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Nenhuma notificação</div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 mb-2 rounded-lg border-l-4 ${getNotificationColor(notification.type)} ${
                    notification.read ? "bg-gray-50" : "bg-white border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                        <h4 className={`text-sm font-medium ${notification.read ? "text-gray-600" : "text-gray-900"}`}>
                          {notification.title}
                        </h4>
                      </div>
                      <p className={`text-xs ${notification.read ? "text-gray-500" : "text-gray-700"}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

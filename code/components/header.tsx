"use client"

import { Search, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationsPopover } from "@/components/notifications-popover"
import { ProfileModal } from "@/components/profile-modal"
import { useState, useEffect } from "react"
import { storage } from "@/lib/storage"
import type { User as UserType } from "@/lib/storage"

export function Header() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const user = storage.getCurrentUser()
    setCurrentUser(user)

    const notifications = storage.getNotifications()
    setUnreadCount(notifications.filter((n) => !n.read).length)
  }, [])

  const handleSearch = async (value: string) => {
    setSearchTerm(value)

    if (value.trim() === "") {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    setIsSearchLoading(true)

    try {
      // Buscar produtos via API
      const productsResponse = await fetch(`http://localhost:3001/api/products`)
      const productsData = await productsResponse.json()
      const products = productsData.data || []

      // Buscar usuários via API
      const usersResponse = await fetch(`http://localhost:3001/api/users`)
      const usersData = await usersResponse.json()
      const users = usersData.data || []

      // Filtrar produtos
      const matchingProducts = products.filter(
        (p: any) =>
          p.name?.toLowerCase().includes(value.toLowerCase()) ||
          p.category?.toLowerCase().includes(value.toLowerCase()) ||
          p.description?.toLowerCase().includes(value.toLowerCase())
      )

      // Filtrar usuários
      const matchingUsers = users.filter(
        (u: any) =>
          u.name?.toLowerCase().includes(value.toLowerCase()) ||
          u.email?.toLowerCase().includes(value.toLowerCase())
      )

      const results = [
        ...matchingProducts.map((p: any) => ({ type: "product", ...p })),
        ...matchingUsers.map((u: any) => ({ type: "user", ...u })),
      ]

      setSearchResults(results)
    } catch (error) {
      console.error("Erro na busca:", error)
      setSearchResults([])
    } finally {
      setIsSearchLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/"
  }

  return (
    <header className="border-b bg-card text-card-foreground px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="hidden md:flex items-center gap-2 max-w-md flex-1 relative">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar produtos, notas fiscais..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />

              {isSearching && !isSearchLoading && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
                  {searchResults.slice(0, 8).map((result, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-secondary cursor-pointer border-b last:border-b-0"
                      onClick={() => {
                        if (result.type === "product") {
                          window.location.href = '/dashboard/estoque'
                        } else if (result.type === "user") {
                          window.location.href = '/dashboard/usuarios'
                        }
                        setSearchTerm("")
                        setSearchResults([])
                        setIsSearching(false)
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {result.type === "product" && (
                          <>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Produto</span>
                            <span className="text-sm font-medium">{result.name}</span>
                          </>
                        )}
                        {result.type === "user" && (
                          <>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Usuário</span>
                            <span className="text-sm font-medium">{result.name}</span>
                          </>
                        )}
                        {result.type === "invoice" && (
                          <>
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Fiscal</span>
                            <span className="text-sm font-medium">{result.number}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationsPopover
            unreadCount={unreadCount}
            onNotificationRead={() => setUnreadCount((prev) => Math.max(0, prev - 1))}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center overflow-hidden">
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar || "/placeholder.svg"}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>
                <span className="hidden md:inline">{currentUser?.name || "Usuário"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = '/dashboard/configuracoes'}>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
        onUserUpdate={setCurrentUser}
      />
    </header>
  )
}

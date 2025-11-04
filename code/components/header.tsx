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

      // Buscar empresas via API
      const companiesResponse = await fetch(`http://localhost:3001/api/companies`)
      const companiesData = await companiesResponse.json()
      const companies = companiesData.data || []

      // Buscar notas fiscais via API
      const invoicesResponse = await fetch(`http://localhost:3001/api/invoices`)
      const invoicesData = await invoicesResponse.json()
      const invoices = invoicesData.data || []

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

      // Filtrar empresas
      const matchingCompanies = companies.filter(
        (c: any) =>
          c.name?.toLowerCase().includes(value.toLowerCase()) ||
          c.cnpj?.toLowerCase().includes(value.toLowerCase()) ||
          c.email?.toLowerCase().includes(value.toLowerCase())
      )

      // Filtrar notas fiscais
      const matchingInvoices = invoices.filter(
        (i: any) =>
          i.number?.toString().toLowerCase().includes(value.toLowerCase()) ||
          i.companyName?.toLowerCase().includes(value.toLowerCase())
      )

      const results = [
        ...matchingProducts.map((p: any) => ({ type: "product", ...p })),
        ...matchingUsers.map((u: any) => ({ type: "user", ...u })),
        ...matchingCompanies.map((c: any) => ({ type: "company", ...c })),
        ...matchingInvoices.map((i: any) => ({ type: "invoice", ...i })),
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

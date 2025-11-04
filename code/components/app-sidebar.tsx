"use client"

import { BarChart3, Box, Building2, FileText, Home, Settings, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { storage } from "@/lib/storage"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CompanySwitcher } from "@/components/company-switcher"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Estoque",
    url: "/dashboard/estoque",
    icon: Box,
  },
  {
    title: "Fiscal",
    url: "/dashboard/fiscal",
    icon: FileText,
  },
  {
    title: "Relatórios",
    url: "/dashboard/relatorios",
    icon: BarChart3,
  },
  {
    title: "Empresas",
    url: "/dashboard/empresas",
    icon: Building2,
  },
  {
    title: "Movimentação",
    url: "/dashboard/movimentacao",
    icon: Box,
  },
  {
    title: "Tickets Patrimônio",
    url: "/dashboard/tickets-patrimonio",
    icon: FileText,
  },
  {
    title: "Usuários",
    url: "/dashboard/usuarios",
    icon: Users,
  },
  {
    title: "Configurações",
    url: "/dashboard/configuracoes",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [currentCompany, setCurrentCompany] = useState<any>(null)

  useEffect(() => {
    const updateCompany = async () => {
      try {
        // Try to get current company from API first
        const response = await fetch('http://localhost:3001/api/companies', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          const companies = data.data || []
          // Get the current company from localStorage to find which one is selected
          const currentCompanyId = storage.getCurrentCompany()?.id
          const currentCompany = companies.find((c: any) => c.id === currentCompanyId) || companies[0]
          if (currentCompany) {
            setCurrentCompany(currentCompany)
            storage.setCurrentCompany(currentCompany)
          }
        } else {
          // Fallback to localStorage
          const company = storage.getCurrentCompany()
          setCurrentCompany(company)
        }
      } catch (error) {
        // Fallback to localStorage
        const company = storage.getCurrentCompany()
        setCurrentCompany(company)
      }
    }

    updateCompany()

    // Listen for company changes
    window.addEventListener('companyChanged', updateCompany)

    return () => {
      window.removeEventListener('companyChanged', updateCompany)
    }
  }, [])

  // Update company name when it changes
  useEffect(() => {
    const handleCompanyUpdate = (event: CustomEvent) => {
      setCurrentCompany(event.detail)
    }

    window.addEventListener('companyChanged', handleCompanyUpdate as EventListener)
    return () => window.removeEventListener('companyChanged', handleCompanyUpdate as EventListener)
  }, [])

  // Also listen for storage changes (for when companies are added/updated)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentCompany') {
        const company = JSON.parse(e.newValue || 'null')
        setCurrentCompany(company)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Force update on mount to ensure company name is displayed
  useEffect(() => {
    const company = storage.getCurrentCompany()
    setCurrentCompany(company)
  }, [])

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="WorkBox" className="h-8 w-8" />
            <span className="text-lg font-bold">WorkBox</span>
          </div>
        </div>
        <div className="p-4">
          <CompanySwitcher />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className="w-full">
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-muted-foreground text-center mt-2">WorkBox v1.0.0</div>
      </SidebarFooter>
    </Sidebar>
  )
}

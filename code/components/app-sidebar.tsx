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
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Box className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">WorkBox</span>
          </div>
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
        <CompanySwitcher />
        <div className="text-xs text-muted-foreground text-center mt-2">WorkBox v1.0.0</div>
      </SidebarFooter>
    </Sidebar>
  )
}

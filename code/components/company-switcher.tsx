"use client"

import { useState, useEffect } from "react"
import { storage, type Company } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2, Check } from "lucide-react"

export function CompanySwitcher() {
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])

  useEffect(() => {
    const updateCompanies = async () => {
      try {
        // Try to get companies from API first
        const response = await fetch('http://localhost:3001/api/companies', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setCompanies(data.data || [])
        } else {
          // Fallback to localStorage
          setCompanies(storage.getCompanies())
        }
      } catch (error) {
        // Fallback to localStorage
        setCompanies(storage.getCompanies())
      }

      const company = storage.getCurrentCompany()
      setCurrentCompany(company)
    }

    updateCompanies()

    // Listen for company changes
    window.addEventListener('companyChanged', updateCompanies)

    return () => {
      window.removeEventListener('companyChanged', updateCompanies)
    }
  }, [])

  const handleSwitchCompany = (company: Company) => {
    storage.setCurrentCompany(company)
    setCurrentCompany(company)
    window.dispatchEvent(new CustomEvent('companyChanged', { detail: company }))
    // Redireciona para o dashboard principal após troca
    window.location.href = '/dashboard'
  }

  // Se só tem uma empresa, ou se está logado, não mostra dropdown
  if (!companies || companies.length <= 1) {
    return (
      <Button variant="outline" className="flex items-center gap-2 bg-transparent w-full justify-start cursor-default" disabled>
        <Building2 className="h-4 w-4" />
        <span className="text-sm truncate">{currentCompany?.name || "Selecionar Empresa"}</span>
      </Button>
    )
  }

  // Se tem mais de uma empresa, mostra dropdown normalmente
  return (
    <div className="space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent w-full justify-start">
            <Building2 className="h-4 w-4" />
            <span className="text-sm truncate">{currentCompany?.name || "Selecionar Empresa"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {companies.filter(c => c.id !== currentCompany?.id).map((company) => (
            <DropdownMenuItem
              key={company.id}
              onClick={() => handleSwitchCompany(company)}
              className="flex items-center justify-between"
            >
              <span>{company.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

"use client"

import type React from "react"
import { companiesApi } from "@/lib/api"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditCompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  company?: any
}

export function EditCompanyModal({ isOpen, onClose, onSuccess, company }: EditCompanyModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        email: company.email || "",
        phone: company.phone || "",
        address: company.address || "",
        logo: company.logo || "",
      })
    }
  }, [company])

  const formatPhone = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "")

    // Aplica a máscara (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    if (numbers.length <= 10)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!company) return

    setIsLoading(true)

    try {
      const response = await companiesApi.updateCompany(company.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ""), // Enviar apenas números
        address: formData.address,
        logo: formData.logo || null,
      })

      if (response.success) {
        // Update localStorage with the new company data
        const { storage } = await import('@/lib/storage')
        const currentCompany = storage.getCurrentCompany()
        if (currentCompany && currentCompany.id === company.id) {
          const updatedCompany = { ...currentCompany, ...response.data }
          storage.setCurrentCompany(updatedCompany)
          // Dispatch event to update UI
          window.dispatchEvent(new CustomEvent('companyChanged', { detail: updatedCompany }))
        }

        onClose()
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          logo: "",
        })

        // Chamar callback de sucesso
        if (onSuccess) {
          onSuccess()
        }

        // Dispatch event to update all components with fresh data
        window.dispatchEvent(new CustomEvent('companyChanged'))
      } else {
        alert("Erro ao atualizar empresa: " + (response.error || "Erro desconhecido"))
      }
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error)
      alert("Erro ao atualizar empresa")
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Empresa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome da empresa"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contato@empresa.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
              placeholder="(00) 00000-0000"
              maxLength={15}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Rua, número, bairro, cidade - UF"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo (URL) - Opcional</Label>
            <Input
              id="logo"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              placeholder="https://exemplo.com/logo.png"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? "Atualizando..." : "Atualizar Empresa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

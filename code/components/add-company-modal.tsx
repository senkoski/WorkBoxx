"use client"

import type React from "react"
import { companiesApi } from "@/lib/api"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddCompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AddCompanyModal({ isOpen, onClose, onSuccess }: AddCompanyModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    email: "",
    phone: "",
    address: {
      state: "",
      city: "",
      zipCode: "",
      neighborhood: "",
      street: "",
      reference: ""
    },
    logo: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const formatCNPJ = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "")
    
    // Aplica a máscara XX.XXX.XXX/XXXX-XX
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
    if (numbers.length <= 12)
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`
  }

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

  const validateCNPJ = (cnpj: string) => {
    const numbers = cnpj.replace(/\D/g, "")
    return numbers.length === 14
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar CNPJ
    if (!validateCNPJ(formData.cnpj)) {
      alert("CNPJ inválido. Deve conter 14 dígitos.")
      return
    }

    setIsLoading(true)

    try {
      const response = await companiesApi.createCompany({
        name: formData.name,
        cnpj: formData.cnpj.replace(/\D/g, ""), // Enviar apenas números
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ""), // Enviar apenas números
        address: formData.address,
        logo: formData.logo || null,
      })

      if (response.success) {
        onClose()
        setFormData({
          name: "",
          cnpj: "",
          email: "",
          phone: "",
          address: "",
          logo: "",
        })

        // Chamar callback de sucesso
        if (onSuccess) {
          onSuccess()
        }
      } else {
        alert("Erro ao criar empresa: " + (response.error || "Erro desconhecido"))
      }
    } catch (error) {
      console.error("Erro ao criar empresa:", error)
      alert("Erro ao criar empresa")
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0">
        <DialogHeader className="sticky top-0 z-10 bg-white p-6 border-b border-gray-200">
          <DialogTitle>Cadastrar Nova Empresa</DialogTitle>
        </DialogHeader>
        <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '24px' }}>
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
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: formatCNPJ(e.target.value) })}
                placeholder="00.000.000/0000-00"
                maxLength={18}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={e => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                  placeholder="UF"
                  required
                  maxLength={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                  placeholder="Digite a cidade"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP *</Label>
                <Input
                  id="zipCode"
                  value={formData.address.zipCode}
                  onChange={e => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
                  placeholder="00000-000"
                  required
                  maxLength={9}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  value={formData.address.neighborhood}
                  onChange={e => setFormData({ ...formData, address: { ...formData.address, neighborhood: e.target.value } })}
                  placeholder="Digite o bairro"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Rua e Número *</Label>
              <Input
                id="street"
                value={formData.address.street}
                onChange={e => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                placeholder="Digite a rua e número"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Ponto de Referência</Label>
              <Input
                id="reference"
                value={formData.address.reference}
                onChange={e => setFormData({ ...formData, address: { ...formData.address, reference: e.target.value } })}
                placeholder="Digite um ponto de referência (opcional)"
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
                {isLoading ? "Cadastrando..." : "Cadastrar Empresa"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
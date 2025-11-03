"use client"

import type React from "react"
import { productsApi } from "@/lib/api"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    minimum: "",
    description: "",
    sku: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await productsApi.createProduct({
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price.replace("R$", "").replace(",", ".").trim()),
        stock: Number.parseInt(formData.stock),
        minimum: Number.parseInt(formData.minimum),
        description: formData.description,
        sku: formData.sku,
        companyId: "current-company-id", // TODO: pegar da autenticação
      })

      if (response.success) {
        onClose()
        setFormData({
          name: "",
          category: "",
          price: "",
          stock: "",
          minimum: "",
          description: "",
          sku: "",
        })

        // Recarregar a página para mostrar o novo produto
        window.location.reload()
      } else {
        alert("Erro ao adicionar produto: " + (response.error || "Erro desconhecido"))
      }
    } catch (error) {
      console.error("Erro ao adicionar produto:", error)
      alert("Erro ao adicionar produto")
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome do produto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                <SelectItem value="Periféricos">Periféricos</SelectItem>
                <SelectItem value="Mobiliário">Mobiliário</SelectItem>
                <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="R$ 0,00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Estoque Atual</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimum">Estoque Mínimo</Label>
            <Input
              id="minimum"
              type="number"
              value={formData.minimum}
              onChange={(e) => setFormData({ ...formData, minimum: e.target.value })}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU (Código do Produto)</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="Digite o SKU do produto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição do produto..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:opacity-90" disabled={isLoading}>
              {isLoading ? "Adicionando..." : "Adicionar Produto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

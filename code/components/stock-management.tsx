"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddProductModal } from "@/components/add-product-modal"
import { EditProductModal } from "@/components/edit-product-modal"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import { productsApi } from "@/lib/api"

export function StockManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productsApi.getProducts()
        if (response.success && response.data) {
          setProducts(response.data)
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()

    // Recarregar periodicamente para refletir mudanças do banco
    const interval = setInterval(loadProducts, 5000)
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Crítico</Badge>
      case "low":
        return <Badge variant="secondary">Baixo</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        const response = await productsApi.deleteProduct(id)
        if (response.success) {
          // Recarregar produtos após exclusão
          const productsResponse = await productsApi.getProducts()
          if (productsResponse.success && productsResponse.data) {
            setProducts(productsResponse.data)
          }
        }
      } catch (error) {
        console.error("Erro ao excluir produto:", error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-foreground">Produtos em Estoque</CardTitle>
            <Button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                <SelectItem value="Periféricos">Periféricos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            {loading ? (
              <div className="text-center py-8">Carregando produtos...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        {product.stock} / {product.minimum}
                      </TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedProduct(product)
                            setIsEditModalOpen(true)
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteProduct(product.id.toString())}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="text-center py-8">Carregando produtos...</div>
            ) : (
              filteredProducts.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-sm">{product.name}</h3>
                      {getStatusBadge(product.status)}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Categoria: {product.category}</p>
                      <p>
                        Estoque: {product.stock} / {product.minimum}
                      </p>
                      <p>Preço: {product.price}</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => {
                        setSelectedProduct(product)
                        setIsEditModalOpen(true)
                      }}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => handleDeleteProduct(product.id.toString())}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedProduct(null)
        }}
        onSuccess={() => {
          const loadProducts = async () => {
            try {
              const response = await productsApi.getProducts()
              if (response.success && response.data) {
                setProducts(response.data)
              }
            } catch (error) {
              console.error("Erro ao carregar produtos:", error)
            }
          }
          loadProducts()
        }}
        product={selectedProduct}
      />
    </div>
  )
}

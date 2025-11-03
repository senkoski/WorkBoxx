"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUploadArea } from "@/components/file-upload-area"
import { Download, Eye, FileText, Search } from "lucide-react"
import { storage, type Invoice } from "@/lib/storage"

export function FiscalManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")


  useEffect(() => {
    const loadInvoices = () => {
      const storedInvoices = storage.getInvoices()
      setInvoices(storedInvoices)
      setLoading(false)
    }

    loadInvoices()

    // Recarregar periodicamente
    const interval = setInterval(loadInvoices, 2000)
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processed":
        return <Badge className="bg-green-100 text-green-800">Processada</Badge>
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>
      case "error":
        return <Badge variant="destructive">Erro</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    return <FileText className={`h-4 w-4 ${type === "NFC-e" ? "text-blue-600" : "text-green-600"}`} />
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.number.includes(searchTerm) || invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || invoice.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <FileUploadArea />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5" />
            Notas Fiscais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Carregando notas fiscais...</div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por número ou fornecedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="NF-e">NF-e</SelectItem>
                    <SelectItem value="NFC-e">NFC-e</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Número</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(invoice.type)}
                            {invoice.type}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{invoice.number}</TableCell>
                        <TableCell>{invoice.supplier}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>{invoice.value}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredInvoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(invoice.type)}
                          <span className="font-medium text-sm">
                            {invoice.type} {invoice.number}
                          </span>
                        </div>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Fornecedor: {invoice.supplier}</p>
                        <p>Data: {new Date(invoice.date).toLocaleDateString("pt-BR")}</p>
                        <p>Valor: {invoice.value}</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

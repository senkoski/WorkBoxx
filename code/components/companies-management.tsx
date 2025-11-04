"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddCompanyModal } from "@/components/add-company-modal"
import { EditCompanyModal } from "@/components/edit-company-modal"
import { Building2, Edit, Plus, Search, Trash2, Mail, Phone, MapPin, CheckCircle } from "lucide-react"
import { companiesApi } from "@/lib/api"
import { storage } from "@/lib/storage"

export function CompaniesManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentCompany, setCurrentCompany] = useState<any>(null)
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc"|"desc">("asc")

  const loadCompanies = async () => {
    try {
      const response = await companiesApi.getCompanies()
      if (response.success && response.data) {
        setCompanies(response.data)
      }
    } catch (error) {
      console.error("Erro ao carregar empresas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCompanies()

    // Load current company
    const company = storage.getCurrentCompany()
    setCurrentCompany(company)

    // Recarregar periodicamente para refletir mudanças do banco
    const interval = setInterval(loadCompanies, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatCNPJ = (cnpj: string) => {
    // Formata CNPJ para XX.XXX.XXX/XXXX-XX
    const numbers = cnpj.replace(/\D/g, "")
    if (numbers.length !== 14) return cnpj
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`
  }

  const formatPhone = (phone: string) => {
    // Formata telefone para (XX) XXXXX-XXXX
    const numbers = phone.replace(/\D/g, "")
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    } else if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    }
    return phone
  }

  const handleDeleteCompany = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir a empresa "${name}"?`)) {
      try {
        const response = await companiesApi.updateCompany(id, { status: "inactive" })
        if (response.success) {
          await loadCompanies()
        } else {
          alert("Erro ao excluir empresa: " + (response.error || "Erro desconhecido"))
        }
      } catch (error) {
        console.error("Erro ao excluir empresa:", error)
        alert("Erro ao excluir empresa")
      }
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const sortedCompanies = [...companies].sort((a, b) => {
    let aValue = a[sortBy] || ""
    let bValue = b[sortBy] || ""
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const filteredCompanies = sortedCompanies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.cnpj?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Building2 className="h-5 w-5" />
              Empresas Cadastradas
            </CardTitle>
              <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/80">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Empresa
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, CNPJ ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Carregando empresas...</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead onClick={() => handleSort("name")}
                        className="cursor-pointer select-none">
                        Empresa {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                      </TableHead>
                      <TableHead onClick={() => handleSort("cnpj")}
                        className="cursor-pointer select-none">
                        CNPJ {sortBy === "cnpj" && (sortOrder === "asc" ? "▲" : "▼")}
                      </TableHead>
                      <TableHead onClick={() => handleSort("email")}
                        className="cursor-pointer select-none">
                        Contato {sortBy === "email" && (sortOrder === "asc" ? "▲" : "▼")}
                      </TableHead>
                      <TableHead onClick={() => handleSort("address")}
                        className="cursor-pointer select-none">
                        Endereço {sortBy === "address" && (sortOrder === "asc" ? "▲" : "▼")}
                      </TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          Nenhuma empresa encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCompanies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {company.logo ? (
                                <img src={company.logo} alt={company.name} className="w-10 h-10 rounded-lg object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                  <Building2 className="h-5 w-5 text-green-600" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {company.name}
                                  {currentCompany?.id === company.id && (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">{formatCNPJ(company.cnpj)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span>{company.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span>{formatPhone(company.phone)}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-start gap-2 text-sm max-w-xs">
                              <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{company.address}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => {
                                setSelectedCompany(company)
                                setIsEditModalOpen(true)
                              }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteCompany(company.id, company.name)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredCompanies.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Nenhuma empresa encontrada</div>
                ) : (
                  filteredCompanies.map((company) => (
                    <Card key={company.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          {company.logo ? (
                            <img src={company.logo} alt={company.name} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                              <Building2 className="h-6 w-6 text-green-600" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate flex items-center gap-2">
                              {company.name}
                              {currentCompany?.id === company.id && (
                                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              )}
                            </h3>
                            <p className="text-sm text-gray-500 font-mono">{formatCNPJ(company.cnpj)}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{company.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            <span>{formatPhone(company.phone)}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{company.address}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => {
                            setSelectedCompany(company)
                            setIsEditModalOpen(true)
                          }}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteCompany(company.id, company.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Empresas</p>
                <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Empresas Ativas</p>
                <p className="text-2xl font-bold text-green-600">{companies.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cadastradas Hoje</p>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    companies.filter(
                      (c) => new Date(c.createdAt).toDateString() === new Date().toDateString()
                    ).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddCompanyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={loadCompanies} />
      <EditCompanyModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedCompany(null)
        }}
        onSuccess={loadCompanies}
        company={selectedCompany}
      />
    </div>
  )
}

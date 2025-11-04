"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddUserModal } from "@/components/add-user-modal"
import { EditUserModal } from "@/components/edit-user-modal"
import { Edit, Plus, Search, Trash2, Shield, Eye } from "lucide-react"
import { usersApi } from "@/lib/api"
import { productsApi } from "@/lib/api"

const roles = {
  admin: { label: "Administrador", color: "bg-red-100 text-red-800" },
  manager: { label: "Gerente", color: "bg-blue-100 text-blue-800" },
  user: { label: "Usuário", color: "bg-green-100 text-green-800" },
}

export function UsersManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [users, setUsers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc"|"desc">("asc")

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await usersApi.getUsers()
        if (response.success && response.data) {
          setUsers(response.data)
        }
      } catch (error) {
        console.error("Erro ao carregar usuários:", error)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

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

  function getRoleBadge(role: keyof typeof roles) {
    const roleInfo = roles[role] || { label: role, color: "bg-gray-100 text-gray-800" }
    return <Badge className={roleInfo.color}>{roleInfo.label}</Badge>
  }

  function getStatusBadge(status: string) {
    let color = "bg-gray-300 text-gray-800"
    let label = status
    const normalized = status.trim().toLowerCase()
    if (normalized === "ativo" || normalized === "active") {
      color = "bg-green-100 text-green-800"
      label = "Ativo"
    } else if (normalized === "inativo" || normalized === "inactive") {
      color = "bg-red-100 text-red-800"
      label = "Inativo"
    } else {
      label = status
    }
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{label}</span>
    )
  }

  const handleDeleteUser = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        const response = await usersApi.deleteUser(id)
        if (response.success) {
          // Recarregar usuários após exclusão
          const usersResponse = await usersApi.getUsers()
          if (usersResponse.success && usersResponse.data) {
            setUsers(usersResponse.data)
          }
        }
      } catch (error) {
        console.error("Erro ao excluir usuário:", error)
      }
    }
  }

  function handleSort(column: string) {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const sortedUsers = [...users].sort((a, b) => {
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

  const filteredUsers = sortedUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <>
      <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Shield className="h-5 w-5" />
                      Usuários do Sistema
                    </CardTitle>
                        <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/80">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Usuário
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar usuários..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead onClick={() => handleSort("name")}
                            className="cursor-pointer select-none">
                            Nome {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                          </TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Função</TableHead>
                          <TableHead onClick={() => handleSort("status")}
                            className="cursor-pointer select-none">
                            Status {sortBy === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                          </TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                              Nenhum usuário encontrado
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user: any) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{getRoleBadge(user.role)}</TableCell>
                              <TableCell>{getStatusBadge(user.status)}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => {
                                    setSelectedUser(user)
                                    setIsEditModalOpen(true)
                                  }}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleDeleteUser(user.id)}
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
                  <div className="md:hidden space-y-4 mt-4">
                    {filteredUsers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">Nenhum usuário encontrado</div>
                    ) : (
                      filteredUsers.map((user: any) => (
                        <Card key={user.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-sm">{user.name}</h3>
                              {getStatusBadge(user.status)}
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>Email: {user.email}</p>
                              <p>Função: {(roles as any)[user.role]?.label || user.role}</p>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => {
                                setSelectedUser(user)
                                setIsEditModalOpen(true)
                              }}>
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                                onClick={() => handleDeleteUser(user.id)}
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

              {/* Permissões por Cargo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Shield className="h-5 w-5" />
                    Permissões por Cargo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-red-800 mb-3">Administrador</h3>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Acesso total ao sistema</li>
                        <li>• Gerenciar usuários</li>
                        <li>• Configurações avançadas</li>
                        <li>• Relatórios completos</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-3">Gerente</h3>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Gestão de estoque</li>
                        <li>• Relatórios departamentais</li>
                        <li>• Aprovação de processos</li>
                        <li>• Visualizar dados fiscais</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-3">Usuário</h3>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Consultar produtos</li>
                        <li>• Registrar movimentações</li>
                        <li>• Relatórios básicos</li>
                        <li>• Perfil pessoal</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
              <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => {
                  setIsEditModalOpen(false)
                  setSelectedUser(null)
                }}
                onSuccess={() => {
                  const loadUsers = async () => {
                    try {
                      const response = await usersApi.getUsers()
                      if (response.success && response.data) {
                        setUsers(response.data)
                      }
                    } catch (error) {
                      console.error("Erro ao carregar usuários:", error)
                    }
                  }
                  loadUsers()
                }}
                user={selectedUser}
              />
            </div>
      </>
    )
}
